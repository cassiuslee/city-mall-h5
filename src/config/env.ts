export const env = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'city-mall-web',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  uploadUrl: import.meta.env.VITE_UPLOAD_URL || '',
  enableLog: import.meta.env.VITE_ENABLE_LOG === 'true',
  currentEnv: import.meta.env.VITE_ENV || 'development',
}

export default env
