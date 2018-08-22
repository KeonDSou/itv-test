import ProgrammesDisplay from "../components/programmes-display";
import React from "react";

const Category = (
    {
        match,
        programmes,
        category,
        handleClick
    }
) => (
    <div>
        <h1>{category.replace('amp;', '')}</h1>
        <ProgrammesDisplay
            path={`/${match.params.id}/${category}`}
            programmes={programmes}
            handleClick={handleClick}
        />
    </div>
);

export default Category;