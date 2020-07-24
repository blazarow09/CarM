import { IonApp, IonContent, IonHeader, IonTitle, IonToolbar, IonLoading } from '@ionic/react';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../stores/UserStore/UserStore';
import AppRouter from './AppRouter';

interface AppProps {
    userStore?: IUserStore;
}

@inject('userStore')
@observer
export default class App extends React.Component<AppProps> {
    public async componentDidMount(): Promise<void> {
        this.props.userStore.setUserContext();
    }

    public render() {
        // if (this.props.userStore?.userContext?.loggedIn) {
        //     return <IonLoading isOpen />;
        // }

        return (
            <IonApp className="ion-padding">
                <AppRouter />
                {/* <IonHeader>
                    <IonToolbar>
                        <IonTitle>My App</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">Add some content here…</IonContent> */}
            </IonApp>
        );
    }
}
