import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import express, { Router } from "express";
let db = require("../../models");

const router = express.Router();
dotenv.config()

router.post("/login", (req,res)=>{
  db.User.findOne({email: req.body.email})
  .then(user =>{
    if(!user || !user.password){
      return res.status(404).send({ message: "User not found"})
    }
    if( !user.isAuthenticated(req.body.password)){
      return res.status(406).send({ message: "Not Acceptable: Invalid Credentials!"})
    }
    let token = jwt.sign(user.toJSON(), "thisIsASecret",{
      expiresIn: 60 * 60 * 8
    })
    res.send({ token })
  })
  .catch(err =>{
    console.log("Error in POST /auth/login", err)
    res.status(503).send({ message: "Something wrong, prob DB related. Or you made a type. One of those."})
  })
})

router.post("/signup", (req,res)=> {
  console.log("HELLO")
  db.User.findOne({
    email: req.body.email
  })
  .then(user =>{
    if(user) {
      return res.status(409).send({ message: "Email address in use "})
    }
    db.User.create(req.body)
    .then(newUser =>{
      let token = jwt.sign(newUser.toJSON(), "thisIsASecret", {
        expiresIn: 60 * 60 * 8
      })
      res.send({ token })
    })
    .catch(err => {
      console.log("Error when creating new user", err)
      res.status(500).send({ message: "Error creating user"})
    })
  })
  .catch(err =>{
    console.log("Error in POST /auth/signup", err)
    res.status(503).send({ message: "Something wrong, prob DB related. Or you made a typo. One of those." })
  })
})

router.get("/current/user", (req: any,res)=>{
  console.log(req.user)
  if(!req.user || !req.user._id) {
    return res.status(417).send({ message: "Check configuration" });
  }
  res.send({ user: req.user })
})

export default router