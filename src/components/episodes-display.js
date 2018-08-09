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
    {episodes, episodeTime, handleEpisodeClick}
    ) => {
    return (
        <div className={'row'}>
            {episodes.map(episode => {
                return <div
                    onClick={handleEpisodeClick}
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
                        {episodeTime && episodeTime(episode)}
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
    )
};

export default EpisodesDisplay;