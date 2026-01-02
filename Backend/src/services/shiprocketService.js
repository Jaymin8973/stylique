const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

class ShiprocketService {
    constructor() {
        this.token = null;
        this.tokenExpiry = null;
    }

    async authenticate() {
        if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry - 86400000) {
            return this.token;
        }

        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;

        if (!email || !password) {
            throw new Error('Shiprocket credentials not configured in environment');
        }

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.token) {
                throw new Error(data.message || 'Failed to authenticate with Shiprocket');
            }

            this.token = data.token;
            this.tokenExpiry = Date.now() + (10 * 24 * 60 * 60 * 1000);

            console.log('Shiprocket authenticated successfully');
            return this.token;
        } catch (error) {
            console.error('Shiprocket auth error:', error.message);
            throw new Error(`Shiprocket authentication failed: ${error.message}`);
        }
    }

    async getHeaders() {
        const token = await this.authenticate();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async getPickupLocations() {
        const headers = await this.getHeaders();

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/settings/company/pickup`, {
                method: 'GET',
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch pickup locations');
            }

            console.log('Available pickup locations:', data.data?.shipping_address?.map(a => a.pickup_location) || []);
            return data.data?.shipping_address || [];
        } catch (error) {
            console.error('Failed to fetch pickup locations:', error.message);
            return [];
        }
    }

    async createOrder(orderDetails) {
        const headers = await this.getHeaders();

        let pickupLocationName = 'Primary';
        try {
            const pickupLocations = await this.getPickupLocations();
            if (pickupLocations.length > 0) {
                pickupLocationName = pickupLocations[0].pickup_location;
                console.log('Using pickup location:', pickupLocationName);
            }
        } catch (e) {
            console.log('Could not fetch pickup locations, using default:', pickupLocationName);
        }

        const billingAddress = orderDetails.address || 'Address';
        const billingCity = orderDetails.city || 'City';
        const billingState = orderDetails.state || 'State';
        const billingPincode = orderDetails.pincode || '110001';
        const billingPhone = orderDetails.customerPhone || '9999999999';
        const billingEmail = orderDetails.customerEmail || 'customer@example.com';
        const customerName = orderDetails.customerName || 'Customer';

        console.log('Shiprocket order details:', {
            order_id: orderDetails.orderNumber || `ORD${orderDetails.id}`,
            billing_customer_name: customerName,
            billing_address: billingAddress,
            billing_city: billingCity,
            billing_state: billingState,
            billing_pincode: billingPincode,
            billing_phone: billingPhone,
            billing_email: billingEmail,
            items_count: orderDetails.items?.length || 0
        });

        const shiprocketOrder = {
            order_id: orderDetails.orderNumber || `ORD${orderDetails.id}`,
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: pickupLocationName,
            channel_id: '',
            comment: '',
            billing_customer_name: customerName,
            billing_last_name: '',
            billing_address: billingAddress,
            billing_address_2: '',
            billing_city: billingCity,
            billing_pincode: billingPincode,
            billing_state: billingState,
            billing_country: 'India',
            billing_email: billingEmail,
            billing_phone: billingPhone,
            shipping_is_billing: true,
            order_items: orderDetails.items?.map(item => ({
                name: item.productName || 'Product',
                sku: `SKU${item.productId}`,
                units: item.quantity || 1,
                selling_price: parseFloat(item.unitPrice) || 0,
                discount: 0,
                tax: 0,
                hsn: ''
            })) || [{ name: 'Product', sku: 'SKU1', units: 1, selling_price: 100, discount: 0, tax: 0, hsn: '' }],
            payment_method: 'Prepaid',
            shipping_charges: parseFloat(orderDetails.shipping) || 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: parseFloat(orderDetails.subtotal) || parseFloat(orderDetails.total) || 100,
            length: 10,
            breadth: 10,
            height: 5,
            weight: 0.5
        };

        try {
            console.log('Shiprocket full order payload:', JSON.stringify(shiprocketOrder, null, 2));

            const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
                method: 'POST',
                headers,
                body: JSON.stringify(shiprocketOrder)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Shiprocket create order error:', JSON.stringify(data, null, 2));
                throw new Error(data.message || data.errors?.join(', ') || 'Failed to create order in Shiprocket');
            }

            console.log('Shiprocket order created:', data);

            return {
                success: true,
                shiprocketOrderId: data.order_id,
                shipmentId: data.shipment_id,
                awbCode: data.awb_code || null,
                courierName: data.courier_name || null,
                status: data.status
            };
        } catch (error) {
            console.error('Shiprocket create order error:', error.message);
            throw error;
        }
    }

    async generateAWB(shipmentId, courierId = null) {
        const headers = await this.getHeaders();

        const body = { shipment_id: shipmentId };
        if (courierId) {
            body.courier_id = courierId;
        }

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate AWB');
            }

            return {
                awbCode: data.response?.data?.awb_code,
                courierCompanyId: data.response?.data?.courier_company_id,
                courierName: data.response?.data?.courier_name
            };
        } catch (error) {
            console.error('Shiprocket AWB generation error:', error.message);
            throw error;
        }
    }

    async checkCourierServiceability(pickupPincode, deliveryPincode, weight = 0.5, cod = false) {
        const headers = await this.getHeaders();

        const params = new URLSearchParams({
            pickup_postcode: pickupPincode,
            delivery_postcode: deliveryPincode,
            weight: weight.toString(),
            cod: cod ? '1' : '0'
        });

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/serviceability?${params}`, {
                method: 'GET',
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to check courier serviceability');
            }

            return data.data?.available_courier_companies || [];
        } catch (error) {
            console.error('Courier serviceability check error:', error.message);
            throw error;
        }
    }

    async trackShipment(awbCode) {
        const headers = await this.getHeaders();

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/awb/${awbCode}`, {
                method: 'GET',
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to track shipment');
            }

            return {
                currentStatus: data.tracking_data?.shipment_status,
                currentStatusTime: data.tracking_data?.current_timestamp,
                etd: data.tracking_data?.etd,
                events: data.tracking_data?.shipment_track || []
            };
        } catch (error) {
            console.error('Shiprocket tracking error:', error.message);
            throw error;
        }
    }

    async trackByOrderId(shiprocketOrderId) {
        const headers = await this.getHeaders();

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/track?order_id=${shiprocketOrderId}`, {
                method: 'GET',
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to track order');
            }

            return data;
        } catch (error) {
            console.error('Shiprocket order tracking error:', error.message);
            throw error;
        }
    }

    async cancelShipment(shiprocketOrderIds) {
        const headers = await this.getHeaders();

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/cancel`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ ids: Array.isArray(shiprocketOrderIds) ? shiprocketOrderIds : [shiprocketOrderIds] })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel shipment');
            }

            return { success: true, ...data };
        } catch (error) {
            console.error('Shiprocket cancel error:', error.message);
            throw error;
        }
    }

    async schedulePickup(shipmentId) {
        const headers = await this.getHeaders();

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/pickup`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ shipment_id: [shipmentId] })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to schedule pickup');
            }

            return data;
        } catch (error) {
            console.error('Shiprocket pickup scheduling error:', error.message);
            throw error;
        }
    }

    async getShippingLabel(shipmentId) {
        const headers = await this.getHeaders();

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/label`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ shipment_id: [shipmentId] })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate shipping label');
            }

            return data.label_url || data;
        } catch (error) {
            console.error('Shiprocket label generation error:', error.message);
            throw error;
        }
    }

    async getInvoice(shiprocketOrderIds) {
        const headers = await this.getHeaders();

        try {
            const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/print/invoice`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ ids: Array.isArray(shiprocketOrderIds) ? shiprocketOrderIds : [shiprocketOrderIds] })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate invoice');
            }

            return data.invoice_url || data;
        } catch (error) {
            console.error('Shiprocket invoice generation error:', error.message);
            throw error;
        }
    }
}

export default new ShiprocketService();
