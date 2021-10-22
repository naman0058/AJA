var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");
const fetch = require("node-fetch");



router.get('/main_category',(req,res)=>{
  pool.query(`select * from main_category`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


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
    console.log(req.body)
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '/' + mm + '/' + dd;
    body['current_date'] =  today
    body['status'] = 'pending'
    console.log('body h',req.body)

    
    
        pool.query(`insert into enquiry set ?`,body,(err,result)=>{
          if(err) throw err;
          else res.json({
              msg : 'success'
          })
      })
      


  
  })



  router.get('/myenquiry',(req,res)=>{
      pool.query(`select e.* , 
      (select c.name from category c where c.id = e.categoryid) as categoryname,
      (select b.name from brand b where b.id = e.brandid) as brandname,
      (select m.name from model m where m.id = e.modelid) as modelname,
      (select m.image from model m where m.id = e.modelid) as modelimage
      (select i.id from invoice i where i.bookingid = e.id) as isinvoice
      from enquiry e where e.number = '${req.query.number}' order by id desc`,(err,result)=>{
          if(err) throw err;
          else res.json(result)
      })
  })

  


 router.get('/banner',(req,res)=>{
   pool.query(`select * from banner where type = '${req.query.type}' order by id desc`,(err,result)=>{
     if(err) throw err;
     else res.json(result)
   })
 })




router.post('/create-invoice',(req,res)=>{
    let body = req.body;
    console.log('body h',req.body)
    pool.query(`insert into invoice set ?`,body,(err,result)=>{
        if(err) throw err;
        else{
          pool.query(`update enquiry set price = '${req.body.price}' where id = '${req.body.bookingid}'`,(err,result)=>{
            if(err) throw err;
           else res.json({
            msg : 'success'
              })
          })
        }
        
    })
  })


  router.get('/invoice',(req,res)=>{
    
    var query = `select e.* , 
    (select i.price from invoice i where i.bookingid = e.id) as totalprice,
    (select i.description from invoice i where i.bookingid = e.id) as invoice_description
    from enquiry e where e.id = '${req.query.id}'`
      pool.query(query,(err,result)=>{
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








  router.post('/partner-login',(req,res)=>{
    pool.query(`select * from delivery where number = '${req.body.number}'`,(err,result)=>{
      if(err) throw err;
      else if(result[0]){
        
if(result[0].status == 'approved'){
  res.json({
    msg : 'approved'
  })
}
else {
    res.json({
      msg : 'pending'
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
    pool.query(`select * from enquiry where assigned_number = '${req.query.number}' and status!= 'completed' order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})




router.get('/partner_history',(req,res)=>{
  pool.query(`select * from enquiry where assigned_number = '${req.query.number}' and status = 'completed' order by id desc`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
  })
})




router.get('/single-enquiry',(req,res)=>{
 
  pool.query(` select e.*,
  (select c.name from category c where c.id = e.categoryid) as categoryname,
  (select b.name from brand b where b.id = e.brandid) as brandname,
  (select m.name from model m where m.id = e.modelid) as modelname,
  (select d.name from delivery d where d.number = e.assigned_number ) as assignedname
  from enquiry e where e.id = '${req.query.id}' ;`,(err,result)=>{
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







router.post('/partner-registeration',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image1', maxCount: 1 },{ name: 'image2', maxCount: 1 }]),(req,res)=>{
	let body = req.body
body['status'] = 'pending'
    console.log('files data',req.files)

    
if(req.files.image[0]){
  body['image'] = req.files.image[0].filename

}

  
if(req.files.image1){
    body['image1'] = req.files.image1[0].filename
  }

  
if(req.files.image2){
    body['image2'] = req.files.image2[0].filename
  }

console.log('body hai',req.body)



pool.query(`select * from delivery where number = '${req.body.number}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]){
   res.json({
     status : 500,
     type:'already regiestered',
     description : 'registered already'
   })
  }
  else{
    pool.query(`insert into delivery set ?`,body,(err,result)=>{
      if(err) {
        console.log('error',err);
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
  }
})

   

})






router.get('/blog/all',(req,res)=>{
  pool.query(`select * from blog order by id desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.post('/single-blog',(req,res)=>{
  pool.query(`select * from blog where id='${req.body.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



router.get('/blog/delete',(req,res)=>{
  pool.query(`delete from blog where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})










router.post('/save-user',(req,res)=>{
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
  let body = req .body
  body['date'] = today
    pool.query(`select * from users where number  = '${req.body.number}'`,(err,result)=>{
      if(err) {
          res.json({
              status:500,
              type : 'error',
              description:err
          })
      }
      else if(result[0]) {
        res.json({
            status : 100,
            type:'success',
            description:'successfully registered'

        })
      }
      else{
       pool.query(`insert into users set ?`,body,(err,result)=>{
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
                  description:'successfully registered'
              })
           }
       })
      }
  })
     

})



module.exports = router;