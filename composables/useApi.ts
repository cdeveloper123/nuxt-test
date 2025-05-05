const BASE_URL = 'https://modelsocietyapi-stage-a3dcfsb2hgf9fkd0.eastus-01.azurewebsites.net'

// Types for better type safety
export interface Profile {
  userName: string
  aboutMe: string
  images: Array<{
    url: string
    description?: string
  }>
}

export interface UserData {
  email: string
}

export const useApi = () => {
  const getAuthToken = () => {
    if (process.client) {
      try {
        const auth = localStorage.getItem('auth')
        return auth ? JSON.parse(auth).token : null
      } catch {
        return null
      }
    }
    return null
  }

  const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  return {
    // Public endpoints (SSR-compatible)
    public: {
      getProfile: (nameForUrl: string) => 
        useFetch(`${BASE_URL}/api/members/${nameForUrl}/profile`)
    },

    // Private endpoints (client-side only)
    private: {
      login: (email: string, password: string) => 
        authFetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        }),
      getCurrentUser: () => 
        authFetch('/api/me')
    }
  }
} 