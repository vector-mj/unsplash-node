import * as env from 'dotenv';
import mongoose from 'mongoose';
env.config({ path: `${__dirname}/config.env` });
process.env = JSON.parse(JSON.stringify(process.env));
import morgan from 'morgan';
const app = require('./app');


// DATABASE CONNECTION
mongoose.connect(`mongodb://${process.env.DB_IP}:${process.env.DB_PORT}/${process.env.DB_NAME}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex: true
}).then(()=>{
    console.log(`Databse connected successfully ! `);

    // SET MORGAN LIB
    if (process.env.DEV_MODE == 'DEVELOPMENT') app.use(morgan('dev'));
    
    // RUN SERVER LISTENER
    const port = process.env.SERVER_PORT || 5000;
    app.listen(port, () => {
        console.log(`server is running on port ${port}`)
    });
}).catch(err=>{
    console.log(err);
})