import AuthService, { IAuthContext } from '../../services/AuthService';
import { observable, action } from 'mobx';
import { IUserCredentials } from '../../components/Authentication/IUserCredentials';
import { IUserSettings } from '../../models/User/IUserSettings';
import UserService from '../../services/UserService';

export interface IUserStore {
    // Methods

    // Auth
    handleLogin(userCredentials: IUserCredentials): Promise<boolean | string>;
    handleRegister(userCredentials: IUserCredentials): Promise<boolean>;
    handleLogout(): Promise<void>;

    setUserContext(userId: string): void;
    setHideTabsMenu(hide: boolean): void;

    // User Settings
    getUserSettings(): Promise<void>;
    updateUserSettings(userSettingsModel: IUserSettings): Promise<void>;

    // Observables
    userContext: IAuthContext;
    hideTabsMenu: boolean;

    userSettings: IUserSettings;
}

export class UserStore implements IUserStore {
    //#region Services
    private _authService: AuthService;
    private _userService: UserService;
    //#endregion

    //#region Observables initialization
    @observable public userContext: IAuthContext = null;
    @observable public hideTabsMenu: boolean = false;
    @observable public userSettings: IUserSettings = null;
    //#endregion

    public constructor(authService: AuthService, userService: UserService) {
        this._authService = authService;
        this._userService = userService;
    }

    @action
    public async getUserSettings(): Promise<void> {
        let userSettings = await this._userService.getUserSettings();

        if (userSettings) {
            this.userSettings = userSettings;
        }
    }

    public async updateUserSettings(userSettingsModel: IUserSettings): Promise<void> {
        await this._userService.updateUserSettings(this.userSettings?.uid, userSettingsModel);

        await this.getUserSettings();
    }

    @action
    public setUserContext(userId: string): void {
        this.userContext = { userId: userId, loggedIn: true };
    }

    public async handleLogin(userCredentials: IUserCredentials): Promise<boolean | string> {
        if (userCredentials) {
            try {
                let authResult = await this._authService.login(userCredentials);

                return authResult;
            } catch (error) {
                console.log(error);
            }

            return false;
        }
    }

    @action
    public setHideTabsMenu(hide: boolean): void {
        this.hideTabsMenu = hide;
    }

    public async handleLogout(): Promise<void> {
        try {
            await this._authService.logout();
        } catch (error) {
            console.log(error);
        }
    }

    public async handleRegister(userCredentials: IUserCredentials): Promise<boolean> {
        try {
            if (userCredentials) {
                let authResult = await this._authService.register(userCredentials);

                return authResult;
            }
        } catch (error) {
            console.log(error);
        }

        return false;
    }
}
