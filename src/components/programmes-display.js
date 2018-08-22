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
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

const ProgrammesDisplay = (
    {
        category,
        handleProgrammeClick,
        programmes
    }
) => {
    return (
        <div className='row'>
            {programmes.map(programme => {
                return <div
                    onClick={handleProgrammeClick}
                    id='programme-card'
                    className='col-lg-4 col-sm-6'
                    key={programme.title}
                    data-id={programme.title}
                >
                    <Link
                        to={`/categories/${
                            category
                            }/${
                            programme.title
                                .replace(/\s+/g, '-')
                                .replace(':', '')
                                .replace('!', '')
                                .toLowerCase()
                            }`}
                    >
                        <div className='row header'
                             data-id={programme.title}
                        >
                            <h3 className='col-sm-10 prog-title'
                                data-id={programme.title}
                            >
                                {programme.title}
                            </h3>
                            <img className='col-sm-2 channel'
                                 data-id={programme.title}
                                 src={programme._embedded.latestProduction._embedded.channel._links.primaryImage.href}
                                 alt={`${programme._embedded.latestProduction._embedded.channel.name} logo`}
                            />
                        </div>
                        <img
                            className={'programme-image'}
                            id={programme.title}
                            data-id={programme.title}
                            src={programme._embedded.latestProduction._links.image.href}
                            alt={programme.title}
                        />
                        <p
                            className={programme.title}
                            data-id={programme.title}
                        >
                            {programme.synopses.ninety}
                        </p>
                    </Link>
                </div>
            })}
        </div>
    )
};

export default ProgrammesDisplay;