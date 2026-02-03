'use client'

import AuthService from "@/services/AuthService";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, createContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
    // isAuthenticated is set to a string value so dynamic rendering can rely on more than just true/false
    isAuthenticated: UserStates | undefined, 
    login: (jwtAuthResponse: JWTAuthResponse) => Promise<void>,
    logout: () => void,
}

export enum UserStates {
    AUTHENTICATED,
    UNAUTHENTICATED,
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const getSessionUsername = () => {
    return localStorage.getItem("username")
}

export const AuthProvider = ({children} : {children : ReactNode}) => {
    const router = useRouter()

    const [isAuthenticated, setIsAuthenticated] = useState<UserStates>()
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            setIsAuthenticated(UserStates.UNAUTHENTICATED)
        } else {

            setIsAuthenticated(UserStates.AUTHENTICATED)

        }
    }, [])

    const login = async (jwtAuthResponse: JWTAuthResponse) => {

        localStorage.setItem('accessToken', jwtAuthResponse.accessToken)
        localStorage.setItem('tokenType', jwtAuthResponse.tokenType)
        localStorage.setItem('refreshToken', jwtAuthResponse.refreshToken)
        localStorage.setItem('username', jwtAuthResponse.username)
        localStorage.setItem('email', jwtAuthResponse.email)
        localStorage.setItem('isVerifiedEmail', String(jwtAuthResponse.isVerifiedEmail))
        localStorage.setItem('roles', String(jwtAuthResponse.roles))
        localStorage.setItem('expiration', String(jwtAuthResponse.expiration))

        setIsAuthenticated(UserStates.AUTHENTICATED)
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('tokenType')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('username')
        localStorage.removeItem('email')
        localStorage.removeItem('isVerifiedEmail')
        localStorage.removeItem('roles')
        localStorage.removeItem('expiration')
        setIsAuthenticated(UserStates.UNAUTHENTICATED)
    }

    return (
    <AuthContext.Provider value={{isAuthenticated, login, logout}}>
        {children}
    </AuthContext.Provider>)
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")

    }

    return context
}