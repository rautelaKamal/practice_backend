const {Router} = require("express");
const userRouter = Router() // its a function even if it starts with capital
const z = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD= "ilovecream";
userRouter.post("/signup", async function(req,res){
     const requiredbody = z.object({
        email: z.string(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string()
     })

     const parsed = requiredbody.safeParse(req.body);

     if(!parsed.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: parsed.error.errors
        });
     }
     const {email,password,firstName,lastName} = parsed.data;
    
     const hashPassword = await bcrypt.hash(password,10);
     await userModel.create({
            email:email,
            password: hashPassword,
            firstName:firstName,
            lastName: lastName
     })
     res.json({
        message: "signup successfull",
     })
})

userRouter.post("/signin",async function(req,res){
const {email,password} = req.body;
})
//step 1
const user = await userModel.findOne({email})

if(!user){
    res.status(403).json({
     message:"Incorrect crendentials"
    })
}
//step 2 compare passwords
const isPasswordCorrect = await bcrypt.compare(password, user.password);
if (!isPasswordCorrect) {
    return res.status(403).json({
      message: "Incorrect credentials",
    });
  }

  // step 3
const token = jwt.sign({
   id: user._id
},JWT_USER_PASSWORD);

//do cookie logic

res.json({
    token:token
})

userRouter.get("/purchases",function(req,res){

})

module.exports = {
    userRouter: userRouter
}