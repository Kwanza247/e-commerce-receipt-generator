const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;



// cloudinary.api.ping((err, result) => {
//   if (err) console.error("Cloudinary API error:", err);
//   else console.log("Cloudinary API OK:", result);
// });
