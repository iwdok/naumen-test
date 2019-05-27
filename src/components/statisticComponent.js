import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import '../styles/statisticComponent.css';

@inject('searchStore') @observer
class statisticComponent extends Component{
    constructor(props){
        super(props);
        this.store = this.props.searchStore;
    }

    open_newest(){
        window.open(this.store.newest_link);
    }

    open_oldest(){
        window.open(this.store.oldest_link);
    }

    sort_results(e){
        this.store.sortType = e.target.value;
        this.store.sortedResults();
    }

    render(){
        return(
            <div>
                <div className={'info ' + this.store.theme}>
                    <div className="words">Среднее число слов в статье: {this.store.averageWordCount};</div>
                    <div className="results-count">результатов: {this.store.resultsCount}</div>
                    <div className="time">за: {this.store.time}</div>
                    <div className="filter">Сортировать по: <select onChange={this.sort_results.bind(this)}>
                        <option>релевантность</option>
                        <option>сначала новое</option>
                        <option>сначала старое</option>
                        <option>наибольшее количество слов</option>
                        <option>наименьшее количество слов</option>
                    </select></div>
                </div>
                <div className={'info ' + this.store.theme}>
                    <div onClick={this.open_newest.bind(this)} className="newest"> Самая новая: {this.store.newestDate} </div>
                    <div onClick={this.open_oldest.bind(this)} className="oldest"> Самая старая: {this.store.oldestDate} </div>
                </div>
            </div>
        );
    }
}

export default statisticComponent;