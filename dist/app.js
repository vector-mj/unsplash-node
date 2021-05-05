"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userRoute = require('./Routes/userRoute');
// Middlewares
var app = express_1.default();
app.use(express_1.default.json());
app.set('view engine', 'ejs');
app.use(express_1.default.static(__dirname + "/public"));
//Routes
function AppError(msg, errCode, res) {
    res.status(errCode).end(msg);
}
// app.get('/login',(req:Request,res:Response)=>{
//     console.log(`${req.ip} connected to server`);
//     res.render(`${__dirname}/public/login.ejs`,{data:{number:req.params.number}});
// });
// app.get('/register',(req:Request,res:Response)=>{
//     console.log(`${req.ip} connected to server`);
//     res.render(`${__dirname}/public/register.ejs`,{data:{number:req.params.number}});
// });
// app.get('/',(req:Request,res:Response)=>{
//     console.log(`${req.ip} connected to server`);
//     res.render(`${__dirname}/public/index.ejs`,{data:{number:req.params.number}});
// });
app.use('/api/v1/user', userRoute);
// app.all('*',(req:Request,res:Response,next:Function)=>{
//     next(AppError(`Can't find ${req.originalUrl} on this server!`, 404,res))
// });
module.exports = app;
