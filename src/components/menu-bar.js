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

import {Link} from "react-router-dom";
import React from "react";

const MenuBar = () => (
    <div className='row nav-bar'>
        <Link
            to='/'
            className='col-3 nav-item'
            id='children'>
            Home
        </Link>
        <Link
            to='/about'
            className='col-3 nav-item'
            id='comedy'>
            About
        </Link>
        <Link
            to='/categories'
            className='col-3 nav-item'
            id='drama-soaps'>
            Categories
        </Link>
        <Link
            to='/channels'
            className='col-3 nav-item'
            id='entertainment'>
            Channels
        </Link>
    </div>
);

export default MenuBar;