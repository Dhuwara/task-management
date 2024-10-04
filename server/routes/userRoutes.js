const express = require('express')
const userController = require('../controllers/userControllers.js')
const router = express.Router()

router.get('/', userController.getAllUser);
router.get('/task', userController.getAllUsersWithTasks)
router.get('/user/:id',userController.getUserById)
router.get('/user/d/getusercount',userController.getUsersWithTaskCount)
router.get('/userdetails', userController.getAllUserDetails)


module.exports = router