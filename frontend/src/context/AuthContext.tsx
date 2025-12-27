import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('gearguard_user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const login = async (email: string, password: string) => {
    // Simulate API call
    // In a real app, you would validate credentials with your backend
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // For demo purposes, accept any valid email/password
    const userData = {
      name: email.split('@')[0],
      email: email
    }
    
    setUser(userData)
    localStorage.setItem('gearguard_user', JSON.stringify(userData))
  }

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    // In a real app, you would create user account with your backend
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userData = {
      name: name,
      email: email
    }
    
    setUser(userData)
    localStorage.setItem('gearguard_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('gearguard_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
