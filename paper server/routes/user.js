const express = require('express')
const db = require('../db')
const utils = require('../utils')
const cryptoJS = require('crypto-js')

const router = express.Router()

router.get('/', (request, response) => {
    const statement = `select id, name, email, phone, status from user`
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
router.post('/login', (request, response) => {
    const {email, password} = request.body
    const encryptedPassword = cryptoJS.MD5(password)
    let statement = `select id, name, email, status from user where email = '${email}' and password = '${encryptedPassword}'`
    const connection = db.createConnection()
    connection.query(statement, (error, users) => {
        
        if (users.length == 0) {
            connection.end()
            response.send(utils.createResult('invalid email or password'))
        } else {
            const user = users[0]
            if (user['status'] == 0) {
                connection.end()
                // user is disabled
                response.send(utils.createResult('Your account is disabled. Please contact Administrator.'))
            } else {
                // if status  = 1  then onluy then permission is granted
                const user=users[0]
            const info={
                name: user['name'],
                email: user['email'],
                id: user['id']

            }
            response.send(utils.createResult(null,info))
                
            }
        }
    })
})

router.post('/register', (request, response) => {
    const {name, email, phone,password} = request.body
    console.log(request.body)
    var d = Date();
    d.toString()
    console.log(d)
    const encryptedPassword = cryptoJS.MD5(password)
    const connection = db.createConnection()
    const statement = `insert into user (name, email, phone, password, registration_date) values ('${name}', '${email}',${phone} ,'${encryptedPassword}','${d}')`
    console.log(statement)
    connection.query(statement, (error, data) => {
        connection.end()
        response.send(utils.createResult(error, data))
    })
})  

module.exports = router