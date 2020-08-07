import { firestore } from '../firebase/firebaseConfig.dev';
import { IUserSettingsCreateUpdate } from '../models/User/IUserSettingsCreateUpdate';
import { IUserSettingsView } from '../models/User/IUserSettingsView';

export default class UserService {
    private getUserSettingsCollectionRef() {
        return firestore.collection('users').doc(window.authContext?.userId).collection('userSettings');
    }

    public async getUserSettings(): Promise<IUserSettingsView> {
        const userSettingsRef = this.getUserSettingsCollectionRef();

        let userSettingsResult = await userSettingsRef.get();

        let userSettings = userSettingsResult?.docs?.pop()?.data();
        let userSettingsId = userSettingsResult?.docs?.pop()?.id;

        let userSettignsModel: IUserSettingsView = {
            uid: userSettingsId,
            language: userSettings?.language,
        };

        return userSettignsModel;
    }

    public async updateUserSettings(userSettingsId: string, userSettings: IUserSettingsCreateUpdate): Promise<void> {
        const userSettingsRef = this.getUserSettingsCollectionRef();

        await userSettingsRef.doc(userSettingsId).update(userSettings);
    }
}
