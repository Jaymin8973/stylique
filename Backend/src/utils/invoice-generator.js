import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate invoice PDF for an order
 * @param {Object} order - Order object with items, user, and pricing details
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateInvoicePDF(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header - Company Logo (Left aligned)
      try {
        const logoPath = join(__dirname, '../../assets/Stylique_Text_Logo.png');
        const logoImage = readFileSync(logoPath);
        doc.image(logoImage, 50, 45, { width: 150 });
      } catch (logoError) {
        // Fallback to text if logo not found
        console.warn('Logo not found, using text fallback:', logoError);
        doc
          .fontSize(28)
          .font('Helvetica-Bold')
          .text('STYLIQUE', 50, 50, { align: 'left' })
          .fontSize(10)
          .font('Helvetica')
          .text('Fashion E-Commerce', 50, 85);
      }

      // Invoice Title
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('INVOICE', 400, 50, { align: 'right' })
        .fontSize(10)
        .font('Helvetica')
        .text(`Invoice #: ${order.orderNumber || order.id}`, 400, 80, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 95, { align: 'right' })
        .moveDown(2);

      // Line separator
      doc
        .strokeColor('#000000')
        .lineWidth(1)
        .moveTo(50, 130)
        .lineTo(550, 130)
        .stroke();

      // Customer Details
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Bill To:', 50, 150)
        .fontSize(10)
        .font('Helvetica')
        .text(order.user?.Username || 'Customer', 50, 170)
        .text(order.user?.Email || '', 50, 185)
        .text(order.addressText || 'N/A', 50, 200, { width: 250 })
        .moveDown(2);

      // Order Details
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Order Details:', 350, 150)
        .fontSize(10)
        .font('Helvetica')
        .text(`Order Number: ${order.orderNumber || order.id}`, 350, 170)
        .text(`Tracking: ${order.trackingNumber || 'N/A'}`, 350, 185)
        .text(`Status: ${(order.status || 'processing').toUpperCase()}`, 350, 200)
        .moveDown(3);

      // Items Table Header
      const tableTop = 280;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Item', 50, tableTop)
        .text('Qty', 300, tableTop, { width: 50, align: 'center' })
        .text('Unit Price', 370, tableTop, { width: 80, align: 'right' })
        .text('Amount', 470, tableTop, { width: 80, align: 'right' });

      // Line under header
      doc
        .strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // Items
      let yPosition = tableTop + 25;
      const items = order.items || [];

      items.forEach((item, index) => {
        const unitPrice = parseFloat(item.unitPrice || '0');
        const quantity = item.quantity || 0;
        const amount = unitPrice * quantity;

        doc
          .fontSize(9)
          .font('Helvetica')
          .text(item.productName || 'Product', 50, yPosition, { width: 240 })
          .text(quantity.toString(), 300, yPosition, { width: 50, align: 'center' })
          .text(`₹${unitPrice.toFixed(2)}`, 370, yPosition, { width: 80, align: 'right' })
          .text(`₹${amount.toFixed(2)}`, 470, yPosition, { width: 80, align: 'right' });

        yPosition += 20;

        // Add new page if needed
        if (yPosition > 700 && index < items.length - 1) {
          doc.addPage();
          yPosition = 50;
        }
      });

      // Summary section
      yPosition += 20;
      const summaryTop = Math.max(yPosition, 650);

      // Line before summary
      doc
        .strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(350, summaryTop)
        .lineTo(550, summaryTop)
        .stroke();

      const subtotal = parseFloat(order.subtotal || '0');
      const shipping = parseFloat(order.shipping || '0');
      const total = parseFloat(order.total || '0');

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', 370, summaryTop + 15, { width: 100, align: 'left' })
        .text(`₹${subtotal.toFixed(2)}`, 470, summaryTop + 15, { width: 80, align: 'right' })
        .text('Shipping:', 370, summaryTop + 35, { width: 100, align: 'left' })
        .text(`₹${shipping.toFixed(2)}`, 470, summaryTop + 35, { width: 80, align: 'right' });

      // Total with bold
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Total:', 370, summaryTop + 60, { width: 100, align: 'left' })
        .text(`₹${total.toFixed(2)}`, 470, summaryTop + 60, { width: 80, align: 'right' });

      // Footer
      doc
        .fontSize(8)
        .font('Helvetica')
        .text(
          'Thank you for shopping with Stylique!',
          50,
          750,
          { align: 'center', width: 500 }
        )
        .text(
          'For any queries, please contact support@stylique.com',
          50,
          765,
          { align: 'center', width: 500 }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Format order data for invoice display (JSON response)
 * @param {Object} order - Order object
 * @returns {Object} Formatted invoice data
 */
export function formatInvoiceData(order) {
  const subtotal = parseFloat(order.subtotal || '0');
  const shipping = parseFloat(order.shipping || '0');
  const total = parseFloat(order.total || '0');

  return {
    invoiceNumber: order.orderNumber || `INV-${order.id}`,
    invoiceDate: new Date(order.createdAt).toISOString(),
    orderNumber: order.orderNumber,
    trackingNumber: order.trackingNumber,
    status: order.status,
    customer: {
      name: order.user?.Username || 'Customer',
      email: order.user?.Email || '',
      address: order.addressText || 'N/A',
    },
    items: (order.items || []).map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: parseFloat(item.unitPrice || '0'),
      amount: parseFloat(item.unitPrice || '0') * item.quantity,
    })),
    pricing: {
      subtotal,
      shipping,
      total,
      currency: 'INR',
    },
  };
}
