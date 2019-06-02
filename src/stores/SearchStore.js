import {observable, action, computed} from "mobx";
import Cookies from 'js-cookie';

class SearchStore {
    @observable preset_cookie = Cookies.get('preset_list');
    @observable preset_list = this.preset_cookie ? JSON.parse(this.preset_cookie).array : [];

    @action results(){
        console.log(this.preset_list);
         if (this.preset_list.length > 3){
            this.preset_list.shift();
        }
        this.preset_list.push(this.searchQuery);
        Cookies.set('preset_list', {array: this.preset_list}, { expires: 30 });
        let time = performance.now();
        fetch(`https://ru.wikipedia.org/w/api.php?action=query&list=search&format=json&iwurl=true&origin=*&srsearch=${this.searchQuery}&srlimit=20&srprop=wordcount|timestamp|snippet|categorysnippet`)
            .then((res) => {
                res.json().then(data => {
                    let make = [],
                        wordcount = [],
                        search_results = data.query.search,
                        id = 0;
                    this.searchOffset = data.continue ? data.continue.sroffset : 0;
                    for (let result of search_results){
                        result.snippet = result.snippet.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                        wordcount.push(result.wordcount);
                        if (new Date(result.timestamp) > this.newest){
                            this.newest = new Date(result.timestamp);
                            this.newest_link = 'https://ru.wikipedia.org/wiki/' + result.title;
                        }
                        if (new Date(result.timestamp) < this.oldest){
                            this.oldest = new Date(result.timestamp);
                            this.oldest_link = 'https://ru.wikipedia.org/wiki/' + result.title;
                        }
                        make.push({
                            id: id,
                            title: result.title,
                            snippet: result.snippet,
                            link: 'https://ru.wikipedia.org/wiki/' + result.title,
                            wordcount: result.wordcount,
                            timestamp: new Date(result.timestamp)
                        });
                        id++;
                    }
                    this.averageWordCount = parseInt(wordcount.reduce(function(sum, current) {
                        return sum + current;
                    }, 0) / wordcount.length);
                    this.resultsCount = data.query.searchinfo.totalhits;
                    this.readyData = make;
                    this.time = ((performance.now() - time) / 1000000).toFixed(6).replace('.', ',') + ' сек.';
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    @action moreResults(){
        fetch(`https://ru.wikipedia.org/w/api.php?action=query&list=search&format=json&iwurl=true&origin=*&srsearch=${this.searchQuery}&sroffset=${this.searchOffset}&srlimit=20&srprop=wordcount|timestamp|snippet|categorysnippet`)
            .then((res) => {
                res.json().then(data => {
                    let wordcount = [],
                        search_results = data.query.search,
                        id = this.searchOffset;
                    console.log(data);
                    if (data.continue){
                        this.searchOffset = data.continue.sroffset;
                        console.log(this.searchOffset);
                        for (let result of search_results){
                            result.snippet = result.snippet.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                            wordcount.push(result.wordcount);
                            if (new Date(result.timestamp) > this.newest){
                                this.newest = new Date(result.timestamp);
                                this.newest_link = 'https://ru.wikipedia.org/wiki/' + result.title;
                            }
                            if (new Date(result.timestamp) < this.oldest){
                                this.oldest = new Date(result.timestamp);
                                this.oldest_link = 'https://ru.wikipedia.org/wiki/' + result.title;
                            }
                            this.readyData.push({
                                id: id,
                                title: result.title,
                                snippet: result.snippet,
                                link: 'https://ru.wikipedia.org/wiki/' + result.title,
                                wordcount: result.wordcount,
                                timestamp: new Date(result.timestamp)
                            });
                            id++;
                        }
                        this.averageWordCount = parseInt((wordcount.reduce((sum, current) => {
                            return sum + current;
                        }, 0) / wordcount.length + this.averageWordCount) / 2);
                    } else {
                        this.searchOffset = 0;
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    @action sortedResults(){
        if (this.sortType !== ""){
            switch (this.sortType) {
                case "релевантность":
                    this.readyData = this.readyData.sort( (a, b) => {
                        if (a.id > b.id) {
                            return 1;
                        }
                        if (a.id < b.id) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                case "сначала новое":
                    this.readyData = this.readyData.sort( (a, b) => {
                        if (a.timestamp < b.timestamp) {
                            return 1;
                        }
                        if (a.timestamp > b.timestamp) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                case "сначала старое":
                    this.readyData = this.readyData.sort( (a, b) => {
                        if (a.timestamp > b.timestamp) {
                            return 1;
                        }
                        if (a.timestamp < b.timestamp) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                case "наибольшее количество слов":
                    this.readyData = this.readyData.sort( (a, b) => {
                        if (a.wordcount < b.wordcount) {
                            return 1;
                        }
                        if (a.wordcount > b.wordcount) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                case "наименьшее количество слов":
                    this.readyData = this.readyData.sort( (a, b) => {
                        if (a.wordcount > b.wordcount) {
                            return 1;
                        }
                        if (a.wordcount < b.wordcount) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                default:
                    break;
            }
        }
    }

    @action subResults(){
        if (this.query){
            fetch(`https://ru.wikipedia.org/w/api.php?action=query&list=search&format=json&iwurl=true&origin=*&srsearch=${this.query}&srlimit=8&srprop=title`)
                .then((res) => {
                    this.subSearch = [];
                    let regexp = new RegExp(this.query, 'ig'),
                        counter = 8;
                    for (let element of this.preset_list){
                        if (element.match(regexp)){
                            this.subSearch.push(element);
                            counter--;
                        }
                    }
                    res.json().then(data => {
                        for (let element of data.query.search){
                            if (counter > 0){
                                this.subSearch.push(element.title);
                                counter--;
                            }
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    @computed get newestDate(){
        let day = this.newest.getDate(),
            month = this.newest.getMonth();
        console.log(day, day.toString().length);
        day = day.toString().length === 2 ? day : '0' + day;
        month = month.toString().length === 2 ? month : '0' + month;
        return `${day}.${month}.${this.newest.getFullYear()}`
    }

    @computed get oldestDate(){
        let day = this.oldest.getDate(),
            month = this.oldest.getMonth();
        day = day.toString().length === 2 ? day : '0' + day;
        month = month.toString().length === 2 ? month : '0' + month;
        return `${day}.${month}.${this.oldest.getFullYear()}`    }

    @observable searchQuery = "";
    @observable subSearch = [];
    @observable readyData = [];
    @observable query = "";
    @observable sortType = "";
    @observable searchOffset = 0;

    @observable averageWordCount = 0;
    @observable resultsCount = 0;
    @observable oldest = new Date();
    @observable newest = new Date('1970-01-01Z00:00:00:000');
    @observable oldest_link = "";
    @observable newest_link = "";
    @observable time;

    @observable theme = "";
    @observable buttonClass = "change-theme-bright";
    @observable buttonText = "bright";
}

const store = new SearchStore();
export default store;