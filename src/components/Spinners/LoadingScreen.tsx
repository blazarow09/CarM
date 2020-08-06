import * as React from 'react';
import { IonRow, IonSpinner } from '@ionic/react';
import './LoadingScreen.css';

interface LoadingScreenProps {
    iconColor: string
}

export default class LoadingScreen extends React.Component<LoadingScreenProps> {
    public render() {
        return (
            <IonRow className="c-loading-screen">
                <IonSpinner className="c-center-loading" name="crescent" color={this.props.iconColor} />
            </IonRow>
        );
    }
}
