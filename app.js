const express = require("express")
const { PORT_NUMBER } = require("./utils/constants");

const app = express();

app.use("/", (req, res) => {
    res.send("Server Running Successfully :)")
});

console.log("Sever got you running...")

app.listen(PORT_NUMBER);
app.use(express.json());
