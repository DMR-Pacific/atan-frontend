import axios, { AxiosResponse } from "axios"
import { dmrpacific_api } from "@/axios/Axios"
import AuthService from "./AuthService"

let isCalled = false
let runningRefreshPromise: Promise<any> | undefined = undefined //Promise.reject(new Error("This is a false error"))

export const RefreshTokenService = {
    
    refreshToken: async () => {

        // Check if call to refresh token has already been made
        if (isCalled) {
            console.log("-------- AWAITING PREVIOUSLY MADE REFRESH PROMISE ------------")
            return runningRefreshPromise
        } else {
                console.log("++++++ REFRESHING TOKEN ++++++")

                // Set property to true to prevent multiple requests to refresh token
                isCalled = true

                // Send request to server
                runningRefreshPromise = RefreshTokenService.sendRefreshRequestToServer({refreshToken:String(localStorage.getItem("refreshToken"))})
                .finally(() => {
                    // Once request has been handled, reset isCalled and runningRefreshPromise to allow for a refresh later
                    isCalled = false
                    runningRefreshPromise = undefined
                })

                return runningRefreshPromise
        }
    },

    sendRefreshRequestToServer: (tokenRefreshRequest: TokenRefreshRequest) => {
        
        return dmrpacific_api.post("/api/1.0/auth/refreshtoken", tokenRefreshRequest)

    }

}