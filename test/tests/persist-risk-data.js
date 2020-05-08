/* eslint max-lines: off */

import { isLocalStorageEnabled } from 'belter/src';

import { persistRiskData } from '../../src/data-collector/persist-risk-data';
import { constants } from '../../src/data-collector/constants';


describe('persist risk data cases', () => {
    const riskDataCookies = {
        cookies:       'sc_f=MyNj1ZMuHH7ycH-;Domain=c.paypal.com;Max-Age=157680000;Path=/;Secure;Version=1;Expires=Wed, UGZUWCKM6F_awXE8WyEURJrBYQG=NSZp9DW0Evk_i;Domain=.paypal.com;Max-Age=630720000;Path=/;Secure;Version=1;Expires=Thu',
        paypalDebugId: 3452354345345
    };
    persistRiskData(riskDataCookies);
    it('should successfully get cookies from localstorage ', () => {
        if (isLocalStorageEnabled()) {
            if (riskDataCookies.cookies !== window.localStorage.getItem(constants.localStorageRiskData)) {
                throw new Error(`Expected riskDataCookies to be ${ window.localStorage.getItem(constants.localStorageRiskData)  }, got ${ window.localStorage.getItem(constants.localStorageRiskData) }`);
            }
        }
    });
});
