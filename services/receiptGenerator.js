const PDFDocument = require("pdfkit");
const cloudinary = require("../config/cloudinary");
const { PassThrough } = require("stream");

exports.generateReceipt = async (order) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = new PassThrough();
  const buffers = [];

  doc.pipe(stream);
  stream.on("data", buffers.push.bind(buffers));

  /* ================= HEADER ================= */
  doc
    .rect(0, 0, doc.page.width, 80)
    .fill("#1F2937"); 

  doc
    .fillColor("#FFFFFF")
    .fontSize(26)
    .text("HIDES LUXURY", 50, 30);

  doc.moveDown(3);

  /* ================= CUSTOMER & ORDER INFO ================= */
  doc.fillColor("#002939").fontSize(12);

  const startY = 110;

  doc
    .font("Helvetica-Bold")
    .text("Billed To:", 50, startY)
    .font("Helvetica")
    .text(order.customerName, 50, startY + 18)
    .text(order.customerEmail, 50, startY + 34);

  doc
    .font("Helvetica-Bold")
    .text("Order Info:", 350, startY)
    .font("Helvetica")
    .text(`Order ID: ${order.orderId}`, 350, startY + 18)
    .text(`Date: ${new Date(order.orderDate).toDateString()}`, 350, startY + 34)
    .text(`Payment Method: ${order.paymentMethod}`, 350, startY + 50); 

  /* ================= ITEMS TABLE ================= */
  const tableTop = 200;

  doc
    .font("Helvetica-Bold")
    .fillColor("#1F2937")
    .text("Item", 50, tableTop)
    .text("Quantity", 280, tableTop)
    .text("Price", 340, tableTop)
    .text("Total", 420, tableTop);

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(500, tableTop + 15)
    .stroke();

  doc.font("Helvetica").fillColor("#000000");

  let y = tableTop + 30;

  order.items.forEach((item) => {
    doc.text(item.name, 50, y);
    doc.text(item.quantity.toString(), 280, y);
    doc.text(`$${item.price.toFixed(2)}`, 340, y);
    doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 420, y);
    y += 25;
  });

  /* ================= TOTALS ================= */
  y += 20;

  doc
    .font("Helvetica-Bold")
    .text("Subtotal:", 340, y)
    .font("Helvetica")
    .text(`$${order.subtotal}`, 420, y);

  y += 20;
  doc.text("Tax:", 340, y).text(`$${order.tax}`, 420, y);

  y += 20;
  doc.text("Discount:", 340, y).text(`$${order.discount}`, 420, y);

  y += 30;

  doc
    .fontSize(14)
    .fillColor("#16A34A") // green
    .text("TOTAL:", 340, y)
    .text(`$${order.total}`, 420, y);

/* ================= FOOTER ================= */
const footerY = doc.page.height - 90;

doc
  .fontSize(10)
  .fillColor("#6B7280") // 
  .text(
    "We appreciate your patronage and look forward to serving you again.",
    50,
    footerY,
    {
      align: "center",
      width: doc.page.width - 100, // margin
    }
  );

doc
  .moveDown(0.5)
  .fontSize(9)
  .text(
    "© 2026 HIDES LUXURY STORE. All rights reserved.",
    {
      align: "center",
      width: doc.page.width - 100,
    }
  );
doc.end();
  /* ================= BUFFER ================= */
  const pdfBuffer = await new Promise((resolve, reject) => {
    stream.on("end", () => resolve(Buffer.concat(buffers)));
    stream.on("error", reject);
  });

  /* ================= CLOUDINARY ================= */
  const uploadResult = await new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "receipts",
      resource_type: "raw",
      public_id: `receipt-${order.orderId}`,
      format: "pdf",
    },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  );

  const bufferStream = new PassThrough();
  bufferStream.end(pdfBuffer);
  bufferStream.pipe(uploadStream);
});


  return {
    pdfBuffer,
    cloudinaryUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};





// cloudinary.api.ping((err, result) => {
//   if (err) console.error("Cloudinary API error:", err);
//   else console.log("Cloudinary API OK:", result);
// });

