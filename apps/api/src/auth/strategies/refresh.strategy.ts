import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AuthService } from "../auth.service";
import refreshConfig from "../config/refresh.config";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor(@Inject(refreshConfig.KEY) private config: ConfigType<typeof refreshConfig>, private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
            secretOrKey: config.secret,
            ignoreExpiration: false,
        });
    }

    validate(payload: any) {
        const id = payload.sub;
        return this.authService.validateRefresh(id);
    }
}