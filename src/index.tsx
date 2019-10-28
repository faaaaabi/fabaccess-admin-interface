import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import {Provider} from "react-redux";
import {rootReducer} from "./redux"
import {compose, createStore} from 'redux';
import fabbAccessTheme from "./theme/fabbAccessTheme";
import * as localForage from "localforage";
import {ThemeProvider} from "@material-ui/styles";

localForage.config({
    driver      : localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name        : 'fabbacces_clickdummy',
    version     : 1.0,
    size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'appData', // Should be alphanumeric, with underscores.
    description : 'dummy storage for the fab access app'
});

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: typeof compose;
    }
}

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(<ThemeProvider theme={fabbAccessTheme}><Provider store={store}><App/></Provider></ThemeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
