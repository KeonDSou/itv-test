import React, {Component} from 'react';
import ReactDOM from 'react-dom';
// import ReactTable from 'react-table';
// import 'react-table/react-table.css';
import axios from 'axios';
import Select from 'react-select';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            programmes: [],
            category: '',
            image: ''
        };
    };

    componentDidMount() {
        this.getCategories();
    };

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
    };

    getProgrammes(category) {
        if (category.includes('&')) category = "Drama & Soaps"; // Removes 'amp;'
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
            })
            .catch(err => console.log(err));
    };

    handleChange = (selectedOption) => {
        this.setState({category: selectedOption.value});
        this.getProgrammes(selectedOption.value);
    };

    render() {
        const {categories, category, programmes} = this.state
        const programmeList =  categories ? <h2>{category} Programme List</h2> : undefined;
        // const style = {}

        const optionsMap = categories.map(category => {
            return {
                value: category.name,
                label: category.name
            };
        })
        return (
            <div className={'container'}>
                <img
                    className={'image__header'}
                    src={'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/ITV_logo_2013.svg/1200px-ITV_logo_2013.svg.png'}/>
                <Select
                    value={category}
                    onChange={this.handleChange}
                    options={optionsMap}
                    placeholder={category || 'Select a category....'}
                />

                <div className={'row'}>
                    {programmes.map(programme => {
                        console.log('programme =====>',programme )
                        return (
                            <div
                                // onClick={handleProgrammeClick}
                                id={'programme-card'}
                                className={'col-lg-4'}
                                key={programme.title}>
                                <h3>{programme.title}</h3>
                                <img src={programme._embedded.latestProduction._links.image.href}/>
                                <p>{programme.synopses.ninety}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        );

    };

};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);