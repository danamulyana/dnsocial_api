const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// create a post
router.post("/", async (req, res) => {
    try{
        const newPost = await new Post(req.body);
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status: "Internal Server Error",
            errStatus : {err}
        }
        console.log(err)
        res.status(500).json(errorHandel);
    }
});

// update a post
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body});
            res.status(200).json({
                statusCode: 200 , 
                status:"the post has been update",
            })
        }else{
            res.status(403).json({
                statusCode: 403 , 
                status:"You can update only your post",
            })
        }
    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status: "Internal Server Error",
            errStatus : {err}
        }
        console.log(err)
        res.status(500).json(errorHandel);
    }
})

// delete a post
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json({
                statusCode: 200 , 
                status:"the post has been deleted",
            })
        }else{
            res.status(403).json({
                statusCode: 403 , 
                status:"You can delete only your post",
            })
        }
    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status: "Internal Server Error",
            errStatus : {err}
        }
        console.log(err)
        res.status(500).json(errorHandel);
    }
});

// like a post
router.put("/:id/like", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json({
                statusCode: 200 , 
                status:"the post has been liked",
            })
        }else{
            await post.updateOne({$pull: {likes: req.body.userId }});
            res.status(200).json({
                statusCode: 200 , 
                status:"the post has been disliked",
            })
        }

    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status: "Internal Server Error",
            errStatus : {err}
        }
        console.log(err)
        res.status(500).json(errorHandel);
    }
});

// get a post
router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status: "Internal Server Error",
            errStatus : {err}
        }
        console.log(err)
        res.status(500).json(errorHandel);
    }
});

// get timeline posts
router.get("/timeline/all", async (req, res) => {
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const frendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        res.json(userPosts.concat(...frendPosts))
    }catch(err){
        const errorHandel = {
            statusCode: 500 , 
            status: "Internal Server Error",
            errStatus : {err}
        }
        console.log(err)
        res.status(500).json(errorHandel);
    }
})

module.exports = router