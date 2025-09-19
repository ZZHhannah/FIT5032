<template>
  <div>
    <!-- Filter Controls -->
    <div class="mb-3">
      <div class="row">
        <div class="col-md-6">
          <label for="isbnFilter" class="form-label">ISBN Filter (show books with ISBN > value)</label>
          <input
            type="number"
            class="form-control"
            id="isbnFilter"
            v-model="isbnFilter"
            @input="applyFilter"
            placeholder="Enter minimum ISBN"
            min="0"
          />
        </div>
        <div class="col-md-6 d-flex align-items-end">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="showAllBooks" @change="toggleFilter" id="showAllCheckbox">
            <label class="form-check-label" for="showAllCheckbox">
              Show all books
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading books...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
      <button @click="loadBooks" class="btn btn-sm btn-outline-danger ms-2">Retry</button>
    </div>

    <!-- Books List -->
    <div v-else>
      <h6>Books Collection ({{ books.length }} books)</h6>

      <ul class="list-group" v-if="books.length > 0">
        <li v-for="book in books" :key="book.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ book.name }}</strong> - ISBN: {{ book.isbn }}
            <span v-if="editingBook?.id === book.id" class="ms-3">
              <input
                type="text"
                class="form-control form-control-sm d-inline-block me-2"
                style="width: 150px;"
                v-model="editingBook.name"
                placeholder="Name"
              />
              <input
                type="number"
                class="form-control form-control-sm d-inline-block me-2"
                style="width: 100px;"
                v-model="editingBook.isbn"
                placeholder="ISBN"
                min="1"
              />
              <button @click="updateBook(book.id)" class="btn btn-success btn-sm me-1" :disabled="isUpdating">
                <span v-if="isUpdating" class="spinner-border spinner-border-sm me-1"></span>
                Save
              </button>
              <button @click="cancelEdit" class="btn btn-secondary btn-sm">Cancel</button>
            </span>
          </div>
          <div v-if="editingBook?.id !== book.id">
            <button @click="startEdit(book)" class="btn btn-outline-primary btn-sm me-1">Edit</button>
            <button @click="deleteBook(book.id)" class="btn btn-outline-danger btn-sm" :disabled="isDeleting">
              <span v-if="isDeleting" class="spinner-border spinner-border-sm me-1"></span>
              Delete
            </button>
          </div>
        </li>
      </ul>

      <p v-else class="text-muted">No books found. Add some books first!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../init.js';

const books = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const isbnFilter = ref(1000);
const showAllBooks = ref(false);
const editingBook = ref(null);
const isUpdating = ref(false);
const isDeleting = ref(false);

// Load books based on filter
const loadBooks = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    let q;

    if (showAllBooks.value) {
      // Show all books, ordered by creation date (newest first)
      q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
      console.log('Loading all books');
    } else {
      // Filter by ISBN > filter value (simplified to avoid composite index)
      const filterValue = parseInt(isbnFilter.value) || 0;
      q = query(
        collection(db, 'books'),
        where('isbn', '>', filterValue),
        orderBy('isbn', 'asc')
      );
      console.log('Loading books with ISBN >', filterValue);
    }

    const querySnapshot = await getDocs(q);

    books.value = [];
    querySnapshot.forEach((doc) => {
      books.value.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      });
    });

    console.log('Loaded', books.value.length, 'books');

  } catch (error) {
    console.error('Error loading books:', error);
    errorMessage.value = 'Failed to load books: ' + error.message;
  } finally {
    isLoading.value = false;
  }
};

// Apply filter when ISBN filter changes
const applyFilter = () => {
  if (!showAllBooks.value) {
    loadBooks();
  }
};

// Toggle between filtered and all books
const toggleFilter = () => {
  loadBooks();
};

// Start editing a book
const startEdit = (book) => {
  editingBook.value = { ...book };
};

// Cancel editing
const cancelEdit = () => {
  editingBook.value = null;
};

// Update book
const updateBook = async (bookId) => {
  if (!editingBook.value) return;

  isUpdating.value = true;

  try {
    const bookRef = doc(db, 'books', bookId);

    const updateData = {
      isbn: parseInt(editingBook.value.isbn),
      name: editingBook.value.name.trim()
    };

    console.log('Updating book:', bookId, updateData);

    await updateDoc(bookRef, updateData);

    console.log('Book updated successfully');

    // Reload books to show updated data
    await loadBooks();

    // Clear editing state
    editingBook.value = null;

  } catch (error) {
    console.error('Error updating book:', error);
    errorMessage.value = 'Failed to update book: ' + error.message;
  } finally {
    isUpdating.value = false;
  }
};

// Delete book
const deleteBook = async (bookId) => {
  if (!confirm('Are you sure you want to delete this book?')) {
    return;
  }

  isDeleting.value = true;

  try {
    console.log('Deleting book:', bookId);

    await deleteDoc(doc(db, 'books', bookId));

    console.log('Book deleted successfully');

    // Reload books to reflect deletion
    await loadBooks();

  } catch (error) {
    console.error('Error deleting book:', error);
    errorMessage.value = 'Failed to delete book: ' + error.message;
  } finally {
    isDeleting.value = false;
  }
};

// Watch for filter changes
watch([isbnFilter, showAllBooks], () => {
  loadBooks();
});

// Load books on component mount
onMounted(() => {
  loadBooks();
});
</script>

<style scoped>
code {
  background-color: #f8f9fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}
</style>
