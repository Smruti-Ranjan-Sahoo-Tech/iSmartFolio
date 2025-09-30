const express = require('express')
const router=express.Router()
const authController=require('./authController')
const {loginController,registerController,logoutController}=authController
const {isLoginChecker} = require('../middlewere/authMiddleware')
//Register route
router.post('/register',registerController)
//Login Rouute
router.post('/login',loginController)
//Logout Rouute
router.post('/logout',logoutController)
//Login status
router.get('/status',isLoginChecker)

module.exports=router