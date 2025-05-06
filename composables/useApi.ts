const BASE_URL = 'https://modelsocietyapi-stage-a3dcfsb2hgf9fkd0.eastus-01.azurewebsites.net'

interface ProfileResponse {
  userName: string
  aboutMe: string
  images: Array<{
    url: string
    description?: string
  }>
}

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
    
    // Don't proceed if token is required but not present
    if (!token) {
      throw new Error('Authentication required')
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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

  const publicFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  return {
    // Public endpoints (no auth required)
    public: {
      getProfile: (nameForUrl: string) => 
        useFetch<ProfileResponse>(`${BASE_URL}/api/members/${nameForUrl}/profile`, {
          key: `profile-${nameForUrl}`,
          server: true,
          lazy: false,
          transform: (response: ProfileResponse) => ({
            userName: response.userName,
            aboutMe: response.aboutMe,
            images: response.images || []
          })
        })
    },

    // Protected endpoints (auth required)
    protected: {
      // Only proceeds if token exists
      getCurrentUser: async () => {
        const token = getAuthToken()
        if (!token) return null
        return authFetch('/api/me')
      },

      // Login doesn't need token but returns one
      login: async (email: string, password: string) => {
        return publicFetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        })
      }
    }
  }
} 