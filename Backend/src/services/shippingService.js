import prisma from '../prismaClient.js';
import { sendOrderShippedEmail } from '../utils/email-service.js';
import shiprocketService from './shiprocketService.js';

class ShippingService {
    async shipOrder(orderId, courier, trackingNumber, useShiprocket = true) {
        if (!orderId) {
            throw new Error('Order ID is required');
        }

        const order = await prisma.orders.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                user: true
            }
        });
        if (!order) throw new Error('Order not found');

        const allowedStatuses = ['confirmed', 'processing'];
        if (!allowedStatuses.includes(order.status)) {
            throw new Error(`Order cannot be shipped from status: ${order.status}. Must be confirmed or processing.`);
        }

        let finalCourier = courier;
        let finalTrackingNumber = trackingNumber;
        let shiprocketOrderId = null;
        let awbCode = null;

        if (useShiprocket) {
            try {
                console.log('Creating order in Shiprocket...');
                console.log('Raw addressText:', order.addressText);

                const addressText = order.addressText || '';
                const pincodeMatch = addressText.match(/(\d{5,6})\s*$/);
                const pincode = pincodeMatch ? pincodeMatch[1].padEnd(6, '0') : '110001';

                const addressWithoutPincode = addressText.replace(/\s*-?\s*\d{5,6}\s*$/, '').trim();
                const addressParts = addressWithoutPincode.split(',').map(s => s.trim());

                let state = addressParts.length >= 1 ? addressParts[addressParts.length - 1] : 'State';
                state = state.replace(/\s*-.*$/, '').trim();

                const city = addressParts.length >= 2 ? addressParts[addressParts.length - 2] : 'City';
                const streetAddress = addressParts.length >= 3 ? addressParts.slice(0, -2).join(', ') : addressText;

                let customerPhone = '9999999999';
                try {
                    const userAddress = await prisma.address.findFirst({
                        where: { userId: order.userId, isDefault: true }
                    });
                    if (userAddress?.mobileNumber) {
                        customerPhone = userAddress.mobileNumber.replace(/\D/g, '').slice(-10);
                    }
                } catch (e) {
                    console.log('Could not fetch user address for phone:', e.message);
                }

                const orderDetails = {
                    id: order.id,
                    orderNumber: order.orderNumber,
                    customerName: order.user?.Username || 'Customer',
                    customerEmail: order.user?.Email || '',
                    customerPhone: customerPhone,
                    address: streetAddress,
                    city: city,
                    state: state,
                    pincode: pincode,
                    items: order.items,
                    subtotal: order.subtotal,
                    shipping: order.shipping,
                    total: order.total
                };

                const shiprocketResult = await shiprocketService.createOrder(orderDetails);
                console.log('Shiprocket order created:', shiprocketResult);

                shiprocketOrderId = shiprocketResult.shiprocketOrderId;

                if (shiprocketResult.shipmentId) {
                    try {
                        const awbResult = await shiprocketService.generateAWB(shiprocketResult.shipmentId);
                        awbCode = awbResult.awbCode;
                        finalCourier = awbResult.courierName || courier || 'Shiprocket';
                        finalTrackingNumber = awbResult.awbCode || trackingNumber;
                        console.log('AWB generated:', awbResult);
                    } catch (awbError) {
                        console.error('AWB generation failed, using Shiprocket order ID:', awbError.message);
                        finalTrackingNumber = `SR${shiprocketOrderId}`;
                        finalCourier = 'Shiprocket';
                    }
                } else if (shiprocketResult.awbCode) {
                    awbCode = shiprocketResult.awbCode;
                    finalTrackingNumber = shiprocketResult.awbCode;
                    finalCourier = shiprocketResult.courierName || 'Shiprocket';
                }
            } catch (shiprocketError) {
                console.error('Shiprocket integration failed:', shiprocketError.message);

                if (!courier || !trackingNumber) {
                    throw new Error(`Shiprocket failed: ${shiprocketError.message}. Please provide manual courier and tracking number.`);
                }

                console.log('Falling back to manual shipping mode');
            }
        }

        if (!finalCourier || !finalTrackingNumber) {
            throw new Error('Missing courier or tracking number');
        }

        const updateData = {
            status: 'shipped',
            courier: finalCourier,
            trackingNumber: finalTrackingNumber,
            updatedAt: new Date()
        };

        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: updateData,
            include: {
                items: true,
                user: true
            }
        });

        const trackingMessage = awbCode
            ? `Shipped via ${finalCourier}. AWB: ${awbCode}`
            : `Shipped via ${finalCourier}. Tracking ID: ${finalTrackingNumber}`;

        await prisma.ordertracking.create({
            data: {
                orderId: orderId,
                status: trackingMessage,
                eventAt: new Date()
            }
        });

        sendOrderShippedEmail(updatedOrder).catch(err =>
            console.error('Failed to send shipped email:', err.message)
        );

        return {
            ...updatedOrder,
            shiprocketOrderId,
            awbCode
        };
    }

    async shipOrderManual(orderId, courier, trackingNumber) {
        return this.shipOrder(orderId, courier, trackingNumber, false);
    }

    async getShiprocketTracking(awbCode) {
        try {
            return await shiprocketService.trackShipment(awbCode);
        } catch (error) {
            console.error('Shiprocket tracking error:', error.message);
            return null;
        }
    }

    async addTrackingUpdate(orderId, status, location) {
        const order = await prisma.orders.findUnique({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');

        const updateText = location ? `${status} at ${location}` : status;

        return await prisma.ordertracking.create({
            data: {
                orderId,
                status: updateText,
                eventAt: new Date()
            }
        });
    }

    async cancelShipment(orderId) {
        const order = await prisma.orders.findUnique({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');

        if (order.trackingNumber?.startsWith('SR') || order.trackingNumber) {
            try {
                await shiprocketService.cancelShipment([order.orderNumber]);
            } catch (error) {
                console.error('Shiprocket cancel failed:', error.message);
            }
        }

        return await prisma.orders.update({
            where: { id: orderId },
            data: {
                status: 'cancelled',
                updatedAt: new Date()
            }
        });
    }

    async getShippingLabel(shipmentId) {
        return await shiprocketService.getShippingLabel(shipmentId);
    }

    async schedulePickup(shipmentId) {
        return await shiprocketService.schedulePickup(shipmentId);
    }
}

export default new ShippingService();
