require("dotenv").config();

const express = require("express")
const { PORT_NUMBER } = require("./config.js")
const connectDB = require("./config/database.js")

const healthRouter = require("./routes/healthCheckRouter.js")

const app = express();


app.use(express.json());
app.use("/", healthRouter)


async function connectAndListen() {
    try {
        await connectDB()
        app.listen(PORT_NUMBER, () => {
            console.log("Sever is Successfully listening on port " + PORT_NUMBER);
        });
    } catch (err) {
        console.error("ERROR: " + err);
    }
}

connectAndListen();

