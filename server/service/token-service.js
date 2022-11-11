const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

exports.generateTokens = (payload)=>{
    const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:'30m'})
    const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'30d'})
    return{
        accessToken,
        refreshToken
    }
}


exports.validateAccessToken = (token) =>{
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    }catch (err){
        return null;
    }
}

exports.validateRefreshToken = (token) =>{
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    }catch (err){
        return null;
    }
}

exports.saveToken = async (userId, refreshToken) => {
    const tokenData = await tokenModel.findOne({user: userId})
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save()
    }
    return await tokenModel.create({user: userId, refreshToken})
}

exports.removeToken = async (refreshToken) => {
    return tokenModel.deleteOne({refreshToken});
}

exports.findToken = async (refreshToken) => {
    return tokenModel.findOne({refreshToken});
}