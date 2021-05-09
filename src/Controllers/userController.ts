// import uesr model
import { Request, Response } from 'express';
import { nextTick } from 'node:process';
import { User } from './../Models/userModel';

// add topUsers as middelware to a new route
const topUsers = async (req:Request,res:Response,next:Function) => {
    req.query.limit = "5";
    req.query.fields = "name,age,email";
    next();
}

const userPost = async (req: Request, res: Response) => {
    try{
        const user = await User.create(req.body);
        if(user){
            res.status(200).json({
                message:"success",
                data:user
            });
        }
    }catch(err){
        res.status(400).json({
            message:"Faild",
            error:"invalid data"
        });
    }

}

const getAllUser = async (req:Request,res:Response)=>{
    try{
        // (1) Clear all querys 
        let cleanQuery:any = {...req.query};
        let whiteList = ['limit','fields','sort','page'];
        whiteList.forEach(el => delete cleanQuery[el]);

        //  (2) Sort by
        let sortBy:string = req.query.sort?(req.query.sort as string).split(",").join(" "):"-accountCreatedAt";

        // (3) Select fields
        const fi:String= req.query.fields?(req.query.fields as String).split(",").join(" "):"-__v";

        // (4) find lessThan or GraterThan
        let query:string = JSON.stringify(cleanQuery);
        let query2:object = JSON.parse(query.replace(/\b(gt|lt|gle|lte)\b/g,match=>`$${match}`));

        // (5) pagination
        let page:any = req.query.page || 1;
        let limit:any = req.query.limit || 100;
        let skip = (page-1)*limit;
        if(req.query.page){
            const numUsers:number = await User.countDocuments();
            if(skip>=numUsers)throw new Error('This page does not exist');
        }
        // (6) run query
        let users = await User.find(query2).select(fi).skip(skip).limit(limit*1).sort(sortBy);

        if(users){
            res.status(200).json({
                message:"successs",
                count:users.length,
                data:users
            });
        }
    }catch(err){
        res.status(400).json({
            message:"Faild",
            error:err
        })
    }
}
const getUser = async (req:Request,res:Response)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            res.status(200).json({
                message:"successs",
                data:user
            });
        }
    }catch(err){
        res.status(400).json({
            message:"Faild",
            error:"invalid data"
        })
    }
}
const deleteUser = async (req:Request,res:Response)=>{
    try{
        const user = await User.findByIdAndRemove(req.params.id);
        if(user){
            res.status(200).json({
                message:"successs , user removed",
                data:user
            });
        }
    }catch(err){
        res.status(400).json({
            message:"Faild",
            error:"invalid data"
        })
    }
}
const updateUser = async (req:Request,res:Response)=>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(user){
            res.status(200).json({
                message:"successs ,This user Updated",
                data:user
            });
        }
    }catch(err){
        res.status(400).json({
            message:"Faild",
            error:"invalid data"
        })
    }
}


export {userPost,getAllUser,getUser,deleteUser,updateUser};
