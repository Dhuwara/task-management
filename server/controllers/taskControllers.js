const task = require('../modals/task.model.js')
const user = require('../modals/user.js')
exports.getAlltask = async (req, res) => {
    try {
        const tasks = await task.find({});
        res.send(tasks);
    } catch (error) {
        // Send a structured error response
        res.status(500).send({ message: 'Database error', error: error.message });
    }
};

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
                    user: 1,
                    status: 1,
                    'userName': { $concat: ['$userDetails.name'] } // Concatenate user name
                }
            }
        ]);

        res.json(tasksWithUsers);
        console.log(tasksWithUsers,"taskwithofwef")
    } catch (error) {
        // Send the error message and type consistently
        res.status(500).json({ message: 'Error fetching tasks with user names', error: error.message });
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
       
        res.status(500).json({ error: 'An error occurred while counting statuses.' });
    }
}




exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const taskItem = await task.findById(id); // Use the correct model reference
        if (!taskItem) {
            return res.status(404).json({ message: 'Task not found' }); // Use json() for consistency
        }
        res.status(200).json(taskItem); // Send back the task item with a 200 status
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error }); // Improved error response
    }
};





exports.assignTask = async(req,res)=>{
    try{
        console.log(req.body)
        const newtask = await task.create(req.body)
        
        console.log('task assigned',newtask._id)
        await user.findByIdAndUpdate(req.body.user,{$addToSet:{task_ids:newtask._id}},{new:true})
        res.status(200).json(newtask)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

exports.deletetask =  async (req, res) => {
    const taskId = req.params.id;
    console.log(taskId)

    try {
        // Find the task by its ID
        const tasks = await task.findById(taskId);
        console.log(tasks,"tasksdelete")

        if (!tasks) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Get the user ID from the task
        const userId = tasks.user;

        // Delete the task from the tasks collection
        await task.findByIdAndDelete(taskId);

        // Remove the task ID from the user's task_ids array
        await user.findByIdAndUpdate(
            userId,
            { $pull: { task_ids: taskId } },
            { new: true }
        );

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
       
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// PUT API to partially update a task by its ID

exports.updateTask =  async (req, res) => {
    const taskId = req.params.id;
    const updateFields = req.body; // This will contain only the fields that need to be updated
  
    try {
      // Find the task by ID and update only the fields that are provided
      const updatedTask = await task.findByIdAndUpdate(
        taskId,
        { $set: updateFields }, // Only update the provided fields
        { new: true } // Return the updated document
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Send the updated task back as the response
      res.status(200).json(updatedTask);
    } catch (error) {
      
      res.status(500).json({ message: 'Server error' });
    }
}
  