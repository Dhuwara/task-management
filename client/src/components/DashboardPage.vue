<template>
  <div class="container-fluid" style="background-color: #f9fafc">
    <div class="container-fluid">
      <div class="row" style="box-shadow: 0 0 30px 8px #96beee40; padding: 10px">
        <div class="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-center align-items-center flex-column" style="height: 80vh;">
          <div class="w-100 d-flex justify-content-between align-items-center">
            <h1>Tasks</h1>
            <router-link :to="`/addtask`">
              <button type="button" style="border: none; background-color: transparent;">
                <font-awesome-icon icon="plus" style="color: blue; cursor: pointer;" />
              </button>
            </router-link>
          </div>
          <div class="overflow-y-scroll w-100 table-container mt-3">
            <table class="table">
              <thead>
                <tr style="border-bottom: 1px solid lightgray; background-color: #f6f7f8;">
                  <th style="background-color: #fafafa" scope="col">Tasks</th>
                  <th style="background-color: #fafafa" scope="col">Assignee</th>
                  <th style="background-color: #fafafa" scope="col">Status</th>
                  <th style="background-color: #fafafa" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tableData" :key="task._id">
                  <td class="hover-effect" style="border-bottom: 1px solid lightgray; height: 42px; font-size: medium; cursor: pointer;" @click="openTaskDetail(task._id, task.user)">
                    {{ task.title }}
                  </td>
                  <td class="hover-effect" @click="openUserDetail(task.user)" style="font-size: medium; cursor: pointer">
                    {{ task.userName }}
                  </td>
                  <td style="border-bottom: 1px solid lightgray">
                    <div :class="statusClass(task.status)" class="status-btn">
                      {{ task.status }}
                    </div>
                  </td>
                  <td>
                    <div>
                      <font-awesome-icon icon="times" class="delete-icon" @click="deleteTask(task._id)" />
                      <router-link :to="`/updatetask/${task._id}`">
                        <button type="button" class="btn">
                          <font-awesome-icon icon="pen-to-square" class="edit-icon" />
                        </button>
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-lg-6 col-md-12 col-sm-12 mt-3 d-flex flex-column justify-content-center align-items-center" style="height: 80vh;">
          <div style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px">
            <BarChart
              v-if="barChartData"
              :chartData="barChartData"
              class="barchart"
            />
          </div>
          <div>
            <PieChart
              v-if="pieChartData"
              :chartData="pieChartData"
              class="piechart"
            />
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import BarChart from "./BarChart.vue";
import PieChart from "./PieChart.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const tableData = ref([]);
const barChartData = ref(null);
const pieChartData = ref(null);
const userData = ref({});

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  await fetchUserWithTask();
  await fetchPieChartData();
  await fetchBarChartData();
  await userdetails();
});

// Modal visibility
const isModalVisible = ref(false);
const showModal = () => { isModalVisible.value = true; };
const hideModal = () => { isModalVisible.value = false; };

const fetchUserWithTask = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/task/assigned");
    tableData.value = response.data;
    console.log(tableData.value);
  } catch (error) {
    console.error("Error while fetching the table data:", error);
  }
};

const statusClass = (status) => {
  if (status === "in-progress") {
    return "status-in-progress";
  } else if (status === "pending") {
    return "status-pending";
  } else if (status === "completed") {
    return "status-completed";
  } else {
    return "";
  }
};

const fetchPieChartData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/task/countofstatus");
    const pieData = response.data;
    const labels = Object.keys(pieData);
    const data = Object.values(pieData);
    pieChartData.value = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"],
        },
      ],
    };
  } catch (error) {
    console.error("Error while fetching pie chart data:", error);
  }
};

const fetchBarChartData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/users/user/d/getusercount");
    const barData = response.data;
    const labels = Object.keys(barData);
    const data = Object.values(barData);
    console.log(labels);
    console.log(data);
    barChartData.value = {
      labels: labels,
      datasets: [
        {
          label: "User Count",
          data: data,
          backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"],
        },
      ],
    };
  } catch (error) {
    console.error("Error while fetching bar chart data:", error);
  }
};

const openUserDetail = (userId) => {
  router.push(`/userdetail/${userId}`);
};

const openTaskDetail = (taskId, userId) => {
  router.push(`/userdetail/${userId}/taskdetail/${taskId}`);
};

const userdetails = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/users/userdetails");
    userData.value = response.data;
    console.log(userData.value);
  } catch (error) {
    console.error("Error while fetching user details:", error);
  }
};

const deleteTask = async (taskId) => {
  console.log(taskId);
  try {
    const response = await axios.delete(`http://localhost:5000/api/task/deletetask/${taskId}`);
    console.log('Task deleted:', response.data);
    tableData.value = tableData.value.filter(task => task._id !== taskId);
    console.log("Task successfully deleted");
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
</script>

<style>
.table-container {
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.table-container::-webkit-scrollbar {
  display: none;
}

.table-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.status-btn {
  border-radius: 20px;
  background-color: #ff5a5a;
  width: 100px;
  height: 42px;
  padding: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.mt-5 {
  margin-top: 5rem !important;
}

.status-btn {
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  text-align: center;
  font-weight: 500;
}

.status-in-progress {
  background-color: #fde3cf;
  border-radius: 20px;
  border: 0.5px solid orange;
  color: #f56a00;
}

.status-pending {
  background-color: #fef0ef;
  border-radius: 20px;
  border: 0.5px solid #ff5a5a;
  color: #ff5a5a;
}

.status-completed {
  background-color: #f6ffed;
  border-radius: 20px;
  border: 0.5px solid #b7eb8f;
  color: green;
}

.hover-effect:hover {
  background-color: lightgray;
}
</style>
