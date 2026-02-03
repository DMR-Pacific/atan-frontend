import axios from 'axios'   
import AuthService from '@/services/AuthService'
import { RefreshTokenService } from '@/services/RefreshTokenService'
import { redirect } from 'next/navigation'

export const dmrpacific_api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_DMRPACIFIC_API_URL}`,
    responseType: "json"
})

export const atlas_api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_ATLAS_API_URL}`,
    responseType: "json"
})


export const atlas_api_authorized = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_ATLAS_API_URL}`,
    responseType: "json"
})



export const dmrpacific_api_authorized = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_DMRPACIFIC_API_URL}`,
    responseType: "json"
})


atlas_api_authorized.interceptors.request.use(async request => {

    // Check if access token is expired
    let expiration = new Date(String(localStorage.getItem("expiration")))

    // if not expired attach current refresh token to header
    if (!(new Date() > expiration)) {
        request.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`

    
    //
    } else {
        try {
            const response = await RefreshTokenService.refreshToken()

            // Successfully refreshed token
            if (response.status == 200) {
                console.log("+++++ SUCCESSFULLY REFRESHED TOKEN +++++")
                // Set renewed session properties
                AuthService.setUserSession(response.data)

                request.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`

            }
        } catch (err) {

            console.log("+++++ FAILED TO REFRESHED TOKEN +++++")
            console.log(err)
            if (axios.isAxiosError(err)) {
                if (err.status == 403) {
                    window.location.href = "/atan/signin"
                    redirect('/signin')
                }
            }
        }


    } 

    return request
})
