/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: category.js -
 *      JSX for each category page
 *
 * @author Keoni D'Souza
 */

import ProgrammesDisplay from "../components/programmes-display";
import React from "react";

const Category = (
    {
        category,
        match,
        programmes,
        handleProgrammeClick
    }
) => (
    <div>
        <h1>{category.replace('amp;', '')}</h1>
        <ProgrammesDisplay
            path={`/${match.params.id}/${category}`}
            programmes={programmes}
            handleProgrammeClick={handleProgrammeClick}
        />
    </div>
);

export default Category;