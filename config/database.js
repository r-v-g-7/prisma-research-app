const mongoose = require("mongoose");

async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with mongoose!");
    } catch (err) {
        throw new Error("ERROR: ", err);
    }
}

module.exports = connectDB; 