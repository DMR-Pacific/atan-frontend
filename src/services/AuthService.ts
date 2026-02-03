import { dmrpacific_api } from "@/axios/Axios"
import { RegisterDto } from "@/types/RegisterDto"
import { Dispatch } from "react"

const AuthService = {



    signin: (loginDto: LoginDto) => {
        return dmrpacific_api.post("/api/1.0/auth/signin", loginDto)
    },

    register: (regDto: RegisterDto) => {
        return dmrpacific_api.post("/api/1.0/register/apply", regDto)

    },


    // ////////////////////////////////////


    // ////////////////////////////////////





// ////////////////////////////////////////

    setUserSession : (jwtAuthResponse: JWTAuthResponse) => {

        localStorage.setItem('accessToken', jwtAuthResponse.accessToken)
        localStorage.setItem('tokenType', jwtAuthResponse.tokenType)
        localStorage.setItem('refreshToken', jwtAuthResponse.refreshToken)
        localStorage.setItem('expiration', String(jwtAuthResponse.expiration))


    },
    checkIsLoggedIn: () => {
    
        // Logged in is based on if accessToken, refresToken, username, and user roles have been set in local storage
        console.log("Checking logged in")
       console.log(localStorage.getItem("accessToken"))
       console.log(localStorage.getItem("refreshToken"))
       console.log(localStorage.getItem("username"))
       console.log(localStorage.getItem("userRoles"))

    },

    getSessionUsername: () => {
        localStorage.getItem('username')
    },
    // logout: (dispatch: any) => {
    //     dispatch({type: 'set', isAuthenticated: false})
    // },

    clearUserSession: () => {
        localStorage.getItem("")
        localStorage.getItem("")
        localStorage.getItem("")
        localStorage.getItem("")
    },


}

export default AuthService