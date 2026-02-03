const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, // MY Gmail
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

exports.sendReceiptEmail = async (receipt, pdfBuffer) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: receipt.customerEmail,
    subject: `Your Receipt – Order ${receipt.orderId}`,
    text: `Hello ${receipt.customerName},

Thank you for your order.
Your receipt is attached as a PDF.
`,
    attachments: [
      {
        filename: `receipt-${receipt.orderId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};
