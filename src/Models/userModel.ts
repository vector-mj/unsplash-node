const bcrypt = require('bcryptjs');
import * as mongoose from 'mongoose';
const validator = require('validator');

// min max min&maxLength trim enum type unique required dafault select validate+validator 
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: [true, 'Please tell us your name!']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Please tell us your lastname!']
    },
    email: {
        type: String,
        trim: true,
        unique: [true, 'email exists'],
        required: [true, 'Please provide your email'],
        // Example for validation
        // validate:function(e:string){
        //     return e+"asdf";
        // }
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    age: {
        type: Number,
        require: [true, "please Enter your birthday"],
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfrim: {
        type: String,
        // select:false,
        required: [true, 'please provide a password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (this: any, el: any) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    accountCreatedAt: {
        type: Date,
        default: Date()
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        defalut: true,
        select: false
    }
}
    // blow code ues virtual 'id' and this will be showen in the result
    // ,{
    //     toJSON:{virtuals:true},
    //     toObject:{virtuals:true},
    // }
);
userSchema.methods.cmp = async function (userPassword, reqPassword) {
    return await bcrypt.compare(reqPassword, userPassword);
}
// userSchema.virtual('halfAge').get(function(this:any){
//     return this.age/2;
// })
// use Document middelware 
// .pre .post .get 
// use Query middelware 
// .pre .post .get on 'find' 'findOne' or /^find/
// use aggregation middelware
userSchema.pre('save', async function (this: any, next) {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfrim = undefined;
        next();
    }
});
userSchema.pre(/^find/,function(this:any,next:Function){
    this.find({active:{$ne:false}});
    next();
})
const User = mongoose.model('User', userSchema);
export { User };