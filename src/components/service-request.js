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
        get: function (headerProp, queryProp, category) {


            const ACCEPT_HEADER =
                `application/vnd.itv.hubsvc.${headerProp}.v3+hal+json; charset=UTF-8`;
            return axios({
                method: 'get',
                url: `${DOMAIN}/${queryProp}?broadcaster=ITV&features=hls,aes&category=${category}`,
                headers: {
                    Accept: ACCEPT_HEADER
                }
            })
        },
        collectEpisodes: function (url) {
            return axios
                .get(url, {
                    headers: {
                        'Accept': 'application/vnd.itv.hubsvc.production.v3+hal+json; charset=UTF-8'
                    }
                })
        }
    }
}

export default ServiceRequest;