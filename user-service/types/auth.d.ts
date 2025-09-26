import { JwtPayload } from "jsonwebtoken"

export interface AuthTokenPayload extends JwtPayload {
    _id: string
    email: string
    sessionId: string
}

declare global {
    namespace Express {
        interface Request {
            user: AuthTokenPayload
        }
    }
}
