var express = require('express');
var router = express.Router();
var pool =  require('./pool');








router.get('/',(req,res)=>{
    var query = `select * from category order by id desc;`
    var query1 = `select * from category`
    pool.query(query+query1,(err,result)=>{
        if(err) throw err;
        else res.render('login',{msg : '' , login:false,result})
    })
  

})



router.post('/verification',(req,res)=>{
    let body = req.body
    // body['number'] = 91+req.body.number
    req.session.numberverify = 91+req.body.number
  
    //   console.log(req.body)


    
   })



   router.get('/verification',(req,res)=>{
    var otp =   Math.floor(100000 + Math.random() * 9000);
    req.session.reqotp = otp;
    res.render('otp',{msg : otp , anothermsg:''  })
   })



router.post('/new-user',(req,res)=>{
  let body = req.body;
  if(req.body.otp == req.session.reqotp){
    body['number'] = req.session.numberverify
  

pool.query(`select * from users where number = '${req.session.numberverify}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {


      req.session.usernumber = req.session.numberverify;
      res.redirect('/')
  


  }
  else {

    pool.query(`insert into users set ?`,body,(err,result)=>{
      if(err) throw err;
      else {
       

        req.session.usernumber = req.session.numberverify;
        res.redirect('/')





      }
    })
  }
})



  }
  else{

  res.render('otp',{msg : '' , anothermsg : 'Invalid Otp'})
    
  }
})


module.exports = router;
