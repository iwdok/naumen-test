import React, { Component } from "react";
import {Router, Route} from "react-router-dom";
import { createBrowserHistory } from 'history';

import '../styles/App.css';
import SearchContainer from './searchContainer';

class App extends Component {
    render() {
        return (
            <Router history={new createBrowserHistory()}>
                <div className="App">
                    <Route path="/" exact component={SearchContainer}/>
                    <Route path="/business/:number" exact component={SearchContainer}/>
                    <Route path="/control/:number" exact component={SearchContainer}/>
                </div>
            </Router>
        );
    }
}

export default App;