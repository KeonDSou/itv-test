import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import Select from 'react-select';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            programmes: [],
            category: ''
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories() {
        axios
            .get('http://discovery.hubsvc.itv.com/platform/itvonline/ctv/categories?', {
                params: {
                    broadcaster: 'ITV',
                    features: 'hls,aes'
                },
                headers: {
                    'Accept': 'application/vnd.itv.hubsvc.category.v3+hal+json'
                }
            })
            .then(fetch => {
                this.setState({
                    categories: fetch.data._embedded.categories
                })
            })
            .catch(err => console.log(err));
    }

    getProgrammes(category) {
        if (category.includes('&')) category = "Drama & Soaps"; // Removes 'amp;'
        console.log('category here: ', category);
            axios
                .get('http://discovery.hubsvc.itv.com/platform/itvonline/ctv/programmes?', {
                    params: {
                        features: 'hls,aes',
                        broadcaster: 'itv',
                        category: category
                    },
                    headers: {
                        'Accept': 'application/vnd.itv.hubsvc.programme.v3+hal+json; charset=UTF-8'
                    }
                })
                .then(fetch => {
                    this.setState({
                        programmes: fetch.data._embedded.programmes
                    });
                    console.log('this.state.programmes', this.state.programmes)
                })
                .catch(err => console.log(err));
    }


    handleClick(event) {
        event.preventDefault();
        this.getProgrammes(event.target.innerHTML);
        this.setState({category: event.target.innerHTML});
    }

    render() {
        console.log(this.state.category);

        return (
            <div>
                <h1>Categories</h1>
                <ul>
                    {this.state.categories.map(category => {
                        return (
                            <a href='#' key={category.name.substring(0,3)}>
                                <li onClick={this.handleClick}>{category.name}</li>
                            </a>
                        )
                    })
                    }
                </ul>
                <h2>Programmes</h2>
                <ul>
                    {console.log(this.state.programmes)}
                    {this.state.programmes.map(programme => {
                        return (
                            <a href='#' key={programme.title.substring(0,3)}>
                                <li>{programme.title}</li>
                            </a>
                        )
                    })
                    }
                </ul>
            </div>
        );

    }

}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);