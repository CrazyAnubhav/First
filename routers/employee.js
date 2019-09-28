const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
var config = require('./../config/config')
var MongoClient = require('mongodb').MongoClient;
var dbo;

router.use(bodyParser.urlencoded({extended: true}))

MongoClient.connect(config.mongodb_server, {useNewUrlParser: true, useUnifiedTopology: true}, function(err,dbcon){
    console.log("DB connected")
    if(err) throw err;
    dbo = dbcon.db(config.database_name);
})
router.get('/',(req,res)=>{
    console.log("Received a HTTP request from a Browser")
    var message1 = "Employee home page List of Employees"
    var mysort = {_id: 1};
    dbo.collection("employee_masters").find().sort(mysort).toArray((err,result)=>{
        if (err) throw err;
    res.render('employee/employee_list', {message: message1, records: result})
}) 
})

router.get('/json',(req,res)=>{
    var record_set1 = [
        {name: 'Amar', department: 'Software Development'},
        {name: 'Naren', department: 'Admin'},
        {name: 'Deepa', department: 'QA'}
    ];
    res.json(record_set1)
})

router.get('/employee_add_form',(req,res)=>{
    res.render('employee/employee_add')
})   

router.post('/insert_employee',(req,res)=>{
console.log("Received a HTTP POST request from a Browser") 
var record = {_id : req.body.employee_id, name : req.body.employee_name, designation : req.body.designation};
if(req.body.employee_id != "" && req.body.employee_name != ""){
    dbo.collection("employee_masters").insertOne(record, function(err,res1){
        if (err) throw err;
        console.log("1 record created");
        res.redirect('/')
    })
} else {
    res.redirect('/')
}
})

router.get('/edit/:employee_id',// async(req,res)=>{
    (req,res)=>{
    let{employee_id}=req.params;
    var where={_id:employee_id};
    dbo.collection(config.table_name)
           .findOne(where, (err, result)=>{
               if(err) return console.log(err)
               res.render('employee/employee_edit',{record: result})
           })

})
router.post('/update_employee/:employee_id',// async(req,res)=>{
    (req,res)=>{
    let{employee_id}=req.params;
    var where={_id:req.params.employee_id};
    var set_values = 
    {$set: {name: req.body.employee_name, designation: req.body.employee_designation}};
    if(req.body.employee_name != ""){
        dbo.collection(config.table_name)
        .updateOne(where, set_values, function(err,res){
            if(err) throw err;
            console.log("1 document updated");
        })
    }
    res.redirect('/');
});

router.get('/delete_employee/:employee_id',
    (req,res)=>{
    let{employee_id}=req.params;
    var where={_id:employee_id};
    dbo.collection(config.table_name)
    .deleteOne(where, function(err,res){
        if(err) throw err;
        console.log("1 document Delete");
    });
    res.redirect('/');
});

router.get('/sort_employee_by_id',(req,res)=>{
    var mysort = {_id: 1};
    dbo.collection(config.table_name).find().sort(mysort).toArray((err,result)=>{
        if (err) return console.log(err);
    res.render('employee/employee_list', {records: result})
}) 
})

router.get('/sort_employee_by_name',(req,res)=>{
    var mysort = {name: 1};
    dbo.collection(config.table_name).find().sort(mysort).toArray((err,result)=>{
        if (err) return console.log(err);
    res.render('employee/employee_list', {records: result})
}) 
})

router.get('/sort_employee_by_designation',(req,res)=>{
    var mysort = {designation: 1};
    dbo.collection(config.table_name).find().sort(mysort).toArray((err,result)=>{
        if (err) return console.log(err);
    res.render('employee/employee_list', {records: result})
}) 
})
module.exports = router;
