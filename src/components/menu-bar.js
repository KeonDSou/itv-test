/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: menu-bar.js -
 *      displays the menu bar
 *
 * @author Keoni D'Souza
 */

import {Link} from 'react-router-dom';
import React from 'react';

const MenuBar = () => (
    <div className='row nav-bar'>
        <Link
            to='/'
            className='col-3 nav-item'
            id='home'>
            Home
        </Link>
        <Link
            to='/about'
            className='col-3 nav-item'
            id='about'>
            About
        </Link>
        <Link
            to='/categories'
            className='col-3 nav-item'
            id='categories'>
            Categories
        </Link>
        <Link
            to='/channels'
            className='col-3 nav-item'
            id='channels'>
            Channels
        </Link>
    </div>
);

export default MenuBar;