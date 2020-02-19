/* @flow */

export type PayPalRiskData = {|
    browserUserAgent : string
|};

export function collectRiskData() : PayPalRiskData {
    const browserUserAgent = window.navigator.userAgent;

    return {
        browserUserAgent
    };
}
