const User = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid')
const mailService = require('./mail.service')
const tokenService = require('./token-service')
const UserDto = require('../dto/user-dto')
const ApiError = require('../exceptions/api-error')

exports.registration = async (email,password)=>{
    const candidate = await User.findOne({email})
    if(candidate){
        throw ApiError.BadRequest(`user email ${email}  is already registered`)
    }
    const hashPassword = await bcrypt.hash(password,3)
    const activationLink = uuid.v4(); //random key

    const user = await User.create({email,password:hashPassword,activationLink})
    await mailService.sendActivationMail(email,`${process.env.API_URL}/user/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id,tokens.refreshToken)

    return{...tokens,user:userDto}
}

exports.activate = async (activationLink) => {
    const user = await User.findOne({activationLink})
    if(!user){
        throw new Error('Incorrect activation link')
    }
    user.isActivated = true
    await user.save()
}

exports.login = async (email,password) =>{
    const user = await  User.findOne({email})
    if (!user) {
        throw ApiError.BadRequest('User not found')
    }
    const isPassEqual = await bcrypt.compare(password,user.password)
    if (!isPassEqual){
        throw ApiError.BadRequest('Password is not correct')
    }
    const userDto = new UserDto(user); //to throw away unused stuff -> id, email, isActivated are preserved
    const tokens = tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return{...tokens,user:userDto}
}

exports.logout = async (refreshToken) =>{
    return await tokenService.removeToken(refreshToken);
}
exports.refresh = async (refreshToken) =>{
    console.log(`so far so good ${refreshToken}`)
    if (!refreshToken){
        throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDB){
        throw ApiError.UnauthorizedError()
    }
    const user = await User.findById(userData.id)
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto})

    await tokenService.saveToken(userDto.id,tokens.refreshToken)

    return {...tokens,user:userDto}
}
