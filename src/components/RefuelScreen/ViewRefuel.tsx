import * as React from 'react';
import MainHeader from '../MainHeader/MainHeader';
import { GlobalColors } from '../../models/Constants/GlobalColors';
import { IonPage, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonIcon, IonRow, IonCol } from '@ionic/react';
import { AppRoutes } from '../AppRoutes';
import { IVehicleStore } from '../../stores/VehicleStore/VehicleStore';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../../stores/UserStore/UserStore';
import { calendarOutline as dateIcon, chevronBackOutline as backIcon, chevronForwardOutline as nextIcon } from 'ionicons/icons';
import './ViewRefuel.css';

interface ViewRefuelProps {
    vehicleStore?: IVehicleStore;
    userStore?: IUserStore;
}

@inject('vehicleStore')
@inject('userStore')
@observer
export default class ViewRefuel extends React.Component<ViewRefuelProps> {
    public async componentDidMount(): Promise<void> {
        this.props.userStore.setHideTabsMenu(true);
    }

    public componentWillUnmount(): void {
        this.props.userStore.setHideTabsMenu(false);
    }

    public render() {
        return (
            <IonPage>
                <MainHeader toolbarColor={GlobalColors.purpleColor} title="Refuel details" extraContent={this.extraContent} />
                <IonContent>
                    <IonItem className="c-background-tab" lines="none">
                        <IonRow className="c-date-content">
                            <IonCol size="2" className="c-button-click-effect" ion-align-items-start>
                                <IonIcon icon={backIcon} onClick={() => console.log('previous')} />
                            </IonCol>
                            <IonCol size="8" className="c-date-info">
                                <IonIcon icon={dateIcon} size="small" />
                                <span>19 Aug 2020 - 19:45</span>
                            </IonCol>
                            <IonCol size="2" ion-align-items-end className="c-button-click-effect">
                                <IonIcon icon={nextIcon} />
                            </IonCol>
                        </IonRow>
                    </IonItem>
                    <IonItem className="c-background-tab c-space-between" lines="none">
                        <IonRow className="">

                        </IonRow>
                    </IonItem>
                </IonContent>
            </IonPage>
        );
    }

    private extraContent = (): JSX.Element => {
        return (
            <IonButtons slot="start">
                <IonBackButton defaultHref={AppRoutes.homeRoute} />
            </IonButtons>
        );
    };
}
