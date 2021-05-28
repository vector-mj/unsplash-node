import { Request, Response } from "express";

const login = (req:Request,res:Response)=>{
    console.log(req.cookies.jwt);
    console.log(`${req.ip} connected to server`); 
    res.status(200).render(`login.ejs`,{data:{number:req.params.number}});
};

const register = (req:Request,res:Response)=>{
    console.log(`${req.ip} connected to server`);
    res.render(`register.ejs`,{data:{number:req.params.number}});
};

const index = (req:Request,res:Response)=>{
    console.log(`${req.ip} connected to server`);
    res.render(`index.ejs`,{data:{number:req.params.number}});
};
export {login,register,index}