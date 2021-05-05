// import uesr model
import { Request, Response } from 'express';
import { User } from './../Models/userModel';

const userPost = async (req: Request, res: Response) => {
    User.create(req.body)
    .then(user=>{
        res.redirect('/?userCreated=true');
        // res.status(200).json({
        //     message:"user created with blow data",
        //     data:user
        // }).redirect('/');
    })
    .catch(err=>{
        res.redirect('/?userCreated=false');
        // res.status(422).json({
        //     message:"falid",
        //     data:err
        // })
    })
}
export {userPost};