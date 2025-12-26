import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
};

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @returns {Promise<boolean>} - Success status
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
}

/**
 * Send order notification email to seller
 * @param {Object} order - Order object with items and user details
 * @returns {Promise<boolean>} - Success status
 */
export async function sendOrderNotificationEmail(order) {
  // Seller email - can be configured in env or fetched from database
  const sellerEmail = process.env.SELLER_EMAIL || process.env.EMAIL_USER;

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${parseFloat(item.unitPrice || 0).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Order Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎉 New Order Received!</h1>
      </div>
      
      <div style="background: #fff; padding: 20px; border: 1px solid #eee; border-top: none;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Order #${order.orderNumber || order.id}</h2>
          <p style="margin: 0; color: #666; font-size: 14px;">Placed on ${orderDate}</p>
        </div>

        <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Customer Details</h3>
        <p><strong>Name:</strong> ${order.user?.Username || 'Customer'}</p>
        <p><strong>Email:</strong> ${order.user?.Email || 'N/A'}</p>
        <p><strong>Shipping Address:</strong> ${order.addressText || 'N/A'}</p>

        <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>₹${parseFloat(order.subtotal || 0).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Shipping:</span>
            <span>₹${parseFloat(order.shipping || 0).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 2px solid #667eea; padding-top: 10px; margin-top: 10px;">
            <span>Total:</span>
            <span style="color: #667eea;">₹${parseFloat(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: sellerEmail,
    subject: `🛒 New Order #${order.orderNumber || order.id} - ₹${parseFloat(order.total || 0).toFixed(2)}`,
    html,
  });
}

export default { sendEmail, sendOrderNotificationEmail };
