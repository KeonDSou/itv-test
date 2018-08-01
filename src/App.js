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
            programmeEpisodes: [],
            category: '',
            episodes: []
        };
        this.handleClick = this.handleClick.bind(this);
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

    /**
     * Handles the category selection
     * @param selectedOption User-specified category
     */
    handleCategory = (selectedOption) => {
        this.setState({category: selectedOption.value});
        this.getProgrammes(selectedOption.value);
    };

    // getProgrammeInfo() {
    // const {episodes, programmeEpisodes} = this.state;
    //create title header
    //image
    //guidance text
    //synopsis short
    //synopsis long


    // const episodesArr = [];
    // for (let i = 0; i < prefix.length; i++) {
    //     episodesArr.push({
    //         title: prefix[i].episodeTitle,
    //         image: prefix[i]._links.image.href,
    //         guidance: prefix[i].guidance,
    //         synopsis_90: prefix[i].synopses.ninety,
    //         synopsis_epg: prefix[i].synopses.epg
    //     });
    // }
    // console.log('episodes: ', episodes);
    // return episodes;
    // }

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

    getEpisodeUrl(programme) {

        if (this.state.programmes.length) {
            this.state.programmes.map((res) => {
                if (res.title === programme) {
                    const url = res._embedded.productions._links["doc:productions"].href
                    this.getEpisodes(url);
                    this.setState({programmeUrl: url});
                }
            })
        }
    }

    formatDate(broadcastDate) {
        const date = broadcastDate.toLocaleDateString('en-gb')
            + ' | '
            + broadcastDate.toLocaleTimeString().replace(':00', '').toLowerCase();
        return (date);
    }

    /**
     * Handles the programme selection
     * @param e User-selected programme (as an event)
     */
    handleClick(e) {
        e.preventDefault();
        console.log(e.target.className);
        this.setState({programme: e.target.className});
        this.getEpisodeUrl(e.target.className);
    }

    render() {
        // Removes the need for 'this.state' prefix
        const {categories, category, programmes, episodes} = this.state;
        // Title appears only when a category is selected
        const catProgList = categories ? <h2>{category} Programme List</h2> : undefined;
        // Formats options for drop-down box
        const optionsMap = categories.map(category => ({
            value: category.name,
            label: category.name
        }));


        console.log('episodes arr', episodes);

        const programmesDisplay = (
            <div className={'row'}>
                {programmes.map(programme => {
                    return <div
                        onClick={this.handleClick}
                        id={'programme-card'}
                        className={'col-lg-4 col-lg-6 '}
                        key={programme.title}>
                        <h3
                            className={programme.title}
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
                    const broadcastDate = new Date(episode.broadcastDateTime.original)
                    console.log('episode am i here', episode)
                    return <div
                        id={'episode-card'}
                        className={'col-lg-4 col-lg-6 '}
                        key={episode.productionId}
                    >
                        <h3
                            className={episode.title}
                        >{episode.episodeTitle || episode._embedded.programme.title}</h3>
                        <p>{this.formatDate(broadcastDate)}</p>
                        <img
                            className={episode.title}
                            src={episode.image}
                            alt={episode.title}
                        />
                        <p
                            className={episode.title}
                        >{episode.synopsis_90}</p>
                    </div>
                })}
            </div>
        );

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
        </div>;

    };

};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);