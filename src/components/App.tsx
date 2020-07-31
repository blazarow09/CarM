import { IonApp, IonLoading } from '@ionic/react';
import React from 'react';
import AppRouter from './AppRouter';
import { useAuthInit, AuthContext } from './Authentication/AuthGuard/AuthGuard';
import '../theme/global-colors.css';


const App: React.FC = () => {
    const { isLoading, auth } = useAuthInit();

    console.log(`Rendering App with auth: loggedIn: ${auth?.loggedIn}, userId: ${auth?.userId}`);
    if (isLoading) {
        return <IonLoading isOpen />;
    }

    return (
        <IonApp className="ion-padding">
            <AuthContext.Provider value={{ loggedIn: auth?.loggedIn, userId: auth?.userId, email: auth?.email }}>
                <AppRouter />
            </AuthContext.Provider>
        </IonApp>
    );
};

export default App;
