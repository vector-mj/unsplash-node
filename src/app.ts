import express,{Request,Response,Application} from 'express';
const userRoute = require('./Routes/userRoute');
// Middlewares
const app:Application = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs')
app.use(express.static(`${__dirname}/public`));


//Routes

function AppError(msg:String,errCode:number,res:Response):any{
    res.status(errCode).end(msg);
}
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
app.use('/api/v1/user',userRoute);
app.all('*',(req:Request,res:Response,next:Function)=>{
    next(AppError(`Can't find ${req.originalUrl} on this server!`, 404,res))
});

module.exports = app;

