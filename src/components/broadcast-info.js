/**
 * ITV - Programme Discovery
 *
 * A simple application to allow a user to discover ITV content
 *
 * File: broadcast-info.js -
 *      returns broadcast information about an episode
 *
 * @author Keoni D'Souza
 */

import moment from 'moment';

/**
 * Label detailing last broadcast date and time, duration and days left
 * @param episode Episode in question
 * @returns Formatted label
 */
function broadcastInfo(episode) {
    /**
     * Returns last broadcast date
     */
    const dateTime = 'Last shown: '
        + moment(episode.broadcastDateTime.commissioning)
        // Sets date to UK format
            .format('dddd Mo MMMM h:mma')
            // Removes minutes from programmes on the hour
            .replace(':00', '');

    /**
     * Calculates how many days are left to watch an episode
     */
    const currentDate = new Date();
    const expiryDate =
        new Date(episode._embedded.variantAvailability[0].until);
    const daysLeft =
        Math.round(
            Math.abs(
                (expiryDate.getTime() - currentDate.getTime()) / (86400000)
            )
        );
    const day = () => {
        if (daysLeft === 0) {
            return 'Expires today'
        } else if (daysLeft === 1) {
            return daysLeft + ' day left'
        } else {
            return daysLeft + ' days left'
        }
    };

    return {
        lastShown: dateTime,
        duration: episode.duration.display,
        expiry: day()
    };
}

export default broadcastInfo;