const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const employeerouter = require("./routes/employee.route");
const authRouter = require('./routes/auth.route');
const dashboardRouter = require('./routes/dashboard.route'); // Import the dashboard route
const app = express();

dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(morgan('dev'))

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.options('*', cors());

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((err) => {
    console.log("DB Disconnected");
  });


app.use('/api',employeerouter);
app.use('/api/auth', authRouter);
app.use('/api/dashboard',dashboardRouter);


const port = process.env.PORT || 11000;

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});