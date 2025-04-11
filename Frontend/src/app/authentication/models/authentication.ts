export interface RegistrationRequest {
    username: string,
    password: string,
    email: string
}

export interface LoginRequest {
    username: string,
    password: string
}

export interface RefreshRequest {
    accessToken: string,
    refreshToken: string
}

export interface AuthenticationResponse {
    expirationDate: string,
    jwtToken: string,
    refreshToken: string,
    userId: string
}
