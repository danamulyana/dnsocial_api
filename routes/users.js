const router = require('express').Router();
const bcrypt = require('bcrypt')
const User = require('../models/User');

// update user
router.put('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                const errorHandel = {
                    statusCode: 500 , 
                    status:"Internal Server Error",
                    errStatus : err
                }
                console.log(err)
                return res.status(500).json(errorHandel);
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            })
            res.status(200).json({
                statusCode: 200 , 
                status:"Account has been updated",
            })
        }catch(err){
            const errorHandel = {
                statusCode: 500 , 
                status:"Internal Server Error",
                errStatus : err
            }
            console.log(err)
            return res.status(500).json(errorHandel);
        }
    }else{
        return res.status(403).json({
            statusCode: 403 , 
            status:"You can update only your account",
        })
    }
})

// delete user
router.delete('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json({
                statusCode: 200 , 
                status:"Account has been deleted",
            })
        }catch(err){
            const errorHandel = {
                statusCode: 500 , 
                status:"Internal Server Error",
                errStatus : err
            }
            console.log(err)
            return res.status(500).json(errorHandel);
        }
    }else{
        return res.status(403).json({
            statusCode: 403 , 
            status:"You can delete only your account",
        })
    }
})

// get a user
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other);
    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status:"Internal Server Error",
            errStatus : err
        }
        console.log(err)
        return res.status(500).json(errorHandel);
    }
})

// follow a user
router.put('/:id/follow', async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user  = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId }})
                await currentUser.updateOne({$push: {followings: req.params.id }})
                res.status(200).json({
                    statusCode: 200 , 
                    status:"user has been followed",
                })
            }else{
                return res.status(403).json({
                    statusCode: 403 , 
                    status:"You allready follow this user",
                })
            }

        }catch(err){
            const errorHandel = {
                statusCode: 500 , 
                status:"Internal Server Error",
                errStatus : err
            }
            console.log(err)
            return res.status(500).json(errorHandel);
        }
    }else{
        return res.status(403).json({
            statusCode: 403 , 
            status:"You cant follow yourself",
        })
    }
})

// unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user  = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers: req.body.userId }})
                await currentUser.updateOne({$pull: {followings: req.params.id }})
                res.status(200).json({
                    statusCode: 200 , 
                    status:"user has been unfollowed",
                })
            }else{
                return res.status(403).json({
                    statusCode: 403 , 
                    status:"You dont follow this user",
                })
            }

        }catch(err){
            const errorHandel = {
                statusCode: 500 , 
                status:"Internal Server Error",
                errStatus : err
            }
            console.log(err)
            return res.status(500).json(errorHandel);
        }
    }else{
        return res.status(403).json({
            statusCode: 403 , 
            status:"You cant unfollow yourself",
        })
    }
})

module.exports = router