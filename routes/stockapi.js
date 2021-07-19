var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");
const fetch = require("node-fetch");




router.get('/pop-up-banner',(req,res)=>{
    pool.query(`select * from pop_up_image`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.get('/screenshot',(req,res)=>{
    pool.query(`select * from screenshot order by id desc limit 20`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.get('/intraday',(req,res)=>{
    pool.query(`select * from intraday order by id desc limit 20`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})



router.get('/delivery',(req,res)=>{
    pool.query(`select * from intraday order by id desc limit 20`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})






module.exports = router;