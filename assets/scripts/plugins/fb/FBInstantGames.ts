import GUIUtil from "../../base/utils/GUIUtil";
import { GameTracking } from "../tracking/GameTracking";

export class FBInstantGames {

    private static templateShare = 'Try Home Pin Now';
    private static templateInvite = {
        cta: 'Play',
        text: {
            default: 'Try Home Pin Now',
            localizations: {
                ar_AR: 'Try Home Pin Now',
                en_US: 'Try Home Pin Now',
                es_LA: 'Try Home Pin Now'
            }
        }
    };

    public static onQuitGame() {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.quit();
    }

    public static onShareGame(callback: Function = null) {
        if (typeof FBInstant === 'undefined') return;
        let temp = window['templateShare'];
        if (!temp) temp = FBInstantGames.templateShare;
        let imgBase64 = GUIUtil.getImgBase64();
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: imgBase64,
            text: temp,
            data: {myReplayData: '...'},
        }).then(() => {
            // continue with the game.
            if (callback) callback();
        });
    }

    public static inviteFriends(callback: Function = null) {
        if (typeof FBInstant === 'undefined') return;
        let imgBase64 = GUIUtil.getImgBase64();
        let temp = window['templateInvite'];
        if (!temp) temp = FBInstantGames.templateInvite;

        FBInstant.context
            .chooseAsync()
            .then(function () {
                console.log("chooseAsync: " + FBInstant.context.getID());

                FBInstant.updateAsync({
                    action: 'CUSTOM',
                    cta: temp.cta,
                    image: imgBase64,
                    text: temp.text,
                    template: 'VILLAGE_INVASION',
                    data: {myReplayData: '...'},
                    strategy: 'IMMEDIATE',
                    notification: 'NO_PUSH',
                }).then(function () {
                    // closes the game after the update is posted.
                    console.log("inviteFriends DONE");
                    if (callback) callback();
                });
            });
    }

    public static createShortcut(callback: Function = null) {
        console.log('createShortcut');
        if (typeof FBInstant === 'undefined') return;
        FBInstant.canCreateShortcutAsync()
            .then(function (canCreateShortcut) {
                if (canCreateShortcut) {
                    FBInstant.createShortcutAsync()
                        .then(function () {
                            // Shortcut created
                            if (callback) callback();
                        })
                        .catch(function (e) {
                            // Shortcut not created
                            console.log('Shortcut not created: ' + e.message);
                        });
                }
            });
    }

    public static subscribeMessengerBot(callback: Function = null) {
        console.log('subscribeMessengerBot');
        if (typeof FBInstant === 'undefined') return;
        FBInstant.player.canSubscribeBotAsync().then(function (can_subscribe) {
            console.log("canSubscribeBot: ",can_subscribe)
            if (can_subscribe) {
                FBInstant.player.subscribeBotAsync()
                .then(function(){
                    FBInstant.setSessionData({
                        optin: true
                    });
                    GameTracking.logEventOptinMessage(true);
                }
                ).catch(function (e) {
                    FBInstant.setSessionData({
                        optin: false
                    });
                    GameTracking.logEventOptinMessage(false);
                });
            }
        });
        
    }

    public static sendSessionData(currentLevel,callback: Function=null){
        if (typeof FBInstant === 'undefined') return;
        FBInstant.setSessionData({
            currentLevel:currentLevel
          });
    }

    public static getPayloadData(callback: Function=null){
        if (typeof FBInstant === 'undefined') return;
        const payload = FBInstant.getEntryPointData();
        if(payload) callback(payload);
        else callback(null);
    }
}