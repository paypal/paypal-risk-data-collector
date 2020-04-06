
import { collectRiskData } from '../../src/data-collector/data-collector';

describe('risk data collector cases', () => {
    const correlationId = 'testCMID';
    const appSourceID = 'SMART_PAYMENT_BUTTONS';

    const payPalRiskData =  collectRiskData(correlationId, appSourceID);
    console.log('should success', JSON.stringify(payPalRiskData));// eslint-disable-line no-console

    it('should successfully include correlation ID in payload ', () => {
        if (payPalRiskData && payPalRiskData.correlationId) {
            if (correlationId !== payPalRiskData.correlationId) {
                throw new Error(`Expected correlationId to be ${ payPalRiskData.correlationId }, got ${ correlationId }`);
            }
        }
    });
    it('should successfully include activeXDefined in payload ', () => {
        if (payPalRiskData && payPalRiskData.payload && payPalRiskData.payload.activeXObject) {
            const activeXObject = payPalRiskData.payload.activeXObject;
            if (activeXObject !== payPalRiskData.payload.activeXObject) {
                throw new Error(`Expected activeXObject to be ${ window.ActiveXObject  }, got ${ activeXObject }`);
            }
        }
    });
    it('should successfully collect referrer and url in payload ', () => {
        if (payPalRiskData && payPalRiskData.payload && payPalRiskData.payload.referrer) {
            const referrer = payPalRiskData.payload.referrer;
            if (referrer !== document.referrer) {
                throw new Error(`Expected referrer to be ${ document.referrer  }, got ${ referrer }`);
            }
        }
        if (payPalRiskData && payPalRiskData.payload && payPalRiskData.payload.URL) {
            const url = payPalRiskData.payload.URL;
            if (url !== document.URL) {
                throw new Error(`Expected url to be ${ document.URL }, got ${ url }`);
            }
        }
    });
    it('should successfully collect the window navigator properties ', () => {
        if (payPalRiskData && payPalRiskData.payload && payPalRiskData.payload.navigator) {
            const appName = payPalRiskData.payload.navigator.appName;
            if (appName !== window.navigator.appName) {
                throw new Error(`Expected appName to be ${ window.navigator.appName }, got ${ appName }`);
            }
            const appVersion = payPalRiskData.payload.navigator.appVersion;
            if (appVersion !== window.navigator.appVersion) {
                throw new Error(`Expected appVersion to be ${ window.navigator.appVersion }, got ${ appVersion }`);
            }
            const buildID = payPalRiskData.payload.navigator.buildID;
            if (buildID !== window.navigator.buildID) {
                throw new Error(`Expected buildID to be ${ window.navigator.buildID }, got ${ buildID }`);
            }
            const cookieEnabled = payPalRiskData.payload.navigator.cookieEnabled;
            if (cookieEnabled !== window.navigator.cookieEnabled) {
                throw new Error(`Expected cookieEnabled to be ${ window.navigator.cookieEnabled }, got ${ cookieEnabled }`);
            }
            const language = payPalRiskData.payload.navigator.language;
            if (language !== window.navigator.language) {
                throw new Error(`Expected language to be ${ window.navigator.language }, got ${ language }`);
            }
            const onLine = payPalRiskData.payload.navigator.onLine;
            if (onLine !== window.navigator.onLine) {
                throw new Error(`Expected onLine to be ${ window.navigator.onLine }, got ${ onLine }`);
            }
            const oscpu = payPalRiskData.payload.navigator.oscpu;
            if (oscpu !== window.navigator.oscpu) {
                throw new Error(`Expected oscpu to be ${ window.navigator.oscpu }, got ${ oscpu }`);
            }
            const platform = payPalRiskData.payload.navigator.platform;
            if (platform !== window.navigator.platform) {
                throw new Error(`Expected platform to be ${ window.navigator.platform }, got ${ platform }`);
            }
            const product = payPalRiskData.payload.navigator.product;
            if (product !== window.navigator.product) {
                throw new Error(`Expected product to be ${ window.navigator.product }, got ${ product }`);
            }
            const productSub = payPalRiskData.payload.navigator.productSub;
            if (productSub !== window.navigator.productSub) {
                throw new Error(`Expected productSub to be ${ window.navigator.productSub }, got ${ productSub }`);
            }
            const userAgent = payPalRiskData.payload.navigator.userAgent;
            if (userAgent !== window.navigator.userAgent) {
                throw new Error(`Expected userAgent to be ${ window.navigator.userAgent }, got ${ userAgent }`);
            }
            const vendor = payPalRiskData.payload.navigator.vendor;
            if (vendor !== window.navigator.vendor) {
                throw new Error(`Expected vendor to be ${ window.navigator.vendor }, got ${ vendor }`);
            }
            const vendorSub = payPalRiskData.payload.navigator.vendorSub;
            if (vendorSub !== window.navigator.vendorSub) {
                throw new Error(`Expected vendorSub to be ${ window.navigator.vendorSub }, got ${ vendorSub }`);
            }

        }
    });
    it('should successfully collect the window screen properties ', () => {
        if (payPalRiskData && payPalRiskData.payload && payPalRiskData.payload.screen) {
            const colorDepth = payPalRiskData.payload.screen.colorDepth;
            if (colorDepth !== window.screen.colorDepth) {
                throw new Error(`Expected colorDepth to be ${ window.screen.appName }, got ${ colorDepth }`);
            }
            const pixelDepth = payPalRiskData.payload.screen.pixelDepth;
            if (pixelDepth !== window.screen.pixelDepth) {
                throw new Error(`Expected pixelDepth to be ${ window.screen.pixelDepth }, got ${ pixelDepth }`);
            }
            const height = payPalRiskData.payload.screen.height;
            if (height !== window.screen.height) {
                throw new Error(`Expected height to be ${ window.screen.height }, got ${ height }`);
            }
            const width = payPalRiskData.payload.screen.width;
            if (width !== window.screen.width) {
                throw new Error(`Expected width to be ${ window.screen.width }, got ${ width }`);
            }
            const availHeight = payPalRiskData.payload.screen.availHeight;
            if (availHeight !== window.screen.availHeight) {
                throw new Error(`Expected availHeight to be ${ window.screen.availHeight }, got ${ availHeight }`);
            }
            const availWidth = payPalRiskData.payload.screen.availWidth;
            if (availWidth !== window.screen.availWidth) {
                throw new Error(`Expected availWidth to be ${ window.screen.appName }, got ${ availWidth }`);
            }
        }
    });
    it('should successfully collect the window fields ', () => {
        if (payPalRiskData && payPalRiskData.payload && payPalRiskData.payload.window) {
            const outerHeight = payPalRiskData.payload.window.outerHeight;
            if (outerHeight !== window.outerHeight) {
                throw new Error(`Expected outerHeight to be ${ window.outerHeight }, got ${ outerHeight }`);
            }
            if (outerWidth !== window.outerWidth) {
                throw new Error(`Expected outerWidth to be ${ window.outerWidth }, got ${ outerWidth }`);
            }
            if (innerHeight !== window.innerHeight) {
                throw new Error(`Expected innerHeight to be ${ window.innerHeight }, got ${ innerHeight }`);
            }
            if (innerWidth !== window.innerWidth) {
                throw new Error(`Expected innerWidth to be ${ window.innerWidth }, got ${ innerWidth }`);
            }
            if (devicePixelRatio !== window.devicePixelRatio) {
                throw new Error(`Expected devicePixelRatio to be ${ window.devicePixelRatio }, got ${ devicePixelRatio }`);
            }
        }
    });
});
