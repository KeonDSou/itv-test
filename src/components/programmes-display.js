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

/**
 * TODO Add programme channel logo
 */

const ProgrammesDisplay = (
    {programmes, handleClick}
    ) => {
    return <div className={'row'}>
        {programmes.map(programme => {
            return <div
                onClick={handleClick}
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
};

export default ProgrammesDisplay;