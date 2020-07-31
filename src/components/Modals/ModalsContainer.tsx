import * as React from 'react';
import { IUiStore } from '../../stores/UiStore/UiStore';
import { inject, observer } from 'mobx-react';
import RepairModal from './RepairModal/RepairModal';
import RefuelModal from './RefuelModal/RefuelModal';
import VehicleModal from './VehicleModal/VehicleModal';

interface ModalsContainerProps {
    uiStore?: IUiStore;
}

@inject('uiStore')
@observer
export default class ModalsContainer extends React.Component<ModalsContainerProps> {
    public render() {
        return (
            <div>
                {this.props.uiStore.modals.vehicleModalOpen && <VehicleModal />}
                {this.props.uiStore.modals.repairModalOpen && <RepairModal />}
                {this.props.uiStore.modals.refuelModalOpen && <RefuelModal />}
            </div>
        );
    }
}
