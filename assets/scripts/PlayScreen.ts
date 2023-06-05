import { QuestType, QuestUtil } from "./config/QuestType";
import MapLevel from "./level/MapLevel";
import { GlobalSignals } from "./config/GlobalSignals";
import { GameData } from "./GameData";
import MainScene from "./MainScene";
import { AudioPlayId } from "./config/AudioPlayId";
import { ResUtil } from "./ResUtil";
import WinPanel from "./level/WinPanel";
import Boss from "./objects/character/Boss/Boss";
import { IconQuest } from "./ui/IconQuest";
import HomeScreen from "./HomeScreen";
import { FBInstantAds } from "./plugins/fb/FBInstantAds";
import { FBInstantGames } from "./plugins/fb/FBInstantGames";
import { GameTracking } from "./plugins/tracking/GameTracking";
import ToastReward from "./ui/ToastReward";
import { LocalStorageManager } from "./base/LocalStorageManager";
import AudioManager from "./base/audio/AudioManager";
import { GameState } from "./config/GameState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayScreen extends cc.Component {

    @property(cc.RichText)
    labelQuest: cc.RichText = null;

    @property(cc.Sprite)
    iconQuest: cc.Sprite = null;

    @property([IconQuest])
    iconConfig: IconQuest[] = [];

    @property(cc.Node)
    levelRoot: cc.Node = null;

    @property(WinPanel)
    winPanel: WinPanel = null;

    @property(ToastReward)
    toastReward: ToastReward = null;

    levelPlay: number = -1;
    countPlayWin: number = 0;
    isContinue: boolean = false;
    backgroundMusic: any = null;

    _questFailSignal;
    _questPassSignal;

    private static _instance: PlayScreen = null;
    public static get instance() {
        return PlayScreen._instance;
    }

    protected onLoad() {
        PlayScreen._instance = this;
        this.isContinue = false;
        this.toastReward.node.active = false;
    }

    protected onEnable(): void {
        if (this.isContinue) {
            cc.log("PlayScreen isContinue");
            return;
        }

        this._questFailSignal = this.onQuestFail.bind(this);
        this._questPassSignal = this.onQuestPass.bind(this);

        GlobalSignals.questFailSignal.add(this._questFailSignal);
        GlobalSignals.questPassSignal.add(this._questPassSignal);

        if (this.levelRoot.childrenCount === 0) {
            this.loadCurrentLevel();
        }

        if (!this.backgroundMusic) {
            this.backgroundMusic = MainScene.instance.audioPlayer.playAudio(AudioPlayId.game_play_music, true);
        }
    }

    protected onDisable(): void {
        MainScene.instance.audioPlayer.stopAllEffect();

        if (this.isContinue) {
            return;
        }
        GlobalSignals.questFailSignal.remove(this._questFailSignal);
        GlobalSignals.questPassSignal.remove(this._questPassSignal);

        if (this.levelRoot.childrenCount > 0) {
            this.levelRoot.removeAllChildren();
        }
        this.unscheduleAllCallbacks();

        if (this.backgroundMusic) {
            MainScene.instance.audioPlayer.stopAudioPlay(this.backgroundMusic);
            this.backgroundMusic = null;
        }
    }

    onQuestFail() {
        let timeExtend = Boss.instance.isGround ? 0 : 0.6;
        this.scheduleOnce(() => {
            this.winPanel.showLose();
            GameTracking.logEventPlayLevel(this.levelPlay, false);
            MainScene.instance.audioPlayer.playAudio(AudioPlayId.game_lose);
        }, 0.8 + timeExtend);
    }

    onQuestPass() {
        if (MapLevel.instance.isQuestCollectItem) {
            this.scheduleOnce(() => {
                this.isContinue = true;
                this.countPlayWin++;
                GameTracking.logEventPlayLevel(this.levelPlay, true);
                GameData.saveLevelUp();

                let itemConfig = MapLevel.instance.itemLoot.itemConfig;
                cc.log("onQuestPass: " + itemConfig.skin);

                MainScene.instance.showHomeScreen((screen) => {
                    let home = screen.getComponent(HomeScreen);
                    home.initOpenItem(itemConfig, () => {
                        MainScene.instance.showGamePlayScreen(() => {
                            this.isContinue = false;
                            this.winPanel.showWin();
                        });
                    });
                });
            }, 0.8);
            return;
        }

        this.isContinue = false;
        let timeExtend = Boss.instance.isGround ? 0 : 0.6;

        this.scheduleOnce(() => {
            this.countPlayWin++;
            this.winPanel.showWin();
            GameData.saveLevelUp();
            GameTracking.logEventPlayLevel(this.levelPlay, true);
            FBInstantGames.subscribeMessengerBot();
        }, 0.8 + timeExtend);


    }

    loadCurrentLevel() {
        this.unscheduleAllCallbacks();
        MainScene.instance.audioPlayer.stopAllEffect();

        FBInstantAds.showInterstitialAd((err) => {
            this.loadLevel(GameData.currentLevelReal);
        });
        ResUtil.releaseLevelById(GameData.currentLevelReal - 1);
        ResUtil.loadLevelById(GameData.currentLevelReal + 1); //load truoc
    }

    loadLevel(id: number) {
        console.log("loadLevel: " + id);

        if (this.levelRoot.childrenCount > 0) {
            MainScene.instance.screenManager.showFlash(1);
        }

        this.clearLevelRoot();
        this.winPanel.hide();

        if (MainScene.instance.testPrefab) {
            this.addLevelToRoot(MainScene.instance.testPrefab);

        } else {
            ResUtil.loadLevelById(id, (prefab) => {
                this.addLevelToRoot(prefab);
            });
        }

        if (this.countPlayWin === 1 && !GameData.isCreatShortcut) {
            FBInstantGames.createShortcut(() => {
                GameTracking.logEventCreateShortCut(GameData.currentLevelId);
                GameData.isCreatShortcut = true;
            });
        }
    }

    addLevelToRoot(prefab) {
        let level = cc.instantiate(prefab);
        this.levelRoot.addChild(level);
        this.levelPlay = parseInt(prefab.name.match(/\d+/)[0]);

        let mapLevel = level.getComponent(MapLevel);
        this.updateLevelInfo(GameData.currentLevelId, mapLevel.questType);
    }

    clearLevelRoot() {
        if (this.levelRoot.childrenCount > 0) {
            try {
                this.levelRoot.removeAllChildren();
            } catch (e) {
                cc.warn(e);
            }
        }
    }

    gotoHomeScreen() {
        MainScene.instance.showHomeScreen((screen) => {
            let home = screen.getComponent(HomeScreen);
            home.activeHomeUI();
            if (MapLevel.instance.gameState == GameState.PLAYING || MapLevel.instance.gameState == GameState.WIN)
                sendCustomAnalyticsEvent("game_end", { level: GameData.currentLevelReal + 1, score: 0, highScore: 0 })
        });
    }

    replayGame() {
        this.loadCurrentLevel();
        MainScene.instance.screenManager.showFlash(1);
        sendCustomAnalyticsEvent("game_replay", { level: GameData.currentLevelReal + 1, score: 0, highScore: 0 });
        sendCustomAnalyticsEvent('game_level', { level: GameData.currentLevelReal + 1 });
    }

    nextLevel(e, check = false) {
        this.loadCurrentLevel();
        let levels3 = JSON.parse(LocalStorageManager.getItem("3levels"));
        debugger
        if (!!levels3) {
            if (levels3 < 2) {
                levels3++;
                LocalStorageManager.setItem("3levels", JSON.stringify(levels3));
            } else {
                if (!check) {
                    AudioManager.EffectEnable = false;
                    AudioManager.MusicEnable = false;
                    replayEvent();
                    LocalStorageManager.setItem("3levels", JSON.stringify(1));
                }
            }
        } else {
            LocalStorageManager.setItem("3levels", JSON.stringify(1));
        }
        sendCustomAnalyticsEvent('game_level', { level: GameData.currentLevelReal + 1 });
    }

    updateLevelInfo(levelId: number, questType: QuestType) {
        let questStr = QuestUtil.getQuestName(questType);
        let level = levelId + 1;
        let levelStr = level < 10 ? "0" + level : "" + level;
        this.labelQuest.string = "<color=#FFBC01>LEVEL " + levelStr + "</color> " + questStr;
    }

    showToastReward(value: number, timeShow: number, delay: number = 0) {
        this.scheduleOnce(() => {
            this.toastReward.show(value, timeShow);
        }, delay);
    }
}
