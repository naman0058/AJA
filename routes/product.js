var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'model';


router.get('/',(req,res)=>{
    if(req.session.adminid){
    res.render('product')
    }
    else{
        res.render('admin_login',{msg:'Please Login First'})
    }
})


router.post('/insert',upload.single('image') ,(req,res)=>{
	let body = req.body
    body['image'] = req.file.filename;

console.log('body hai',req.body)
   
	pool.query(`insert into ${table} set ?`,body,(err,result)=>{
		if(err) {
            console.log('eroor',err)
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
                description:'successfully added'
            })
        }
	})
})



router.get('/all',(req,res)=>{
	pool.query(`select s.* , 
    (select c.name from category c where c.id = s.categoryid) as categoryname,
    (select b.name from brand b where b.id = s.brandid) as brandname
   from ${table} s `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
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


router.post('/update', (req, res) => {

let body = req.body

  

    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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



router.post('/update_image',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image1', maxCount: 1 },{ name: 'image2', maxCount: 1 }]), (req, res) => {
    let body = req.body
 console.log('files data',req.files)

if(req.files.image){
    body['image'] = req.files.image[0].filename
  
  }
  
    
  if(req.files.image1){
      body['image1'] = req.files.image1[0].filename
    }
  
    
  if(req.files.image2){
      body['image2'] = req.files.image2[0].filename
    }
  

    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            // res.json({
            //     status:200,
            //     type : 'success',
            //     description:'successfully update'
            // })
            res.redirect('/model')
        }
    })
})



module.exports = router;