const {Router} = require("express");
const userRouter = Router() // its a function even if it starts with capital
const z = require("zod");

userRouter.post("/signup", function(req,res){
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
     res.json({
        message: "signed up"
     })
})

userRouter.post("/signin", function(req,res){

})

userRouter.get("/purchases",function(req,res){

})

module.exports = {
    userRouter: userRouter
}