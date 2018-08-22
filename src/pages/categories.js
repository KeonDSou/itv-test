/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: categories.js -
 *      JSX for the categories page
 *
 * @author Keoni D'Souza
 */

import {Link} from "react-router-dom";
import React from "react";

const Categories = (
    {
        categories,
        handleCategory
    }
) => (
    <div>
        <h1>Category Selection</h1>
        <div className='row categories'>
            {categories.map(
                (category) =>
                    <div className='col-3'
                         key={category.name}>
                        <Link to={`/categories/${
                            category.name
                                .replace(' & ', '-')
                                .toLowerCase()}`}
                        >
                            <div className='category-box'
                                 id={category.name
                                     .replace(' & ', '-')
                                     .toLowerCase()}
                            >
                                <p onClick={handleCategory}>
                                    {category.name}
                                </p>
                            </div>
                        </Link>
                    </div>
            )}
        </div>
    </div>
);

export default Categories;