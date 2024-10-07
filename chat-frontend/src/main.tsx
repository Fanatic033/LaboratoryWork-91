import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {CssBaseline} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import {persistor, store} from "./app/store.ts";
import {PersistGate} from "redux-persist/integration/react";
import {addInterceptors} from "./axiosApi.ts";

addInterceptors(store);

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <BrowserRouter>
                <CssBaseline/>
                <StrictMode>
                    <App/>
                </StrictMode>
            </BrowserRouter>
        </PersistGate>
    </Provider>
)
