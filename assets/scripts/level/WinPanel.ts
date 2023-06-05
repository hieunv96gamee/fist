import { GameData } from "../GameData";
import Boss from "../objects/character/Boss/Boss";
import { FBInstantAds } from "../plugins/fb/FBInstantAds";
import PlayScreen from "../PlayScreen";
import { FBInstantGames } from "../plugins/fb/FBInstantGames";
import { GameTracking } from "../plugins/tracking/GameTracking";
import { GameConfig } from "../config/GameConfig";
import Camera = cc.Camera;
import easeOut = cc.easeOut;
import MainScene from "../MainScene";
import AudioManager from "../base/audio/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WinPanel extends cc.Component {

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Label)
    changeCoinLabel: cc.Label = null;

    @property(Camera)
    camera: Camera = null;

    @property(cc.Float)
    cameraScale: number = 1.66;

    @property(cc.Node)
    winNode: cc.Node = null;

    @property(cc.Node)
    loseNode: cc.Node = null;

    protected onEnable(): void {

        this.node.scale = 3.0;
        this.node.position = new cc.Vec3(100, -cc.winSize.height / 2, 0);
        this.levelLabel.string = "LEVEL " + (GameData.currentLevelId + 1);

        if (!Boss.instance) {
            cc.log("Boss.instance is null");
            return;
        }

        let scale = 1 / this.cameraScale;
        let pos = Boss.instance.node.position;
        let dy = (cc.winSize.height - 1280) * scale;
        // cc.log("dy = " + dy);
        pos.y -= dy;


        let dt = 0.3;
        this.focusPanelTo(pos, scale, dt);
        this.focusCameraTo(pos, this.cameraScale, dt);
    }

    protected onDisable(): void {
        cc.Tween.stopAllByTarget(this.camera);
        cc.Tween.stopAllByTarget(this.camera.node);

        this.camera.zoomRatio = 1.0;
        this.camera.node.position = cc.Vec3.ZERO;
    }

    showWin() {
        this.winNode.active = true;
        this.loseNode.active = false;
        this.node.active = true;
        this.showChangeCoin(GameConfig.coin_level_up);

        // setTimeout(() => {
        //     if (PlayScreen.instance.levelPlay % 3 === 0 && PlayScreen.instance.levelPlay >= 10) {
        //         FBInstantGames.inviteFriends(() => {
        //             GameTracking.logEventInviteFriend(GameData.currentLevelId);
        //         });
        //     }
        // }, 300);

    }

    showLose() {
        this.winNode.active = false;
        this.loseNode.active = true;
        this.node.active = true;
        sendCustomAnalyticsEvent("game_end", { level: GameData.currentLevelReal + 1, score: 0, highScore: 0 })
    }

    hide() {
        this.node.active = false;
    }

    showChangeCoin(changeCoin) {
        GameData.addCoin(changeCoin);
        this.changeCoinLabel.string = "+" + changeCoin;
        //todo show effect coin fly
    }

    focusPanelTo(pos: cc.Vec3, scale: number, dt: number = 0.2) {
        cc.tween(this.node).to(dt, {
            position: pos,
            scale: scale
        }, easeOut(5)).start();
    }

    focusCameraTo(pos: cc.Vec3, scale: number, dt: number = 0.2) {
        this.camera.node.position = pos;

        cc.tween(this.camera).to(dt, {
            zoomRatio: scale
        }).start();

        // cc.tween(this.camera.node).to(dt, {
        //     position: pos
        // }).start();
    }

    onClickShowAdsToReceiveBonus() {
        // FBInstantAds.showRewardedVideoAd((err) => {
        //     if (!err) {
        AudioManager.EffectEnable = false;
        AudioManager.MusicEnable = false;
        MainScene.instance.rewardType = "watch";
        rewardEvent();

        //     }
        // });
    }

    onClickShowAdsToSkipLevel() {
        // FBInstantAds.showRewardedVideoAd((err) => {
        //     if (!err) {
        AudioManager.EffectEnable = false;
        AudioManager.MusicEnable = false;
        MainScene.instance.rewardType = "skip";
        rewardEvent();
        //     }
        // });
    }
}
