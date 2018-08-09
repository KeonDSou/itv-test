/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: single-episode-display.js -
 *      displays an episode of a chosen programme
 *
 * @author Keoni D'Souza
 */

import React from 'react';

const SingleEpisodeDisplay = (
    {episodeData, time}
    ) => {

    /**
     * Label detailing an episode's series number and episode number and title
     * @returns {*} JSX for above
     */
    const label = () => {
        const {broadcastDateTime, episode, episodeTitle, series} = episodeData;
        // For episodes with series ...
        if (series) {
            console.log('qwertyuiop');
            // ... display episode title if present
            if (episodeTitle) {
                return <h2 className={'series-episode-title'}>
                    {'Series ' + series + ':  Episode ' + episode + ' - ' + episodeTitle}
                </h2>
            }
            // ... or just display series and episode number
            else {
                return <h2 className={'series-episode-title'}>
                    {'Series ' + series + ':  Episode ' + episode}
                </h2>
            }
            // Use last broadcast date if there is no series number
        } else {
            const broadcastDate = new Date(broadcastDateTime.commissioning);
            return <h2 className={'series-episode-title'}>{broadcastDate.toLocaleDateString('en-gb')}</h2>
        }
    };

    if (episodeData) {
        const categoryName =
            episodeData._embedded.categories
            && episodeData._embedded.categories
                .map(item => item.name).join(', ');
        return (
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

                {label()}

                <div
                    id={episodeData.episodeTitle}
                    data-id={episodeData.productionId}
                >
                    {episodeData.guidance ? <p id={episodeData.episodeTitle} data-id={episodeData.productionId}>
                        Guidance:
                        <span className={'guidance'}>{' ' + episodeData.guidance}</span>
                    </p> : undefined}
                </div>

                <p className='synopsis'>{episodeData.synopses.epg}</p>

                <p>{time(episodeData)}</p>
                <p>Category: <em>{categoryName}</em></p>
            </div>
        )
    }
    else {
        return <div/>;                                        
    }

};

export default SingleEpisodeDisplay;