<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h1 class="card-title text-center mb-4">Sign Out</h1>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="alert alert-success" role="alert">
              {{ successMessage }}
            </div>

            <div class="text-center">
              <p class="mb-4">Are you sure you want to sign out?</p>

              <div class="d-grid gap-2">
                <button
                  @click="logout"
                  class="btn btn-danger"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Signing Out...' : 'Sign Out' }}
                </button>

                <router-link to="/" class="btn btn-secondary">
                  Cancel
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signOut } from "firebase/auth";
import { auth } from "../main.js";

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const logout = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await signOut(auth);
    console.log("Signed out, auth.currentUser:", auth.currentUser);

    successMessage.value = "Successfully signed out! Redirecting...";

    // Redirect to sign in page after a short delay
    setTimeout(() => {
      router.push("/FirebaseSignIn");
    }, 1500);

  } catch (err) {
    console.error("Logout error:", err.message);
    errorMessage.value = "An error occurred while signing out. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
