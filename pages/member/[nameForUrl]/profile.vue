<template>
  <div>
    <!-- Navigation -->
    <nav class="profile-nav">
      <NuxtLink 
        v-for="profile in exampleProfiles" 
        :key="profile.url"
        :to="profile.url"
        :class="{ active: nameForUrl === profile.id }"
      >
        {{ profile.name }}
      </NuxtLink>
    </nav>

    <!-- Client-side user data -->
    <ClientOnly>
      <div v-if="auth.userEmail" class="user-email">
        Logged in as: {{ auth.userEmail }}
      </div>
    </ClientOnly>

    <!-- SSR Profile Content -->
    <main>
      <div v-if="pending" class="loading">
        Loading profile...
      </div>

      <div v-else-if="error" class="error">
        {{ error.message }}
      </div>

      <div v-else-if="profile" class="profile">
        <h1>{{ profile.userName }}</h1>
        
        <section class="about">
          <h2>About Me</h2>
          <p>{{ profile.aboutMe }}</p>
        </section>

        <section class="images">
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

// Fetch user email on client-side
onMounted(async () => {
  if (auth.isAuthenticated && !auth.userEmail) {
    await auth.fetchUserEmail()
  }
})

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
.profile-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
}

.profile-nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
}

.profile-nav a.active {
  font-weight: bold;
}

.user-email {
  padding: 1rem;
  background: #e9ecef;
  margin: 1rem 0;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: red;
}

.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-container img {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
}
</style> 