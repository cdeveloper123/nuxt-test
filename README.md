# Vue.js Test Task Implementation

This project demonstrates a Vue.js/Nuxt implementation with a focus on SSR (Server-Side Rendering) and client-side interactions. The main goal is to showcase how to properly handle both static (SEO-friendly) and dynamic (user-specific) content.

## Project Overview

The application consists of two main features:
1. User authentication
2. Profile viewing with SSR support

### API Server
```
https://modelsocietyapi-stage-a3dcfsb2hgf9fkd0.eastus-01.azurewebsites.net/
```

## Implementation Approach

### 1. Static vs Dynamic Content Separation

```vue
<!-- Static SSR Content (public profile info) -->
<main>
  <div v-if="profile" class="profile">
    <h1>{{ profile.userName }}</h1>
    <section class="about">
      <h2>About Me</h2>
      <p>{{ profile.aboutMe }}</p>
    </section>
  </div>
</main>

<!-- Dynamic Client-side Content (user email) -->
<ClientOnly>
  <div v-if="auth.userEmail" class="user-email">
    Logged in as: {{ auth.userEmail }}
  </div>
</ClientOnly>
```

**Reasoning:**
- Profile data is public and SEO-important → Server-side rendered
- User email is private and user-specific → Client-side only
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
- Fast initial page load with SSR
- SEO-friendly content
- Non-blocking user data fetching
- Smooth client-side navigation

### 3. API Structure

```typescript
const api = {
  public: {
    // SSR-compatible endpoints (no auth required)
    getProfile: (nameForUrl: string) => 
      useFetch(`${BASE_URL}/api/members/${nameForUrl}/profile`)
  },
  private: {
    // Client-side only endpoints (auth required)
    getCurrentUser: () => authFetch('/api/me')
  }
}
```

**Design Decisions:**
- Clear separation between public and private endpoints
- SSR compatibility for public data
- Client-side only for authenticated requests

### 4. Performance Optimizations

- Initial SSR fetch for fast first page load
- Client-side navigation for subsequent views
- Reactive updates on route changes
- No full page reloads needed
- Lazy loading for images

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

## Key Benefits

1. **SEO Optimization**
   - Critical content rendered server-side
   - Meta tags properly generated
   - Search engine friendly

2. **Performance**
   - Fast initial page load
   - Efficient client-side navigation
   - Optimized data fetching
   - Parallel loading of content

3. **User Experience**
   - No content flashing
   - Smooth navigation
   - Immediate feedback
   - Proper loading states

4. **Maintainability**
   - Clear code organization
   - Type safety with TypeScript
   - Easy to extend
   - Well-structured components

5. **Security**
   - Private data handled client-side
   - Proper authentication flow
   - Secure data handling

## Project Structure

```
├── composables/
│   └── useApi.ts         # API interaction logic
├── pages/
│   ├── login.vue         # Login page
│   └── member/
│       └── [nameForUrl]/
│           └── profile.vue # Profile page with SSR
└── stores/
    └── auth.ts           # Authentication state management
```

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

## Technical Decisions

1. **Nuxt 3**: Chosen for built-in SSR support and modern Vue.js features
2. **Pinia**: For state management with TypeScript support
3. **Composition API**: For better code organization and type safety
4. **TypeScript**: For enhanced developer experience and code reliability

## Best Practices Implemented

1. **Code Organization**
   - Clear separation of concerns
   - Modular component structure
   - Reusable composables

2. **Performance**
   - Efficient SSR implementation
   - Optimized data fetching
   - Smart caching strategy

3. **Type Safety**
   - TypeScript throughout
   - Proper interface definitions
   - Type-safe API calls

4. **Error Handling**
   - Graceful error states
   - User-friendly error messages
   - Proper error boundaries
