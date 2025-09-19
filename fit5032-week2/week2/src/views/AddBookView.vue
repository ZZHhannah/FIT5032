<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Add Book Form -->
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title mb-0">Add New Book</h2>
          </div>
          <div class="card-body">

            <!-- Error/Success Messages -->
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="alert alert-success" role="alert">
              {{ successMessage }}
            </div>

            <!-- Book Form -->
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <input
                  type="number"
                  class="form-control"
                  id="isbn"
                  v-model="bookData.isbn"
                  :disabled="isLoading"
                  placeholder="Enter ISBN (numbers only)"
                  min="1"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="name" class="form-label">Book Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="bookData.name"
                  :disabled="isLoading"
                  placeholder="Enter book name"
                  required
                />
              </div>

              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading || !bookData.isbn || !bookData.name"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Adding...' : 'Add Book' }}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      <!-- Book List -->
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Book Collection</h5>
          </div>
          <div class="card-body">
            <BookList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../init.js';
import BookList from '../components/BookList.vue';

const bookData = ref({
  isbn: '',
  name: ''
});
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Add book to Firestore
const addBook = async () => {
  if (!bookData.value.isbn || !bookData.value.name) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  if (isNaN(bookData.value.isbn) || bookData.value.isbn <= 0) {
    errorMessage.value = 'ISBN must be a valid positive number';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const docData = {
      isbn: parseInt(bookData.value.isbn),
      name: bookData.value.name.trim(),
      createdAt: new Date()
    };

    console.log('Adding book to Firestore:', docData);

    // Add document to 'books' collection
    await addDoc(collection(db, 'books'), docData);

    console.log('Book added successfully');

    // Clear form
    bookData.value = { isbn: '', name: '' };

    successMessage.value = 'Book added successfully! Check the list below.';

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);

  } catch (error) {
    console.error('Error adding book:', error);
    errorMessage.value = 'Failed to add book: ' + error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
pre {
  font-size: 0.9em;
}

code {
  background: none;
  color: inherit;
  padding: 0;
}
</style>
