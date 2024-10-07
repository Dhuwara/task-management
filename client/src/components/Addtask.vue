<template>
    <div class="modal fade show" tabindex="-1" style="display: block;" aria-modal="true" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal 1</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal" ></button>
          </div>
          <div class="modal-body">
            <div class="row">
  <div class=" mb-4">
    <div class="card mb-4">
      <div class="card-header py-3">
        <h5 class="mb-0">Add Task</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitTask">
              <div class="mb-3">
                

                    <label for="taskAssignee" class="form-label">User</label>

    <select v-model="formData.user" class="form-select" id="taskAssignee">
  <option v-for="assignee in assignees" :key="assignee.id" :value="assignee._id">
    {{ assignee.name }}
  </option>
</select>
              </div>
              <div class="mb-3">
                <label for="taskTitle" class="form-label">title</label>
                <textarea v-model="formData.title" class="form-control" id="taskTitle" placeholder="Task Title "></textarea>
              </div>
              <div class="mb-3">
                <label for="taskDescription" class="form-label">description</label>
                <input v-model="formData.description" type="text" class="form-control" id="taskDescription" />
              </div>
              <div class="mb-3">
                <label for="taskDueDate" class="form-label">Due date</label>
                <input v-model="formData.dueDate" type="date" class="form-control" id="taskDueDate" />
              </div>
              <div class="mb-3">
                <label for="taskStatus" class="form-label" >Status</label>
                <select v-model="formData.status" class="form-select" id="taskStatus" disabled>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">Add Task</button>
            </form>
</div>

    </div>
  </div>
  </div>
          </div>
         
        </div>
      </div>
    </div>


    
  </template>
  

  
  <script setup>
  import { onMounted, ref } from 'vue';
  import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  // Define reactive form data using ref
  const formData = ref({
    user: '', // This will store the assignee's ID
    title: '',
    description: '',
    dueDate: '',
    status: 'pending' // Default status is pending
  });
  
  // Reactive list of assignees
  const assignees = ref([]);
  const router = useRouter()
  // Fetch user details (assignees) from an API or define them statically
  const userdetails = async () => {
    try {
      // Simulate an API call (replace with your actual API request)
      const response = await axios.get('http://localhost:5000/api/users/userdetails'); // Change to your real endpoint
      assignees.value = response.data; // Assuming the API returns an array of assignees
      console.log(assignees.value,"values")
    } catch (error) {
      console.error('Error fetching assignees:', error);
    }
  };
  
 
  formData.user
// Handle form submission
const submitTask = async () => {
  console.log('Form Data:', formData.value);

  try {
    // Send the POST request to your API
    const response = await axios.post('http://localhost:5000/api/task/addtask', formData.value); // Replace with your actual API endpoint

    // Log the response from the server
    console.log('Task successfully submitted:', response.data);

    
    // Reset form data after submission
    formData.value = {
      assignee: '', // Resetting to default
      title: '',
      description: '',
      dueDate: '',
      status: 'pending'
    };
    router.push('/')

  } catch (error) {
    // Handle error during the request
    console.error('Error submitting task:', error);

  }
};


const closeModal = ()=>{
    router.push('/')
}
  // Fetch assignee details when the component is mounted
  onMounted(() => {
    userdetails();
  });
  </script>
  
  <style scoped>
  .modal {
    background-color: rgba(0, 0, 0, 0.5);
  }
  @media (min-width: 576px) {
  .modal-dialog {
    max-width: none; /* Disable the max-width */
    margin-right: 20px;
    margin-left: 20px;
  }
}

  </style>
  