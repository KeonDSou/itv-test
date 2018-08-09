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

const SingleEpisodeDisplay = ({ data, label, time}) => {
    const categoryName = data && data._embedded.categories.map(item => item.name).join(', ');
    return (data ? (
            <div className={'single-episode'}>
                <div className={'row'}>
                    <h1 className='col-sm-10 prog-title'>
                        {data._embedded.programme.title}
                    </h1>
                    <img className={'col-sm-2 channel'}
                         src={data._embedded.channel._links.primaryImage.href}
                         alt={`${data._embedded.channel.name} logo`}
                    />
                </div>

                <img className={'image'}
                     src={data._links.image.href}
                     alt={data.episodeTitle}
                />

                {label}

                <div
                    id={data.episodeTitle}
                    data-id={data.productionId}
                >
                    {data.guidance ? <p id={data.episodeTitle} data-id={data.productionId}>
                        Guidance:
                        <span className={'guidance'}>{' ' + data.guidance}</span>
                    </p>: undefined}
                </div>

                <p className='synopsis'>{data.synopses.epg}</p>

                <p>{time(data)}</p>
                <p>Category: <em>{categoryName}</em></p>
            </div>
        )
        : '')
};

export default SingleEpisodeDisplay;