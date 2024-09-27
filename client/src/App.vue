<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';

</script>

<template>
   <div>
    <Navbar />

  
  <RouterView />

   </div>
</template>

<style>
body{
    font-family: "poppins",sans-serif !important;
}
</style>