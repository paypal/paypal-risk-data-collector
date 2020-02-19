/* @flow */

import { collectRiskData } from '../../src/index';

describe('risk data collector cases', () => {

    it('should successfully collect the browser user agent', () => {

        const { browserUserAgent } = collectRiskData();

        if (browserUserAgent !== window.navigator.userAgent) {
            throw new Error(`Expected browserUserAgent to be ${ window.navigator.userAgent }, got ${ browserUserAgent }`);
        }
    });
});
