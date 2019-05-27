import React, { Component } from 'react';
import {inject, observer} from "mobx-react";

@inject('searchStore') @observer
class SubSearchComponent extends Component{
    constructor(props){
        super(props);
        this.store = this.props.searchStore;
    }

    search(e){
        this.store.searchQuery = e.target.id;
        this.store.subSearch = "";
        this.store.query = e.target.id;
        this.store.results();
    }

    render(){
        return(
            <div id={this.props.title} onClick={this.search.bind(this)}>{this.props.title}</div>
        );
    }
}

export default SubSearchComponent;