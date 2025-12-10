const {Router} = require("express");
const {adminModel} = require("../db");
const adminRouter = Router();

adminRouter.post("/signup", function(req,res){

})

adminRouter.post("/signin", function(req,res){

}) 
adminRouter.post("/", function(req,res){

})

adminRouter.put("/", function(req,res){

}) // post course

adminRouter.get("/", function(req,res){

}) // check course


module.exports ={
    adminRouter:adminRouter
}