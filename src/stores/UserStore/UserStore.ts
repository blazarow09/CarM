import AuthService, { IAuthContext } from '../../services/AuthService';
import { observable } from 'mobx';
import { IUserCredentials } from '../../components/Authentication/IUserCredentials';

export interface IUserStore {
    // Methods
    handleLogin(userCredentials: IUserCredentials): Promise<boolean>;
    handleRegister(userCredentials: IUserCredentials): Promise<boolean>;
    handleLogout(): Promise<void>;

    // Observables
    userContext: IAuthContext;
}

export class UserStore implements UserStore {
    //#region Services
    private _authService: AuthService;
    //#endregion

    //#region Observables initialization
    @observable public userContext: IAuthContext = null;
    //#endregion

    public constructor(authService: AuthService) {
        this._authService = authService;
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
