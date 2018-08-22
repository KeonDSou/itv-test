/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: channels.js -
 *      JSX for the channels page
 *
 * @author Keoni D'Souza
 */

import React from 'react';

const Channels = ({channels}) => (
    <div>
        <h1>Channel Selection</h1>
        <div className='row'>
            {channels
                .map((channel) =>
                    <div className='col-sm-2 channel-bar'
                         id={channel.name}
                         key={channel.name}
                    >
                        <img
                            key={`${channel.name}-bar`}
                            src={channel._links.dogImage.href}
                            alt={channel.name}
                        />
                    </div>
                )
            }
        </div>
        <div className='row'>
            {channels
                .map((channel) =>
                    <div className='col-lg-6 channel-container'
                         key={channel.name}
                    >
                        <img
                            className='channel-background'
                            key={`${channel.name}-background`}
                            src={channel._links.backgroundImage.href}
                            alt={channel.name}
                        />
                        <img
                            className='channel-logo'
                            key={`${channel.name}-logo`}
                            src={channel._links.primaryImage.href}
                            alt={channel.name}
                        />
                        <p className='channel-strapline'
                           id={channel.name}>
                            {channel.strapline}
                        </p>
                    </div>
                )
            }
        </div>
    </div>
);

export default Channels;