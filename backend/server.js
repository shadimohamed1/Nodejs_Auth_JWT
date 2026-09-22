import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());


const users =[];


app.post("/api/signup",async (req,res)=>{

    try {
        
   const {email,password}=req.body;  
   if(!email || !password ){
       return res.status(400).json({message:"All fields are required"});
   }

   const existingUser = users.find(user => user.email === email);
   
   if(existingUser){
       return res.status(400).json({message:"User already exists"});
   }

   const passwordHash=await bcrypt.hash(password,10);
   
   
   const newUser = {
        id : users.length+1,
        email,
        passwordHash,
        role : "USER",
        createdAt : new Date(),
   } 
   users.push(newUser);
   
   return res.status(201).json({message:"User created successfully"});
} catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal server error"});
}
})

app.post("/api/signin",async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user = users.find(user=>user.email===email);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }


        const isPasswordValid = await bcrypt.compare(password,user.passwordHash);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid password"});
        }
        const token = jwt.sign({
            sub : user.id,
            role : user.role,
        },process.env.JWT_SECRET,{expiresIn:"1h"});

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:15*60*1000
        });
        return res.status(200).json({message:"User signed in successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
})

function authenticateToken(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        req.user = payload;
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({message:"Invalid Token"});
    }
}


app.get("/api/profile",authenticateToken,(req,res)=>{
    res.status(200).json({message:"Protected Route Accessed",
        userId:req.user.sub,
        role : req.user.role
    });
})


function requireAdminRole(req,res,next){
    if(req.user.role !== "ADMIN"){
        return res.status(403).json({message:"Access denied"});
    }
    next();
}

app.delete("/api/delete/:id",authenticateToken,requireAdminRole,(req,res)=>{
    const userId = parseInt(req.params.id);
    const index = users.findIndex(user=>user.id === userId);
    if(index === -1){
        return res.status(404).json({message:"User not found"});
    }
    users.splice(index,1);
    res.status(200).json({message:"User deleted successfully"});
})


app.post("/api/logout",(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message:"User logged out successfully"});
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});