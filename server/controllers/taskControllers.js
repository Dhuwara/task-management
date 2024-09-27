const task = require('../modals/task.model.js')
const users = require('../modals/user.js')
exports.getAlltask = async (req, res) => {
    try {
        const tasks = await task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getTasksWithUserNames = async (req, res) => {
   
    try {
        const tasksWithUsers = await task.aggregate([
            {
                $lookup: {
                    from: 'users', // Ensure this matches the users collection name
                    localField: 'user', // Field in tasks that references user
                    foreignField: '_id', // Field in users that matches
                    as: 'userDetails' // The output array name
                }
            },
            {
                $unwind: {
                    path: '$userDetails', // Deconstruct the userDetails array
                    preserveNullAndEmptyArrays: true // Optional: keeps tasks with no user
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    user:1,
                    status:1,
                    
                    
                    'userName': { $concat: ['$userDetails.name'] } // Concatenate user name
                }
            }
        ]);

        res.json(tasksWithUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks with user names', error });
    }
};

exports.countOfStatus = async (req,res)=>{
    
    try {
        const tasks = await task.find({});
        
        const statusCounts = {
            'in-progress': 0,
            'pending': 0,
            'completed': 0,
        };

        tasks.forEach(taski => {
            if (statusCounts[taski.status] !== undefined) {
                statusCounts[taski.status]++;
            }
        });

        res.json(statusCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while counting statuses.' });
    }
}

exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const taskItem = await task.findById(id);
        if (!taskItem) {
            return res.status(404).send({ message: 'Task not found' });
        }
        res.send(taskItem);
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.getUserNameByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params; // Extract taskId from request parameters
        const result = await task.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(taskId) } // Match the task ID
            },
            {
                $lookup: {
                    from: 'users', // User collection name
                    localField: 'user', // Field in tasks collection
                    foreignField: '_id', // Field in users collection
                    as: 'userInfo'
                }
            },
            {
                $unwind: {
                    path: '$userInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    userName: '$userInfo.name' // Select the user's name
                }
            }
        ]);

        if (result.length > 0) {
            res.json(result[0]); // Return the user's name
        } else {
            res.status(404).json({ message: 'Task or user not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user name by task ID', error });
    }
};