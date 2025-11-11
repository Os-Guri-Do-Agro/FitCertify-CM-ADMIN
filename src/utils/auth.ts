export enum SubRole {
  INFLUENCE = 'influence',
  FINANCEIRO = 'financeiro',
  MARKETING = 'marketing',
  ADMIN = 'admin',
  ORGANIZADOR = 'organizador',
  BLOG = 'blog',
  MARKETPLACE = 'marketplace',
}

const getPayload = () => {
  const token = sessionStorage.getItem('token')
  if (!token) return null

  try {
    const base64 = token.split('.')[1]
    const jsonPayloadInfoUser = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayloadInfoUser)
    return payload
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getUserRole = (): SubRole | null => {
  const payload = getPayload()
  return payload?.subRole || null
}

export const getInfoUser = () => {
  const payload = getPayload()
  return payload
}
export const getSubRole = () => {
  const payload = getPayload()
  return payload.subRole
}

export const hasRole = (role: SubRole): boolean => {
  const userRole = getUserRole()
  return userRole === role
}

export const hasAnyRole = (roles: SubRole[]): boolean => {
  const userRole = getUserRole()
  return userRole ? roles.includes(userRole) : false
}

export const isTokenValid = (): boolean => {
  const token = sessionStorage.getItem('token')

  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)

    return payload.exp > currentTime
  } catch (error) {
    console.log(error)
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

export const canAccessRoute = (allowedRoles: SubRole[]): boolean => {
  return isTokenValid() && hasAnyRole(allowedRoles)
}
