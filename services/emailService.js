const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendReceiptEmail = async (receipt, pdfBuffer) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: receipt.email,
      subject: `Your Receipt for Order ${receipt.orderId}`,
      text: `Hello ${receipt.customerName},
      
      \n\nThank you for your order. Please find your receipt attached.
      \n\nBest regards,\nThe Hides Luxury Team`,
      attachments: [
        {
          filename: `receipt-${receipt.orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    console.log(" Receipt email sent to:", receipt.email);
  }catch (err) {
    console.error("Errror sending receipt email:", err);
    throw err;
  }
};
console.log("Resend API Key>> ", process.env.RESEND_API_KEY);