import { persistRiskData } from '../../src/data-collector/persist-risk-data';

describe('persist risk data cases', () => {

    const cookiesData =  [
        {
            sc_f: '6ZHwyYl4qvckMV4uZVVQLTOeMuTGRnpXtR126X8xcaMqGAfffdW1zJzS-9ypHtOrlnCjltXKBLrhxoYITpM9TIL8pYKglzcvigixWG;Domain=c.paypal.com;Max-Age=157680000;Path=/;Secure;Version=1;Expires=Sun, 30-Mar-2025 23:06:16 GMT; HttpOnly'
        },
        {
            UGZUWCKM6F_awXE8WyEURJrBYQG: 'ahW44aQnP6r9zG7SjSgRqjzNYJ317vUyKYeVthfZBUu6BvCTvXUQ104-W7ZKXk7wMhKWLMZAozP71Pm3;Domain=.paypal.com;Max-Age=630720000;Path=/;Secure;Version=1;Expires=Mon, 26-Mar-2040 23:06:16 GMT; HttpOnly'
        }
    ];
    persistRiskData(cookiesData);
    it('should successfully get cookies from localstorage ', () => {
        cookiesData.forEach(cookie => {
            for (const key in cookie) {
                if (cookie.hasOwnProperty(key)) {
                    if (cookie[key] !== window.localStorage.getItem(key)) {
                        throw new Error(`Expected cookie[key] to be ${ window.localStorage.getItem(key)  }, got ${ window.localStorage.getItem(key) }`);
                    }
                }
            }
        });
    });
});
