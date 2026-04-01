const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
 
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const testRoute = require("./routes/middRoutes");
app.use("/api/test", testRoute);

app.get("/", (req, res) => {
    res.send("TaskOrbit API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});