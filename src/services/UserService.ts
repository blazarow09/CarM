import { firestore } from '../firebase/firebaseConfig.dev';
import { IUserSettings } from '../models/User/IUserSettings';

export default class UserService {
    private getUserSettingsCollectionRef() {
        return firestore.collection('users').doc(window.authContext?.userId).collection('userSettings');
    }

    public async getUserSettings(): Promise<IUserSettings> {
        const userSettingsRef = this.getUserSettingsCollectionRef();

        let userSettingsResult = await userSettingsRef.get();

        let userSettings = userSettingsResult?.docs?.pop()?.data();
        let userSettingsId = userSettingsResult?.docs?.pop()?.id;

        let userSettignsModel: IUserSettings = {
            uid: userSettingsId,
            language: userSettings?.language,
        };

        return userSettignsModel;
    }

    public async updateUserSettings(userSettingsId: string, userSettings: IUserSettings): Promise<void> {
        const userSettingsRef = this.getUserSettingsCollectionRef();

        await userSettingsRef.doc(userSettingsId).update(userSettings);
    }
}
