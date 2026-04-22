require("dotenv").config()
const express = require("express")
const connectDB = require("./config/database.js")
const cookieParser = require("cookie-parser")
const healthRouter = require("./routes/healthCheckRouter.js")
const authRouter = require("./routes/auth.routes.js")
const profileRouter = require("./routes/profile.routes.js")
const postRouter = require("./routes/post.routes.js")
const { errorHandler } = require("./middleware/error.js")
const cors = require("cors");
const { workspaceRouter } = require("./routes/workspace.routes.js")
const searchRouter = require("./routes/search.routes.js")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://project-n2utb.vercel.app"
    ],
    credentials: true
  }));

app.use("/", healthRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/post", postRouter);
app.use("/workspace", workspaceRouter);
app.use("/api/search", searchRouter); 
app.use(errorHandler);


async function connectAndListen() {
    try {
        await connectDB()
        app.listen(process.env.PORT_NUMBER, () => {
            console.log("Server is Successfully listening on port " + process.env.PORT_NUMBER)
        })
    } catch (err) {
        console.error("ERROR: " + err)
    }
}

connectAndListen();
