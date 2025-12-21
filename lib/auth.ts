export const saveToken = (token: string) => {
  localStorage.setItem("token", token)
}

export const getToken = () => {
  return localStorage.getItem("token")
}

export const logout = () => {
  localStorage.removeItem("token")
}

export const isAuthenticated = () => {
  const token = getToken()
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp > currentTime
  } catch {
    return false
  }
}

export const getUserFromToken = () => {
  const token = getToken()
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { id: payload.id, role: payload.role }
  } catch {
    return null
  }
}
