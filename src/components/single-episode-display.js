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
import moment from 'moment';

const SingleEpisodeDisplay = (
    {
        episodeData,
        broadcastInfo
    }
) => {
    /**
     * Label detailing an episode's series number and episode number and title
     * @returns {*} JSX for above
     */
    const episodeTitleLabel = () => {
        const {
            broadcastDateTime,
            episode,
            episodeTitle,
            series
        } = episodeData;
        // For episodes with series ...
        if (series) {
            // ... display episode title if present
            if (episodeTitle) {
                return <h2 className='series-episode-title'>
                    {'Series ' + series
                    + ':  Episode ' + episode
                    + ' - ' + episodeTitle}
                </h2>
            }
            // ... or just display series and episode number
            else {
                return <h2 className='series-episode-title'>
                    {'Series ' + series + ':  Episode ' + episode}
                </h2>
            }
            // Use last broadcast date if there is no series number
        } else {
            const broadcastDate =
                moment(broadcastDateTime.commissioning)
                // Sets date to UK format
                    .format('dddd Mo MMMM')
                    // Removes minutes from programmes on the hour
                    .replace(':00', '');
            return <h2 className='series-episode-title'>
                {broadcastDate}
            </h2>
        }
    };

    if (episodeData) {
        // Comma-separates multiple categories
        const categoryName =
            episodeData._embedded.categories
            && episodeData._embedded.categories
                .map(item => item.name)
                .join(', ');
        const channel =
            (episodeData._embedded.channel.name)
                .replace(' ', '');
        return <div className='single-episode'>
            <div className='row'>
                <h1 className='col-sm-10 prog-title'>
                    {episodeData._embedded.programme.title}
                </h1>
                <img className='col-sm-2 channel'
                     src={episodeData._embedded.channel
                         ._links.primaryImage.href}
                     alt={episodeData._embedded.channel.name}
                />
            </div>
            <div
                className='row'
                id={episodeData.episodeTitle}
                data-id={episodeData.productionId}
            >
                <div className='col-md-8'>
                    <img className='image'
                         src={episodeData._links.image.href}
                         alt={episodeData.episodeTitle}
                    />
                </div>
                <div className='col-sm-4 right-pane'>
                    {episodeTitleLabel()}
                    {/* Display guidance box, if applicable */}
                    {episodeData.guidance ?
                        <p className='guidance-box'
                           id={episodeData.episodeTitle}
                           data-id={episodeData.productionId}
                        >{`\u24BC ${episodeData.guidance}`}
                        </p> : undefined}
                    
                    <p className='synopsis'>{episodeData.synopses.epg}</p>

                    <div className={`broadcast-info-box-${channel}`}>
                        <p className='info-element'>
                            {broadcastInfo(episodeData).lastShown}
                        </p>
                        <p className='info-element'>
                            {`Duration: ${broadcastInfo(episodeData).duration}`}
                        </p>
                        <p className='info-element'>
                            {`Availability: ${broadcastInfo(episodeData).expiry}`}
                        </p>
                        <p className='info-element'>
                            {`Category: ${categoryName}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    }
    return <div/>;

};

export default SingleEpisodeDisplay;