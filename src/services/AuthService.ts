import { auth as firebaseAuth } from '../firebase/firebaseConfig.dev';
import { IUserCredentials } from '../components/Authentication/IUserCredentials';
import { firestore } from '../firebase/firebaseConfig.dev';
import { IUserSettingsCreateUpdate } from '../models/User/IUserSettingsCreateUpdate';

export interface IAuthContext {
    loggedIn: boolean;
    email?: string;
    userId?: string;
}

export default class AuthService {
    private getUserSettingsCollectionRef(userId: string) {
        return firestore.collection('users').doc(userId).collection('userSettings');
    }

    public async login(userCredentials: IUserCredentials): Promise<boolean> {
        if (userCredentials.email && userCredentials.password) {
            try {
                let result = await firebaseAuth.signInWithEmailAndPassword(userCredentials.email, userCredentials.password);

                if (result.user.uid) {
                    return true;
                }
            } catch (error) {
                if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
                    return false;
                }
            }
        }
    }

    public async register(userCredentials: IUserCredentials): Promise<boolean> {
        if (userCredentials?.email && userCredentials?.password === userCredentials?.confirmPassword) {
            try {
                let result = await firebaseAuth.createUserWithEmailAndPassword(userCredentials.email, userCredentials.password);

                if (result?.user?.uid) {
                    await this.seedDefaultValues(result.user.uid);

                    return true;
                }
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    public async logout(): Promise<void> {
        await firebaseAuth.signOut();

        window.authContext = null;
    }

    private async seedDefaultValues(userId: string): Promise<void> {
        const userSettingsRef = this.getUserSettingsCollectionRef(userId);

        const defaultUserSettings: IUserSettingsCreateUpdate = {
            language: 'EN',
        };

        await userSettingsRef.add(defaultUserSettings);
    }
}
