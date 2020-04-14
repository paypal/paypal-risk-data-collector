/* @flow */
/* constants:true*/

import { isLocalStorageEnabled } from 'belter/src';

import { constants } from './constants';

type CollectRiskDataOptions = {|
    clientMetadataID : string,
    appSourceID : string
|};

/**
*
* Collects P1 risk data: navigator, window, & screen fields, referrer URL, activeXDefined,
* fraudnet-version, flash version, timezone details, checksum, spoof-flag,
* true-browser
*/
export function collectRiskData({ clientMetadataID, appSourceID } : CollectRiskDataOptions) : Object {
    const payload = {};
    let checkSumString = '';
    const fraudnetStart = Date.now();
    const p1Start = Date.now();

    const hash = function(input) {
        let hashVal = 0;
        let char;
        for (let i = 0; i < input.length; i++) {
            char = input.charCodeAt(i);
            hashVal += char;
        }
        // Convert to 32bit integer
        hashVal &= hashVal; // eslint-disable-line no-bitwise
        return hashVal;
    };

    /**
    * Concatenates an element to the checksum string.
    */
    const _addToChecksumString = function(string : string) {
        checkSumString += string;
    };

    /**
    * Sets superCookie and VIDCookie values onto the payload.
    */
    const _setCookiesDataOnPayload = function() {
        // default values null - if no supercookies are found
        if (isLocalStorageEnabled() && window.localStorage.getItem(constants.localStorageRiskData)) {
            payload.localStorageRiskData = window.localStorage.getItem(constants.localStorageRiskData);
        }
    };

    /**
    * Sets fields from the browser's Navigator API.
    */
    const _setNavigatorFields = function() {
        let k;
        const navigatorFields = [
            'appName',
            'appVersion',
            'buildID',
            'cookieEnabled',
            'language',
            'onLine',
            'oscpu',
            'platform',
            'product',
            'productSub',
            'userAgent',
            'vendor',
            'vendorSub'
        ];
        payload.navigator = {};
        for (k = 0; k < navigatorFields.length; k += 1) {
            payload.navigator[navigatorFields[k]] = window.navigator[navigatorFields[k]];
            // Fields for checksum
            if (navigatorFields[k] === 'userAgent') {
                _addToChecksumString(window.navigator[navigatorFields[k]]);
            }
        }
        // For IE 10 and below, window.navigator.language is not supported. Using window.navigator.browserLanguage to get 'language'
        if (typeof window.navigator.language === 'undefined') {
            payload.navigator.language = window.navigator.browserLanguage;
        }
    };
    /**
    * Sets fields from the browser's Screen API.
    */
    const _setScreenFields = function() {
        let k;
        const screenFields = [
            'colorDepth',
            'pixelDepth',
            'height',
            'width',
            'availHeight',
            'availWidth'
        ];
        payload.screen = {};
        for (k = 0; k < screenFields.length; k += 1) {
            payload.screen[screenFields[k]] = window.screen[screenFields[k]];
            if (
                screenFields[k] === 'colorDepth' || screenFields[k] === 'width'
            ) {
                _addToChecksumString(window.screen[screenFields[k]]);
            }
        }
    };

    /**
    * Sets fields from the browser's Window API.
    */
    const _setWindowFields = function() {
        let k;
        const windowFields = [
            'outerHeight',
            'outerWidth',
            'innerHeight',
            'innerWidth',
            'devicePixelRatio'
        ];
        payload.window = {};
        for (k = 0; k < windowFields.length; k += 1) {
            payload.window[windowFields[k]] = window[windowFields[k]];
        }
    };

    /**
    * Sets the referrer URL.
    * Note the intentional spelling difference between "referrer" and "referer"
    * In FraudNet, we use "referer"
    */
    const _setReferrerURL = function() {
        payload.referer = document.referrer;
        payload.URL = document.URL;
    };
    /**
    * Sets the FraudNet version number.
    * Typically corresponds to a date in YYYYMMDD format.
    */
    const _setFraudNetVersionNumber = function() {
        payload.rvr = constants.FN_RELEASE_VERSION;
    };
    /**
        * Checks if the ActiveXObject is defined (only available on IE)
        */
    const _setActiveXDefined = function() {
        payload.activeXDefined = typeof window.ActiveXObject !== 'undefined';
    };

    /**
    * Sets the Flash-Player version, if it is available.
    */
    const _setFlashVersion = function() {
        const fpMap = {
            UNDEFINED:          'undefined',
            SHOCKWAVE_FLASH:    'Shockwave Flash',
            SHOCKWAVE_FLASH_AX: 'ShockwaveFlash.ShockwaveFlash',
            FLASH_MIME_TYPE:    'application/x-shockwave-flash'
        };
        const flashPlayerVersion = [ 0, 0, 0 ];
        let description;

        if (
            typeof navigator.plugins !== fpMap.UNDEFINED && typeof navigator.plugins[fpMap.SHOCKWAVE_FLASH] === 'object'
        ) {
            try {
                description = navigator.plugins[fpMap.SHOCKWAVE_FLASH].description;
                // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                if (description && !(typeof navigator.mimeTypes !== fpMap.UNDEFINED &&
                    navigator.mimeTypes[fpMap.FLASH_MIME_TYPE] &&
                    !navigator.mimeTypes[fpMap.FLASH_MIME_TYPE].enabledPlugin)
                ) {
                    description = description.replace(
                        /^[\w\W]*\s+(\S+\s+\S+$)/,
                        '$1'
                    );
                    flashPlayerVersion[0] = parseInt(
                        description.replace(/^([\w\W]*)\.[\w\W]*$/, '$1'),
                        10
                    );
                    flashPlayerVersion[1] = parseInt(
                        description.replace(
                            /^[\w\W]*\.([\w\W]*)\s[\w\W]*$/,
                            '$1'
                        ),
                        10
                    );
                    flashPlayerVersion[2] = (/[a-zA-Z]/).test(description)
                        ? parseInt(
                            description.replace(
                                /^[\w\W]*[a-zA-Z]+([\w\W]*)$/,
                                '$1'
                            ),
                            10
                        )
                        : 0;
                }
            } catch (e) {
                // empty
            }
        } else if (typeof window.ActiveXObject !== fpMap.UNDEFINED) {
            try {
                const ActiveXObject = new window.ActiveXObject(
                    fpMap.SHOCKWAVE_FLASH_AX
                );
                if (ActiveXObject) {
                    description = ActiveXObject.GetVariable('$version');
                    if (description) {
                        description = description.split(' ')[1].split(',');
                        flashPlayerVersion[0] = parseInt(description[0], 10);
                        flashPlayerVersion[1] = parseInt(description[1], 10);
                        flashPlayerVersion[2] = parseInt(description[2], 10);
                    }
                }
            } catch (e) {
                // empty
            }
        }

        // place flashVersion into payload
        payload.flashVersion = {
            major:   flashPlayerVersion[0],
            minor:   flashPlayerVersion[1],
            release: flashPlayerVersion[2]
        };
    };


    /**
    * Sets the timezone details.
    * tz - getTimezoneOffset in the Date API (in milliseconds)
    * tzName - jsTimezoneDetect 3rd party library
    * dst - Boolean for daylight's savings. Moving to back-end.
    */
    const _setTimezoneDetails = function() {
        // getTimezoneOffset returns a value in minutes
        // changing to milliseconds before returning for comparisons
        // inverting positive and negative, see
        // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        payload.tz = -(new Date().getTimezoneOffset() * 60000);
        if (Intl.DateTimeFormat() && Intl.DateTimeFormat().resolvedOptions() && Intl.DateTimeFormat().resolvedOptions().timeZone) {
            payload.tzName =  Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        if (payload.tzName) {
            _addToChecksumString(payload.tzName);
        }
        payload.dst = true;
    };

    /**
    * Sets the P1 timing details.
    * time - Date.now()
    * i - iframe loading time
    * pp1 - "pre-post1", the time from app-start to finish collecting P1.
    * cd1 - time to collect p1 data.
    */
    const _setP1TimingDetails = function() {
        const preP1PostTime = Date.now();
        _addToChecksumString(preP1PostTime.toString());
        payload.time = preP1PostTime;

        payload.pt1 = {
            pp1: (preP1PostTime - fraudnetStart).toFixed(2),
            cd1: (preP1PostTime - p1Start).toFixed(2)
        };
    };

    /*
    * Sets a four-digit spoof flag.
    * Checks user agent, global properties, outer width/height, selenium.
    * 0 is false; 1 is true. 0000 means all methods return false. cannot find any suspect script detection.
    * the last digit (selenium check) works for firefox only from the front end code, we will merge the result
    * at backend for other browsers.
    */
    const _generateSpoofFlag = function() {
        let result = [ 0, 0, 0, 0 ];
        const propEnum = {
            NO:        0,
            YES:       1,
            PHANTOMJS: 2,
            NODEJS:    3,
            COUCHJS:   4,
            RHINO:     5,
            CHROMIUM:  6
        };
        // 1st digit - userAgentCheck
        (function userAgentCheck() {
            // convenience function
            const _indexOfString = function(original, keyword) {
                const la = original.length;
                const lb = keyword.length;
                outer: for (let i = 0; i <= la - lb; i++) {
                    for (let j = 0; j < lb; j++) {
                        if (keyword.charAt(j) !== original.charAt(i + j)) {
                            continue outer;
                        }
                    }
                    return i;
                }
                return -1;
            };
            // search if there is a phantomjs in the UA.
            try {
                if (
                    _indexOfString(
                        window.navigator.userAgent.toLowerCase(),
                        decodeURIComponent('%70%68%61%6E%74%6F%6D%6A%73')
                    ) > -1
                ) {
                    result[0] = propEnum.YES;
                    return;
                }
                result[0] = propEnum.NO;
            } catch (e) {
                result[0] = propEnum.NO;
            }
        }());
        // 2nd digit - globalPropertiesCheck
        (function globalPropertiesCheck() {
            // some headless specific properties
            try {
                if (window.callPhantom || window._phantom || window.phantom) {
                    result = result.concat(propEnum.PHANTOMJS);
                    result[1] = propEnum.PHANTOMJS;
                    return;
                }
                if (window.Buffer) {
                    result[1] = propEnum.NODEJS;
                    return;
                }
                if (window.emit) {
                    result[1] = propEnum.COUCHJS;
                    return;
                }
                if (window.spawn) {
                    result[1] = propEnum.RHINO;
                    return;
                }
                if (window.doAutomation || window.domAutomationController) {
                    result[1] = propEnum.CHROMIUM;
                    return;
                }
                result[1] = propEnum.NO;
            } catch (e) {
                result[1] = propEnum.NO;
            }
        }());
        // 3rd digit - sizeCheck
        (function sizeCheck() {
            try {
                if (window.outerWidth === 0 && window.outerHeight === 0) {
                    result[2] = propEnum.YES;
                    return;
                }
                result[2] = propEnum.NO;
            } catch (e) {
                result[2] = propEnum.NO;
            }
        }());
        // 4th digit - seleniumCheck
        (function seleniumCheck() {
            try {
                if (window.document.$cdc_asdjflasutopfhvcZLmcfl_.cache_) {
                    // chrome selenium properties. we have more enhanced logic at backend to
                    // identify chrome selenium.
                    result[3] = propEnum.YES;
                    return;
                }
            } catch (e) {
                // empty
            }
            try {
                if (
                    window.document.documentElement.getAttribute(
                        decodeURIComponent('%77%65%62%64%72%69%76%65%72')
                    )
                ) {
                    // firefox
                    // decoded string = webdriver
                    result[3] = propEnum.YES;
                    return;
                }
            } catch (e) {
                // empty
            }
            try {
                if (
                    decodeURIComponent(
                        '%5F%53%65%6C%65%6E%69%75%6D%5F%49%44%45%5F%52%65%63%6F%72%64%65%72'
                    ) in window
                ) {
                    // a firefox plugin
                    // decoded string "_Selenium_IDE_Recorder"
                    result[3] = propEnum.YES;
                    return;
                }
            } catch (e) {
                // empty
            }
            try {
                if (
                    decodeURIComponent(
                        '%5F%5F%77%65%62%64%72%69%76%65%72%5F%73%63%72%69%70%74%5F%66%6E'
                    ) in document
                ) {
                    // IE
                    // decoded string "__webdriver_script_fn"
                    result[3] = propEnum.YES;
                    return;
                }
            } catch (e) {
                // empty
            }
            result[3] = propEnum.NO;
        }());

        return result.join('');
    };

    /**
    * Sets the trueBrowser property.
    */
    const _setTrueBrowser = function() {
        /* var browserEnum = { UNDEFINED : -1, CHROME : 1, OPERA : 2, FIREFOX : 3,SAFARI : 4, IE : 5, EDGE : 6,
            MOBILE_CHROME : 7, MOBILE_SAFARI : 8, SAFARI_WEBVIEW : 9, MOBILE_FIREFOX : 10, EDEGE_CHROMIUM : 11 };
        */
        try {
            if ((window.opr && window.opr.addons) || window.opera) {
                return 2;
            }
            // $FlowFixMe
            if (typeof InstallTrigger !== 'undefined') {
                if (typeof window.orientation !== 'undefined') {
                    return 10;
                } else {
                    return 3;
                }
            }
            if (
                /* @cc_on!@*/ false ||
                typeof document.documentMode !== 'undefined'
            ) {
                return 5;
            }
            if (typeof window.StyleMedia !== 'undefined') {
                return 6;
            }

            const isChrome = window.chrome;
            if (isChrome) {
                if (!window.location.fragmentDirective &&
                window.clientInformation.plugins &&
                window.clientInformation.plugins.length > 0 &&
                window.clientInformation.plugins[0].name.indexOf('Edge') >= 0) {
                    return 11;
                } else if (window.location.fragmentDirective &&
                window.clientInformation.plugins &&
                window.clientInformation.plugins.length > 0 &&
                window.clientInformation.plugins[0].name.indexOf('Chrome') >= 0) {
                    return 1;
                }
                const isMobile = typeof window.orientation !== 'undefined';
                if (isMobile) {
                    return 7;
                }
            }
            if (typeof window.__firefox__ !== 'undefined') {
                return 10;
            }
            if (
                typeof window.__gCrWeb !== 'undefined' || typeof window.__crWeb !== 'undefined' ||
                typeof window.FormControlElement !== 'undefined'
            ) {
                return 7;
            }
            const isSafari = (typeof document !== 'undefined' &&
                    // $FlowFixMe
                    typeof document.onwebkitmouseforcechanged !== 'undefined') ||
                    typeof window.webkitNotifications !== 'undefined' ||
                    Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            if (isSafari) {
                // $FlowFixMe
                const isMobileS = typeof navigator.standalone !== 'undefined' &&
                    typeof window.orientation !== 'undefined';
                if (!isMobileS) {
                    return 4;
                } else {
                    if (Boolean(navigator.mediaDevices) || (window.statusbar && window.statusbar.visible) ||
                        (window.indexedDB && typeof window.indexedDB.deleteDatabase !== 'undefined' &&
                        typeof window.Animation !== 'undefined')
                    ) {
                        if (window.webkit &&
                            typeof window.webkit.messageHandlers !== 'undefined') {
                            return 9;
                        } else {
                            return 8;
                        }
                    } else {
                        return 9;
                    }
                }
            }
            return -1;
        } catch (e) {
            return -1;
        }
    };

    /**
    * Converts the checksumString to a 32-bit integer, to 2 decimal places.
    *
    * Currently a combination of:
    * 1. userAgent,
    * 2. screen's colorDepth & width,
    * 3. timezone name,
    * 4. and epoch timestamp.
    */
    const _generateChecksum = function() {
        return hash(checkSumString).toFixed(2);
    };

    const collectP1 = function() {
        _setCookiesDataOnPayload();
        _setNavigatorFields();
        _setScreenFields();
        _setWindowFields();
        _setReferrerURL();
        _setFraudNetVersionNumber();
        _setActiveXDefined();
        _setFlashVersion();
        _setTimezoneDetails();
        _setP1TimingDetails();

        (function _setPt1MiscFields() {
            // $FlowFixMe
            payload.pt1.ph1 = _generateChecksum();
            // $FlowFixMe
            payload.pt1.sf = _generateSpoofFlag();
            // $FlowFixMe
            payload.pt1.tb = _setTrueBrowser();
        }());
        return payload;
    };

    const p1Payload = collectP1();

    return {
        correlationId: clientMetadataID,
        appId:         appSourceID,
        payload:       p1Payload
    };
}
