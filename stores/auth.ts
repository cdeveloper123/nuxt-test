import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface AuthState {
  token: string | null
  userEmail: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    userEmail: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const { protected: protectedApi } = useApi()
        const data = await protectedApi.login(email, password)
        this.token = data.authToken
        await this.fetchUserEmail()
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    async fetchUserEmail() {
      if (!this.token) return

      try {
        const { protected: protectedApi } = useApi()
        const data = await protectedApi.getCurrentUser()
        
        // If API call wasn't made due to missing token
        if (!data) return

        if (data.email) {
          this.userEmail = data.email
        }
      } catch (error) {
        console.error('Failed to fetch user email:', error)
      }
    },

    logout() {
      this.token = null
      this.userEmail = null
    }
  },

  persist: {
    storage: persistedState.localStorage
  }
}) 