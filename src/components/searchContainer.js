import React, { Component } from 'react';
import '../styles/searchContainer.css';
import '../styles/blocks/container.css';
import logo from '../icons/torch.png';
import ResultComponent from './resultComponent';
import SubSearchComponent from './subSearchComponent';
import StatisticComponent from './statisticComponent';
import {inject, observer} from "mobx-react";

@inject('searchStore') @observer
class SearchContainer extends Component{
    constructor(props){
        super(props);
        this.store = this.props.searchStore;
    }

    searchChanged(e) {
        this.store.query = e.target.value;
        this.store.subResults();
    }

    startSearch(){
        this.store.searchQuery = this.store.query;
        this.store.subSearch = "";
        this.store.results();
    }

    themeChange(){
        if (this.store.theme === ""){
            document.body.style.background = "#FFFFFF";
            this.store.theme = "black";
            this.store.buttonClass = "change-theme-dark";
            this.store.buttonText = "dark";
        } else {
            document.body.style.background = "#222226";
            this.store.theme = "";
            this.store.buttonClass = "change-theme-bright";
            this.store.buttonText = "bright";
        }
    }

    moreResults(){
        this.store.moreResults();
        this.store.sortedResults();
    }

    render(){
        return(
            <div>
                <div className="container">
                    <div className={'header ' + this.store.theme}>
                        <div>Wiki Torch<img src={logo} className="logo" alt="err"/></div>
                        <div className="theme-changer">
                            <button onClick={this.themeChange.bind(this)} className={this.store.buttonClass}>{this.store.buttonText}</button>
                        </div>
                    </div>
                    <div className={'search ' + this.store.theme}>
                        <div className="input-panel">
                            <input autoFocus placeholder="Найти..." value={this.store.query} onChange={this.searchChanged.bind(this)}/>
                            <button className="search-button" onClick={this.startSearch.bind(this)}>Найти</button>
                        </div>
                        {this.store.subSearch.length > 0 && <div className="sub-search">
                            {this.store.subSearch.map((element, index) => {
                                return <SubSearchComponent key={index} title={element}/>
                            })}
                        </div>}
                    </div>
                    {this.store.averageWordCount > 0 &&
                        <StatisticComponent />
                    }
                    <div className="result-list">
                        {this.store.readyData.map((element, index) => {
                            return <ResultComponent title={element.title} link={element.link} snippet={element.snippet} key={index}/>
                        })}
                        {this.store.searchOffset > 0 &&
                            <div className="more-results" onClick={this.moreResults.bind(this)}>Еще....</div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchContainer;