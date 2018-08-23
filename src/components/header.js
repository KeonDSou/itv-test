/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: header.js -
 *      displays the header
 *
 * @author Keoni D'Souza
 */

import MenuBar from './menu-bar';
import React from 'react';
import Select from 'react-select';

const itvHubLogo =
    'https://upload.wikimedia.org/wikipedia/en/0/0a/ITV_Hub_Logo.png';

const Header = (
    {
        category,
        handleCategory,
        options
    }
) => (
    <div className='row header'>
        <div className='col-3'>
            <a href='/'>
                <img
                    id='itv-hub-logo'
                    src={itvHubLogo}
                    alt='ITV Hub Logo'
                />
            </a>
        </div>
        <div className='col-9'>
            <MenuBar/>
            {/* Search bar/drop-down */}
            <Select
                value={category}
                onChange={handleCategory}
                options={options}
                placeholder={category.replace('amp;', '')
                || 'Please select or type a category...'}
            />
        </div>
    </div>
);

export default Header;