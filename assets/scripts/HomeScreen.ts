import MainScene from "./MainScene";
import { AudioPlayId } from "./config/AudioPlayId";
import { GameData } from "./GameData";
import { ResUtil } from "./ResUtil";
import MyRoom from "./room/MyRoom";
import { ItemConfig } from "./objects/more/ItemLoot";
import { FBInstantGames } from "./plugins/fb/FBInstantGames";
import { GameTracking } from "./plugins/tracking/GameTracking";
import CastleScreen from "./CastleScreen";
import { GameConfig } from "./config/GameConfig";
import PlayScreen from "./PlayScreen";
import { LocalStorageManager } from "./base/LocalStorageManager";
import AudioManager from "./base/audio/AudioManager";
import SettingsPopup from "./ui/SettingsPopup";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeScreen extends cc.Component {

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Node)
    roomRoot: cc.Node = null;

    @property(cc.Node)
    uiRoot: cc.Node = null;

    backgroundMusic: any = null;
    firstInitStartGame: boolean = true;
    visibleRoomId: number = -1;

    private static _instance: HomeScreen = null;
    public static get instance() {
        return HomeScreen._instance;
    }

    protected onLoad() {
        GameData.initPlayerData(null);
        HomeScreen._instance = this;
        this.activeHomeUI();
        window.rewardDone = function () {
            if (MainScene.instance.rewardType == "watch") {
                let changeCoin = GameConfig.coin_level_bonus;
                cc.log("onClickShowAdsToReceiveBonus: bonus = " + changeCoin);
                GameData.addCoin(changeCoin);
                PlayScreen.instance.nextLevel(null, true);
                PlayScreen.instance.showToastReward(changeCoin, 2, 0.5);
            } else if (MainScene.instance.rewardType == "skip") {
                GameData.saveLevelUp();
                PlayScreen.instance.nextLevel(null, true);
            } else if (MainScene.instance.rewardType == "claim") {
                watchSkin();
            }
        }
        window.replayDone = function () {
            cc.log("Replay Done");
        }
        window.resumeMusic = function () {
            let sound_effect = JSON.parse(LocalStorageManager.getItem("sound_effect"));
            let sound_music = JSON.parse(LocalStorageManager.getItem("sound_music"));
            if (sound_effect == null) LocalStorageManager.setItem("sound_music", JSON.stringify(true));
            if (sound_music == null) LocalStorageManager.setItem("sound_effect", JSON.stringify(true));
            if (!!sound_effect)
                AudioManager.EffectEnable = true;
            else AudioManager.EffectEnable = false;

            if (!!sound_music)
                AudioManager.MusicEnable = true;
            else AudioManager.MusicEnable = false;
        }
    }

    protected start() {
        // FBInstantGames.getPayloadData((data) => {
        //     if (data) GameTracking.logEventUserFromAd(data.fb_instant_game_ad_id);
        // });
        let sound_effect = JSON.parse(LocalStorageManager.getItem("sound_effect"));
        let sound_music = JSON.parse(LocalStorageManager.getItem("sound_music"));
        if (sound_effect == null) LocalStorageManager.setItem("sound_music", JSON.stringify(true));
        if (sound_music == null) LocalStorageManager.setItem("sound_effect", JSON.stringify(true));
        if (!!sound_effect)
            AudioManager.EffectEnable = true;
        else AudioManager.EffectEnable = false;

        if (!!sound_music)
            AudioManager.MusicEnable = true;
        else AudioManager.MusicEnable = false;
    }

    protected onEnable(): void {
        cc.log("HomeScreen onEnable");
        if (this.roomRoot.childrenCount === 0) {
            this.loadCurrentRoom();
        }
    }

    protected onDisable(): void {
        if (this.backgroundMusic) {
            MainScene.instance.audioPlayer.stopAudioPlay(this.backgroundMusic);
            this.backgroundMusic = null;
        }
    }

    activeHomeUI() {
        cc.log("activeHomeUI");
        this.uiRoot.active = true;
        this.levelLabel.string = "LEVEL " + (GameData.currentLevelId + 1);

        if (!this.backgroundMusic) {
            this.backgroundMusic = MainScene.instance.audioPlayer.playAudio(AudioPlayId.home_music, true);
        }
        // FBInstantGames.sendSessionData(GameData.currentLevelId+1,()=>{})
    }

    initOpenItem(itemConfig: ItemConfig, callback: Function) {
        cc.log("initOpenItem: roomId = " + itemConfig.roomId + ", idInRoom = " + itemConfig.itemId);
        this.uiRoot.active = false;

        let roomId = itemConfig.roomId - 1;

        cc.log("roomId = " + roomId + ", currentRoomId = " + GameData.currentRoomId);
        if (roomId != this.visibleRoomId) {
            this.roomRoot.removeAllChildren();

            this.loadCurrentRoom(() => {
                let myRoom = this.roomRoot.children[0].getComponent(MyRoom);
                if (myRoom) {
                    myRoom.openItem(itemConfig, callback);
                }
            });

        } else if (this.roomRoot.childrenCount > 0) {
            let myRoom = this.roomRoot.children[0].getComponent(MyRoom);
            if (myRoom) {
                myRoom.openItem(itemConfig, callback);
            }
        }
    }

    loadCurrentRoom(callback: Function = null) {
        console.log("loadCurrentRoom: " + GameData.currentRoomId);
        this.loadRoom(GameData.currentRoomId, () => {
            if (callback) callback();

            if (this.firstInitStartGame) {
                this.firstInitStartGame = false;

                this.activeHomeUI();
                MainScene.instance.initStartGame();
            }
        });
    }

    loadRoom(id: number, callback: Function = null) {
        console.log("loadRoom: " + id);
        MainScene.instance.showLoading();

        ResUtil.loadRoomById(id, (prefab) => {
            MainScene.instance.hideLoading();

            if (this.roomRoot.childrenCount > 0) {
                this.roomRoot.removeAllChildren();
            }

            let room = cc.instantiate(prefab);
            this.visibleRoomId = id;
            this.roomRoot.addChild(room);
            if (callback) callback();
        });
    }

    playGame() {
        if (MainScene.instance.loadLevelCallback != undefined) {
            MainScene.instance.showLoading();

            MainScene.instance.loadLevelCallback = (prefab) => {
                MainScene.instance.showGamePlayScreen();
                MainScene.instance.hideLoading();
            };
        } else {
            MainScene.instance.showGamePlayScreen();
        }
        let check = JSON.parse(cc.sys.localStorage.getItem("firstTime"));
        if (!!check) {
            sendCustomAnalyticsEvent("game_start", {});
            cc.sys.localStorage.setItem("firstTime", JSON.stringify(false));
        } else {
            sendCustomAnalyticsEvent("game_replay", { level: GameData.currentLevelReal + 1, score: 0, highScore: 0 });
        }
        sendCustomAnalyticsEvent('game_level', { level: GameData.currentLevelId + 1 });
    }

    onClickSetting() {
        MainScene.instance.showSettingPopup();
    }

    onClickSelectRoom() {
        MainScene.instance.showSelectRoomPopup();
    }

    onClickOutfit() {
        MainScene.instance.showSkinPopup();
    }

    onClickHouse() {
        if (MainScene.instance.loadKingdomBuilderCallback != undefined) {
            MainScene.instance.showLoading();

            MainScene.instance.loadKingdomBuilderCallback = (prefab) => {
                MainScene.instance.showCastleScreen();
                MainScene.instance.hideLoading();
            };
        } else {
            MainScene.instance.showCastleScreen();
        }
    }

    onClickShare() {
        FBInstantGames.onShareGame(() => {
            GameTracking.logEventShareGame(GameData.currentLevelId);
        });
    }

    onClickInvite() {
        FBInstantGames.inviteFriends(() => {
            GameTracking.logEventInviteFriend(GameData.currentLevelId);
        });
    }
    onClickLeaderBoard() {
    }
}
