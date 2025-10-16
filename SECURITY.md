# Security Guidelines

## API Key Management

### ✅ Correct: Server-Side API Keys

\`\`\`typescript
// app/actions/api.ts
"use server"

export async function fetchData() {
  const apiKey = process.env.API_KEY // Server-side only
  // ... use apiKey
}
\`\`\`

### ❌ Incorrect: Client-Side Exposure

\`\`\`typescript
// Don't do this!
const apiKey = process.env.NEXT_PUBLIC_API_KEY // Exposed to browser!
\`\`\`

## Environment Variables

### Server-Side Only (Secure)
- `WALLHAVEN_API_KEY` - Wallhaven API authentication
- `WAIFU_API_KEY` - Waifu.im API authentication
- Any other sensitive credentials

### Client-Side (Public - Use Carefully)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_ANALYTICS_ID` - Public analytics ID

## Best Practices

1. **Never** use `NEXT_PUBLIC_` prefix for API keys
2. **Always** access API keys in Server Actions or API Routes
3. **Use** environment variable validation at startup
4. **Rotate** API keys regularly
5. **Monitor** API usage for anomalies

## Deployment Checklist

- [ ] No `NEXT_PUBLIC_` prefix on sensitive keys
- [ ] All API calls using keys are server-side
- [ ] `.env.local` added to `.gitignore`
- [ ] Environment variables set in deployment platform
- [ ] API key rotation schedule established

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com instead of using the issue tracker.
