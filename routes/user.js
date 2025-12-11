const {Router} = require("express");
const userRouter = Router() // its a function even if it starts with capital
const z = require("zod");
const bcrypt = require("bcrypt");

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
const {email, password} = req.body;
})
    
const user = userModel.findOne({
    email:email,
    password: password
})


userRouter.get("/purchases",function(req,res){

})

module.exports = {
    userRouter: userRouter
}