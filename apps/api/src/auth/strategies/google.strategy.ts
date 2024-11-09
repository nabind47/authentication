import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

import { AuthService } from "../auth.service";
import googleConfig from "../config/google.config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(googleConfig.KEY) private config: ConfigType<typeof googleConfig>, private authService: AuthService) {
        super({
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackUrl,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const user = await this.authService.validateGoogleUser({
            email: profile.emails[0].value,
            name: profile.displayName,
            password: '',
        });
        done(null, user);
    }
}