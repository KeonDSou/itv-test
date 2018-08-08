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
     * Converts ISO date into a more readable format
     * @param date Date to be formatted
     * @returns {string} Formatted date
     */
    formatDate(date) {
        return date.toLocaleDateString('en-gb')
            + ' | '
            + date.toLocaleTimeString().replace(':00', '').toLowerCase();
    }

    /**
     * Calculates how many days are left to watch an episode
     * @param episode Episode in question
     * @returns {string} Days left (formatted)
     */
    getAvailability(episode) {
        const expiryDate = new Date(episode._embedded.variantAvailability[0].until);
        const currentDate = new Date();
        const daysLeft =
            Math.round(
                Math.abs(
                    (expiryDate.getTime() - currentDate.getTime()) / (86400000)
                )
            );
        // For 1+ days remaining
        if (daysLeft !== 0) return ` | ${daysLeft} day${(daysLeft === 1) ? `` : `s`} left`;
        // For 0 days remaining
        else return ' | Expires today';
    }

    /**
     * Label detailing last broadcast date and time, duration and day left
     * @param episode Episode in question
     * @returns {string} Label (formatted)
     */
    episodeInfoLabel(episode) {
        const broadcastDate = new Date(episode.broadcastDateTime.commissioning);
        return 'Last shown: '
            + this.formatDate(broadcastDate)
            + ' | '
            + episode.duration.display
            + this.getAvailability(episode);
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
        // console.log('episodes ->', this.state.episodes);
        // Search through the episodes where the titles match
        console.log('e.target -->', e.target, '<-- e.target');
        console.log('e.target.data-id -->', e.target.dataset.id, '<-- e.target.data-id');


        const episodeDetails = this.state.episodes.filter(
            episode => episode.productionId === e.target.dataset.id);

        console.log('episode details: ', episodeDetails[0]);
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

        const categoryName = episodeData && episodeData._embedded.categories.map(item => {

            console.log('item ===>', item );
            return (<p>Category: <em>{item.name}</em></p>);
        });

        const episodesDisplay = (
            <div className={'row'}>
                {episodes.map(episode => {
                    return <div
                        onClick={this.handleEpisodeClick}
                        className={'col-lg-4 col-lg-6'}
                        id={episode.episodeTitle}
                        key={episode.episodeId || episode.productionId}
                    >
                        <h3
                            className='title'
                            id={episode.episodeTitle}
                            data-id={episode.productionId}
                        >
                            {episode.episodeTitle || episode._embedded.programme.title}</h3>
                        <p
                            className='episode-date-time'
                            id={episode.episodeTitle}
                            data-id={episode.productionId}
                        >
                            {this.episodeInfoLabel(episode)}
                        </p>

                        <img
                            className='image'
                            id={episode.episodeTitle}
                            src={episode._links.image.href}
                            alt={episode.episodeTitle}
                            data-id={episode.productionId}
                        />

                            {episode.guidance ? <p id={episode.episodeTitle} data-id={episode.productionId}>
                                Guidance:
                                <span className={'guidance'}>{' ' + episode.guidance}</span>
                                </p>: undefined}
                        <p
                            className='synopsis'
                            id={episode.episodeTitle}
                            data-id={episode.productionId}
                        >
                            {episode.synopses.ninety}
                        </p>
                    </div>
                })}
            </div>
        );

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

                    <p
                        id={episodeData.episodeTitle}
                        data-id={episodeData.productionId}
                    >
                        {episodeData.guidance ? <p id={episodeData.episodeTitle} data-id={episodeData.productionId}>
                            Guidance:
                            <span className={'guidance'}>{' ' + episodeData.guidance}</span>
                        </p>: undefined}
                    </p>

                    <p className='synopsis'>{episodeData.synopses.epg}</p>

                    <p>{this.episodeInfoLabel(episodeData)}</p>
                    {categoryName}
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
                    <ProgrammesDisplay programmes={programmes}
                    handleClick = {this.handleClick}/>
                    {episodesDisplay}
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