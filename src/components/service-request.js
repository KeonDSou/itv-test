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
    `http://discovery.hubsvc.itv.com/platform/itvonline/ctv`;

function ServiceRequest() {
    return {
        get: function (params) {
            const defaultDomain = DOMAIN
                + '/'
                + params.queryProp
                + '?broadcaster=ITV&features=hls,aes&category='
                + params.category;
            const conditionalDomain = params.url ? params.url : defaultDomain;
            const ACCEPT_HEADER =
                `application/vnd.itv.hubsvc.${params.headerProp}.v3+hal+json; charset=UTF-8`;
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