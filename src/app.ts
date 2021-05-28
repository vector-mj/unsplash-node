import express,{Request,Response,Application} from 'express';
import "./utils/AppError";
import { AppError } from './utils/AppError'; 
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
const xss = require('xss-clean');
import sanitizer from 'express-mongo-sanitize';
import hpp from 'hpp'; 
const userRoute = require('./Routes/userRoute'); 
const dashboardRoute = require('./Routes/dashboardRoute'); 
const viewPage = require('./Routes/viewRoute'); 
import cookieParser from 'cookie-parser'; 
import path from 'path';

const limiter = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"Too many request from this ip, please try again an hour!" 
});

// Middlewares    
const app:Application = express();
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs')
app.set('views',[__dirname + '/Views/', __dirname + '/Views/userPages/']);
app.use(express.static(`${__dirname}/public`));
app.use('/user',limiter);
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(sanitizer());
app.use(cookieParser());
app.use(function(req, res, next) {
    res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com" ); 
    next(); 
})

//Routes
///////////////////////////////////////////////
app.use('/',viewPage)
app.use('/user',userRoute);
app.use('/dashboard',dashboardRoute);
app.all('*',(req:Request,res:Response,next:Function)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});
app.use((err:any,req:Request,res:Response,next:Function):any =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
});
///////////////////////////////////////////////

module.exports = app;

  