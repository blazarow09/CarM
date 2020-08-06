import * as React from 'react';
import { IonIcon } from '@ionic/react';
import refuelIcon from '../../../img/icons/refuel-w.svg';
import IconBase from './IconBase';
import { build as repairIcon } from 'ionicons/icons';

interface RepairIconProps {
    className?: string;
}

export default class RepairIcon extends IconBase<RepairIconProps> {
    protected renderIcon(): JSX.Element {
        return (
            <IonIcon className="c-entry-icon" icon={repairIcon} />
        )
    }
}
