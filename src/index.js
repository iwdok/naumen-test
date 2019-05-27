import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import {Provider} from 'mobx-react';
import SearchStore from './stores/SearchStore';

const Root = (
    <Provider searchStore={SearchStore}>
        <App/>
    </Provider>
);

ReactDOM.render(Root, document.getElementById("root"));