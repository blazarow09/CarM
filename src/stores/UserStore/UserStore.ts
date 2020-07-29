import AuthService, { IAuthContext } from '../../services/AuthService';
import { observable, action } from 'mobx';
import { IUserCredentials } from '../../components/Authentication/IUserCredentials';

export interface IUserStore {
    // Methods
    handleLogin(userCredentials: IUserCredentials): Promise<boolean>;
    handleRegister(userCredentials: IUserCredentials): Promise<boolean>;
    handleLogout(): Promise<void>;
    setUserContext(userId: string): void;
    setHideTabsMenu(hide: boolean): void;

    // Observables
    userContext: IAuthContext;
    hideTabsMenu: boolean;
}

export class UserStore implements IUserStore {
    //#region Services
    private _authService: AuthService;
    //#endregion

    //#region Observables initialization
    @observable public userContext: IAuthContext = null;
    @observable public hideTabsMenu: boolean = false;
    //#endregion

    public constructor(authService: AuthService) {
        this._authService = authService;
    }

    @action
    public setUserContext(userId: string): void {
        this.userContext = { userId: userId, loggedIn: true };
    }

    public async handleLogin(userCredentials: IUserCredentials): Promise<boolean> {
        if (userCredentials) {
            try {
                let authContext = await this._authService.login(userCredentials);
            } catch (error) {
                console.log(error);
            }

            return true;
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
                let authContext = await this._authService.register(userCredentials);
            }
        } catch (error) {
            console.log(error);
        }

        return false;
    }

   
}
