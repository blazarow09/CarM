import { useEffect, useContext, useState } from "react";
import { auth as firebaseAuth} from '../../../firebase/firebaseConfig.dev';
import React from "react";
import { IAuthContext } from "../../../services/AuthService";

interface IAuthInit {
    isLoading: boolean;
    auth?: IAuthContext;
}

export const AuthContext = React.createContext<IAuthContext>({ loggedIn: false });

export function useAuth(): IAuthContext {
    return useContext(AuthContext);
}

export function useAuthInit(): IAuthInit {
    const [authInit, setAuthInit] = useState<IAuthInit>({ isLoading: true });

    let auth: IAuthContext = { loggedIn: false};
    useEffect(() => {

        // Return the firebaseAuth to unsubscribe.
        return firebaseAuth.onAuthStateChanged((firebaseUser): void => {
            auth = firebaseUser ? { loggedIn: true, userId: firebaseUser.uid, email: firebaseUser.email } : { loggedIn: false };

            setAuthInit({ isLoading: false, auth: auth });
        });
    }, []);

    return authInit;
}