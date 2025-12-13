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

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  
  const reqCourse = z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    price: z.number(),
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid courseId")
  });

  const parsed = reqCourse.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.errors
    });
  }

  const { title, description, imageUrl, price, courseId } = parsed.data;
  const adminId = req.userId;

  const result = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId
    },
    {
      title,
      description,
      imageUrl,
      price
    }
  );

  if (result.modifiedCount === 0) {
    return res.status(403).json({
      message: "Update failed — either course not found or you are not the creator"
    });
  }

  res.json({
    message: "Course updated successfully",
    updated: true
  });
}); // post course

adminRouter.get("/course/bulk", adminMiddleware,async function(req,res){
const adminId = req.userId;

const courses = await courseModel.find({
    creatorId: adminId
});
res.json({
    message: "course updated",
    courses
})
}) // check course


module.exports ={
    adminRouter:adminRouter
}