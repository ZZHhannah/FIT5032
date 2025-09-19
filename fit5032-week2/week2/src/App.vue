<script setup>
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FirebaseRegister" class="nav-link" active-class="active">Register</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FirebaseSignIn" class="nav-link" active-class="active">Sign In</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FirebaseLogout" class="nav-link" active-class="active">Logout</router-link>
        </li>
      </ul>
    </header>
  </div>
  <main class="container pb-4">
    <router-view />
  </main>
  
</template>

<style scoped>
main { min-height: 60vh; }
</style>
