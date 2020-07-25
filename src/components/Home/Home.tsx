import * as React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
} from '@ionic/react';
import { settingsOutline as settingsIcon, exitOutline as exitIcon} from 'ionicons/icons';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { observer, inject } from 'mobx-react';

interface HomeProps {
    userStore?: IUserStore;
}

@inject('userStore')
@observer
export default class Home extends React.Component<HomeProps> {
    private toggleTheme(checked: boolean): void {
        if (!checked) {
            document.body.classList.toggle('dark', checked);
        } else {
            document.body.classList.toggle('dark', checked);
        }
    }

    private async logout (): Promise<void> {
        await this.props.userStore.handleLogout();

    }

    public render() {        
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="secondary">
                        <IonButtons slot="end">
                            <IonButton>
                                <IonIcon icon={settingsIcon} slot="icon-only" />
                            </IonButton>
                            <IonButton onClick={async (): Promise<void> => await this.logout()}>
                                <IonIcon icon={exitIcon} slot="icon-only" />
                            </IonButton>
                        </IonButtons>
                        <IonTitle>Home</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {/* <IonItem>
                        <IonLabel>Checked:</IonLabel>
                        <IonToggle onIonChange={(e) => this.toggleTheme(e.detail.checked)} />
                    </IonItem> */}
                </IonContent>
            </IonPage>
        );
    }
}
