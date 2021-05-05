"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var bcrypt = require('bcryptjs');
var mongoose = __importStar(require("mongoose"));
var validator = require('validator');
var userSchema = new mongoose.Schema({
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
        required: [true, 'Please provide your email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
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
        required: [true, 'please provide a password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
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
});
// userSchema.pre('save',async function(this:any,next){
//     if(this.password){
//         this.password = await bcrypt.hash(this.password,12);
//         this.passwordConfrim = undefined;
//         next();
//     }
// });
var User = mongoose.model('User', userSchema);
exports.User = User;
