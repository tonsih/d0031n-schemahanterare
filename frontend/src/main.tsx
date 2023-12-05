import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store.ts';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
);
