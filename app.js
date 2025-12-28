require("dotenv").config();

const express = require("express")
const connectDB = require("./config/database.js")
const cookieParser = require("cookie-parser")

const healthRouter = require("./routes/healthCheckRouter.js")
const authRouter = require("./routes/auth.routes.js")
const profileRouter = require("./routes/profile.routes.js")
const postRouter = require("./routes/post.routes.js");

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/", healthRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/post", postRouter);


async function connectAndListen() {
    try {
        await connectDB()
        app.listen(process.env.PORT_NUMBER, () => {
            console.log("Sever is Successfully listening on port " + process.env.PORT_NUMBER);
        });
    } catch (err) {
        console.error("ERROR: " + err);
    }
}

connectAndListen();



