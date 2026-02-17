const express = require('express')
const router = express.Router()
const User = require('../model/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//signup api
router.post('/signup',(req,res)=>{
    console.log('signup post request')

    User.find({email:req.body.email})
    .then(result=>{
        if(result.length>0)
        {
            return res.status(409).json({
                msg:'email already exist'
            })
        }

        bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err)
        {
            console.log(err)
            return res.status(500).json({
                error:err
            })
        }

        const newUser = new User({
        _id:new mongoose.Types.ObjectId,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:hash
    })
    newUser.save()
    .then(result=>{
        const token = jwt.sign({
            firstName:result.firstName,
            lastName:result.lastName,
            userId:result._id,
            email:result.email,
        },
            'sbs 147',
            {
                expiresIn:"365d"
            }
        )
        res.status(201).json({
            firstName:result.firstName,
            lastName:result.lastName,
            email:result.email,
            userId:result._id,
            token:token
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })

    })

    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })

    
})


// login api

router.post('/login', (req, res) => {

    User.findOne({ email: req.body.email })
    .then(user => {

        if (!user) {
            return res.status(401).json({
                msg: 'User does not exist'
            });
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {

            if (!result) {
                return res.status(401).json({
                    msg: 'Invalid password'
                });
            }

            const token = jwt.sign(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userId: user._id
                },
                'sbs 147',
                { expiresIn: "365d" }
            );

            res.status(200).json({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userId: user._id,
                token: token
            });

        });

    })
    .catch(err => {
        res.status(500).json({ error: err });
    });

});


//check user
router.get('/checkEmail/:email',(req,res)=>{
    User.find({email:req.params.email})
    .then(result=>{
        if(result)
        {
            return res.status(200).json({
                isAvailable:true
            })
        }
        res.status(200).json({
            isAvailable:false
        })

    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router;

