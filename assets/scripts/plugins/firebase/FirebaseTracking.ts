export class FirebaseTracking {

    public static event_create_shortcut = "create_shortcut";
    public static event_invite_friends = "invite_friends";
    public static event_share_game = "share_game";
    public static event_quit_game = "quit_game";
    public static event_play_level = "play_level";
    public static event_unlock_skin = "unlock_skin";


    public static event_show_ad = "show_ad";
    public static event_ad_load_failed = "ad_load_failed";
    public static event_show_ad_failed = "show_ad_failed";

    public static event_optin_message ="optin_message";

    public static logEvent(event_name, data) {
        // console.log("FirebaseTracking.logEvent: " + event_name + " data:" + JSON.stringify(data));
        if (typeof firebase === 'undefined') return;
        firebase.analytics().logEvent(event_name, data);
    }

    public static logEventPlayLevel(level_play: number, isSuccess: boolean){
        FirebaseTracking.logEvent(FirebaseTracking.event_play_level, {
            level: level_play,
            success: isSuccess
        });
    }

    public static logEventUnlockSkin(skin_name: string){
        FirebaseTracking.logEvent(FirebaseTracking.event_unlock_skin, {
            skin: skin_name
        });
    }

    public static logEventCreateShortCut(current_level: number){
        FirebaseTracking.logEvent(FirebaseTracking.event_create_shortcut, {
            level: current_level
        });
    }

    public static logEventInviteFriend(current_level: number){
        FirebaseTracking.logEvent(FirebaseTracking.event_invite_friends, {
            level: current_level
        });
    }

    public static logEventShareGame(current_level: number){
        FirebaseTracking.logEvent(FirebaseTracking.event_share_game, {
            level: current_level
        });
    }

    public static logEventQuitGame(current_level: number){
        FirebaseTracking.logEvent(FirebaseTracking.event_quit_game, {
            level: current_level
        });
    }

    public static logEventAdLoadFailed(adType: string, errorType: string){
        FirebaseTracking.logEvent(FirebaseTracking.event_ad_load_failed, {
            ad_type: adType,
            error_type: errorType
        });
    }

    public static logEventShowAdFailed(errorType: string){
        FirebaseTracking.logEvent(FirebaseTracking.event_show_ad_failed, {
            error_type: errorType
        });
    }

    public static logEventShowAd(ad_type: string){
        FirebaseTracking.logEvent(FirebaseTracking.event_show_ad, {
            type: ad_type
        });
    }

    public static logEventOptinMessage(optin: boolean){
        FirebaseTracking.logEvent(FirebaseTracking.event_optin_message, {
            optin: optin
        });
    }

    public static logEventUserFromAd(id) {
        FirebaseTracking.logEvent('ad_user', {
          ad_id: id
        });
    }
    
}
