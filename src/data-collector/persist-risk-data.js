/* @flow */

/**
*
* Persist risk data: save the cookies returned from backend in localstorage
*
*/

import { isLocalStorageEnabled } from 'belter/src';

import { constants } from './constants';

type RiskDataCookies = string;

export function persistRiskData(riskDataCookies : RiskDataCookies) {
    if (isLocalStorageEnabled() && riskDataCookies) {
        window.localStorage.setItem(constants.localStorageRiskData, riskDataCookies);
    }
}
