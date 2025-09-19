<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h1 class="card-title text-center mb-4">Sign In</h1>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="alert alert-success" role="alert">
              {{ successMessage }}
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                placeholder="Enter your email"
                :disabled="isLoading"
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                :disabled="isLoading"
              />
            </div>

            <div class="d-grid">
              <button
                @click="signin"
                class="btn btn-primary"
                :disabled="isLoading || !email || !password"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isLoading ? 'Signing In...' : 'Sign In' }}
              </button>
            </div>

            <div class="text-center mt-3">
              <p class="mb-0">Don't have an account?
                <router-link to="/FirebaseRegister">Register here</router-link>
              </p>
            </div>

            <div v-if="userRole" class="alert alert-success mt-3">
              <p class="mb-0">Current Role: {{ userRole }}</p>
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../init.js";

const email = ref("");
const password = ref("");
const userRole = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const router = useRouter();

const signin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log("Signed in:", cred.user);
    console.log("auth.currentUser:", auth.currentUser);

    // Get user role from Firestore
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (snap.exists()) {
      userRole.value = snap.data().role;
      console.log("Role:", userRole.value);
    }

    // Show success message and delay redirect
    successMessage.value = `Welcome! You are logged in as ${userRole.value || 'User'}. Redirecting to home page...`;

    // Redirect to home page after showing the role
    setTimeout(() => {
      router.push("/");
    }, 2000);
  } catch (err) {
    console.error("SignIn error:", err.message);
    errorMessage.value = getErrorMessage(err.code);
  } finally {
    isLoading.value = false;
  }
};

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    default:
      return 'An error occurred during sign in. Please try again.';
  }
};
</script>
