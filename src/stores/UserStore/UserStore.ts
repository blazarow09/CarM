import AuthService, { IAuthContext } from '../../services/AuthService';
import { auth as firebaseAuth } from '../../firebase/firebaseConfig.dev';
import { observable, action, computed } from 'mobx';
import { IUserCredentials } from '../../components/Authentication/IUserCredentials';

export interface IUserStore {
    // Methods
    handleLogin(userCredentials: IUserCredentials): Promise<void>;
    handleRegister(userCredentials: IUserCredentials): Promise<void>;

    // Observables
    userContext: IAuthContext;
    setUserContext(): void;

    // Computed
    onAuthStateChanged: firebase.Unsubscribe;
}

export class UserStore implements UserStore {
    //#region Services
    private _authService: AuthService;
    //#endregion

    //#region Observables initialization
    @observable public userContext: IAuthContext = { loggedIn: false };
    //#endregion

    public constructor(authService: AuthService) {
        this._authService = authService;
    }

    @action
    public setUserContext(authContextResult?: IAuthContext): void {
        if (authContextResult) {
            this.userContext = authContextResult;
        } else {
            let authContext = this.onAuthStateChanged;

            this.userContext = authContext;
        }
    }

    public async handleLogin(userCredentials: IUserCredentials): Promise<void> {
        if (userCredentials) {
            let authContext = await this._authService.login(userCredentials);

            if (authContext?.loggedIn) {
                this.setUserContext(authContext);
            }
        }
    }

    public async handleRegister(userCredentials: IUserCredentials): Promise<void> {
        if (userCredentials) {
            let authContext = await this._authService.register(userCredentials);

            if (authContext?.loggedIn) {
                this.setUserContext(authContext);
            }
        }
    }

    //#region Computed properties
    @computed
    public get onAuthStateChanged(): IAuthContext {
        let auth: IAuthContext;

        firebaseAuth.onAuthStateChanged((firebaseUser): void => {
            auth = firebaseUser ? { loggedIn: true, email: firebaseUser?.email, userId: firebaseUser?.uid } : { loggedIn: false };
        });

        if (!auth) {
            return { loggedIn: false };
        }

        return auth;
    }
    //#endregion
}
