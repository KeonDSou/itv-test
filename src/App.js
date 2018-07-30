import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import Select from 'react-select';
// import './App.css';
// import api from './categories.json';

// const CATEGORIES = ["Children",
//     "Comedy",
//     "Drama & Soaps",
//     "Entertainment",
//     "Factual",
//     "Films",
//     "News",
//     "Sport",
// ]

// export default class PersonList extends React.Component {
//     state = {
//         // persons : []
//         // name: "",
//         id: "",
//     }
//
//     // componentDidMount() {
//     //     axios.get("https://jsonplaceholder.typicode.com/users")
//     //         .then(res => {
//     //             const persons = res.data;
//     //             this.setState({ persons })
//     //         })
//     // }
//
//     handleChange = event => {
//         // this.setState({name: event.target.value});
//         this.setState({ id: event.target.value });
//     }
//
//     handleSubmit = event => {
//         event.preventDefault();
//
//         // const user = {
//         //     name: this.state.name
//         // };
//         //
//         // axios.post(`https://jsonplaceholder.typicode.com/users`, {user})
//         //     .then(res => {
//         //         console.log(res);
//         //         console.log(res.data);
//         //     })
//         axios.delete(`https://jsonplaceholder.typicode.com/users/${this.state.id}`)
//             .then(res => {
//                 console.log(res);
//                 console.log(res.data);
//             })
//     }
//
//     render() {
//         // return <ul>
//         //     {this.state.persons.map(
//         //         person => <li>{person.name}</li>
//         //     )}
//         // </ul>
//         // return (
//         //     <div>
//         //         <form onSubmit={this.handleSubmit}>
//         //             <label>
//         //                 Person Name:
//         //                 <input type="text" name="name" onChange={this.handleChange} />
//         //             </label>
//         //             <button type="submit">Add</button>
//         //         </form>
//         //     </div>
//         // )
//         return (
//             <div>
//                 <form onSubmit={this.handleSubmit}>
//                     <label>
//                         Person ID:
//                         <input type="text" name="id" onChange={this.handleChange} />
//                     </label>
//                     <button type="submit">Delete</button>
//                 </form>
//             </div>
//         )
//     }
// }

// export default class App extends React.Component {
//
//     render() {
//         CATEGORIES.forEach(function (cat) {
//             return cat;
//         })
//
//         return (
//             <div>
//                 <h1>Categories</h1>
//                 <ul>
//                     {CATEGORIES.map(
//                         cat => <li key={(cat.substring(0,3))}>{cat}</li>
//                     )}
//                 </ul>
//             </div>
//         );
//     }
//
// }

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            programmes: [],
            category: ''
        }
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
        if (category.includes('&')) category = "Drama & Soaps";
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
        this.getProgrammes(event.target.innerHTML)
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
                            <a href='#' key={category.name}>
                                <li onClick={this.handleClick}>{category.name}</li>
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