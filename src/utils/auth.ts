export const isTokenValid = (): boolean => {
  const token = sessionStorage.getItem('token')
  
  if (!token) return false
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    return payload.exp > currentTime
  } catch (error) {
    return false
  }
}

export const logout = (): void => {
  sessionStorage.removeItem('token')
  window.location.href = '/login'
}

export const checkAuthAndRedirect = () => {
  if (!isTokenValid()) {
    logout()
    return '/login'
  }
  return true
}