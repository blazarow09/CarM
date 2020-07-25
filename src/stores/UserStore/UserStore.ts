import AuthService, { IAuthContext } from '../../services/AuthService';
import { auth as firebaseAuth } from '../../firebase/firebaseConfig.dev';
import { observable, action, computed } from 'mobx';
import { IUserCredentials } from '../../components/Authentication/IUserCredentials';

export interface IUserStore {
    // Methods
    handleLogin(userCredentials: IUserCredentials): Promise<boolean>;
    handleRegister(userCredentials: IUserCredentials): Promise<boolean>;
    handleLogout(): Promise<void>;

    // Observables
    userContext: IAuthContext;
    setUserContext(): void;

    // Computed
    onAuthStateChanged: 'loggedIn' | 'pending' | 'notLoggedIn';
    // onAuthStateChanged: IAuthContext;
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

    // @action
    // public setUserContext(authContextResult?: IAuthContext): void {
    //     if (authContextResult) {
    //         this.userContext = authContextResult;
    //     } else {
    //         let authContext = this.onAuthStateChanged;

    //         // this.userContext = authContext;
    //     }
    // }

    public async handleLogin(userCredentials: IUserCredentials): Promise<boolean> {
        if (userCredentials) {
            try {
                let authContext = await this._authService.login(userCredentials);

                // if (authContext?.loggedIn) {
                //     this.setUserContext(authContext);

                //     return true;
                // }
            } catch (error) {
                console.log(error);
            }

            return true;
        }
    }

    public async handleLogout(): Promise<void> {
        // if (this.userContext?.loggedIn) {
            try {
                await this._authService.logout();

                // this.setUserContext();
            } catch (error) {
                console.log(error);
            }
        // }
    }

    public async handleRegister(userCredentials: IUserCredentials): Promise<boolean> {
        try {
            if (userCredentials) {
                let authContext = await this._authService.register(userCredentials);

                // if (authContext?.loggedIn) {
                //     this.setUserContext(authContext);

                //     return true;
                // }
            }
        } catch (error) {
            console.log(error);
        }

        return false;
    }

    //#region Computed properties
    // @computed
    // public get onAuthStateChanged(): 'loggedIn' | 'pending' | 'notLoggedIn' {
    //     console.log('Invoked onAuthStateChange');

    //     let auth: IAuthContext;

    //     let unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser): void => {
    //         auth = firebaseUser ? { loggedIn: 'loggedIn', email: firebaseUser?.email, userId: firebaseUser?.uid } : { loggedIn: 'notLoggedIn' };
    //     });

    //     console.log(auth);

    //     this.userContext = auth;

    //     if (!auth) {
    //         unsubscribe();
    //         return 'pending';
    //     }

    //     unsubscribe();
    //     return 'loggedIn';
    // }
    //#endregion
}
