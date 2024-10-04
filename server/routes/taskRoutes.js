const express = require('express')
const taskController = require('../controllers/taskControllers.js')
const router = express.Router()

router.get('/', taskController.getAlltask);
router.get('/assigned', taskController.getTasksWithUserNames)
router.get('/countofstatus',taskController.countOfStatus)
router.get('/tasks/:id',taskController.getTaskById)
router.post('/addtask', taskController.assignTask)
router.delete('/deletetask/:id', taskController.deletetask)
router.put('/updatetask/:id',taskController.updateTask)
module.exports = router