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
import ProgrammesDisplay from './components/programmes-display';
import EpisodesDisplay from './components/episodes-display';

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
            episodeData: null
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
            episodeData: null
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

        if (this.state.programmes.length) {
            this.state.programmes.filter((prog) => {
                if (prog.title === programme) {
                    const url = prog._embedded.productions._links["doc:productions"].href;
                    this.getEpisodes(url);
                    this.setState({programmeUrl: url});
                }
            })
        }
    }

    /**
     * Label detailing last broadcast date and time, duration and day left
     * @param episode Episode in question
     * @returns {string} Label (formatted)
     */
    episodeTime(episode) {
        const currentDate = new Date();
        const broadcastDate = new Date(episode.broadcastDateTime.commissioning);

        /**
         * Converts ISO date into a more readable format
         */
        const formatDate =
            broadcastDate.toLocaleDateString('en-gb')
            + ' | '
            + broadcastDate.toLocaleTimeString()
                // Removes seconds from time
                .replace(':00', '').toLowerCase();

        /**
         * Calculates how many days are left to watch an episode
         */
        const expiryDate = new Date(episode._embedded.variantAvailability[0].until);
        const daysLeft =
            Math.round(
                Math.abs(
                    (expiryDate.getTime() - currentDate.getTime()) / (86400000)
                )
            );
        const day = () => {
            if (daysLeft === 0) {
                return ' | Expires today'
            } else if (daysLeft === 1) {
                return ' | ' + daysLeft + ' day left'
            } else {
                return ' | ' + daysLeft + ' days left'

            }
        };
        return 'Last shown: '
            + formatDate
            + ' | '
            + episode.duration.display
            + day();
        }

    /**
     * Handles the programme selection
     * @param e User-selected programme (as an event)
     */
    handleClick(e) {
        e.preventDefault();
        this.setState({programme: e.target.className});
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

    /**
     * Label detailing an episode's series number and episode number and title
     * @returns {*} JSX for above
     */
    seriesEpisodeTitleLabel() {
        if (this.state.episodeData.series) {
            return <h2 className={'series-episode-title'}>
                {`Series ${
                    this.state.episodeData.series
                }: Episode ${
                    this.state.episodeData.episode
                }${
                    this.state.episodeData.episodeTitle ? ` - ${
                        this.state.episodeData.episodeTitle
                    }` : ''
                }
                `}
            </h2>
        } else {
            const broadcastDate = new Date(this.state.episodeData.broadcastDateTime.commissioning);
            return <h2>{broadcastDate.toLocaleDateString('en-gb')}</h2>
        }
    }

    render() {
        // Removes the need for 'this.state' prefix
        const {categories, category, programmes, episodes, episodeData} = this.state;

        // Formats options for drop-down box
        const optionsMap = categories.map(category => ({
            value: category.name,
            label: category.name
        }));

        const categoryName = episodeData && episodeData._embedded.categories.map(item => item.name).join(', ');

        const singleEpisodeDisplay = episodeData ? (
                <div className={'single-episode'}>
                    <div className={'row'}>
                        <h1 className='col-sm-10 prog-title'>
                            {episodeData._embedded.programme.title}
                        </h1>
                        <img className={'col-sm-2 channel'}
                             src={episodeData._embedded.channel._links.primaryImage.href}
                             alt={`${episodeData._embedded.channel.name} logo`}
                        />
                    </div>

                    <img className={'image'}
                         src={episodeData._links.image.href}
                         alt={episodeData.episodeTitle}
                    />

                    {this.seriesEpisodeTitleLabel()}

                    <div
                        id={episodeData.episodeTitle}
                        data-id={episodeData.productionId}
                    >
                        {episodeData.guidance ? <p id={episodeData.episodeTitle} data-id={episodeData.productionId}>
                            Guidance:
                            <span className={'guidance'}>{' ' + episodeData.guidance}</span>
                        </p>: undefined}
                    </div>

                    <p className='synopsis'>{episodeData.synopses.epg}</p>

                    <p>{this.episodeTime(episodeData)}</p>
                    <p>Category: <em>{categoryName}</em></p>
                </div>
            )
            : undefined;

        return (
            <div className={'container'}>
                <div className={'row'}>
                    <a href='.' className={'col-md-3'}>
                        <img
                            id={'itv_hub_logo'}
                            src={itvHubLogo}
                            alt={'ITV Hub Logo'}
                        />
                    </a>

                    <Select
                        className={'col-md-9'}
                        value={category}
                        onChange={this.handleCategory}
                        options={optionsMap}
                        placeholder={category || 'Please select or type a category...'}
                    />
                </div>

                <div className={'row'}>
                    <ProgrammesDisplay
                        programmes={programmes}
                        handleClick={this.handleClick}/>
                    <EpisodesDisplay
                        episodes={episodes}
                        episodeTime={this.episodeTime}
                        handleEpisodeClick={this.handleEpisodeClick}
                    />
                    {singleEpisodeDisplay}
                </div>
            </div>
        );

    };

};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);