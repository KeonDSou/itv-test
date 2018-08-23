/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: episodes-display.js -
 *      displays the episodes of a chosen programme
 *
 * @author Keoni D'Souza
 */

import React from 'react';

const EpisodesDisplay = (
    {
        episodes,
        broadcastInfo,
        handleEpisodeClick
    }
) => {
    return <div className='row'>
        {episodes.map(episode => {
            const title = episode.episodeTitle;
            const programmeTitle = episode._embedded.programme.title;
            // If there is an episode number ...
            const seriesEpisodeNumber = (episode.episode)
                // ... and if there is a series number > 1
                ? (episode.series && episode.series !== 1)
                    // Display series and episode number if present
                    ? ('Series ' + episode.series + ': Episode ' + episode.episode)
                    // Display just episode number if present
                    : ('Episode ' + episode.episode)
                // Display programme title if both don't exist
                : programmeTitle;

            return <div
                onClick={handleEpisodeClick}
                className='col-lg-4 col-lg-6'
                id='episode-card'
                key={episode.episodeId || episode.productionId}
                data-id={episode.productionId}
            >
                <div className='row header'
                     data-id={episode.productionId}
                >
                    <h3 className='col-sm-10 prog-title'
                        data-id={episode.productionId}
                    >
                        {/* Refer to lines 23-34 */}
                        {title || seriesEpisodeNumber || programmeTitle}
                    </h3>
                    <img className='col-sm-2 channel'
                         data-id={episode.productionId}
                         src={episode._embedded.channel._links.primaryImage.href}
                         alt={episode._embedded.channel.name}
                    />
                </div>

                <p className='episode-date-time'
                   id={title}
                   data-id={episode.productionId}
                >
                    {broadcastInfo(episode).lastShown
                    + ' | '
                    + broadcastInfo(episode).duration
                    + ' | '
                    + broadcastInfo(episode).expiry}
                </p>

                <img className='image'
                     id={title}
                     src={episode._links.image.href}
                     alt={title}
                     data-id={episode.productionId}
                />

                {/* Display guidance box, if applicable */}
                {episode.guidance ?
                    <p className='guidance-box'
                       id={title}
                       data-id={episode.productionId}
                    >
                        {`\u24BC ${episode.guidance}`}
                    </p> : undefined}

                <p className='synopsis'
                   id={title}
                   data-id={episode.productionId}
                >
                    {episode.synopses.ninety}
                </p>
            </div>
        })}
    </div>
};

export default EpisodesDisplay;