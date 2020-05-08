/* @flow */

/**
*
* Persist risk data: save the cookies returned from backend in localstorage
*
*/

import { isLocalStorageEnabled } from 'belter/src';

import { constants } from './constants';

type PersistRiskData = {|
    cookies? : string
|};

export function persistRiskData(riskDataCookies : PersistRiskData) {
    if (isLocalStorageEnabled() && riskDataCookies && riskDataCookies.cookies) {
        window.localStorage.setItem(constants.localStorageRiskData, riskDataCookies.cookies);
    }
}
