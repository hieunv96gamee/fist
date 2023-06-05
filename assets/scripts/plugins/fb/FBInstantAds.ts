import {GameData} from "../../GameData";
import {Signal} from "../../base/Signal";
import {GameTracking} from "../tracking/GameTracking";


export class FBInstantAds {

    public static enableAds: boolean;
    public static typeAd = {
        Interstitial: "Interstitial",
        Rewarded: "Rewarded"
    };

    public static adsConfig: {
        Interstitial: string,
        Rewarded: string,
        distanceTime: number,
        distanceLevel: number,
    };

    private static _preloadedInterstitial = null;
    private static _preloadedRewardedVideo = null;

    public static lastTimeShowAds = 0;
    public static lastLevelShowAds = 0;

    public static get isRewardedVideoReady() {
        return FBInstantAds._preloadedRewardedVideo != null;
    }

    public static get isInterstitialReady() {
        return FBInstantAds._preloadedInterstitial != null;
    }

    public static LoadingRewardedVideoSignal = new Signal();

    private static checkInitFBInstant(): boolean {
        if (typeof FBInstant === 'undefined') {
            console.warn("FBInstant is undefined");
            return false;
        }

        if (!FBInstantAds.enableAds) {
            console.warn("FBInstant is not enable");
            return false;
        }
        return true;
    }

    public static preloadInterstitialAd(callback: Function = null) {
        if (!FBInstantAds.checkInitFBInstant()) {
            if (callback) callback();
            return;
        }

        if (FBInstantAds.isInterstitialReady) {
            console.warn("Interstitial ad ready to show");
            if (callback) callback();
            return;
        }

        FBInstant.getInterstitialAdAsync(
            FBInstantAds.adsConfig.Interstitial
        ).then(function (interstitial) {
            // Load the Ad asynchronously
            FBInstantAds._preloadedInterstitial = interstitial;
            return FBInstantAds._preloadedInterstitial.loadAsync();
        }).then(function () {
            console.log('Interstitial preloaded');
            if (callback) callback();
            return;
        }).catch(function (err) {
            console.warn('Interstitial failed to preload: ' + err.message);
            GameTracking.logEventAdLoadFailed(FBInstantAds.typeAd.Interstitial, err.code);
            FBInstantAds._preloadedInterstitial = null;
            if (callback) callback(err);
            return;
        });
    }

    public static showInterstitialAd(callback: Function) {
        if (!FBInstantAds.checkInitFBInstant()) {
            callback();
            return;
        }

        let dl = GameData.currentLevelId - FBInstantAds.lastLevelShowAds;
        if (dl < FBInstantAds.adsConfig.distanceLevel) {
            callback();
            return;
        }

        let currentTime = (new Date()).getTime();
        let dt = (currentTime - FBInstantAds.lastTimeShowAds) / 1000;
        if (dt < FBInstantAds.adsConfig.distanceTime) {
            console.warn("Too many ads shown recently: dt = " + dt);
            callback();
            return;
        }

        if (!FBInstantAds.isInterstitialReady) {

            //try preload
            FBInstantAds.preloadInterstitialAd((err) => {
                if (!err) {
                    FBInstantAds.showInterstitialAd(callback);
                } else {
                    callback(err);
                }
            });
            return;
        }

        FBInstantAds._preloadedInterstitial.showAsync()
            .then(function () {
                console.log('Interstitial ad finished successfully');
                FBInstantAds._preloadedInterstitial = null;
                FBInstantAds.lastTimeShowAds = currentTime;
                FBInstantAds.lastLevelShowAds = GameData.currentLevelId;
                FBInstantAds.preloadInterstitialAd();
                GameTracking.logEventShowAd(FBInstantAds.typeAd.Interstitial);
                callback();
            })
            .catch(function (e) {
                console.warn('Interstitial ad is not shown: ' + e.message);
                FBInstantAds._preloadedInterstitial = null;
                FBInstantAds.preloadInterstitialAd();
                GameTracking.logEventShowAdFailed(e.code);
                callback(e);
            });
    }

    public static preloadRewardedVideoAd(callback: Function = null) {
        if (!FBInstantAds.checkInitFBInstant()) {
            if (callback) callback();
            return;
        }

        if (FBInstantAds.isRewardedVideoReady) {
            console.warn("Rewarded Video Ad ready to show");
            if (callback) callback();
            return;
        }

        FBInstantAds.LoadingRewardedVideoSignal.dispatch(true);

        FBInstant.getRewardedVideoAsync(
            FBInstantAds.adsConfig.Rewarded
        ).then(function (rewarded) {

            // Load the Ad asynchronously
            FBInstantAds._preloadedRewardedVideo = rewarded;
            return FBInstantAds._preloadedRewardedVideo.loadAsync();

        }).then(function () {
            console.log('Rewarded video preloaded');
            FBInstantAds.LoadingRewardedVideoSignal.dispatch(false);
            if (callback) callback();
            return;
        }).catch(function (err) {
            console.warn('Rewarded video failed to preload: ' + err.message);
            GameTracking.logEventAdLoadFailed(FBInstantAds.typeAd.Rewarded, err.code);
            FBInstantAds._preloadedRewardedVideo = null;
            if (callback) callback(err);
            return;
        });
    }

    public static showRewardedVideoAd(callback: Function) {
        if (!FBInstantAds.checkInitFBInstant()) {
            return;
        }

        if (!FBInstantAds.isRewardedVideoReady) {

            //try preload
            FBInstantAds.preloadRewardedVideoAd((err) => {
                if (!err) {
                    FBInstantAds.showRewardedVideoAd(callback);

                } else {
                    callback(err);
                }
            });
            return;
        }

        FBInstantAds._preloadedRewardedVideo.showAsync()
            .then(function () {
                console.log('Rewarded video watched successfully');
                FBInstantAds._preloadedRewardedVideo = null;
                FBInstantAds.lastTimeShowAds = (new Date()).getTime();
                FBInstantAds.preloadRewardedVideoAd();
                GameTracking.logEventShowAd(FBInstantAds.typeAd.Rewarded);
                callback();
            })
            .catch(function (err) {
                console.warn("Rewarded video error: " + JSON.stringify(err));
                FBInstantAds._preloadedRewardedVideo = null;
                FBInstantAds.lastTimeShowAds = (new Date()).getTime();
                FBInstantAds.preloadRewardedVideoAd();
                GameTracking.logEventShowAdFailed(err.code);
                callback(err);
            });
    }

}