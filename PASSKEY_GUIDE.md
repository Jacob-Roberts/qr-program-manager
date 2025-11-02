# Passkey Authentication - Quick Start Guide

Passkeys are now enabled in your application! Here's everything you need to know.

## What are Passkeys?

Passkeys are a secure, passwordless authentication method that uses:
- **Biometrics**: Face ID, Touch ID, fingerprint readers
- **Security Keys**: Hardware tokens like YubiKey
- **Device PINs**: Your device's unlock method

They're more secure than passwords because they use cryptographic keys and are phishing-resistant.

## How It Works

### For Users

**Signing In with a Passkey:**
1. Visit the sign-in page
2. Click "Sign In with Passkey"
3. Use your device's biometric authentication or security key
4. You're instantly signed in!

**Adding a Passkey to Your Account:**
1. Sign in using any method (Google, Magic Link, or existing Passkey)
2. Click your profile icon in the top right
3. Click "Add Passkey"
4. Give it a name (optional, e.g., "My iPhone")
5. Follow your device's prompts to register the passkey

### Browser Support

Passkeys work on:
- ✅ Chrome/Edge (Windows, Mac, Android, iOS)
- ✅ Safari (Mac, iOS)
- ✅ Firefox (Windows, Mac)
- ✅ Most modern mobile browsers

## Technical Details

### Components Created

1. **`SignInWithPasskey`** (`src/app/(auth)/sign-in/sign-in-with-passkey.tsx`)
   - Client component for passkey sign-in
   - Handles WebAuthn authentication flow
   - Shows loading states and error messages

2. **`AddPasskeyButton`** (`src/components/add-passkey-button.tsx`)
   - Client component for registering new passkeys
   - Includes dialog for naming passkeys
   - Integrated into user profile menu

### Configuration

**Server Config** (`src/server/auth/config.ts`):
```typescript
passkey({
  rpID: env.NODE_ENV === "production" 
    ? new URL(env.NEXT_PUBLIC_DEPLOY_URL).hostname 
    : "localhost",
  rpName: "QR Program Manager",
  origin: env.NEXT_PUBLIC_DEPLOY_URL,
})
```

**Client Config** (`src/lib/auth-client.ts`):
```typescript
plugins: [magicLinkClient(), passkeyClient()]
```

### Database Schema

New `passkey` table stores:
- Credential ID (unique identifier)
- Public key (for verification)
- Counter (prevents replay attacks)
- Device type and metadata
- User association

## Security Considerations

### Why Passkeys are Secure

1. **Phishing-Resistant**: Passkeys are bound to your domain and can't be used on fake sites
2. **No Shared Secrets**: Private keys never leave the user's device
3. **Unique Per Site**: Each site gets a unique key pair
4. **Biometric Protection**: Often protected by device biometrics

### Best Practices

1. **HTTPS Required**: Passkeys only work over HTTPS (except localhost for testing)
2. **Domain Binding**: Make sure `rpID` matches your domain
3. **User Communication**: Educate users about passkey benefits
4. **Fallback Methods**: Always provide alternative sign-in methods

## Testing

### Local Development

1. Start your dev server: `bun dev`
2. Visit `http://localhost:3000/sign-in`
3. Try signing in with a passkey (will use browser's test authenticator)
4. Sign in with another method, then add a passkey

### Production

1. Ensure `NEXT_PUBLIC_DEPLOY_URL` is set correctly
2. Verify HTTPS is enabled
3. Test on multiple devices and browsers
4. Check that `rpID` matches your domain hostname

## Common Issues

### "Passkey not supported"
- Update to a modern browser version
- Check if WebAuthn is disabled in browser settings

### "Registration failed"
- Verify HTTPS is enabled (required in production)
- Check browser console for detailed errors
- Ensure `rpID` matches your domain

### "Could not verify passkey"
- User may be on a different device
- Passkey might have been deleted from device
- Try removing and re-registering the passkey

## User Experience Tips

### When to Prompt Users

- After successful first sign-in with another method
- On settings/profile page
- After significant account actions (with opt-in)

### Don't

- Force users to use passkeys
- Remove other sign-in methods
- Over-prompt users who have dismissed it

## Browser Autofill

Passkeys support conditional UI (autofill):
- Users see their passkeys in the email field autocomplete
- Click a passkey to sign in instantly
- No extra clicks needed

This is enabled by default in the `SignInWithPasskey` component with `autoFill: true`.

## Multi-Device Support

Users can:
- Register multiple passkeys (one per device)
- Name them for easy identification
- Use any registered passkey to sign in

## Migration Path for Existing Users

1. Users continue using current sign-in methods
2. After sign-in, they see "Add Passkey" option
3. They can gradually adopt passkeys at their own pace
4. No forced migration needed

## Analytics & Monitoring

Consider tracking:
- Passkey registration rate
- Passkey sign-in success rate
- Browser/device distribution
- User feedback on passkey UX

## Resources

- [WebAuthn Guide](https://webauthn.guide/)
- [Better Auth Passkey Docs](https://better-auth.com/docs/plugins/passkey)
- [SimpleWebAuthn](https://simplewebauthn.dev/) (underlying library)

## Support

If users have issues:
1. Check browser compatibility
2. Verify HTTPS is enabled
3. Try alternative sign-in methods
4. Contact support with browser/device details

