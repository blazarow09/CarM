import { auth as firebaseAuth } from '../firebase/firebaseConfig.dev';
import { IUserCredentials } from '../components/Authentication/IUserCredentials';

export interface IAuthContext {
    loggedIn: boolean;
    email?: string;
    userId?: string;
}

export default class AuthService {
    public async login(userCredentials: IUserCredentials): Promise<IAuthContext> {
        if (userCredentials.email && userCredentials.password) {
            try {
                let result = await firebaseAuth.signInWithEmailAndPassword(userCredentials.email, userCredentials.password);

                if (result) {
                    return { loggedIn: true, email: result?.user.email, userId: result?.user.uid };
                }
            } catch (error) {
                console.log(error);
            }

            return { loggedIn: false };
        }
    }

    public async register(userCredentials: IUserCredentials): Promise<IAuthContext> {
        if (userCredentials.email && userCredentials.password && userCredentials.confirmPassword) {
            if (userCredentials.password == userCredentials.confirmPassword) {
                try {
                    let result = await firebaseAuth.createUserWithEmailAndPassword(userCredentials.email, userCredentials.password);

                    if (result.additionalUserInfo.isNewUser) {
                        return { loggedIn: true, email: result?.user.email, userId: result?.user.uid };
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            return { loggedIn: false };
        }
    }

    public async logout(): Promise<void> {
        await firebaseAuth.signOut();
    }
}
