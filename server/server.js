require("dotenv").config();
const PORT = process.env.PORT;
const express = require('express');
const app = express();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
app.use(express.json());
const startServer = async () =>{
    await connectDB();
    app.listen(PORT, ()=>{
    console.log("Process running on PORT:",PORT)
});
}

app.get("/",(req, res) =>{
    res.send("Working");
});

app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/students",studentRoutes);
startServer();

