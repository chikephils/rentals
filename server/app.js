const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: "https://chireva-rentals.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello world! Your Server is Running...");
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}

//import Routes
const auth = require("./controller/auth");
const listing = require("./controller/listing");
const booking = require("./controller/booking");
const user = require("./controller/user");

app.use("/api/v2/auth", auth);
app.use("/api/v2/listing", listing);
app.use("/api/v2/booking", booking);
app.use("/api/v2/user", user);

module.exports = app;
