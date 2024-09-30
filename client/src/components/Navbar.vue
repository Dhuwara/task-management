<template>
    <nav class="navbar">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img style="width: 50px; height: 50px;  " src="../assets/download.png" alt="Logo" width="30" height="24" class="d-inline-block align-text-top" @click="openHome">
      
    </a>

    <div class="profile-con">
      <p style="margin-bottom: 0px; color: #F56A00;">D</p>
    </div>
  </div>
</nav>
</template>

<script setup>
import router from '@/router';

  const openHome =  ()=>{
      router.push('/')
    }
 
</script>
<style scoped>

.profile-con{
  width: 39px;
    height: 38px;
    background-color: #FDE3CF;
    border-radius: 49px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(150, 190, 238, 0.25) 0px 0px 30px 8px
}
</style>