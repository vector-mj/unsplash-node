import * as crypto from 'crypto';
const bcrypt = require('bcryptjs');
import * as mongoose from 'mongoose';
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please tell us your name!']
    },
    lastName:{
        type:String,
        trim:true,
        required:[true,'Please tell us your lastname!']
    },
    email:{
        type:String,
        trim:true,
        unique:[true,'email exists'],
        required:[true,'Please provide your email']
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    age:{
        type:Number,
        require:[true,"please Enter your birthday"],
    },
    role:{
        type:String,
        enum: ['user','guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        // select:false
    },
    passwordConfrim:{
        type:String,
        // select:false,
        required:[true,'please provide a password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(this:any,el:any) {
              return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    accountCreatedAt:{
        type:Date,
        default:Date()
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        defalut:true,
        select:false
    }
});

userSchema.pre('save',async function(this:any,next){
    if(this.password){
        this.password = await bcrypt.hash(this.password,12);
        this.passwordConfrim = undefined;
        next();
    }
});
const User = mongoose.model('User',userSchema);
export {User};