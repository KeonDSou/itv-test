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

// Forms the (consistent) first part of each URL
const DOMAIN =
    'http://discovery.hubsvc.itv.com/platform/itvonline/ctv';

function ServiceRequest() {
    return {
        // Simulates the axios get function
        get: function (params) {
            const category = params.category
                ? `&category=${params.category}`
                : '';
            const channel = params.channel
                ? `&channelId=${params.channel}`
                : '';
            const defaultDomain = DOMAIN
                + '/'
                + params.queryProp
                + '?broadcaster=ITV&features='
                + params.features
                + category
                + channel;
            // Selects domain to pass through ...
            const conditionalDomain = params.url
                // ... for getEpisodes
                ? params.url
                // ... for getCategories, getChannels, getProgrammes, getChannelProgrammes
                : defaultDomain;
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