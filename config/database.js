const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://RiddhiVinayakGarg:chanchal123@rvg7.ladr2.mongodb.net/prism");
        console.log("Connected with mongoose!");
    } catch (err) {
        throw new Error("ERROR: ", err);
    }
}

module.exports = connectDB; 