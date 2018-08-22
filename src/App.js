/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: App.js -
 *      the main file importing code and initialising the application
 *
 * @author Keoni D'Souza
 */

// React modules
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

// Pages
import Home from './pages/home';
import About from './pages/about';
import Category from './pages/category';
import Categories from './pages/categories';
import Channels from './pages/channels';

// Other imports
import Header from './components/header';
import ServiceRequest from './components/service-request';
import EpisodesDisplay from './components/episodes-display';
import SingleEpisodeDisplay from './components/single-episode-display';
import broadcastInfo from './components/broadcast-info';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channels: [],
            categories: [],
            programmes: [],
            programmeUrl: '',
            programme: '',
            category: '',
            episodes: [],
            episodeData: ''
        };
        this.handleCategory = this.handleCategory.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleEpisodeClick = this.handleEpisodeClick.bind(this);
    };

    /**
     * Initialises display with category drop-down
     */
    componentWillMount() {
        this.getCategories();
        this.getChannels();
    }

    componentDidMount() {
    };

    /**
     * Fetches the categories from the JSON file
     */
    collectCategories(params) {
        ServiceRequest()
            .get(params)
            .then(fetch => {
                this.setState({
                    categories: fetch.data._embedded.categories
                })
            })
            .catch(err => console.log(err));
    };

    /**
     * Sets the parameters for the fetch request
     */
    getCategories() {
        const params = {
            queryProp: 'categories',
            headerProp: 'category.v3',
            features: 'hls,aes'
        };
        this.collectCategories(params);
    };

    /**
     * Fetches the channels from the JSON file
     */
    collectChannels(params) {
        ServiceRequest()
            .get(params)
            .then(fetch => {
                this.setState({
                    channels: fetch.data._embedded.channels
                });
            })
            .catch(err => console.log(err));
    };

    /**
     * Sets the parameters for the fetch request
     */
    getChannels() {
        const params = {
            queryProp: 'channels',
            features: 'mpeg-dash',
            headerProp: 'channel.v2'
        };
        this.collectChannels(params);
    };

    /**
     * Fetches the programmes from the chosen category
     * @param params Parameters for axios request
     */
    collectProgrammes(params) {
        ServiceRequest()
            .get(params)
            .then(fetch => {
                this.setState({
                    programmes: fetch.data._embedded.programmes
                });
            })
            .catch(err => console.log(err));
    };

    /**
     * Sets the parameters for the fetch request
     * @param category User-specified category
     */
    getProgrammes(category) {
        if (category.includes('&')) {
            category = 'Drama+%26+Soaps';
        }
        const params = {
            queryProp: 'programmes',
            features: 'hls,aes',
            category,
            headerProp: 'programme.v3'
        };
        this.collectProgrammes(params);
    };

    /**
     * Handles the category selection
     * @param selectedOption User-specified category
     */
    handleCategory(selectedOption) {
        const category =
            selectedOption.value
                ? selectedOption.value
                : selectedOption.target.innerHTML;
        this.setState({
            category: category,
            episodeData: '',
            episodes: []
        });
        this.getProgrammes(category);
    };

    /**
     * Fetches the episodes from the chosen category
     * @param params Parameters for axios request
     */
    collectEpisodes(params) {
        ServiceRequest()
            .get(params)
            .then(fetch => {
                this.setState({
                    episodes: fetch.data._embedded.productions
                })
            })
            .catch(err => console.log(err));
    };

    /**
     * Sets the parameters for the fetch request
     * @param url Episode collection location
     */
    getEpisodes(url) {
        this.setState({
            episodes: [],
            programmes: []
        });
        if (url) {
            const params = {
                url,
                headerProp: 'production.v3'
            };
            this.collectEpisodes(params);
        }
    };

    /**
     * Fetches the URL to collect programme episodes
     * @param programme User-specified programme
     */
    getEpisodesUrl(programme) {
        // Removes the need for 'this.state' prefix
        const {programmes} = this.state;

        if (programmes.length) {
            for (let i = 0; i < programmes.length; i++) {
                if (programmes[i].title === programme) {
                    const url =
                        programmes[i]._embedded.productions
                            ._links["doc:productions"].href;
                    this.getEpisodes(url);
                    this.setState(
                        {programmeUrl: url}
                    );
                }
            }
        }
    }

    /**
     * Handles the programme selection
     * @param e User-selected programme (as an event)
     */

    handleClick(e) {
        e.preventDefault();
        this.setState({
            episodes: '',
            programme: e.target.attributes['data-id'].value
        });
        this.getEpisodesUrl(e.target.attributes['data-id'].value);
    }

    /**
     * Handles the episode selection
     * @param e User-selected episode (as an event)
     */
    handleEpisodeClick(e) {
        e.preventDefault();

        // Search through the episodes where the titles match
        const episodeDetails = this.state.episodes.filter(
            episode => episode.productionId ===
                e.target.attributes['data-id'].value);

        this.setState({
            episodes: [],
            episodeData: episodeDetails[0]
        });
    }

    render() {
        // Removes the need for 'this.state' prefix
        const {
            channels,
            categories,
            programmes,
            programmeUrl,
            programme,
            category,
            episodes,
            episodeData
        } = this.state;

        // Formats options for drop-down box
        const optionsMap = categories.map(category => ({
            value: category.name,
            label: category.name
        }));

        // const Programme = ({match}) => (
        //   <div>
        //       <h3>{programme}</h3>
        //   </div>
        // );

        const PreCategory = ({match}) => (
            <Category
                category={category}
                match={match}
                programmes={programmes}
                handleClick={this.handleClick}
            />
        );

        const PreCategories = () => (
            <Categories
                categories={categories}
                handleCategory={this.handleCategory}
            />
        );

        const PreChannels = () => (
            <Channels
                channels={channels}
            />
        );

        return (
            <Router>
                <div className='container'>
                    <Header
                        categories={categories}
                        category={category}
                        handleCategory={this.handleCategory}
                        options={optionsMap}
                    />

                    <Route exact path='/' component={Home}/>
                    <Route path='/about' component={About}/>
                    <Route exact path='/categories' component={PreCategories}/>
                    <Route path='/categories/:id' component={PreCategory}/>
                    <Route path='/channels' component={PreChannels}/>

                    {/*Content display area*/}
                    <div className='row'>
                        <EpisodesDisplay
                            episodes={episodes}
                            broadcastInfo={broadcastInfo}
                            handleEpisodeClick={this.handleEpisodeClick}
                        />
                        <SingleEpisodeDisplay
                            episodeData={episodeData}
                            label={this.seriesEpisodeTitleLabel}
                            broadcastInfo={broadcastInfo}
                        />
                    </div>

                    <div className='footer'>
                        <p><em>{'by'}</em>{" Keoni D'Souza"}</p>
                    </div>
                </div>
            </Router>
        );

    };

};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);