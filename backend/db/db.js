const Pool = require("pg").Pool // add pg library inside Pool

const db = async () => new Pool({ 
  user: "postgres", 
  password: "0812", 
  host: "localhost", 
  port: 5432, 
  database: "smart-financer" 
}) 

module.exports = { db };