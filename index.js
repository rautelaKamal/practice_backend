const express = require('express');
const mongoose = require("mongoose");

const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin");
const app = express();
console.log("scuss")

app.use("/user",userRouter);
app.use("/course",courseRouter); 
app.use("/admin",adminRouter)

async function main (){
await mongoose.connect("mongodb+srv://rautelaKamal:huQ6GaWCcqIbBlm1@cluster0.whe7ook.mongodb.net/courses")
app.listen(3000);
}
main()

