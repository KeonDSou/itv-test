/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: programmes-display.js -
 *      displays the programmes within a chosen category
 *
 * @author Keoni D'Souza
 */

import React from 'react';

const ProgrammesDisplay = (
    {programmes, handleClick}
) => {
    return (
        <div className={'row'}>
            {programmes.map(programme => {
                return <div
                    onClick={handleClick}
                    id={'programme-card'}
                    className={'col-lg-4 col-lg-6 '}
                    key={programme.title}>

                    <div className='row header'>
                        <h3 className='col-sm-10 prog-title'>
                            {programme.title}
                        </h3>
                        <img className={'col-sm-2 channel'}
                             src={programme._embedded.latestProduction._embedded.channel._links.primaryImage.href}
                             alt={`${programme._embedded.latestProduction._embedded.channel.name} logo`}
                        />
                    </div>

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
    )
};

export default ProgrammesDisplay;