<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h1 class="card-title text-center mb-4">Register</h1>

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
                placeholder="Enter your password (min. 6 characters)"
                :disabled="isLoading"
              />
            </div>

            <div class="mb-3">
              <label for="role" class="form-label">Role</label>
              <select class="form-select" id="role" v-model="role" :disabled="isLoading">
                <option value="personal">Personal User</option>
                <option value="admin">Admin</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div class="d-grid">
              <button
                @click="register"
                class="btn btn-success"
                :disabled="isLoading || !email || !password"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isLoading ? 'Creating Account...' : 'Register' }}
              </button>
            </div>

            <div class="text-center mt-3">
              <p class="mb-0">Already have an account?
                <router-link to="/FirebaseSignIn">Sign in here</router-link>
              </p>
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../init.js";

const email = ref("");
const password = ref("");
const role = ref("personal");
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const router = useRouter();

const register = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters long";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("Registered:", cred.user);

    // Save user data to Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      email: email.value,
      role: role.value,
      createdAt: new Date()
    });
    console.log("User data saved successfully with role:", role.value);

    successMessage.value = "Account created successfully! Redirecting to sign in...";

    // Redirect to sign in page after a short delay
    setTimeout(() => {
      router.push("/FirebaseSignIn");
    }, 2000);

  } catch (err) {
    console.error("Register error:", err.message);
    errorMessage.value = getErrorMessage(err.code);
  } finally {
    isLoading.value = false;
  }
};

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    default:
      return 'An error occurred during registration. Please try again.';
  }
};
</script>
