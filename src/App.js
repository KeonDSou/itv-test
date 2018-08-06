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
            episodeData: null});
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
        return this.formatDate(broadcastDate)
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

    render() {
        console.log('episode ->', this.state.episodeData);
        // Removes the need for 'this.state' prefix
        const {categories, category, programmes, episodes, episodeData} = this.state;
        // Formats options for drop-down box
        const optionsMap = categories.map(category => ({
            value: category.name,
            label: category.name
        }));


        const programmesDisplay = (
            <div className={'row'}>
                {programmes.map(programme => {
                    return <div
                        onClick={this.handleClick}
                        id={'programme-card'}
                        className={'col-lg-4 col-lg-6 '}
                        key={programme.title}>
                        <h3
                            className='title'
                        >{programme.title}</h3>
                        <img
                            className={programme.title}
                            src={programme._embedded.latestProduction._links.image.href}
                            alt={programme.title}
                        />
                        <p
                            className={programme.title}
                        >{programme.synopses.ninety}</p>
                    </div>
                })}
            </div>
        );

        const episodesDisplay = (
            <div className={'row'}>
                {episodes.map(episode => {
                    const guidance = episode.guidance ? 'Guidance: ' + episode.guidance : undefined;
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

                        <p
                            className='guidance'
                            id={episode.episodeTitle}
                            data-id={episode.productionId}
                        >
                            {guidance}
                        </p>
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

        const singleEpisodeDisplay = 0;
            {/*<div className={'row'}>*/}
                {/*<div*/}
                    {/*data-id={episodeData.productionId}*/}
                    {/*className={'col-lg-4 col-lg-6'}*/}
                    {/*key={episodeData.episodeId || episodeData.productionId}*/}
                {/*>*/}
                    {/*<h3 className='title'>*/}
                        {/*{episodeData.episodeTitle || episodeData._embedded.programme.title}*/}
                        {/*</h3>*/}
                    {/*<p id='episode-date-time'>*/}
                        {/*/!*{this.episodeInfoLabel(episode)}*!/*/}
                        {/*</p>*/}
                    {/*<img className='image'*/}
                         {/*src={episodeData._links.image.href}*/}
                         {/*alt={episodeData.episodeTitle}*/}
                    {/*/>*/}
                    {/*<p className='synopsis'>{episodeData.synopses.ninety}</p>*/}
                {/*</div>*/}
            {/*</div>;*/}

        return <div className={'container'}>
            <a href='.'>
                <img
                    id={'itv_logo'}
                    src={'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/ITV_logo_2013.svg/1200px-ITV_logo_2013.svg.png'}
                    alt={'ITV Logo'}
                />
            </a>

            <Select
                value={category}
                onChange={this.handleCategory}
                options={optionsMap}
                placeholder={category || 'Please select or type a category...'}
            />

            {programmesDisplay}
            {episodesDisplay}
            {singleEpisodeDisplay}
        </div>;

    };

};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);