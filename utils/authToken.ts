// utils/authToken.ts
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth-token', token);
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth-token');
};


export const removeAuthToken = () => {
  localStorage.removeItem('auth-token');
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};