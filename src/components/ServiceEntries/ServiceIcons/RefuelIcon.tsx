import * as React from 'react';
import { IonIcon } from '@ionic/react';
import refuelIcon from '../../../img/icons/refuel-w.svg';
import IconBase from './IconBase';

interface RefuelIconProps {
    className: string;
}

export default class RefuelIcon extends IconBase<RefuelIconProps> {
    protected renderIcon(): JSX.Element {
        return (
            <IonIcon className="c-entry-icon" icon={refuelIcon} />
        )
    }
}
