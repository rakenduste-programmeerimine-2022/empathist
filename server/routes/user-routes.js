const express = require('express')
const router = express.Router()
const userController = require("../controllers/user-controller")
const {body} = require("express-validator");

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:6}),
    userController.registration)

router.post('/login',userController.login)
router.post('/logout',userController.logout)

router.get('/activate/:link',userController.activate)
router.get('/refresh',userController.refresh)