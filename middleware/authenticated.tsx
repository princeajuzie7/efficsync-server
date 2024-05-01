import { isTokenValid, attachCookiesToResponse } from "../utils/jwt"
import { Request, Response, NextFunction } from "express";
import TokenSchema from "../models/TokenModel"
import { BadRequestError, UnAuthorized } from "../errors";

export async function authenticated(req: Request |any, res: Response, next: NextFunction) {
    const { refreshToken, accessToken }: { refreshToken:string, accessToken:string } =
        req.signedCookies;
    
    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken);
            req.user = payload.user;
            return next();
        }
        const payload = isTokenValid(refreshToken);

        const existingToken = await TokenSchema.findOne({
          user: payload.user.userId,
          refreshToken: payload.refreshToken,
        });
        
        if (!existingToken || !existingToken?.$isValid) {
            throw new UnAuthorized('Authentication invalid');
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken,
        })
        req.user = payload.user;
        
    } catch (error) {
        throw new UnAuthorized("Authentication invalid");
    }
 
}
