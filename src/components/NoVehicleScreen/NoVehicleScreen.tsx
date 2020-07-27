import * as React from 'react';
import { IonRow, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import './NoVehicleScreen.css';
import logo from '../../img/icon.png';
import { add as addIcon } from 'ionicons/icons';
import { IUiStore, Modals } from '../../stores/UiStore/UiStore';
import { inject, observer } from 'mobx-react';

interface NoVehicleScreenProps {
    uiStore?: IUiStore;
}

@inject('uiStore')
@observer
export default class NoVehicleScreen extends React.Component<NoVehicleScreenProps> {
    public render() {
        return (
            <>
                <IonRow className="c-no-res-screen c-center">
                    <img className="c-no-res-screen c-center c-img" src={logo} alt="carm logo" width="114px" height="114px" />
                    <br />
                    <p className="c-no-res-label">No results were found</p>
                    <br />
                    <IonFab horizontal="center" className="c-fab">
                        <IonFabButton color="light" onClick={(): void => this.props.uiStore.openCloseModal(Modals.AddCarModal, 'open')}>
                            <IonIcon icon={addIcon} />
                        </IonFabButton>
                    </IonFab>
                </IonRow>
            </>
        );
    }
}
