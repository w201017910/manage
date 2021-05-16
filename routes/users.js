var express = require('express');
var router = express.Router();
var mysql=require("mysql")
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'score'
});
connection.connect()
/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query("INSERT into exam(exam,examtime)VALUES(?,?)",[req.query.classname,req.query.classtime],(err,data)=>{
    if(err){
      res.render("ress",{title:["创建考试","创建考试","考试信息","创建失败"]})}else{
      res.render("ress",{title:["创建考试","创建考试","考试信息","创建成功"]})
    }
  })
});



module.exports = router;
