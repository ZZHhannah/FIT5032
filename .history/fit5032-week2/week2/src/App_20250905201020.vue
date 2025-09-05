<script setup>
// Router-only shell; views are rendered below
</script>

<template>
  <!-- Centered nav using Bootstrap nav-pills like the screenshots -->
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">Home (Week 5)</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
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
