const express = require('express')
const app = express()
var config = require('./config/config')
var routers_employee = require('./routers/employee') 

app.use('/',routers_employee);
app.set('view engine', config.view_engine)
app.set('port_no', config.port_no)


app.listen(app.get('port_no'), ()=>{
    console.log(`Server is running on port ${app.get('port_no')}`)
})

