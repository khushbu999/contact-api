const express = require('express')
const router = express.Router();
const Contact = require('../model/contact')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/checkAuth')
const jwt = require('jsonwebtoken')

//add contact
router.post('/',checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs 147')
    newContact = new Contact({
        _id:new mongoose.Types.ObjectId,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        address:req.body.address,
        phone:req.body.phone,
        userId:verify.userId
    })

    newContact.save()
    .then(result=>{
        res.status(200).json({
            newContact:result
        })
    })
})

//get own contact 
router.get('/', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs 147')
    Contact.find({ userId: verify.userId })

        .select("_id firstName lastName email phone address")
        .then(result => {
            res.status(200).json({
                blogList: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

// delete contact 
router.delete('/:id', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs 147')
    console.log(verify)

    Contact.deleteOne({ _id: req.params.id, userId: verify.userId })
        .then(result => {
            if (result.deletedCount == 0) {
                return res.status(401).json({
                    msg: 'something is wrong'
                })
            }
            res.status(200).json({
                msg: 'deleted success'
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

//update
router.put('/:id', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs 147')
    console.log(verify)

    Contact.find({ _id: req.params.id, userId: verify.userId })
        .then(result => {
            if (result.length == 0) {
                return res.status(400).json({
                    msg: 'something is wrong'
                })
            }
            Contact.findOneAndUpdate({ _id: req.params.id, userId: verify.userId }, {
                $set: {
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    email:req.body.email,
                    address:req.body.address,
                    phone:req.body.phone
                }
            })
                .then(result => {
                    res.status(200).json({
                        msg: result
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

})

module.exports = router


