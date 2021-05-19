import {Response,Request} from 'express';
import { truncate } from 'fs/promises';
import {createTransport} from 'nodemailer';
import * as jwt from 'jsonwebtoken';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
import { AppError } from '../utils/AppError';
import {User} from './../Models/userModel';
const signUp = async (req:Request,res:Response,next:Function)=>{
    try{
        const user = await User.create(req.body);
        if (user) {
            res.status(200).json({
                message: "success",
                data: user
            });
        }

    }catch(err){
        next(new AppError(err,400))
    }
};
const signToken = (id:any)=>{
    let secret:any = process.env.SECRET;
    return jwt.sign({id:id},secret,{expiresIn:process.env.EXPIRES_TOKEN});
}
const login = async (req:Request,res:Response,next:Function)=>{
    try{

        const {email,password} = req.body;
        if(!email||!password){
            return next(new AppError("please enter email & password",404));
        }
        const result:any = await User.findOne({email}).select('password');
        if(!res||!await bcrypt.compare(password,result.password)){
            return next(new AppError("email or password is wrong",400))
        }
        const tok = signToken(result._id)
        let time:number|any = process.env.COOKIE_EXPIRES;
        res.cookie('jwt',tok,{
            expires:new Date(Date.now()+1*24*60*60*1000),
            httpOnly:true,
            secure:true,            
        });
        res.status(200).json({
            message:"success",
            token:tok
        })
    }catch(err){
        next(new AppError(err,400))
    }
};

const protect = async (req:Request,res:Response,next:Function)=>{
    //(1)
    let token:any;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) return next(new AppError("please login first to access to this path",401));
    //(2)
    let secret:any = process.env.SECRET;
    const decode:any = jwt.verify(token,secret);
    if(!decode) return next(new AppError("please enter a valid token",401));
    //(3)
    const currentUser:any = await User.findById(decode.id) 
    if(!currentUser) return next(new AppError("your account deleted please register again",401));
    //(4)
    if(currentUser.passwordChangedAt>new Date(decode.iat*1000)) return next(new AppError("your password changed alerady, please first login.",401));
    req.user = currentUser; 
    // GO GO
    next()
}

const license = (...rols:string[]) =>{
    return (req:Request,res:Response,next:Function)=>{
        let user:any = req.user;
        console.log(rols);
        if(!rols.includes(user.role)){
            return next(new AppError("you dont have permission to access to this page",400))
        }
        next();
    }
}
const forgotPassword = async (req:Request,res:Response,next:Function)=>{
    const email = req.body.email;
    if(!email) return next(new AppError("Please send a email ",400));
    
    const user:any = await User.findOne({email});
    if(!user) return next(new AppError("we haven't user with this email",404));
    
    const forgotToken:any = crypto.randomBytes(32).toString('hex');
    const userSetToken:any = await User.findByIdAndUpdate(user._id,{passwordResetExpires:Date.now()+10*60*1000,passwordResetToken:forgotToken},{new:true});

    //() send email
    const transport = createTransport({
        host:"smtp.mailtrap.io",
        port:2525,
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        }
    })
    transport.sendMail({
        from: "smtp.mailtrap.io",
        to: userSetToken.email,
        subject: 'Unsplash-node',
        text: `http://${process.env.DOMAIN}:${process.env.SERVER_PORT}/user/resetpassword/${forgotToken}`
    },(err: any,info:any)=>console.log(err))


    res.status(200).json({
        status:'ok',
        message:"we send a link to your email to reset password"
    })
}

const resetPassword = async (req:Request,res:Response,next:Function)=>{
    try{
        const token = req.params.token;
        if(!token) return next(new AppError("we need token to reset your password",401));
        
        let user:any = await User.findOne({"passwordResetToken":token})
        if(!user) return next(new AppError("user not found",401));
    
        if(user.passwordResetExpires<Date.now()) return next(new AppError("your token expires please try again reset password in forgot page",401));
    
        const pass:any = crypto.randomBytes(4).toString('hex')+'R!';
        const cryptPass = await bcrypt.hash(pass,12);
        user = await User.findByIdAndUpdate(user._id,{password:cryptPass,passwordResetToken:undefined},{new:true});
    
        res.status(200).json({
            message:"your password reset with this password",
            password:pass,
        })
    }catch(err){
        next(new AppError(err,401));
    }
}
export {signUp,login,protect,license,forgotPassword,resetPassword};