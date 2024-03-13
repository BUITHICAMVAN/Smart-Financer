// const mongoose = require("mongoose");

// const db = async () => {
//   try {
//     mongoose.set("strictQuery", false);
//     await mongoose.connect(process.env.MONGO_URL);
//   } catch (error) {
//     console.log("DB Connection Error");
//   }
// };

// module.exports = { db };

const Pool = require("pg").Pool 

const db = async () => new Pool({ 
  user: "postgres", 
  password: "0812", 
  host: "localhost", 
  port: 5432, 
  database: "smartfinancer" 
}) 

module.exports = { db };