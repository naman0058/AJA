var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");
const fetch = require("node-fetch");




router.get('/category',(req,res)=>{
	pool.query(`select * from category order by name`,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})


router.get('/brand',(req,res)=>{
	pool.query(`select * from brand where categoryid = '${req.query.categoryid}' order by name  `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})




router.get('/model',(req,res)=>{
	pool.query(`select * from model where categoryid = '${req.query.categoryid}' and brandid = '${req.query.brandid}' order by name`,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})




router.get('/get-address',(req,res)=>{
    pool.query(`select * from address where usernumber = '${req.query.usernumber}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
  })
  
  
  
  router.post('/save-address',(req,res)=>{
    let body = req.body;
    console.log('body h',req.body)
    pool.query(`insert into address set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({
            msg : 'success'
        })
    })
  })
  
  
  
  
  router.get('/delete-address',(req,res)=>{
    pool.query(`delete from address where id = '${req.query.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json({msg:'success'})
    })
  })
  
  
  
  router.get('/get-single-address',(req,res)=>{
    pool.query(`select * from address where id = '${req.query.id}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  })
  
  
  
  
  router.post('/update-address', (req, res) => {
    pool.query(`update address set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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

  


  router.post('/create-enquiry',(req,res)=>{
    let body = req.body;
    var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
    body['current_date'] =  today
    console.log('body h',req.body)
    pool.query(`insert into enquiry set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({
            msg : 'success'
        })
    })
  })



  router.get('/myenquiry',(req,res)=>{
      pool.query(`select * from enquiry where number = '${req.query.number}' order by id desc`,(err,result)=>{
          if(err) throw err;
          else res.json(result)
      })
  })

  


 




router.post('/create-invoice',(req,res)=>{
    let body = req.body;
    console.log('body h',req.body)
    pool.query(`insert into invoice set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.json({
            msg : 'success'
        })
    })
  })


  router.get('/invoice',(req,res)=>{
      pool.query(`select * from invoice where number = '${req.query.number}'`,(err,result)=>{
          if(err) throw err;
          else res.json(result)
      })
  })


  
router.post("/payment-initiate", (req, res) => {
    const url = `https://rzp_live_dzlUpCalsmyFit:MuvUAutY83bcbpHZol6xXrPZ@api.razorpay.com/v1/orders/`;
    const data = {
      amount: req.body.amount * 100, // amount in the smallest currency unit
      //amount:100,
      currency: "INR",
      payment_capture: true,
    };
    console.log("data", data);
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((resu) => res.send(resu));
  });
  
  router.get("/demo", (req, res) => {
    res.render("dem");
  });
  
  router.get("/demo1", (req, res) => {
    console.log(req.query);
    res.send(req.query);
  });




  router.post("/razorpay-response", (req, res) => {
    let body = req.body;
    console.log("response recieve", body);
  
    if (body.razorpay_signature) {
      res.redirect("/api/success_razorpay");
    } else {
      res.redirect("/api/failed_payment");
    }
  });
  
  router.get("/success_razorpay", (req, res) => {
    res.json({
      msg: "success",
    });
  });
  
  router.get("/failed_payment", (req, res) => {
    res.json({
      msg: "failed",
    });
  });
  
  router.post("/failed_payment", (req, res) => {
    res.json({
      msg: "failed",
    });
  });





  router.post('/partner-registeration',(req,res)=>{
    pool.query(`insert into partner set ?`,body,(err,result)=>{
      if(err) throw err;
      else res.json({
        msg : 'success',
        
      })
    })
  })




  router.post('/partner-login',(req,res)=>{
    pool.query(`select * from partner where number = '${req.body.number}'`,(err,result)=>{
      if(err) throw err;
      else if(result[0]){
        
if(result[0].status == 'approved'){
  res.json({
    msg : 'approved'
  })
}
else {
    res.json({
      msg : 'reject'
    })
}

      }
      else {
  res.json({
    msg : 'you are not registered'
  })
      }
    })
  })








  router.get('/partner_enquiry',(req,res)=>{
    pool.query(`select * from enquiry where assignednumber = '${req.query.number}' order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




router.get('/single-enquiry',(req,res)=>{
  pool.query(`select * from enquiry where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.post('/update-status',(req,res)=>{
  pool.query(`update enquiry set status = '${req.body.status}' where id = '${req.body.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json({
      msg : 'success'
    })
  })
})










router.post('/enquiry/update/status',(req,res)=>{
  pool.query(`update enquiry set ? where id = ?`, [req.body, req.body.id], (err, result) => {

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