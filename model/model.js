var mysql = require('mysql');


var con = mysql.createConnection({
    host: "localhost",
    user: "abdifatah",
    password: "Abdi7728$",
    database:'apps_livraison'
  });



  module.exports=con;