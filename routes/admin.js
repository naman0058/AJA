var express = require('express');

var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');

var table = 'admin';
const request = require('request');


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd; 


router.get('/',(req,res)=>{
    res.render('admin_login',{msg : ''})
})


router.get('/logout',(req,res)=>{
    req.session.adminid = null;
    res.redirect('/admin')
})


router.get('/change-password',(req,res)=>{

var otp = Math.floor(Math.random()*100000)+1;

    request(`http://mysmsshop.in/V2/http-api.php?apikey=gCuJ0RSBDLC3xKj6&senderid=SAFEDI&number=8319339945&message=Use OTP ${otp} to change password your DailyNourish Account.&format=json`, { json: true }, (err, result) => {
        if (err) { return console.log(err); }
       else {
           req.session.otp = otp
        res.render('change-password',{msg:''})
       }
    })
   
})




router.post('/change-password',(req,res)=>{

    if(req.session.otp == req.body.otp){
 pool.query(`update admin set password = '${req.body.password}'`,(err,result)=>{
     if(err) throw err;
     else res.render('admin_login',{msg:''})
 })
    }
    else {
        res.render('change-password',{msg:'Invalid OTP'})
    }
       
    })

router.post('/login',(req,res)=>{
    pool.query(`select * from ${table} where email = '${req.body.email}' and password = '${req.body.password}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
          req.session.adminid = result[0].id
          res.redirect('/admin/dashboard')
        }
        else {
            res.render('admin_login',{msg : 'Invalid Username & Password'})
        }
    })
})


router.get('/dashboard',(req,res)=>{
    if(req.session.adminid){
    var query = `select count(id) as total from category;`
    var query2 = `select count(id) as total from brand;`
    var query3 =  `select count(id) as total from users;`
    var query4 = `select count(id) as total from enquiry where status != 'completed';`
    var query5 = `select count(id) as total from enquiry where status = 'completed';`
    var query6 = `select count(id) as total from enquiry;`
    var query7 = `select sum(price) as total from enquiry;`
    var query8 = `select sum(price) as total from enquiry where current_date = CURDATE();`

    pool.query(query+query2+query3+query4+query5+query6+query7+query8,(err,result)=>{
if(err) throw err;
else res.render('dashboard',{result:result})
    })
     
    }
    else {
        res.render('admin_login',{msg : 'Please Login'})
    }
})



router.get('/update-status',(req,res)=>{
    pool.query(`update booking set status = '${req.query.status}' where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.redirect('/admin/dashboard')
    })
})







router.get('/approved-vendor',(req,res)=>{
    if(req.session.adminid){
        pool.query(`select * from delivery where status =  'approved' order by id desc`,(err,result)=>{
            if(err) throw err;
            else res.render('approved-vendor',{result})
        })
    }
    else {
        res.redirect('/admin')
    }
   
})


router.get('/requested-vendor',(req,res)=>{
    if(req.session.adminid){

        pool.query(`select * from delivery where status !=  'approved' order by id desc`,(err,result)=>{
            if(err) throw err;
            else res.render('requested-vendor',{result})
        })
    }
    else{
        res.redirect('/admin')
    }
 
})



router.get('/approved',(req,res)=>{
    pool.query(`update delivery set status = 'approved' where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.redirect('/admin/requested-vendor')
    })
})


router.get('/reject',(req,res)=>{
    pool.query(`delete from delivery where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else res.redirect('/admin/requested-vendor')
    })
})



router.get('/blog',(req,res)=>{
    if(req.session.adminid) {
        res.render('blog',{login:true})
    }
    else{
      res.redirect('/admin')
    } 
})





router.post('/blog/insert',upload.single('image'),(req,res)=>{
	let body = req.body
    console.log('body aayi ',req.file)
    console.log('body aayi ',req.body)


    body['image'] = req.file.filename;
  
	pool.query(`insert into blog set ?`,body,(err,result)=>{
		if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
            // console.log(err)
        }
		else {
            res.json({
                status:200,
                type : 'success',
                description:'successfully added'
            })
            
        }
	})
})


router.get('/blog/all',(req,res)=>{
    pool.query(`select * from blog b order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




router.get('/blog/delete', (req, res) => {
    let body = req.body
    pool.query(`delete from blog where id = ${req.query.id}`, (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            res.json({
                status:200,
                type : 'success',
                description:'successfully delete'
            })
        }
    })
})







router.post('/blog/update', (req, res) => {
    pool.query(`update blog set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            res.json({
                status:200,
                type : 'success',
                description:'successfully update'
            })
  
            
        }
    })
  })


module.exports = router;
