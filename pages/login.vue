<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          id="email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  try {
    isLoading.value = true
    error.value = ''

    const success = await auth.login(email.value, password.value)
    if (success) {
      router.push('/member/vova/profile')
    } else {
      error.value = 'Login failed. Please check your credentials.'
    }
  } catch (e) {
    error.value = 'An unexpected error occurred.'
  } finally {
    isLoading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  if (auth.isAuthenticated) {
    router.push('/member/vova/profile')
  }
})
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
}

button {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style> 