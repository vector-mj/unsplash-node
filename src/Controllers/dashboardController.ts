import { Request, Response } from "express";

const dashboard = (req:Request,res:Response,next:Function)=>{
    res.status(200).render('dashboard.ejs');
}
const wallpapers = (req:Request,res:Response,next:Function)=>{
    console.log("man man man man man")
    res.status(200).render('icons.ejs');
}
const info = (req:Request,res:Response,next:Function)=>{
    res.status(200).render('info.ejs');
}
const tables = (req:Request,res:Response,next:Function)=>{
    res.status(200).render('tables.ejs');
}

export {dashboard,wallpapers,info,tables}