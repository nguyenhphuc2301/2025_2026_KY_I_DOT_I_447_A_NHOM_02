import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",        // thay bằng user MySQL của bạn
  password: "",        // thay bằng password MySQL của bạn
  database: "ql_ktx",  // tên database của bạn
});

export default pool;
