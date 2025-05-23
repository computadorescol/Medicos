// Simple mock for useAuth. Replace with your real auth logic as needed.
export function useAuth() {
  // Example: get user from context or Firebase Auth
  return {
    user: {
      uid: 'mock-uid',
      displayName: 'Mock User',
    },
  };
}
