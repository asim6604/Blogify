const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose')
const routes=require('./Routes/userRoute')
mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(e=>console.log('mongo connected'))
app.use(express.urlencoded({ extended: true }));
app.set("view engine",'ejs');

app.set('views',path.resolve('./Views'))
app.get('/user',(req,res)=>{
    res.render('homepage')
})
app.use('/',routes);
app.listen(4000,()=>{
    console.log("app is running on 4000");
})