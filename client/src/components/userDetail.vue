<template>
  <div  v-if="user" class="main-con" style="height: 90vh;">
    <div class="d-flex align-items-start" style="padding: 5px;">
      <div class="nav flex-column nav-pills me-3 side-con" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <button class="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">User Profile</button>
        <button class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Tasks</button>
      </div>
      <div class="tab-content w-100" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
          <div class="tab-pane fade show active tab-con" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
            <div class="d-flex justify-content-between">
              <div class="d-flex">
                <div class="profile-pic">
                  <span style="margin-left:0px">{{ getFirstLetter(user.name) }}</span>
                </div>
                <div class="profile-details ms-3">
                  <p style="font-size: medium;">{{ user.name }}</p>
                  <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ user.Designation }}</p>
                  <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ user.address }}</p>
                </div>
              </div>
              <div class="Edit-btn">
                <button class="btn"><font-awesome-icon :icon="['fas', 'pen-to-square']" style="color: #b3b9cb;" /></button>
              </div>
            </div>
          </div>
          <div class="tab-con" style="padding: 20px;">
            <div class="d-flex justify-content-between">
              <p style="font-size: larger;">Personal information</p>
              <div class="Edit-btn">
                <button class="btn"><font-awesome-icon :icon="['fas', 'pen-to-square']" style="color: #b3b9cb;" /></button>
              </div>
            </div>
            <div class="d-flex justify-content-between me-3">
              <div class="d-flex flex-column">
                <p style="font-size: small; color: black">First Name</p>
                <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ getFirstAndLastName(user.name).firstName }}</p>
              </div>
              <div class="d-flex flex-column">
                <p style="font-size: small; color:black">Last Name</p>
                <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ getFirstAndLastName(user.name).lastName }}</p>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div class="d-flex flex-column">
                <p style="font-size: small; color:black;">Email address</p>
                <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ user.email }}</p>
              </div>
              <div class="d-flex flex-column">
                <p style="font-size: small; color: black">Phone</p>
                <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ user.phone }}</p>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div class="d-flex flex-column">
                <p style="font-size: small; color: black">Designation</p>
                <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ user.Designation }}</p>
              </div>
            </div>
          </div>
          <div class="tab-con" style="padding: 10px;">
            <div class="d-flex justify-content-between">
              <p style="font-size: larger;">Address</p>
              <div class="Edit-btn">
                <button class="btn"><font-awesome-icon :icon="['fas', 'pen-to-square']" style="color: #b3b9cb;" /></button>
              </div>
            </div>
            <div class="d-flex justify-content-between me-3" v-if="user.address">
              <div class="d-flex flex-column">
                <p style="font-size: small; color: black">Country</p>
                <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ splitAddress(user.address).country }}</p>
              </div>
              <div class="d-flex flex-column">
                <p style="font-size: small; color:black">City/State</p>
                <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ splitAddress(user.address).city }}, {{ splitAddress(user.address).state }}</p>
              </div>
            </div>
            <div class="d-flex justify-content-between" v-if="user.address">
              <div class="d-flex flex-column">
                <p style="font-size: small; color: black;">Postal Code</p>
                <p style="font-size: small; color: #AFB6C8; font-weight: 600;">{{ user.zipcode }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade mt-3 taskdetail" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
          <div v-if="user && user.tasks">
            <ul class="taskul">
              <li v-for="task in user.tasks" :key="task.id" class="d-flex justify-content-between" style="border-bottom: 0.5px solid lightgrey;">
                {{ task.title }}
                <font-awesome-icon :icon="['fas', 'eye']" style="color: #b3b9cb; margin-bottom: 10px;" @click="openTask(task.id, user._id)" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';


    const route = useRoute();
    const router = useRouter();
    const user = ref(null);
    const showUser = ref(true);
    const showTask = ref(false);

    const fetchUserDetails = async () => {
      const userId = route.params.id;
      console.log(userId)
      try {
        const response = await axios.get(`http://localhost:5000/api/users/user/${userId}`);
        user.value = response.data;
        console.log(user.value)
        // Ensure task_ids is always an array
        const taskIds = Array.isArray(user.value.task_ids) ? user.value.task_ids : [user.value.task_ids];
        const taskPromises = taskIds.map(async (taskId) => {
          console.log(taskId)
          const taskResponse = await axios.get(`http://localhost:5000/api/task/tasks/${taskId}`);
          return { id: taskId, title: taskResponse.data.title };
        });

        user.value.tasks = await Promise.all(taskPromises);
        console.log("userdetail", user.value.tasks)
      } catch (error) {
        console.error('Error fetching the user details:', error);
      }
    };

    const showUserDetails = () => {
      showUser.value = true;
      showTask.value = false;
    };

    const showTaskDetails = () => {
      showUser.value = false;
      showTask.value = true;
    };

    const openTask = (taskId, userId) => {
      router.push(`/userdetail/${userId}/taskdetail/${taskId}`);
    };

    const getFirstAndLastName = (fullName) => {
      if (!fullName) return { firstName: '', lastName: '' };
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[1] || ''; // Handle case when there's no last name
      return { firstName, lastName };
    };

    const getFirstLetter = (fullName) => {
      if (!fullName) return '';
      return fullName.charAt(0); // Get the first character
    };

    const splitAddress = (address) => {
      const addressParts = address.split(',');

      if (addressParts.length === 4) {
        return {
          street: addressParts[0].trim(),
          city: addressParts[1].trim(),
          state: addressParts[2].trim(),
          country: addressParts[3].trim()
        };
      } else if (addressParts.length === 3) {
        return {
          street: addressParts[0].trim(),
          city: addressParts[1].trim(),
          state: '',
          country: addressParts[2].trim()
        };
      } else {
        return {
          street: '',
          city: '',
          state: '',
          country: ''
        };
      }
    };

    onMounted(() => {
      console.log("called ")
      fetchUserDetails();
    });

   
 
</script>

<style scoped>


ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 10px;
}

.pp {
  cursor: pointer;
  color: blue;
}

.pp:hover {
  text-decoration: underline;
}

p{
  font-weight: 500;
  
}


/* Add a black background color to the top navigation */
.topnav {
  background-color: #333;
  overflow: hidden;
}

/* Style the links inside the navigation bar */
.topnav p {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

/* Change the color of links on hover */
.topnav p:hover {
  background-color: #ddd;
  color: black;
}

/* Add a color to the active/current link */
.topnav .active {
  background-color: #04aa6d;
  color: white;
}
.nav-tabs{
  border-bottom: 1px solid lightgray;
  padding-bottom: 0px;
}

ul li {
     margin-bottom: 10px; 
}
.tab-content > .active {
    display: flex;
    flex-direction: column;
}

.taskul{
  height: 100%;
  gap: 20px;
  display: flex;
  flex-direction: column;

}

.profile-pic{
  width: 60px;
    height: 60px;
    background-color: #FDE3CF;
    border-radius: 49px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(150, 190, 238, 0.25) 0px 0px 30px 8px;
    color: #F56A00;
}

.tab-con{
  border: 3px solid #F1F2F5;
    border-radius: 7px;
    padding: 10px;
    background-color: white;
    margin-top: 9px;
}
.main-con{
  background-color: #f7f8fa;
}

.side-con{
  height: 85vh;
  background-color: white;
  padding:10px;
  margin-top:15px;
  margin-left:5px
}

.taskdetail{
  background-color: white;
    padding: 10px;
    /* height: 100vh; */
    height: fit-content;
    border-bottom: 0.5px solid lightgrey;
    border-radius: 7px;
    margin-right: 7px;

    
}
</style>


