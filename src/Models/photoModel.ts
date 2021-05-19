import * as mongoose from 'mongoose';
import { time } from 'node:console';
const photoSchema = new mongoose.Schema({
    user:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        require:[true,"username is require to save a photo"]
    },
    time:{
        type:Date,
        default:Date.now()
    },
    path:{
        type:String,
        require:[true,"we need a path to save photo"]
    },
    private:{
        type:Boolean,
        default:false
    }
})