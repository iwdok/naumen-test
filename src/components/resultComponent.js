import React, { Component } from 'react';
import '../styles/resultComponent.css';
import {inject, observer} from "mobx-react";

@inject('searchStore') @observer
class ResultComponent extends Component{
    constructor(props){
        super(props);
        this.store = this.props.searchStore;
    }

    openOnWiki(){
        window.open(this.props.link);
    }

    render(){
        return(
            <div className={'results ' + this.store.theme}>
                <div className="result-container">
                    <div className="link-click" onClick={this.openOnWiki.bind(this)}>
                        <div className="title">{this.props.title}</div>
                        <div className="link">{decodeURI(this.props.link)}</div>
                    </div>
                    <div className="snippet" dangerouslySetInnerHTML={{__html: this.props.snippet}}/>
                </div>
            </div>
        );
    }
}

export default ResultComponent;