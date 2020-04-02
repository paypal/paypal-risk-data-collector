/**
*
* Persist risk data: save the cookies returned from backend in localstorage
*
*/
export function persistRiskData(riskDataCookies) {
    if (riskDataCookies) {
        riskDataCookies.forEach(cookie => {
            for (const key in cookie) {
                if (cookie.hasOwnProperty(key)) {
                    // console.log(`${ key  } -> ${  cookie[key] }`);// eslint-disable-line no-console
                    window.localStorage.setItem(key, cookie[key]);
                }
            }
        });
    }
}
