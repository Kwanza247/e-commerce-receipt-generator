const swaggerJSDoc = require("swagger-jsdoc");

const port = process.env.PORT || 4000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce Receipt Generator API",
      version: "1.0.0",
      description: "API for generating receipts and handling payments",
    },
    servers: [
      {
        url: "https://e-commerce-receipt-generator-tyox.onrender.com",
      },
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;