// import uesr model
import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { User } from './../Models/userModel';
// import { catchErr } from './../utils/catchError';

// const aggregateUesr = async (req:Request,res:Response,next:Function) =>{
//     const state = User.aggregate([
//         {
//             $match:{age:{$gt:50}}
//         },
//         {
//             $group:{
//                 _id:"$age"
//             }
//         }
//     ])
// }

// const topUsers = async (req: Request, res: Response, next: Function) => {
//     try {
//         req.query.limit = "5";
//         req.query.fields = "name,age,email";
//         next();
//     } catch (err) {
//         next(new AppError(err, 400))
//     }
// };

const userPost = async (req: Request, res: Response, next: Function) => {
    try {
        const user = await User.create({
            name:req.body.name,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password,
            age:req.body.age,
            passwordConfrim:req.body.passwordConfrim
        });
        if (user) {
            res.status(200).json({
                message: "success",
                data: user
            });
        } else {
            next(new AppError("fuck this", 404));
        }
    } catch (err) {
        next(new AppError(err, 400))
    }
};

const getAllUser = async (req: Request, res: Response, next: Function) => {
    try {
        // (1) Clear all querys 
        let cleanQuery: any = { ...req.query };
        let whiteList = ['limit', 'fields', 'sort', 'page'];
        whiteList.forEach(el => delete cleanQuery[el]);

        //  (2) Sort by
        let sortBy: string = req.query.sort ? (req.query.sort as string).split(",").join(" ") : "-accountCreatedAt";

        // (3) Select fields
        const fi: String = req.query.fields ? (req.query.fields as String).split(",").join(" ") : "-__v";

        // (4) find lessThan or GraterThan
        let query: string = JSON.stringify(cleanQuery);
        let query2: object = JSON.parse(query.replace(/\b(gt|lt|gle|lte)\b/g, match => `$${match}`));

        // (5) pagination
        let page: any = req.query.page || 1;
        let limit: any = req.query.limit || 100;
        let skip = (page - 1) * limit;
        if (req.query.page) {
            const numUsers: number = await User.countDocuments();
            if (skip >= numUsers) throw new Error('This page does not exist');
        }
        // (6) run query
        let users = await User.find(query2).select(fi).skip(skip).limit(limit * 1).sort(sortBy);

        if (users) {
            res.status(200).json({
                message: "successs",
                count: users.length,
                data: users
            });
        }
    } catch (err) {
        next(new AppError(err, 400))
    }
};
const getUser = async (req: Request, res: Response, next: Function) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.status(200).json({
                message: "successs",
                data: user
            });
        }
    } catch (err) {
        next(new AppError(err, 400))
    }
};
const deleteUser = async (req: Request, res: Response, next: Function) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (user) {
            res.status(200).json({
                message: "successs , user removed",
                data: user
            });
        }else{
            return next(new AppError("this user id not exists", 400))
        }
    } catch (err) {
        next(new AppError(err, 400))
    }
};
const updateUser = async (req: Request, res: Response, next: Function) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (user) {
            res.status(200).json({
                message: "successs ,This user Updated",
                data: user
            });
        }
    } catch (err) {
        next(new AppError(err, 400))
    }
};


export { userPost, getAllUser, getUser, deleteUser, updateUser };
