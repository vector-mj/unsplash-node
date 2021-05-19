import express,{Request,Response,Application} from 'express';
import "./utils/AppError";
import { AppError } from './utils/AppError';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
const xss = require('xss-clean');
import sanitizer from 'express-mongo-sanitize';
import hpp from 'hpp';
const userRoute = require('./Routes/userRoute');
// Middlewares
const app:Application = express();
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs')
app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"Too many request from this ip, please try again an hour!"
});
app.use('/user',limiter);
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(sanitizer());
//Routes
///////////////////////////////////////////////
app.get('/login',(req:Request,res:Response)=>{
    console.log(`${req.ip} connected to server`);
    res.render(`${__dirname}/Views/login.ejs`,{data:{number:req.params.number}});
});

app.get('/register',(req:Request,res:Response)=>{
    console.log(`${req.ip} connected to server`);
    res.render(`${__dirname}/Views/register.ejs`,{data:{number:req.params.number}});
});

app.get('/',(req:Request,res:Response)=>{
    console.log(`${req.ip} connected to server`);
    res.render(`${__dirname}/Views/index.ejs`,{data:{number:req.params.number}});
});
///////////////////////////////////////////////
app.use('/user',userRoute);
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

module.exports = app;

  