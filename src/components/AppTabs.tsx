import * as React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../stores/UserStore/UserStore';
import Home from '../components/Home/Home';

interface AppTabsProps {
    userStore?: IUserStore;
}

@inject('userStore')
@observer
export default class AppTabs extends React.Component<AppTabsProps> {
    public render() {
        return (
            <IonRouterOutlet>
                <Route exact path="/my/home">
                    <Home />
                </Route>
                <Route exact path="/my/entries/view/:id">
                    {/* <EntryPage /> */}
                </Route>
                <Route exact path="/my/entries/add">
                    {/* <AddEntryPage /> */}
                </Route>
                <Redirect exact path="/" to="/my/entries" />
            </IonRouterOutlet>
        );
    }
}
