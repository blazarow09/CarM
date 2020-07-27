import * as React from 'react';
import { IUiStore } from '../../stores/UiStore/UiStore';
import { inject, observer } from 'mobx-react';
import AddVehicle from './AddVehicle/AddVehicle';
import AddRepair from './AddRepair/AddRepair';

interface ModalsContainerProps {
    uiStore?: IUiStore;
}

@inject('uiStore')
@observer
export default class ModalsContainer extends React.Component<ModalsContainerProps> {
    public render() {
        return (
            <div>
                {this.props.uiStore.modals.addCarModal && <AddVehicle />}
                {this.props.uiStore.modals.addRepairModal && <AddRepair />}
            </div>
        );
    }
}
