import {body, validationResult} from 'express-validator';
import { Request, Response } from 'express';


const createUserValidator = () =>{
    return [
        body('email').isEmail(),
        body('name').isString().isLength({min:4,max:12}),
        body('lastName').isString().isLength({min:4,max:12}),
        body('password').isString().isLength({min:4}),
        body('password').isStrongPassword({
            minLength:8,
            minLowercase:1,
            minNumbers:1,
            minSymbols:1,
            minUppercase:1
        })
        .withMessage('password is not Strong')
        .custom((value,{req})=>{
            if(value!==req.body.passwordConfrim)throw new Error('password is not match #');
            return true;
        })
    ];
}

const validate = async (req:Request,res:Response,next:any)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }
    next();
}

export {createUserValidator,validate}