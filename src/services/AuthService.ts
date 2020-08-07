import { auth as firebaseAuth } from '../firebase/firebaseConfig.dev';
import { IUserCredentials } from '../components/Authentication/IUserCredentials';
import { firestore } from '../firebase/firebaseConfig.dev';
import { IUserSettings } from '../models/User/IUserSettings';

export interface IAuthContext {
    loggedIn: boolean;
    email?: string;
    userId?: string;
}

export default class AuthService {
    public async login(userCredentials: IUserCredentials): Promise<void> {
        if (userCredentials.email && userCredentials.password) {
            try {
                let result = await firebaseAuth.signInWithEmailAndPassword(userCredentials.email, userCredentials.password);
                console.log('auth service register')
            } catch (error) {
                console.log(error);
            }
        }
    }

    public async register(userCredentials: IUserCredentials): Promise<void> {
        if (userCredentials.email && userCredentials.password && userCredentials.confirmPassword) {
            if (userCredentials.password === userCredentials.confirmPassword) {
                try {
                    let result = await firebaseAuth.createUserWithEmailAndPassword(userCredentials.email, userCredentials.password);

                    if (result?.user?.uid) {
                        await this.seedDefaultValues(result.user.uid);
                    }
                    console.log('auth service register')
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    public async logout(): Promise<void> {
        await firebaseAuth.signOut();

        window.authContext = null;
    }

    private getUserSettingsCollectionRef(userId: string) {
        return firestore.collection('users').doc(userId).collection('userSettings');
    }

    private async seedDefaultValues(userId: string): Promise<void> {
        const userSettingsRef = this.getUserSettingsCollectionRef(userId);

        const defaultUserSettings: IUserSettings = {
            language: 'EN'
        }

        await userSettingsRef.add(defaultUserSettings);
    }
}
