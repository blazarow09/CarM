import * as React from 'react';
import { IonPage, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/react';
import { settingsOutline as settingsIcon, exitOutline as exitIcon } from 'ionicons/icons';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { observer, inject } from 'mobx-react';
import MainHeader from '../MainHeader/MainHeader';

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

    private async logout(): Promise<void> {
        await this.props.userStore.handleLogout();
    }

    public render() {
        return (
            <IonPage>
                <MainHeader title="Home" extraContent={this.extraContent} />
                <IonContent></IonContent>
            </IonPage>
        );
    }

    private extraContent = (): JSX.Element => {
        return (
            <IonButtons slot="end">
                <IonButton>
                    <IonIcon icon={settingsIcon} slot="icon-only" />
                </IonButton>
                <IonButton onClick={async (): Promise<void> => await this.logout()}>
                    <IonIcon icon={exitIcon} slot="icon-only" />
                </IonButton>
            </IonButtons>
        );
    };
}
