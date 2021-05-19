import {Response, Request, NextFunction} from 'express';
import { AppError } from './AppError';
const catchErr = (Fn:any) =>{
    Fn.catch();
}
export {catchErr};