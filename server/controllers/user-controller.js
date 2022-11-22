const userService = require('../service/user-service');
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/api-error");

exports.registration= async (req,res,next)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return next(ApiError.BadRequest('Validation Error',errors.array()))
        }
        const{email,password,username}=req.body
        const userData = await userService.registration(email,password,username)
        res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        return res.json(userData)
    }
    catch (err) {
        next(err)
    }
}

exports.activate = async (req,res,next) =>{
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.redirect(process.env.CLIENT_URL)
    }
    catch (err){
        next(err)
    }
}


exports.login = async (req,res,next) => {
    try {
        const {email,password} = req.body;
        const userData = await userService.login(email, password);
        res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        return res.json(userData)
    }
    catch (err) {
        next(err)
    }
}

exports.logout = async (req,res,next) =>{
    try {
        const {refreshToken} = req.cookies
        const token = await userService.logout(refreshToken)
        res.clearCookie('refreshToken')
        return res.json(token)
    }catch (err){
        next(err)
    }
}

exports.refresh = async (req,res,next) =>{
    try {
        const {refreshToken} = req.cookies
        const userData = await userService.refresh(refreshToken)
        res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        return res.json(userData)
    }catch (err){
        next(err)
    }
}
