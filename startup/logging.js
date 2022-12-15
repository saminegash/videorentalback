const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')

module.exports = function (){
const logger = winston.createLogger({
    transports:[
        new winston.transports.File({filename:'uncoughtExceptions.log'}),
        new winston.transports.Console()
    ],
    rejectionHandlers:[
        new winston.transports.File({
            filename:'rejections.log'
        })
    ]
})

process.on('uncaughtException', (ex) =>{
    console.log("We Got an UnCaught Exception");
    winston.error(ex.message, ex)
  })
  
  process.on('unhandledRejection', (ex) =>{
    console.log("We Got an UnCaught Exception");
    winston.error(ex.message, ex)
  })
  
  
  winston.add(new winston.transports.File( {filename: 'logfile.log'}))
  winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/vidly'}))
}