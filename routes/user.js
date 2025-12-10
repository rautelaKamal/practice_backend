const {Router} = use(express);
const userRouter = Router() // its a function even if it starts with capital


userRouter.post("/signup", function(req,res){

})

userRouter.post("/signin", function(req,res){

})

userRouter.get("/purchases",function(req,res){

})

module.exports = {
    userRouter: userRouter
}