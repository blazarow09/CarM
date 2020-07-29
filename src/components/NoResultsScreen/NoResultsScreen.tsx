import * as React from 'react';
import { IonRow } from '@ionic/react';
import './NoVehicleScreen.css';
import logo from '../../img/icon.png';

interface NoResultsScreenProps {
    extraContent?: () => JSX.Element;
}

export default class NoResultsScreen extends React.Component<NoResultsScreenProps> {
    public render() {
        return (
            <>
                <IonRow className="c-no-res-screen c-center">
                    <img className="c-no-res-screen c-center c-img" src={logo} alt="carm logo" width="114px" height="114px" />
                    <br />
                    <p className="c-no-res-label">No results were found</p>
                    <br />
                    {this.props?.extraContent && this.props.extraContent()}
                </IonRow>
            </>
        );
    }
}
