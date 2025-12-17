require("dotenv").config();
const connectDB = require("./config/database.js");
const User = require("./models/user.js")

async function testUser() {
    try {
        await connectDB(); // connect to MongoDB

        const user = new User({
            name: "Test User",
            email: "testuser@example.com",
            password: "123456",
            role: "student",
            fieldOfStudy: "Computer Science",
            institution: "Test University"
        });

        const savedUser = await user.save();
        console.log("User saved:", savedUser);

        process.exit(0); // exit after test
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

testUser();
