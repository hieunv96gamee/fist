import {FirebaseTracking} from "../firebase/FirebaseTracking";
import { GATracking } from "../gameanalytics/GATracking";


export class GameTracking {

    public static logEvent(event_name: string, data) {
        FirebaseTracking.logEvent(event_name, data);
    }

    public static logEventPlayLevel(level_play: number, isSuccess: boolean) {
        FirebaseTracking.logEventPlayLevel(level_play, isSuccess);
    }

    public static logEventUnlockSkin(skin_name: string) {
        FirebaseTracking.logEventUnlockSkin(skin_name);
    }

    public static logEventCreateShortCut(current_level: number) {
        FirebaseTracking.logEventCreateShortCut(current_level);
    }

    public static logEventInviteFriend(current_level: number) {
        FirebaseTracking.logEventInviteFriend(current_level);
    }

    public static logEventShareGame(current_level: number) {
        FirebaseTracking.logEventShareGame(current_level);
    }

    public static logEventQuitGame(current_level: number) {
        FirebaseTracking.logEventQuitGame(current_level);
    }

    public static logEventAdLoadFailed(adType: string, errorType: string) {
        FirebaseTracking.logEventAdLoadFailed(adType, errorType);
    }

    public static logEventShowAdFailed(errorType: string) {
        FirebaseTracking.logEventShowAdFailed(errorType);
    }

    public static logEventShowAd(adType: string) {
        FirebaseTracking.logEventShowAd(adType);
    }

    public static logEventOptinMessage(optin: boolean) {
        FirebaseTracking.logEventOptinMessage(optin);
    }

    public static logEventUserFromAd(adId){
        FirebaseTracking.logEventUserFromAd(adId);
        GATracking.logEventUserFromAd(adId);
    }
}