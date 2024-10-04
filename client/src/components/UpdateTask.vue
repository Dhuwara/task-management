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
        <h5 class="mb-0">Update Details</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="taskTitle" class="form-label">Title</label>
                <input v-model="formData.title" type="text" class="form-control" id="taskTitle" placeholder="Task Title" />
              </div>
              <div class="mb-3">
                <label for="taskDescription" class="form-label">Description</label>
                <textarea v-model="formData.description" class="form-control" id="taskDescription" placeholder="Task Description"></textarea>
              </div>
              <div class="mb-3">
                <label for="taskDueDate" class="form-label">Due Date</label>
                <input v-model="formData.dueDate" type="date" class="form-control" id="taskDueDate" />
              </div>
              <div class="mb-3">
                <label for="taskStatus" class="form-label">Status</label>
                <select v-model="formData.status" class="form-select" id="taskStatus">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">Update Task</button>
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
  

  
  <script>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { useRoute,useRouter } from "vue-router";
  
  export default {
    setup() {
      const formData = ref({
        title: "",
        description: "",
        dueDate: "",
        status: "",
      });
  
      const originalTask = ref({});
      const route = useRoute();
      const router = useRouter();
  
      // Fetch the task data to populate the form
      const fetchTask = async (taskId) => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/task/tasks/${taskId}`
          );
          originalTask.value = response.data;
          console.log(originalTask.value)
  
          formData.value = {
            title: response.data.title,
            description: response.data.description,
           dueDate: response.data.dueDate ? response.data.dueDate.split('T')[0] : '',
            status: response.data.status,
          };
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
      };
      console.log(formData.value, "formdata")
      const closeModal  = ()=>{
        router.push('/')
      }
      // Handle form submission
      const handleSubmit = async () => {
        const updatedFields = {};
  
        console.log(updatedFields)
        // Check if fields are changed before updating
        if (formData.value.title !== originalTask.value.title) {
          updatedFields.title = formData.value.title;
        }
        if (formData.value.description !== originalTask.value.description) {
          updatedFields.description = formData.value.description;
        }
        if (formData.value.dueDate !== (originalTask.value.dueDate ? originalTask.value.dueDate.split('T')[0] : '')) {
    updatedFields.dueDate = formData.value.dueDate;
}

        if (formData.value.status !== originalTask.value.status) {
          updatedFields.status = formData.value.status;
        }
  
        // No changes were made
        if (Object.keys(updatedFields).length === 0) {
          alert("No changes detected.");
          return;
        }
  
        try {
          const taskId = originalTask.value._id;
          const response = await axios.put(
          `http://localhost:5000/api/task/updatetask/${taskId}`,
          updatedFields
        );
       // Reset the form data after successful submission
    formData.value = {
      title: "",
      description: "",
      dueDate: "",
      status: "",
    };

  
      router.push('/')
   
       
          console.log("Task updated successfully:", response.data);
        } catch (error) {
          console.error("Error updating task:", error);
        }
      };
  
  
      onMounted(() => {
        const taskId = route.params.id; // Get task ID from route params
        console.log(taskId)
        fetchTask(taskId);
      });
  
      return {
        formData,
        handleSubmit,
        closeModal
      };
    },
  };
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
  