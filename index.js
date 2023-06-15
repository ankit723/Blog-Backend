import dotenv from 'dotenv'
dotenv.config();
import express from "express"
import cors from 'cors'
import bodyParser from "body-parser"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import cookie from 'cookie'

const app=express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

var posts=[]

mongoose.connect(process.env.MONGOD_SERVER, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("connected to the mongodb of intern-blog-assesment")
})
.catch((error)=>{
    console.log("Mongod connection error; ", error)
})

const blogSchema = new mongoose.Schema({
    type:String,
    title:String,
    para:String
})

const Blog = new mongoose.model("Blog", blogSchema)

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

const User = new mongoose.model("User", userSchema)


app.post("/compose", (req, res)=>{
    const {f_type, f_title, f_para} = req.body
    console.log(f_type, f_title, f_para)
    const blog = new Blog({ type:f_type, title:f_title, para:f_para });
    blog.save();
    let j_posts={type:f_type, title:f_title, para:f_para}
    posts.push(j_posts)
    res.status(201).json({ message: 'Successfully Posted New Blog' });
})

app.get("/getallposts", (req, res)=>{
    Blog.find({})
    .then((results)=>{
        res.json(results)
    })
})

app.post('/login', (req, res)=>{
    const {f_email,f_password}=req.body
    console.log(f_email, f_password)
    User.findOne({email:f_email})
    .then((user)=>{
        console.log(user)
        if(user){
            
            bcrypt.compare(f_password, user.password, (err, result)=>{
                if (result===true){
                    res.status(201).json({ message: 'User Is Logged In' });
                }else{
                    console.log("err in bcrypt",err)
                }
            })
        }
    })
    .catch(err=>{
        console.log("err in db", err)
    })
})

app.listen(9000, ()=>{
    console.log("The server has started to listen on port 9000")
})