
var express = require('express');
var router = express.Router();
var mysql=require("mysql")
var multer = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'excel/' });
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'score',
  multipleStatements: true
});
connection.connect()
var mysqlword=
"SELECT student.sname,class.className,score.course,score.usualscore,score.testscore,score.totalscore,score.rebuild,score.makeuptest,exam.exam from score "+ 
"INNER JOIN exam on exam.exam=score.exam INNER JOIN student "+
"on student.testId=score.testId INNER JOIN class on class.className=student.class INNER JOIN layer "+
"on layer.grade=class.grade";
/* GET home page. */
router.post('/upload', upload.single('1'), function(req, res, next){
  console.log(req.files);
});
router.get('/', function(req, res, next) {
  res.render('login');
});
router.get('/form_advanced', function(req, res, next) {
  if(req.session.username!=undefined){
    connection.query("SELECT className from class",function(err,data){
      if(err){console.log(err)}else{
        res.render('form_advanced',{data:data,username:req.session.username})
      }
    })
  }else{
    res.redirect("/")
  }
  
});
router.get('/form_upload', function(req, res, next) {
  if(req.session.username!=undefined){res.render('form_upload',{username:req.session.username});}else{
    res.redirect("/")
  }
  
});
router.get('/form_validation', function(req, res, next) {
  if(req.session.username!=undefined){res.render('form_validation',{username:req.session.username});}else{
    res.redirect("/")
  }
  
});
router.get('/form_wizards', function(req, res, next) {
  if(req.session.username!=undefined){
    connection.query("select * from layer",function(err,data){
    if(err){console.log(err)}else{
      res.render("form_wizards",{data:data,username:req.session.username})
    }
  })}else{
    res.redirect("/")
  }
  
});
router.get('/form', function(req, res, next) {
  if(req.session.username!=undefined){
    connection.query("select grade from layer",function(err,data){
    if(err){console.log(err)}else{
      res.render("form",{data:data,username:req.session.username})
    }
  })}else{
    res.redirect("/")
  }
  
});
router.get("/tables_remake",function(req,res,next){
  if(req.session.username!=undefined){
    connection.query("select * from course;select exam from exam",function(err,data){
      if(err){console.log(err)}else{
        res.render('tables_remake',{data:data,username:req.session.username})
      }
    })
  }else{
    res.redirect("/")
  }
  
})
router.get('/tables_dynamic', function(req, res, next) {
  if(req.session.username!=undefined){
    connection.query(mysqlword,function(err,data){
      if(err){console.log(err)}else{
        res.render('tables_dynamic',{data:data,username:req.session.username})
      }
    })
  }else{
    res.redirect("/")
  }
  
  
});
router.get('/tables', function(req, res, next) {
  if(req.session.username!=undefined){
    connection.query("SELECT class.className,student.sname,student.testId FROM class INNER JOIN student ON class.className=student.class;SELECT courseName FROM course;SELECT exam FROM exam",function(err,data){
      if(err){console.log(err)}else{
        res.render('tables',{data:data,username:req.session.username})
      }
    })
  }else{
    res.redirect("/")
  }
  
});
router.get("/student",function(req,res,next){
  if(req.session.username!=undefined){
    connection.query("INSERT into student(sname,studentId,sex,class,testId)VALUES(?,?,?,?,?)",
  [req.query.name,req.query.studentId,req.query.sex,req.query.class,req.query.testId],(err,data)=>{
    if(err){
      res.render("ress",{title:["添加学生","添加学生","学生信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加学生","添加学生","学生信息","添加成功"],username:req.session.username})
    }
  })
  }else{
    res.redirect("/")
  }

  
})
router.post("/user",(req,res,next)=>{
  if(req.session.username!=undefined){
    connection.query("INSERT into user(username,email,telephone,registertime,password)VALUES(?,?,?,?,?)",
  [req.body.name,req.body.email,req.body.phone,req.body.date,req.body.password],(err,data)=>{
    if(err){
      res.render("ress",{title:["教师注册","添加教师","教师信息","注册失败"],username:req.session.username})}else{
      res.render("ress",{title:["教师注册","添加教师","教师信息","注册成功"],username:req.session.username})
    }
  })
  }else{
    res.redirect("/")
  }
  
})
router.get("/layer",(req,res,next)=>{
  if(req.session.username!=undefined){
    connection.query("INSERT into layer(grade)VALUES(?)",
  [req.query.layer],(err,data)=>{
    if(err){
      res.render("ress",{title:["添加年级","添加年级","年级信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加年级","添加年级","年级信息","添加成功"],username:req.session.username})
    }
  })
  }else{
    res.redirect("/")
  }
  
})
router.get("/class",(req,res,next)=>{
  if(req.session.username!=undefined){
    connection.query("INSERT into class(className,number,grade)VALUES(?,?,?)",
  [req.query.classname,req.query.classnumber,req.query.grade],(err,data)=>{
    if(err){
      res.render("ress",{title:["添加班级","添加班级","班级信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加班级","添加班级","班级信息","添加成功"],username:req.session.username})
    }
  })
  }else{
    res.redirect("/")
  }
  
})
router.get("/course",(req,res,next)=>{
  if(req.session.username!=undefined){
    connection.query("INSERT into course(courseName)VALUES(?)",
  [req.query.course],(err,data)=>{
    if(err){
      res.render("ress",{title:["添加课程","添加课程","课程信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加课程","添加课程","课程信息","添加成功"],username:req.session.username})
    }
  })
  }else{
    res.redirect("/")
  }
  
})
router.post("/add",(req,res)=>{
  if(req.session.username!=undefined){
    var p=[];
  var v=[];


  for(var i in req.body){
    if(i.indexOf("?")==-1){
      
      continue;
    }else{var test=i.split("?")
    p.push(test[0])
    v.push(test[1])
  }
  }

  var e=false;
for(var i=0;i<p.length;i++){
  connection.query("INSERT into score(student,exam,course,usualscore,testscore,totalscore,testId)VALUES(?,?,?,?,?,?,?)",
  [p[i],req.body[p[i]+"?"+v[i]],req.body[p[i]+"1"],req.body[p[i]+"2"],req.body[p[i]+"3"],req.body[p[i]+"4"],v[i]],(err,data)=>{
   if(err){e=true}
  })
}
if(e){res.render("ress",{title:["添加成绩","添加成绩","成绩信息","添加失败"],username:req.session.username})}else{
  res.render("ress",{title:["添加成绩","添加成绩","成绩信息","添加成功"],username:req.session.username})
}
  }else{res.redirect("/")}
  
  
})
router.get("/makeup",(req,res)=>{
  if(req.session.username!=undefined){
    var test;
  console.log(req.query.kind)
  if(req.query.kind=="重修"){test="rebuild"}else{test="makeuptest"}
  connection.query("update score set "+test+"=? where testId=? and exam=? and course=?",
  [req.query.score,req.query.testId,req.query.exam,req.query.course],(err,data)=>{
    if(err){
      console.log(err)
      res.render("ress",{title:["添加补考","添加补考","补考信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加补考","添加补考","补考信息","添加成功"],username:req.session.username})
    }
  })
  }else{
    res.redirect("/")
  }
  
})
router.post("/login",(req,res)=>{
  connection.query("select * from user where username=? and password=?",[req.body.username,req.body.password],(err,data)=>{
    if(data.length>0){
      req.session.username=req.body.username
      req.session.password=req.body.password
      res.redirect("form")}else{res.end("失败")}
  })
})

module.exports = router;
