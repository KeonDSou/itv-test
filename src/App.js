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

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Select from 'react-select';
import ServiceRequest from './components/service-request';
import ProgrammesDisplay from './components/programmes-display';
import EpisodesDisplay from './components/episodes-display';
import SingleEpisodeDisplay from './components/single-episode-display';
import broadcastInfo from './components/broadcast-info';
import About from './pages/about';

const itvHubLogo =
    'https://upload.wikimedia.org/wikipedia/en/0/0a/ITV_Hub_Logo.png';

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
    getCategories() {
        const params = {
            queryProp: 'categories',
            headerProp: 'category.v3',
            features: 'hls,aes'
        };
        ServiceRequest()
            .get(params)
            .then(fetch => {
                this.setState({
                    categories: fetch.data._embedded.categories
                })
            })
            .catch(err => console.log(err));
    };

    getChannels() {
        const params = {
            queryProp: 'channels',
            features: 'mpeg-dash',
            headerProp: 'channel.v2'
        };
        ServiceRequest()
            .get(params)
            .then(fetch => {
                this.setState({
                    channels: fetch.data._embedded.channels
                });
            })
            .catch(err => console.log(err));
    }

    /**
     * Fetches the programmes from the chosen category
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
        // return (
        //     <Route
        //         key={category.name}
        //         path={`/channels/${category.name}`}
        //         component={ProgrammesDisplay}
        //     />
        // )
    };

    /**
     * Fetches the episodes from the chosen category
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
            ServiceRequest()
                .get(params)
                .then(fetch => {
                    this.setState({
                        episodes: fetch.data._embedded.productions
                    })
                })
                .catch(err => console.log(err));
        }
    }

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

        const Home = () => (
            <div>
                <h1>Home - ITV Programme Discovery</h1>
                <p>{'Welcome to ITV Programme Discovery - the place to navigate ITV programmes.'}</p>
            </div>
        );

        // const About = () => (
        //     <div>
        //         <h1>About</h1>
        //         <p>{'A simple application to allow a user to discover ITV content.'}</p>
        //     </div>
        // );

        // const Programme = ({match}) => (
        //   <div>
        //       <h3>{programme}</h3>
        //   </div>
        // );

        const Category = ({match}) => (
            <div>
                <h1>{category.replace('amp;', '')}</h1>
                <ProgrammesDisplay
                    path={`/${match.params.id}/${category}`}
                    programmes={programmes}
                    handleClick={this.handleClick}
                />
            </div>
        );

        const Categories = () => (
            <div>
                <h1>Category Selection</h1>
                <div className='row categories'>
                    {this.state.categories
                        .map(
                            (category) =>
                                <div className='col-3'
                                     key={category.name}>
                                    <Link to={`/categories/${
                                        category.name
                                            .replace(' & ', '-')
                                            .toLowerCase()}`}
                                    >
                                        <div className='category-box'
                                             id={category.name
                                                 .replace(' & ', '-')
                                                 .toLowerCase()}
                                        >
                                            <p onClick={this.handleCategory}>
                                                {category.name}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                        )
                    }
                </div>
            </div>
        );

        const Channels = () => (
            <div>
                <h1>Channel Selection</h1>
                <div className='row'>
                    {this.state.channels
                        .map(
                            (channel) =>
                                <div className='col-sm-2 channel-bar'
                                     id={channel.name}
                                     key={channel.name}
                                >
                                    <img
                                        key={`${channel.name}-bar`}
                                        src={channel._links.dogImage.href}
                                        alt={channel.name}
                                    />
                                </div>
                        )
                    }
                </div>
                <div className='row'>
                    {this.state.channels
                        .map(
                            (channel) =>
                                <div className='col-lg-6 channel-container'
                                     key={channel.name}
                                >
                                    <img
                                        className='channel-background'
                                        key={`${channel.name}-background`}
                                        src={channel._links.backgroundImage.href}
                                        alt={channel.name}
                                    />
                                    <img
                                        className='channel-logo'
                                        key={`${channel.name}-logo`}
                                        src={channel._links.primaryImage.href}
                                        alt={channel.name}
                                    />
                                    <p className='channel-strapline'
                                       id={channel.name}>
                                        {channel.strapline}
                                    </p>
                                </div>
                        )
                    }
                </div>
            </div>
        );

        return (
            <Router>
                <div className='container'>
                    {/*'Navigation'-style header bar*/}
                    <div className='row header'>
                        <div className='col-3'>
                            <a href='/'>
                                <img
                                    id='itv-hub-logo'
                                    src={itvHubLogo}
                                    alt='ITV Hub Logo'
                                />
                            </a>
                        </div>
                        <div className='col-9'>
                            <div className='row nav-bar'>
                                <Link
                                    to='/'
                                    className='col-3 nav-item'
                                    id='children'>
                                    Home
                                </Link>
                                <Link
                                    to='/about'
                                    className='col-3 nav-item'
                                    id='comedy'>
                                    About
                                </Link>
                                <Link
                                    to='/categories'
                                    className='col-3 nav-item'
                                    id='drama-soaps'>
                                    Categories
                                </Link>
                                <Link
                                    to='/channels'
                                    className='col-3 nav-item'
                                    id='entertainment'>
                                    Channels
                                </Link>
                            </div>
                            <div>
                                <Select
                                    value={category}
                                    onChange={this.handleCategory}
                                    options={optionsMap}
                                    placeholder={category.replace('amp;', '')
                                    || 'Please select or type a category...'}
                                />
                            </div>
                        </div>
                    </div>

                    <Route exact path='/' component={Home}/>
                    <Route path='/about' component={About}/>
                    <Route exact path='/categories' component={Categories}/>
                    <Route path='/categories/:id' component={Category}/>
                    <Route path='/channels' component={Channels}/>

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