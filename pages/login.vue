<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Welcome Back</h1>
        <p class="subtitle">Please login to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <span class="input-icon">✉️</span>
            <input 
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
              autocomplete="email"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="login-button"
          :class="{ 'loading': isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </button>

        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>
      </form>

      <div class="demo-credentials">
        <p class="demo-title">Demo Credentials:</p>
        <code>
          Email: test566@gmal.com<br>
          Password: 1234qwer
        </code>
      </div>
    </div>
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
/* Box Sizing Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: clamp(1rem, 5vw, 2rem);
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.login-header {
  background: #339af0;
  color: white;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  text-align: center;
}

.login-header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 1.8rem);
  font-weight: 600;
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: clamp(0.875rem, 2vw, 0.95rem);
}

.login-form {
  padding: clamp(1.5rem, 5vw, 2rem);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
  font-size: clamp(0.875rem, 2vw, 1rem);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: clamp(1rem, 3vw, 1.2rem);
  opacity: 0.7;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  display: block;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.2s ease;
  background: #f8f9fa;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #339af0;
  box-shadow: 0 0 0 3px rgba(51,154,240,0.1);
}

.input-wrapper input::placeholder {
  color: #adb5bd;
}

.login-button {
  width: 100%;
  padding: clamp(0.75rem, 2vw, 0.875rem);
  background: #339af0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.login-button:hover:not(:disabled) {
  background: #228be6;
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
}

.loading-dots span {
  animation: dots 1.4s infinite;
  opacity: 0;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dots {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fff5f5;
  color: #fa5252;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}

.error-icon {
  font-size: clamp(1rem, 3vw, 1.2rem);
}

.demo-credentials {
  padding: clamp(1.25rem, 4vw, 1.5rem);
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}

.demo-title {
  margin: 0 0 0.5rem;
  color: #868e96;
  font-weight: 500;
}

code {
  display: block;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  color: #495057;
  line-height: 1.5;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .login-card {
    max-width: 360px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 0;
    background: white;
  }
  .login-card {
    border-radius: 0;
    box-shadow: none;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .login-form {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .form-group:last-of-type {
    margin-bottom: 2rem;
  }
  .login-button {
    margin-top: auto;
  }
  .demo-credentials {
    margin-top: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .login-container {
    background: linear-gradient(135deg, #212529 0%, #343a40 100%);
  }
  .login-card {
    background: #343a40;
  }
  .login-header {
    background: #228be6;
  }
  .input-wrapper input {
    background: #495057;
    border-color: #495057;
    color: white;
  }
  .input-wrapper input::placeholder {
    color: #adb5bd;
  }
  .demo-credentials {
    background: #212529;
  }
  code {
    background: #495057;
    color: #e9ecef;
  }
  .error-message {
    background: #862e2e;
  }
}
</style> 