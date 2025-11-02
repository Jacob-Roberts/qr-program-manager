# Better-Auth Migration Summary

This document summarizes the migration from Next-Auth to Better-Auth.

## What Was Changed

### 1. Dependencies
- **Removed**: `next-auth` and `@auth/drizzle-adapter`
- **Added**: `better-auth`

### 2. Authentication Configuration
- **File**: `src/server/auth/config.ts`
- Migrated from Next-Auth configuration to Better-Auth
- Configured Drizzle adapter for PostgreSQL
- Set up Google OAuth provider
- Configured Magic Link email authentication using the `magicLink` plugin
- **NEW**: Added Passkey (WebAuthn) authentication using the `passkey` plugin
- Removed the need for `AUTH_SECRET` (Better-Auth handles this internally)

### 3. Database Schema Changes
- **File**: `src/server/db/schema.ts`
- **User table**: 
  - Changed `emailVerified` from timestamp to boolean
  - Added `createdAt` and `updatedAt` timestamps
- **Session table**:
  - Renamed `sessionToken` to `token`
  - Renamed `expires` to `expiresAt`
  - Added `id` as primary key
  - Added `ipAddress` and `userAgent` fields
  - Added `createdAt` and `updatedAt` timestamps
- **Account table**:
  - Added `id` primary key
  - Renamed fields to match Better-Auth schema:
    - `provider` → `providerId`
    - `providerAccountId` → `accountId`
    - `access_token` → `accessToken`
    - `refresh_token` → `refreshToken`
    - Added `accessTokenExpiresAt` and `refreshTokenExpiresAt`
  - Added `password` field for future password auth support
  - Added `createdAt` and `updatedAt` timestamps
- **Verification table**:
  - Renamed from `verificationToken` to `verification`
  - Added `id` primary key
  - Renamed `token` to `value`
  - Renamed `expires` to `expiresAt`
  - Added `createdAt` and `updatedAt` timestamps
- **Passkey table** (NEW):
  - Stores passkey credentials for WebAuthn authentication
  - Fields: `id`, `name`, `publicKey`, `userId`, `credentialID`, `counter`, `deviceType`, `backedUp`, `transports`, `aaguid`, `createdAt`

### 4. API Routes
- **Deleted**: `src/app/api/auth/[...nextauth]/route.ts`
- **Created**: `src/app/api/auth/[...all]/route.ts`
- Uses Better-Auth's `toNextJsHandler` helper

### 5. Auth Client
- **Created**: `src/lib/auth-client.ts`
- Client-side authentication using Better-Auth's React hooks
- Configured with `magicLinkClient` plugin
- **NEW**: Configured with `passkeyClient` plugin for WebAuthn support

### 6. Server-Side Auth Usage
Updated all server-side auth calls throughout the codebase:
- **Before**: `await auth()` 
- **After**: `await auth.api.getSession({ headers: await headers() })`

Files updated:
- `src/server/api/trpc.ts` - tRPC context
- `src/components/user-button.tsx` - User profile component
- `src/app/accept-share/route.ts` - Share acceptance route
- `src/app/api/uploadthing/core.ts` - File upload middleware
- `src/app/page.tsx` - Home page authentication checks

### 7. Authentication Actions
- **File**: `src/app/(auth)/sign-in/actions.ts`
- Updated to use Better-Auth client methods:
  - Google sign-in: `authClient.signIn.social()`
  - Magic link sign-in: `authClient.signIn.magicLink()`

### 8. Sign-In Components
- **Updated**: `src/app/(auth)/sign-in/page.tsx`
- **NEW**: `src/app/(auth)/sign-in/sign-in-with-passkey.tsx` - Passkey sign-in component
- Users can now sign in with:
  - Magic link email
  - Passkey (biometrics/security key)
  - Google OAuth

### 9. User Profile Enhancement
- **Updated**: `src/components/user-button.tsx`
- **NEW**: `src/components/add-passkey-button.tsx`
- Added "Add Passkey" button in user profile menu
- Users can register passkeys after signing in with other methods

### 10. Email Verification
- **File**: `src/server/email/resend.tsx`
- Updated `sendVerificationRequest` function signature to match Better-Auth's magic link plugin

### 11. Environment Variables
- **File**: `src/env.js`
- Removed `AUTH_SECRET` (no longer needed)
- All other environment variables remain the same:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `RESEND_API_KEY`
  - `DATABASE_URL`

## Database Migration Required

⚠️ **IMPORTANT**: You need to migrate your database to the new schema.

### Option 1: Using Drizzle Kit (Recommended)
```bash
# Generate the migration
bun drizzle-kit generate

# Review the migration file in drizzle/ folder

# Apply the migration
bun drizzle-kit migrate
```

### Option 2: Manual Migration
The schema changes are backward-incompatible. You'll need to:
1. Backup your existing auth data
2. Drop old tables or create new ones
3. Migrate user data if needed

## Testing Checklist

Before deploying to production, test the following:

- [ ] Google OAuth sign-in works
- [ ] Magic link email sign-in works
- [ ] Email delivery is functioning
- [ ] **NEW**: Passkey sign-in works (test on supported device/browser)
- [ ] **NEW**: Adding a passkey to account works
- [ ] User sessions persist correctly
- [ ] Sign-out functionality works
- [ ] Protected routes redirect properly
- [ ] File uploads work (UploadThing middleware)
- [ ] Share invitations work
- [ ] User profile displays correctly

## Callback URLs

Better-Auth uses different callback URLs than Next-Auth:

- **Google OAuth redirect**: `https://your-domain.com/api/auth/callback/google`
- **Magic link callback**: Handled automatically by Better-Auth

Make sure to update your Google OAuth settings in the Google Cloud Console if you haven't already.

## Benefits of Better-Auth

1. **Modern Architecture**: Built specifically for modern React and Next.js
2. **Better TypeScript Support**: Full type safety throughout
3. **Plugin System**: Extensible with a rich plugin ecosystem
4. **Simpler API**: More intuitive API design
5. **Active Development**: Actively maintained with regular updates
6. **Passwordless Authentication**: Built-in support for passkeys and magic links
7. **Enhanced Security**: WebAuthn/FIDO2 passkey support for phishing-resistant authentication

## Troubleshooting

### Session not persisting
- Clear browser cookies
- Check that `NEXT_PUBLIC_DEPLOY_URL` is set correctly
- Verify database connection

### Email not sending
- Check `RESEND_API_KEY` is valid
- Verify email is not in spam folder
- Check Resend dashboard for delivery status

### OAuth not working
- Verify Google OAuth credentials
- Check callback URL in Google Console matches: `https://your-domain.com/api/auth/callback/google`
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

### Passkey registration failing
- Ensure you're using HTTPS (required for WebAuthn, except on localhost)
- Verify browser supports WebAuthn (most modern browsers do)
- Check that `NEXT_PUBLIC_DEPLOY_URL` is set correctly
- Make sure `rpID` in auth config matches your domain

### Passkey sign-in not working
- User must be on the same device where passkey was registered (for platform authenticators)
- Check browser's stored credentials
- Verify database has passkey records for the user

## Next Steps

1. Run database migrations
2. Test authentication flows
3. Update your `.env` file (remove `AUTH_SECRET` if present)
4. Deploy to staging and verify all functionality
5. Deploy to production

## Support

- Better-Auth Documentation: https://better-auth.com/docs
- Better-Auth GitHub: https://github.com/better-auth/better-auth

