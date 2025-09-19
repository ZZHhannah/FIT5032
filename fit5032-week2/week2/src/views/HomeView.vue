<template>
  <div class="container mt-4">
    <!-- User Info Section -->
    <div v-if="user" class="row mb-4">
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <h5 class="alert-heading">Welcome back!</h5>
          <p class="mb-1"><strong>Email:</strong> {{ user.email }}</p>
          <p class="mb-1"><strong>Role:</strong> {{ userRole }}</p>
          <p class="mb-0"><strong>User ID:</strong> {{ user.uid }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title">Week 2 - Library Registration</h2>
            <LibraryRegistrationForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../init.js';
import LibraryRegistrationForm from '@/components/LibraryRegistrationForm.vue';

const user = ref(null);
const userRole = ref('');

onMounted(async () => {
  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser;

    if (currentUser) {
      // Get user role from Firestore
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          userRole.value = snap.data().role;
          console.log("Current user role:", userRole.value);
        }
      } catch (error) {
        console.error("Error getting user role:", error);
      }
    } else {
      userRole.value = '';
    }
  });
});
</script>

