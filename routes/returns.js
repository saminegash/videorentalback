const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/',auth, async(req, res)=>{
    if(!req.body.customerId){
        return res.status(400).send("No customrer Id provided")
    }
})

module.exports =router;