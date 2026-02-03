interface JWTAuthResponse {
    accessToken: string,
    tokenType: string,
    refreshToken: string,
    username: string,
    email: string,
    isVerifiedEmail: boolean,
    roles: string[]
    expiration: Date,
}