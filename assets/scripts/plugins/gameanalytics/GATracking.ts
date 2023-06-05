import { FirebaseTracking } from "../firebase/FirebaseTracking";

export class GATracking {
    public static logEventUserFromAd(adId) {
        if(typeof GameAnalytics == undefined) return;
        GameAnalytics("addDesignEvent", "ad_id:"+adId);
    }
}