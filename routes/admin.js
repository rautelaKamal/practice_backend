const {Router} = require("express");
const {adminModel, courseModel} = require("../db");
const adminRouter = Router();
const z = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD} = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async function(req,res){
const requiredbody = z.object({
    email: z.string(),
    password:z.string(),
    firstName:z.string(),
    lastName:z.string()
})
const parsed = requiredbody.safeParse(req.body);
if(!parsed.success){
    res.json({
        message: "wrong format"
    })
}
const {email,password,firstName,lastName} = parsed.data;

const hasedPassword = await bcrypt.hash(password,10);

await adminModel.create({
    email,
    password:hasedPassword,
    firstName,
    lastName,
})
    res.json({
        message:"signed up",
    })
})

adminRouter.post("/signin",async function(req,res){
    const{email,password} = req.body;

    const admin =await adminModel.findOne({email});

    if(!admin){
        res.json({
            message:"incorrect crendentials"
        })
    }
    const checkPassword = await bcrypt.compare(password,admin.password);

    if(!checkPassword){
        res.json({
            message:"incorrect password"
        })
    }
    const token = jwt.sign({
        id: admin._id
    },JWT_ADMIN_PASSWORD);

    res.json({
        token:token,
    });
}); 
adminRouter.post("/course", adminMiddleware, async function(req,res){
const reqCourse = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    price:z.number(),
    
})
const parsed = reqCourse.safeParse(req.body);
if(!parsed){
    res.json({
        message:"error"
    })
}
const { title,description,imageUrl,price } = req.body;

const course = await courseModel.create({
    title:title,
    description:description,
    imageUrl:imageUrl,
    price:price,
    creatorId:adminId
})
 res.json({
    message: "course created",
    courseId: course._id
 })
})

adminRouter.put("/course",adminMiddleware, async function(req,res){

const reqCourse = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    price:z.number(),
    
})
const parsed = reqCourse.safeParse(req.body);
if(!parsed){
    res.json({
        message:"error"
    })
}
const adminId = req.userId;
const { title,description,imageUrl,price,courseId } = req.body;

const course = await courseModel.updateOne({
    _id: courseId,
    creatorId: adminID
},{
    title:title,
    description:description,
    imageUrl:imageUrl,
    price:price,
    creatorId:adminId
})
 res.json({
    message: "course created",
    courseId: course._id
 })

}) // post course

adminRouter.get("/course/bulk", function(req,res){

}) // check course


module.exports ={
    adminRouter:adminRouter
}