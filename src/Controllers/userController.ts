// import uesr model
import { Request, Response } from 'express';
import { User } from './../Models/userModel';

const userPost = async (req: Request, res: Response) => {
    console.log(req.secure+"  "+req.headers['x-forwarded-proto']);
    User.create(req.body)
    .then(user=>{
        res.redirect('/login?userCreated=true');
        // res.status(200).json({
        //     message:"user created with blow data",
        //     data:user
        // }).redirect('/');
    })
    .catch(err=>{
        res.redirect('/register?userCreated=false');
        // res.status(422).json({
        //     message:"falid",
        //     data:err
        // })
    })
}
export {userPost};