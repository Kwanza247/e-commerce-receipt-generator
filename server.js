const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();

const connectDb = require('./config/dbConnection');
;
connectDb();
const paymentRoute = require("./routes/paymentRoute");
const receiptRoute = require("./routes/receiptRoute")


process.on('unhandledRejection', (reason, promise) => {
    console.error('FATAL UNHANDLED REJECTION:', reason);
});

const app = express();
app.use(express.json());

const port = process.env.PORT || 4000;
console.log(process.env.CONNECTION_STRING);

app.use("/api/receipts", receiptRoute);
app.use("/api/payments", paymentRoute);



console.log("db name>> ", process.env.CONNECTION_STRING)
app.get("/", (req, res) => {
    res.json({message: "My receipt generator"});
})
app.listen(port, () => {
    console.log("Server is listening on port ", port);
}); 