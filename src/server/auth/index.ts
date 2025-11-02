import { auth } from "./config";

export { auth };

// Export common helpers that may be used in the app
export const getSession = auth.api.getSession;
export const signOut = auth.api.signOut;
