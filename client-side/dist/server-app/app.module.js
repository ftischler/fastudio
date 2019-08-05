"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const ng_universal_1 = require("@nestjs/ng-universal");
const path_1 = require("path");
const auth_controller_1 = require("./src/auth/auth.controller");
const BROWSER_DIR = path_1.join(process.cwd(), 'dist/browser');
ng_universal_1.applyDomino(global, path_1.join(BROWSER_DIR, 'index.html'));
let ApplicationModule = class ApplicationModule {
};
ApplicationModule = __decorate([
    common_1.Module({
        imports: [
            ng_universal_1.AngularUniversalModule.forRoot({
                viewsPath: BROWSER_DIR,
                bundle: require('../server/main'),
                liveReload: true
            })
        ],
        controllers: [auth_controller_1.AuthController]
    })
], ApplicationModule);
exports.ApplicationModule = ApplicationModule;
//# sourceMappingURL=app.module.js.map