import * as env from 'dotenv';
import mongoose from 'mongoose';
env.config({ path: `${__dirname}/config.env` });
process.env = JSON.parse(JSON.stringify(process.env));
import morgan from 'morgan';
const app = require('./app');

// ---------------------------------------------------------------
// DATABASE CONNECTION

let DB:any = process.env.DB_ATLAS;
DB = DB.replace('<PASSWORD>',process.env.DB_PASSWORD);
DB = DB.replace('<NAME>',process.env.DB_NAME); 

// OR

// let DB:any = process.env.DB_LOCAL;
// DB = DB.replace('<NAME>',process.env.DB_NAME);

// ---------------------------------------------------------------
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex: true
}).then(()=>{
    console.log(`Database connected successfully !`);

    // SET MORGAN LIB
    if (process.env.DEV_MODE == 'DEVELOPMENT') app.use(morgan('dev'));
    
    // RUN SERVER LISTENER
    const port = process.env.SERVER_PORT || 6000;
    app.listen(port, () => {
        console.log(`server is running on port ${port}  !`)
    });
}).catch(err=>{ 
    console.log(err);
}); 