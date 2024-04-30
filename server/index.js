const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary =  require("cloudinary")

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}

//connect to db
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost: ${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`shutting down server for ${err.message}`);
  console.log(`shutting down the server for unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
