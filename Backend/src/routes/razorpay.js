import { Router } from 'express';
import Razorpay from 'razorpay';
import { createHmac } from 'crypto';
import authAny from '../middleware/authAny.js';

const router = Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
});

router.use(authAny);

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture
        };

        console.log('Creating Razorpay order with options:', options);
        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created:', order.id);

        return res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return res.status(500).json({
            error: 'Failed to create order',
            message: error.message,
            details: error.error || error
        });
    }
});

// Verify Payment Signature
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        // Generate signature
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const generated_signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
            .update(text)
            .digest('hex');

        console.log('Verifying payment signature');
        console.log('Generated:', generated_signature);
        console.log('Received:', razorpay_signature);

        // Verify signature
        if (generated_signature === razorpay_signature) {
            console.log('Payment verified successfully');
            return res.json({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
            });
        } else {
            console.log('Payment signature mismatch');
            return res.status(400).json({
                success: false,
                error: 'Invalid payment signature',
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return res.status(500).json({
            error: 'Payment verification failed',
            message: error.message
        });
    }
});

// Get Payment Details
router.get('/payment/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await razorpay.payments.fetch(paymentId);

        return res.json({
            success: true,
            payment,
        });
    } catch (error) {
        console.error('Fetch payment error:', error);
        return res.status(500).json({
            error: 'Failed to fetch payment details',
            message: error.message
        });
    }
});

export default router;
