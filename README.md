# Vue.js Test Task Implementation

This project demonstrates a Vue.js/Nuxt implementation focusing on Server-Side Rendering (SSR) and client-side interactions. The main goal is to showcase the proper handling of both static (SEO-friendly) and dynamic (user-specific) content.

## Core Requirements

1. **SSR for Initial Load**
   - Profile data rendered server-side for SEO
   - Public content available immediately
   - Meta tags generated during SSR

2. **Client-side Navigation**
   - SPA-style profile navigation
   - No full page reloads
   - State preservation between routes

3. **Dynamic User Content**
   - Authenticated user data loaded client-side
   - Email display for logged-in users
   - Bearer token authentication

## Implementation Approach

### 1. SSR and Client-side Content Separation

```vue
<!-- Static SSR Content (SEO-friendly) -->
<main>
  <div v-if="profile" class="profile">
    <h1>{{ profile.userName }}</h1>
    <section class="about">
      <h2>About Me</h2>
      <p>{{ profile.aboutMe }}</p>
    </section>
  </div>
</main>

<!-- Dynamic Client-side Content -->
<ClientOnly>
  <div v-if="auth.userEmail" class="user-email">
    Logged in as: {{ auth.userEmail }}
  </div>
</ClientOnly>
```

**Reasoning:**
- Profile data is public and SEO-important → Server-side rendered
- User email is private and dynamic → Client-side only
- `<ClientOnly>` prevents hydration mismatches

### 2. Data Fetching Strategy

```typescript
// SSR Data Fetch (Profile)
const { data: profile } = await useApi().public.getProfile(nameForUrl.value)

// Client-side Data Fetch (User Email)
onMounted(async () => {
  if (auth.isAuthenticated && !auth.userEmail) {
    await auth.fetchUserEmail()
  }
})
```

**Benefits:**
- SEO-critical data available during initial render
- Dynamic user data doesn't block SSR
- Efficient client-side updates
- Clear separation of concerns

### 3. API Structure

```typescript
const api = {
  // Public endpoints (SSR-compatible)
  public: {
    getProfile: (nameForUrl: string) => 
      useFetch(`${BASE_URL}/api/members/${nameForUrl}/profile`, {
        key: `profile-${nameForUrl}`,
        server: true,
        lazy: false
      })
  },

  // Protected endpoints (client-side only)
  protected: {
    getCurrentUser: async () => {
      const token = getAuthToken()
      if (!token) return null
      return authFetch('/api/me')
    }
  }
}
```

**Design Decisions:**
- Clear separation between public and protected endpoints
- SSR-compatible public data fetching
- Token-based authentication for protected routes
- Efficient caching with unique keys

### 4. Client-side Navigation

```typescript
// Profile page component
watch(nameForUrl, async (newValue) => {
  if (newValue) {
    const { data, error } = await useApi().public.getProfile(newValue)
    if (!error) {
      profile.value = data.value
    }
  }
})
```

**Implementation:**
- Using `NuxtLink` for client-side routing
- Watching route params for profile updates
- Preserving application state
- No full page reloads

### 5. SEO Implementation

```typescript
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
```

## Project Structure

```
├── composables/
│   └── useApi.ts         # API interaction with SSR support
├── pages/
│   ├── login.vue         # Authentication page
│   └── member/
│       └── [nameForUrl]/
│           └── profile.vue # SSR-enabled profile page
└── stores/
    └── auth.ts           # Authentication state management
```

## Technical Decisions

1. **Nuxt 3**
   - Built-in SSR support
   - Automatic route handling
   - Efficient client-side navigation
   - Component hydration control

2. **API Design**
   - Separate public and protected endpoints
   - SSR-compatible data fetching
   - Efficient caching strategy
   - Token-based authentication

3. **State Management**
   - Centralized auth state
   - Persistent token storage
   - Clear public/private data separation
   - Efficient updates

## Performance Considerations

1. **Server-side Rendering**
   - Critical content rendered on server
   - SEO optimization
   - Fast initial page load
   - Reduced client-side processing

2. **Client-side Navigation**
   - No full page reloads
   - Efficient data updates
   - State preservation
   - Smooth transitions

3. **Data Management**
   - Strategic data fetching
   - Proper caching
   - Minimal duplicate requests
   - Efficient updates

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Run development server:
```bash
yarn dev
```

3. Build for production:
```bash
yarn build
```

## Test Credentials

```json
{
  "email": "test566@gmal.com",
  "password": "1234qwer"
}
```

## Key Benefits

1. **SEO Optimization**
   - Critical content rendered server-side
   - Meta tags properly generated
   - Search engine friendly
   - Semantic markup

2. **Performance**
   - Fast initial page load
   - Efficient client-side navigation
   - Optimized data fetching
   - Responsive images

3. **User Experience**
   - Fluid responsive design
   - Smooth transitions
   - Loading states
   - Error feedback
   - Dark mode support

4. **Maintainability**
   - Clear code organization
   - Type safety with TypeScript
   - Component-based architecture
   - Responsive utilities

5. **Accessibility**
   - WCAG compliance
   - Keyboard navigation
   - Screen reader support
   - High contrast modes

## Future Improvements

1. **Performance**
   - Image optimization
   - Code splitting
   - Service workers
   - Progressive loading

2. **Accessibility**
   - Enhanced ARIA support
   - More keyboard shortcuts
   - Focus management
   - Voice navigation

3. **Features**
   - Profile editing
   - Image upload
   - Social sharing
   - Real-time updates
