const db=require('../db')
const express=require('express')
const utils = require('../utils')
const cryptoJs = require('crypto-js')

const router=express.Router()

router.post('/login',(request,response)=>{
    const{email,password}=request.body
  // const encryptedPassword=''+cryptoJs.MD5(password)
    const connection=db.createConnection()
    const statement=`select * from admin where email='${email}' and password='${password}'`
    connection.query(statement,(error,admin)=>{
        connection.end()
       
        if(admin.length==0){
            response.send(utils.createResult('Invalid Email or Password'))
        }
        else{
            const Admin=admin[0]
            const info={
                email:Admin['email'],
                password:Admin['password']
            }
            response.send(utils.createResult(null, info))//??
        }
    })
})

router.post('/register', (request, response) => {
    const {name, email, phone,password} = request.body
    var d = Date();
    d.toString()
    const encryptedPassword = cryptoJS.MD5(password)
    const statement = `insert into user (name, email, phone, password, registration_date) values ('${name}', '${email}','${phone}' ,'${encryptedPassword}','${d}')`
    const connection = db.createConnection()
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})

router.put('/toggle-status/:id', (request, response) => {
    const id = request.params.id
    const {status} = request.body
    const statement = `update user set status = ${status} where id = ${id}`
    const connection = db.createConnection()
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})
module.exports = router