<template>
  <div class="container-fluid" style="background-color: #f9fafc">
   
    <div class="container-fluid ">
      
      <div
        class="row"
        style="box-shadow: 0 0 30px 8px #96beee40; padding: 10px"
      >
        <div
          class="col-lg-6 col-md-12 col-sm-12  d-flex justify-content-center align-items-center flex-column"
          style="height: 80vh;"
          >
          <div class="w-100 ">
          </div>
          <div class="overflow-y-scroll w-100 table-container mt-3">
            <table class="table">
              <thead>
                <tr
                  style="
                    border-bottom: 1px solid lightgray;
                    background-color: #f6f7f8;
                  "
                >
                  <th style="background-color: #fafafa" scope="col">Tasks</th>
                  <th style="background-color: #fafafa" scope="col">
                    Assignee
                  </th>
                  <th style="background-color: #fafafa" scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tableData" :key="task._id">
                  <td
                    class="hover-effect"
                    style="
                      border-bottom: 1px solid lightgray;
                      height: 42px;
                      font-size: medium;
                      cursor: pointer;
                    "
                    @click="opeTaskDetail(task._id, task.user)"
                  >
                    {{ task.title }}
                  </td>

                  <td
                  class="hover-effect"
                    @click="openUserDetail(task.user)"
                    style="font-size: medium; cursor: pointer"
                  >
                    {{ task.userName }}
                  </td>
                  <td style="border-bottom: 1px solid lightgray">
                    <div :class="statusClass(task.status)" class="status-btn">
                      {{ task.status }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="col-lg-6 col-md-12 col-sm-12 mt-3 d-flex flex-column justify-content-center align-items-center"
          style="
    height: 80vh;
"
          >
          <div style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px">
            <BarChart v-if="barChartData" :chartData="barChartData" class="barchart" />
          </div>
          <div>
            <PieChart v-if="pieChartData" :chartData="pieChartData" class="piechart"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from "./BarChart.vue";
import PieChart from "./PieChart.vue";
import axios from "axios";


export default {
  name: "dashboard",
  components: { BarChart, PieChart },

  data() {
    return {
      tableData: [],
      barChartData: null, // Bar chart data
      pieChartData: null, // Pie chart data
    };
  },

  created() {
    this.fetchUserWithTask();
    this.fetchPieChartData(); // Fetch pie chart data
    this.fetchBarChartData(); // Fetch bar chart data
    this.fetchUserDetails();
  },

  methods: {
    async fetchUserWithTask() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/task/assigned"
        );
        this.tableData = response.data;
        console.log(this.tableData)
      } catch (error) {
        console.log("Error while fetching the table data:", error);
      }
    },
    statusClass(status) {
      if (status === "in-progress") {
        return "status-in-progress";
      } else if (status === "pending") {
        return "status-pending";
      } else if (status === "completed") {
        return "status-completed";
      } else {
        return "";
      }
    },

    async fetchPieChartData() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/task/countofstatus"
        );
        const pieData = response.data;

        // Extract labels and data dynamically from the response
        const labels = Object.keys(pieData); // e.g., ['in-progress', 'pending', 'completed']
        const data = Object.values(pieData); // e.g., [3, 14, 3]

        // Update pie chart data
        this.pieChartData = {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"], // Customize colors
            },
          ],
        };
      } catch (error) {
        console.log("Error while fetching pie chart data:", error);
      }
    },

    async fetchBarChartData() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/user/d/getusercount"
        );
        const barData = response.data;
        console.log(barData);

        // Extract labels and data dynamically from the response
        const labels = Object.keys(barData); 
        const data = Object.values(barData); 
        console.log(labels);
        console.log(data);
        // Prepare the chartData for BarChart
        this.barChartData = {
          labels: labels,
          datasets: [
            {
              label: "User Count",
              data: data,
              backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"], // Customize colors
            },
          ],
        };
      } catch (error) {
        console.log("Error while fetching bar chart data:", error);
      }
    },
    openUserDetail(userId) {
      this.$router.push(`/userdetail/${userId}`);
    },
    opeTaskDetail(taskid, userid) {
      this.$router.push(`/userdetail/${userid}/taskdetail/${taskid}`);
    },

    async fetchUserDetails() {
      const userId = this.$route.params.id;
      console.log(userId);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        this.user = response.data;
        console.log(this.user);
      } catch (error) {
        console.error("Error fetching the user details:", error);
      }
    },
  },
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
