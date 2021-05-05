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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var env = __importStar(require("dotenv"));
var mongoose_1 = __importDefault(require("mongoose"));
env.config({ path: __dirname + "/config.env" });
process.env = JSON.parse(JSON.stringify(process.env));
var morgan_1 = __importDefault(require("morgan"));
var app = require('./app');
// DATABASE CONNECTION
mongoose_1.default.connect("mongodb://" + process.env.DB_IP + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(function () {
    console.log("Databse connected successfully ! ");
    // SET MORGAN LIB
    if (process.env.DEV_MODE == 'DEVELOPMENT')
        app.use(morgan_1.default('dev'));
    // RUN SERVER LISTENER
    var port = process.env.SERVER_PORT || 5000;
    app.listen(port, function () {
        console.log("server is running on port " + port);
    });
}).catch(function (err) {
    console.log(err);
});
