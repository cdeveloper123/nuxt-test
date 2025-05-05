<template>
  <div>
    Redirecting to login...
  </div>
</template>

<script setup>
const router = useRouter()

// Redirect to login page
onMounted(() => {
  router.push('/login')
})
</script> 