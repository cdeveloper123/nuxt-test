<template>
  <div class="page-container">
    <!-- Navigation -->
    <nav class="profile-nav">
      <div class="nav-content">
        <div class="nav-links">
          <NuxtLink 
            v-for="profile in exampleProfiles" 
            :key="profile.url"
            :to="profile.url"
            :class="{ active: nameForUrl === profile.id }"
          >
            {{ profile.name }}
          </NuxtLink>
        </div>
        <ClientOnly>
          <button 
            v-if="auth.isAuthenticated" 
            class="logout-btn"
            @click="handleLogout"
          >
            Logout
          </button>
        </ClientOnly>
      </div>
    </nav>

    <!-- User Email -->
    <ClientOnly>
      <div v-if="auth.userEmail" class="user-email">
        <div class="email-content">
          <span class="email-label">Logged in as:</span>
          <span class="email-value">{{ auth.userEmail }}</span>
        </div>
      </div>
    </ClientOnly>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Loading State -->
      <div v-if="pending" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error">
        <div class="error-icon">⚠️</div>
        <p>{{ error.message }}</p>
      </div>

      <!-- Profile Content -->
      <div v-else-if="profile" class="profile">
        <header class="profile-header">
          <h1>{{ profile.userName }}</h1>
        </header>
        
        <section class="about-section">
          <h2>About Me</h2>
          <p class="about-text">{{ profile.aboutMe }}</p>
        </section>

        <section class="images-section">
          <h2>Images</h2>
          <div class="image-grid">
            <div 
              v-for="image in profile.images" 
              :key="image.url" 
              class="image-container"
            >
              <img 
                :src="image.url" 
                :alt="image.description || `${profile.userName}'s image`"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

// Store
const auth = useAuthStore()

// Constants
const exampleProfiles = [
  { id: 'vova', name: "Vova's Profile", url: '/member/vova/profile' },
  { id: 'Model-Society-Admin', name: "Model Society Admin's Profile", url: '/member/Model-Society-Admin/profile' }
]

// Route
const route = useRoute()
const router = useRouter()
const nameForUrl = computed(() => route.params.nameForUrl as string)

// Initial data fetch (SSR)
const { data: profile, pending, error } = await useApi().public.getProfile(nameForUrl.value)

// Watch for route changes
watch(nameForUrl, async (newValue) => {
  if (newValue) {
    const { data, error } = await useApi().public.getProfile(newValue)
    if (!error) {
      profile.value = data.value
    }
  }
})

// Fetch user email on client-side only if authenticated
onMounted(async () => {
  if (auth.isAuthenticated && !auth.userEmail) {
    await auth.fetchUserEmail()
  }
})

// Handle logout
const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

// SEO
useHead(() => ({
  title: profile.value ? `${profile.value.userName}'s Profile` : 'Profile',
  meta: [
    {
      name: 'description',
      content: profile.value 
        ? `View ${profile.value.userName}'s profile and photos` 
        : 'User Profile Page'
    }
  ]
}))
</script>

<style scoped>
/* Base Styles */
.page-container {
  min-height: 100vh;
  background-color: white;
}

/* Navigation Styles */
.profile-nav {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.profile-nav a {
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: #495057;
  border-radius: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.profile-nav a:hover {
  background-color: #e9ecef;
}

.profile-nav a.active {
  background-color: #339af0;
  color: white;
}

.logout-btn {
  padding: 0.75rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;
}

.logout-btn:hover {
  background-color: #fa5252;
  transform: translateY(-1px);
}

/* User Email Styles */
.user-email {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.email-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.email-label {
  color: #868e96;
}

.email-value {
  color: #495057;
  font-weight: 500;
}

/* Main Content Styles */
.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Loading & Error States */
.loading,
.error {
  text-align: center;
  padding: 3rem 1rem;
  margin: 1rem;
  border-radius: 8px;
  background: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top-color: #339af0;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #fa5252;
  background: #fff5f5;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Profile Content */
.profile {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  margin: 1rem;
}

.profile-header {
  background: #339af0;
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
}

.profile-header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  line-height: 1.2;
}

.about-section,
.images-section {
  padding: 2rem;
}

.about-section {
  background: white;
}

.about-text {
  color: #495057;
  line-height: 1.6;
  font-size: clamp(1rem, 2vw, 1.1rem);
}

.images-section {
  background: #f8f9fa;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.image-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  aspect-ratio: 16/9;
}

.image-container:hover {
  transform: translateY(-4px);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Section Headers */
h2 {
  color: #339af0;
  margin-bottom: 1.5rem;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
}

/* Responsive Design - Tablets */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .profile-nav a {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .logout-btn {
    width: 100%;
    text-align: center;
  }

  .about-section,
  .images-section {
    padding: 1.5rem;
  }

  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
}

/* Responsive Design - Mobile */
@media (max-width: 480px) {
  .nav-content {
    padding: 0.75rem;
  }

  .nav-links {
    flex-direction: column;
    align-items: stretch;
  }

  .profile-nav a {
    text-align: center;
    margin: 0.25rem 0;
  }

  .profile {
    margin: 0;
    border-radius: 0;
  }

  .profile-header {
    padding: 2rem 1rem;
  }

  .about-section,
  .images-section {
    padding: 1.25rem;
  }

  .image-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    margin: 1rem auto;
  }

  .loading,
  .error {
    margin: 0;
    border-radius: 0;
  }
}

/* Print Styles */
@media print {
  .profile-nav,
  .user-email,
  .logout-btn {
    display: none;
  }

  .profile {
    box-shadow: none;
  }

  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 