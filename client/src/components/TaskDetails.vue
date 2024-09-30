<template>
  <div class="task-details" v-if="task">
    <div class="task-con">
      <div class="d-flex justify-content-between">
        <span class="fw-semibold mb-5" style="font-size: xx-large;">{{ task.title }}</span>
        <font-awesome-icon icon="times" @click="closeTaskDetails" style="cursor: pointer;" />
      </div>

      <div class="d-flex align-items-baseline">
        <p style="width: 15%; color: #b2b4c0">Status</p>
        <div :class="statusClass" class="status-container">{{ task.status }}</div>
      </div>

      <div class="d-flex align-items-baseline">
        <p style="width: 15%; color: #b2b4c0">Assigned To</p>
        <span class="w-50">{{ user.name }}</span>
      </div>

      <div class="d-flex align-items-baseline">
        <p style="width: 15%; color: #b2b4c0">Due Date</p>
        <span class="w-50">{{ formattedDueDate }}</span>
      </div>

      <!-- Tabs for Comments and Description -->
      <ul class="nav nav-tabs mt-3" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description-tab-pane" type="button" role="tab" aria-controls="description-tab-pane" aria-selected="false">Description</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="comments-tab" data-bs-toggle="tab" data-bs-target="#comments-tab-pane" type="button" role="tab" aria-controls="comments-tab-pane" aria-selected="true">Comments</button>
        </li>
      </ul>

      <!-- Tab content -->
      <div class="tab-content" id="myTabContent">
        <!-- Description tab -->
        <div class="tab-pane fade show active" id="description-tab-pane" role="tabpanel" aria-labelledby="description-tab" tabindex="0" style="padding-top: 20px;">
          <p style="font-size: larger;">{{ task.description }}</p>
        </div>
        <!-- Comments tab -->
        <div class="tab-pane fade" id="comments-tab-pane" role="tabpanel" aria-labelledby="comments-tab" tabindex="0" style="padding-top: 20px;">
          <div class="textarea-container">
            <textarea name="" id="" class="text-in" placeholder="Add a comment"></textarea>
            <button class="textarea-button btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";


    const route = useRoute();
    const router = useRouter();

    const task = ref(null);
    const user = ref(null);
    const taskId = route.params.taskid;
    const userId = route.params.id;

    // Fetch Task Details
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/task/tasks/${taskId}`);
        task.value = response.data;
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    // Fetch User Details
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/user/${userId}`);
        user.value = response.data;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Close Task Details
    const closeTaskDetails = () => {
      router.push(`/userdetail/${userId}`);
    };

    // Format due date as 'date month year'
    const formattedDueDate = computed(() => {
      if (task.value && task.value.dueDate) {
        const date = new Date(task.value.dueDate);
        return date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      return "";
    });

    // Compute the status class based on the task status
    const statusClass = computed(() => {
      if (task.value) {
        if (task.value.status === "in-progress") {
          return "status-in-progress"; // Red container for in-progress
        } else if (task.value.status === "completed") {
          return "status-completed"; // Green container for completed
        } else if (task.value.status === "pending") {
          return "status-pending"; // Orange container for pending
        }
      }
      return "";
    });

    onMounted(() => {
      fetchTaskDetails();
      fetchUserDetails();
    });

    
</script>

<style scoped>
.task-details {
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
  bottom: 0;
}

.task-con {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
}

/* Styling for the colored status container */
.status-container {
  padding: 6px;
    border-radius: 17px;
   
    font-weight: bold;
    display: flex;
    /* text-align: center; */
    justify-content: center;
    align-items: center;
}

/* Specific colors for each status */
.status-in-progress {
  background-color:#ffa5005c; /* Orange background for pending */
  color: orange;
}

.status-completed {
  background-color: #E5FAF0; /* Green background for completed */
  color: #25c579;
}

.status-pending {
  

  background-color:#ff000033; /* Red background for in-progress */
  color: red;
}

.text-in {
  width: 56%;
  height: 100px;
  border: 0.5px solid lightgrey;
  border-radius: 20px;
  background-color: #f7f7f8;
}

.textarea-container {
  position: relative;
  display: inline-block;
  width: 100%;
  padding: 10px;
}

.text-in {
  width: 100%;
  height: 100px;
  padding: 22px;
}

.textarea-button {
  position: absolute;
  bottom: 24px;
  right: 21px;
  padding: 5px 10px;
  cursor: pointer;
}


.nav-tabs .nav-link {
  border: none;
  background-color: transparent !important;
  
  transition: border-bottom 0.3s ease; 
}


.nav-tabs .nav-link.active {
  
  border-bottom: 3px solid lightgray; 
}

.nav-tabs .nav-link:hover {

 border-bottom: 3px solid black;
}

</style>
