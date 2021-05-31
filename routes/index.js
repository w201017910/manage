var express = require('express');
var router = express.Router();
var mysql=require("mysql")
var path = require('path');
var fs = require('fs');
var formidable=require("formidable")
var xlsx = require('node-xlsx');
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

router.get('/', function(req, res, next) {
  res.render('login');
});
router.post("/users/reback",(req,res)=>{

  connection.query("select email from user where username=?",[req.body.username],(err,data)=>{

    if(err){console.log(err);res.json({result:"错误"})}else if(data.length<1){
      res.json({result:"用户名不存在"})
    }else{
      var ma=Math.floor(Math.random() * 10000) + 1;
      req.session.user=req.body.username
      req.session.ma=ma
      var transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 465, // SMTP 端口
        secureConnection: true, // 使用了 SSL
        auth: {
          user: '1754332801@qq.com',
          // 这里密码不是qq密码，是你设置的smtp授权码
          pass: 'kwgmbzjmwqkufacg',
        }
      });
      let mailOptions = {
        from: '"lll"<1754332801@qq.com>', // sender address
        to: data[0].email, // list of receivers
        subject: '验证码', // Subject line
        // 发送text或者html格式
        // text: 'Hello world?', // plain text body
        html: '<h1>'+ma+'</h1>' // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
      });
      res.json({result:"发送成功"})
    }
  })
})
router.post("/users/remake",(req,res)=>{
  console.log(1);
  if(req.body.ma==req.session.ma&&req.body.username==req.session.user){
    connection.query("update user set password=? where username=?",[req.body.password,req.body.username],(err,data)=>{
      if(err){res.json({result:"重置失败"})}else{res.json({result:"重置成功"})}
    })
  }else{res.json({result:"验证码错误"})}
})
router.all("/*",(req,res,next)=>{
  if(req.session.username){next()}else{
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
router.get("/reback",(req,res)=>{
  res.render("reback")
})

router.get('/form_advanced', function(req, res, next) {

    connection.query("SELECT className from class",function(err,data){
      if(err){console.log(err)}else{
        res.render('form_advanced',{data:data,username:req.session.username})
      }
    })
  
  
});
router.get('/form_upload', function(req, res, next) {
  res.render('form_upload',{username:req.session.username});
  
});
router.get('/form_validation', function(req, res, next) {
  res.render('form_validation',{username:req.session.username});
  
});
router.get('/form_wizards', function(req, res, next) {
 
    connection.query("select * from layer",function(err,data){
    if(err){console.log(err)}else{
      res.render("form_wizards",{data:data,username:req.session.username})
    }
  })
  
});
router.get('/form', function(req, res, next) {
  
    connection.query("select grade from layer",function(err,data){
    if(err){console.log(err)}else{
      res.render("form",{data:data,username:req.session.username})
    }
  })
  
});
router.get("/tables_remake",function(req,res,next){
  
    connection.query("select * from course;select exam from exam",function(err,data){
      if(err){console.log(err)}else{
        res.render('tables_remake',{data:data,username:req.session.username})
      }
    })
    
})
router.get('/tables_dynamic', function(req, res, next) {
  
    connection.query(mysqlword,function(err,data){
      if(err){console.log(err)}else{
        res.render('tables_dynamic',{data:data,username:req.session.username})
      }
    })
  
  
});
router.get('/tables', function(req, res, next) {

    connection.query("SELECT class.className,student.sname,student.testId FROM class INNER JOIN student ON class.className=student.class;SELECT courseName FROM course;SELECT exam FROM exam",function(err,data){
      if(err){console.log(err)}else{
        res.render('tables',{data:data,username:req.session.username})
      }
    })
  
  
});
router.get('/update', function(req, res, next) {

  connection.query("SELECT * from score",function(err,data){
    if(err){console.log(err)}else{
      
      res.render('update',{data:data,username:req.session.username})
    }
  })


});
router.get("/student",function(req,res,next){

    connection.query("INSERT into student(sname,studentId,sex,class,testId)VALUES(?,?,?,?,?)",
  [req.query.name,req.query.studentId,req.query.sex,req.query.class,req.query.testId],(err,data)=>{
    if(err){
      res.render("ress",{title:["添加学生","添加学生","学生信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加学生","添加学生","学生信息","添加成功"],username:req.session.username})
    }
  })
  

  
})
router.post("/user",(req,res,next)=>{

    connection.query("INSERT into user(username,email,telephone,registertime,password)VALUES(?,?,?,?,?)",
  [req.body.name,req.body.email,req.body.phone,req.body.date,req.body.password],(err,data)=>{
    if(err){
      res.render("ress",{title:["教师注册","添加教师","教师信息","注册失败"],username:req.session.username})}else{
      res.render("ress",{title:["教师注册","添加教师","教师信息","注册成功"],username:req.session.username})
    }
  })
  
  
})

router.get("/layer",(req,res,next)=>{

    connection.query("INSERT into layer(grade)VALUES(?)",
  [req.query.layer],(err,data)=>{
    if(err){
      res.render("ress",{title:["添加年级","添加年级","年级信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加年级","添加年级","年级信息","添加成功"],username:req.session.username})
    }
  })
  
})
router.get("/class",(req,res,next)=>{

    connection.query("INSERT into class(className,number,grade)VALUES(?,?,?)",
  [req.query.classname,req.query.classnumber,req.query.grade],(err,data)=>{
    if(err){
      res.render("ress",{title:["添加班级","添加班级","班级信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加班级","添加班级","班级信息","添加成功"],username:req.session.username})
    }
  })
  
  
})
router.get("/course",(req,res,next)=>{

    connection.query("INSERT into course(courseName)VALUES(?)",
  [req.query.course],(err,data)=>{
    if(err){
      res.render("ress",{title:["添加课程","添加课程","课程信息","添加失败"],username:req.session.username})}else{
      res.render("ress",{title:["添加课程","添加课程","课程信息","添加成功"],username:req.session.username})
    }
  })
  
  
})
router.post("/add",(req,res)=>{

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
    console.log(i);
   if(err){e=true}
  })
}
if(e){res.render("ress",{title:["添加成绩","添加成绩","成绩信息","添加失败"],username:req.session.username})}else{
  res.render("ress",{title:["添加成绩","添加成绩","成绩信息","添加成功"],username:req.session.username})
} 
})
router.post("/update",(req,res)=>{
  var totalscore;
  for(o in req.body){
    if(o=="totalscore[]"){
      totalscore=req.body[o]
    }
  }
var usualscore=req.body["usualscore[]"]
console.log(1);
var testscore=req.body["testscore[]"]


var testId=req.body["testId[]"]
console.log(3);


console.log(totalscore);
var exam=req.body["exam[]"]

var course=req.body["course[]"]
console.log(6);
var e=false;

for(var i=0;i<usualscore.length;i++){

connection.query("update score set usualscore=?,testscore=?,totalscore=? where testId=? and exam=? and course=?",
[usualscore[i],testscore[i],totalscore[i],testId[i],exam[i],course[i]],(err,data)=>{
 if(err){e=true}

})
}
if(e){res.json({result:"修改失败"})}else{
  res.json({result:"修改成功"})
} 
})
router.get("/makeup",(req,res)=>{
 
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
 
  
})

router.post('/upload', function(req, res) {

  var form = new formidable.IncomingForm();   //创建上传表单
      form.encoding = 'utf-8';        //设置编辑
      form.uploadDir = './excel/';     //设置上传目录
      form.keepExtensions = true;     //保留后缀
      form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {

        if (err) {
          console.log(err);
          
          return;        
        }  
        var oldpath = path.normalize(files.file.path)
        var newPath = "./excel/"+files.file.name

        
        fs.renameSync(oldpath,newPath);
        
        leadIn(newPath)
    });      
});
function leadIn(newPath){
  
  var sheets = xlsx.parse(newPath);
  　sheet=sheets[0]
   
    for(var i=2;i<sheet.data.length-1;i++){
      connection.query("insert into score values(?,?,?,'期中考试',?,?,?,?,0,0,?,?)",[sheet.data[i][3],sheet.data[i][4],sheet.data[i][5],sheet.data[i][2],sheet.data[i][7],sheet.data[i][8],sheet.data[i][9],sheet.data[i][6],sheet.data[i][0]],(err,data)=>{
        if(err){console.log(err);}
      })
    }

}
module.exports = router;
