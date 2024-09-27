const user = require('../modals/user.js')
const Task = require('../modals/task.model.js')

exports.getAllUser = async (req, res) => {
    try {
        const users = await user.find({})
        res.send(users)

    } catch (error) {
        res.status(500).send(error)
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
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users and tasks', error });
    }
};

exports.getUserById = async(req,res)=>{
    try{
        const {id} = req.params;
    const userdetails = await user.findById(id)
    res.send(userdetails)
    }catch(error){
        res.status(500).send(error)
    }

}

exports.getUsersWithTaskCount = async (req, res) => {
    try {
        const users = await user.aggregate([
            {
                $project: {
                    name: 1,
                    numberOfTasks: { $size: "$task_ids" }
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
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

