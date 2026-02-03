# Hides Luxury Receipt Engine 🧾

## Overview
A high-performance e-commerce receipt generator built with Node.js and Express designed to automate the generation, storage, and distribution of digital receipts. This system utilizes a producer-consumer architecture with BullMQ and Redis to handle PDF generation and email delivery asynchronously, ensuring zero latency during the checkout process.

## Features
- Node.js & Express: Provides a robust and scalable RESTful API architecture.
- MongoDB & Mongoose: Handles persistent storage for order records and receipt metadata with strict schema validation.
- BullMQ & Redis: Implements a reliable background task queue to decouple PDF generation from the main request-response cycle.
- PDFKit: Programmatically generates professional, high-fidelity PDF documents from transaction data.
- Cloudinary Integration: Securely hosts generated receipts with support for signed, time-limited access URLs.
- Nodemailer: Automates the delivery of receipts to customers via SMTP with PDF attachments.

## Getting Started
### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Kwanza247/e-commerce-receipt-generator.git
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Redis Server**:
   Ensure you have a Redis instance running locally on port 6379.
4. **Run the Application**:
   ```bash
   # Start the API server
   npm run dev
   
   # Start the background worker (in a separate terminal)
   npm run worker
   ```

### Environment Variables
Create a `.env` file in the root directory and populate it with the following variables:
```env
PORT=4000
CONNECTION_STRING=mongodb://localhost:27017/receipt_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Receipt <noreply@hidesluxury.com>
```

## API Documentation
### Base URL
`http://localhost:4000/api`

### Endpoints

#### POST /api/payments/simulate
**Description**: Simulates a successful checkout, persists the order, and queues a receipt generation task.

**Request**:
```json
{
  "orderId": "ORD-9921",
  "customerName": "John Doe",
  "customerEmail": "johndoe@example.com",
  "items": [
    { "name": "Leather Wallet", "quantity": 1, "price": 150.00 },
    { "name": "Classic Belt", "quantity": 1, "price": 85.00 }
  ],
  "subtotal": 235.00,
  "tax": 15.00,
  "discount": 10.00,
  "total": 240.00,
  "paymentMethod": "Credit Card"
}
```

**Response**:
```json
{
  "message": "Payment simulated successfully",
  "orderId": "ORD-9921"
}
```

**Errors**:
- 400: Missing required fields (orderId, email, or total).
- 400: Order with this ID already exists.
- 500: Internal server error during persistence.

---

#### POST /api/receipts/generate-receipt
**Description**: Manually triggers the generation and emailing of a receipt for an existing order.

**Request**:
```json
{
  "orderId": "ORD-9921"
}
```

**Response**:
```json
{
  "message": "Receipt generated and emailed successfully",
  "receiptUrl": "https://res.cloudinary.com/path/to/receipt.pdf"
}
```

**Errors**:
- 400: orderId is required.
- 404: Order not found in database.
- 500: Failure during PDF generation or email dispatch.

---

#### GET /api/receipts/:orderId
**Description**: Retrieves the receipt metadata and a signed URL for the document.

**Request**:
- Path Parameter: `orderId` (string)

**Response**:
```json
{
  "receiptId": "R-ORD-9921",
  "orderId": "ORD-9921",
  "customerEmail": "johndoe@example.com",
  "receiptUrl": "https://res.cloudinary.com/signed/url/path",
  "createdAt": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:
- 404: Receipt record not found.
- 500: Failed to generate signed access URL.

## Technologies Used

| Technology | Purpose |
| :--- | :--- |
| [Node.js](https://nodejs.org/) | JavaScript Runtime |
| [Express](https://expressjs.com/) | Web Framework |
| [MongoDB](https://www.mongodb.com/) | NoSQL Database |
| [Redis](https://redis.io/) | In-memory Data Structure Store |
| [BullMQ](https://docs.bullmq.io/) | Message Queue & Background Jobs |
| [Cloudinary](https://cloudinary.com/) | Media Asset Management |
| [PDFKit](https://pdfkit.org/) | PDF Generation Engine |

## Contributing
- Fork the project and create your feature branch.
- Ensure all code follows the existing architectural patterns.
- Provide detailed commit messages explaining the rationale for changes.
- Submit a pull request with a comprehensive description of the update.

## Author Info
**Ibrahim Adegboye**
- [GitHub](https://github.com/ibrahim-adegboye)
- [LinkedIn](https://www.linkedin.com/in/ibrahim-adegboye)
- [Twitter](https://twitter.com/ibrahim_adegboye)

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

