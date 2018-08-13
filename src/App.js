/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * @author Keoni D'Souza
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Select from 'react-select';
import moment from 'moment';
import ProgrammesDisplay from './components/programmes-display';
import EpisodesDisplay from './components/episodes-display';
import SingleEpisodeDisplay from './components/single-episode-display';

const itvHubLogo = 'https://upload.wikimedia.org/wikipedia/en/0/0a/ITV_Hub_Logo.png';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            programmes: [],
            programmeUrl: '',
            programme: '',
            category: '',
            episodes: [],
            episodeData: ""
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleEpisodeClick = this.handleEpisodeClick.bind(this);
    };

    /**
     * Initialises display with category drop-down
     */
    componentDidMount() {
        this.getCategories();
    };

    /**
     * Fetches the categories from the JSON file
     */
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

    /**
     * Fetches the programmes from the chosen category
     * @param category User-specified category
     */
    getProgrammes(category) {
        if (category.includes('&')) category.replace('amp;', '');
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

    /**
     * Handles the category selection
     * @param selectedOption User-specified category
     */
    handleCategory = (selectedOption) => {
        this.setState({
            category: selectedOption.value,
            episodeData: '',
            episodes: []
        });
        this.getProgrammes(selectedOption.value);
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
            axios
                .get(url, {
                    headers: {
                        'Accept': 'application/vnd.itv.hubsvc.production.v3+hal+json; charset=UTF-8'
                    }
                })
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
                    const url = programmes[i]._embedded.productions._links["doc:productions"].href;
                    this.getEpisodes(url);
                    this.setState({programmeUrl: url});
                }
            }
        }
    }

    /**
     * Label detailing last broadcast date and time, duration and days left
     * @param episode Episode in question
     * @returns {string} Label (formatted)
     */
    broadcastInfo(episode) {

        /**
         * Returns last broadcast date
         */
        const dateTime = 'Last shown: '
            + moment(episode.broadcastDateTime.commissioning)
            // Sets date to UK format
                .format('dddd Mo MMMM h:mma')
                // Removes minutes from programmes on the hour
                .replace(':00', '');

        /**
         * Calculates how many days are left to watch an episode
         */
        const currentDate = new Date();
        const expiryDate = new Date(episode._embedded.variantAvailability[0].until);
        const daysLeft =
            Math.round(
                Math.abs(
                    (expiryDate.getTime() - currentDate.getTime()) / (86400000)
                )
            );
        const day = () => {
            if (daysLeft === 0) {
                return 'Expires today'
            } else if (daysLeft === 1) {
                return daysLeft + ' day left'
            } else {
                return daysLeft + ' days left'

            }
        };

        return {
            lastShown: dateTime,
            duration: episode.duration.display,
            expiry: day()
        };
    }

    /**
     * Handles the programme selection
     * @param e User-selected programme (as an event)
     */
    handleClick(e) {
        e.preventDefault();
        this.setState({
            episodes: '',
            programme: e.target.className
        });
        this.getEpisodesUrl(e.target.className);
    }

    /**
     * Handles the episode selection
     * @param e User-selected episode (as an event)
     */
    handleEpisodeClick(e) {
        e.preventDefault();

        // Search through the episodes where the titles match
        const episodeDetails = this.state.episodes.filter(
            episode => episode.productionId === e.target.dataset.id);

        this.setState({
            episodes: [],
            episodeData: episodeDetails[0]
        });
    }

    render() {
        // Removes the need for 'this.state' prefix
        const {categories, category, programmes, episodes, episodeData} = this.state;

        // Formats options for drop-down box
        const optionsMap = categories.map(category => ({
            value: category.name,
            label: category.name
        }));

        return (
            <div className='container'>

                {/*'Navigation'-style header bar*/}
                <div className='row'>
                    <a href='.' className='col-md-3'>
                        <img
                            id='itv-hub-logo'
                            src={itvHubLogo}
                            alt='ITV Hub Logo'
                        />
                    </a>

                    <Select
                        className='col-md-9'
                        value={category}
                        onChange={this.handleCategory}
                        options={optionsMap}
                        placeholder={category || 'Please select or type a category...'}
                    />
                </div>

                {/*Content display area*/}
                <div className='row'>
                    <ProgrammesDisplay
                        programmes={programmes}
                        handleClick={this.handleClick}/>
                    <EpisodesDisplay
                        episodes={episodes}
                        broadcastInfo={this.broadcastInfo}
                        handleEpisodeClick={this.handleEpisodeClick}
                    />
                    <SingleEpisodeDisplay
                        episodeData={episodeData}
                        label={this.seriesEpisodeTitleLabel}
                        broadcastInfo={this.broadcastInfo}
                    />
                </div>
            </div>
        );

    };

};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);