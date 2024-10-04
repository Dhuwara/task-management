const user = require('../modals/user.js')
const Task = require('../modals/task.model.js')

exports.getAllUser = async (req, res) => {
    console.log(req.body,"finduseres")
    try {
        const users = await user.find({})
        res.send(users)

    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
}

exports.getAllUsersWithTasks = async (req, res) => {
    try {
        const users = await user.aggregate([
            {
                $lookup: {
                    from: 'tasks', // Name of the tasks collection
                    localField: 'task_ids', // Field in the users collection
                    foreignField: '_id', // Field in the tasks collection
                    as: 'tasks' // Output array field
                }
            }
        ]);
        res.json(users);
        console.log(users,"veliya vaada ")
    } catch (error) {
        res.status(500).json({ message: 'Database error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userDetails = await user.findById(id);
        
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

exports.getUsersWithTaskCount = async (req, res) => {
    try {
        const users = await user.aggregate([
            {
                $project: {
                    name: 1,
                    numberOfTasks: { $size: "$task_ids" },
                }
            },
            {
                $group: {
                    _id: null,
                    users: { $push: { name: "$name", count: "$numberOfTasks" } }
                }
            }
        ]);

        // Transforming the output into the desired format
        const result = {};
        if (users.length > 0) {
            users[0].users.forEach(user => {
                result[user.name] = user.count;
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Database error' });
    }
};


exports.getAllUserDetails = async (req, res) => {
    try {
        const users = await user.find({},{_id:1,name:1})
        res.send(users)

    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
}

