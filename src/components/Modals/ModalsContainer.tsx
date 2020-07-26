import * as React from 'react';
import { IUiStore } from '../../stores/UiStore/UiStore';
import { inject, observer } from 'mobx-react';
import AddCarModal from './AddCarModal/AddCarModal';

interface ModalsContainerProps {
    uiStore?: IUiStore;
}

@inject('uiStore')
@observer

export default class ModalsContainer extends React.Component<ModalsContainerProps> {

  public render() {
    return (
      <div>
        {this.props.uiStore.modals.addCarModal && (
            <AddCarModal />
        )}
      </div>
    );
  }
}
