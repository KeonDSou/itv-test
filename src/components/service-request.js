/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: service-request.js -
 *      collects the data from the API
 *
 * @author Keoni D'Souza
 */

import axios from 'axios';

const DOMAIN =
    'http://discovery.hubsvc.itv.com/platform/itvonline/ctv';

function ServiceRequest() {
    return {
        // Simulates the axios get function
        get: function (params) {
            const category = params.category ? `&category=${params.category}` : '';
            const defaultDomain = DOMAIN
                + '/'
                + params.queryProp
                + '?broadcaster=ITV&features='
                + params.features
                + category;
            // Selects domain to pass through ...
            const conditionalDomain = params.url
                ? params.url // ... for getEpisodes
                : defaultDomain; // ... for getCategories, getChannels, getProgrammes
            const ACCEPT_HEADER = 'application/vnd.itv.hubsvc.'
                + params.headerProp
                + '+hal+json; charset=UTF-8';
            return axios({
                method: 'get',
                url: conditionalDomain,
                headers: {
                    Accept: ACCEPT_HEADER
                }
            })
        }
    }
}

export default ServiceRequest;