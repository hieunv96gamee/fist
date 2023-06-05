import { QuestType } from "../config/QuestType";
import { GameState } from "../config/GameState";
import { GlobalSignals } from "../config/GlobalSignals";
import StickHold from "../objects/barrier/StickHold";
import Character from "../objects/character/Character";
import TouchManager from "../base/TouchManager";
import ItemLoot from "../objects/more/ItemLoot";
import ArrayUtil from "../base/utils/ArrayUtil";
import { GameData } from "../GameData";
import PlayScreen from "../PlayScreen";
import SettingsPopup from "../ui/SettingsPopup";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MapLevel extends cc.Component {

    @property({
        type: cc.Enum(QuestType)
    })
    questType: QuestType = QuestType.COLLECT_GEMS;
    gameState: GameState = GameState.BEGIN;

    @property([StickHold])
    arrStickToActive: StickHold[] = [];

    @property([cc.Node])
    arrEnemies: cc.Node[] = [];

    @property(ItemLoot)
    itemLoot: ItemLoot = null;

    @property(cc.Label)
    tipLabel: cc.Label = null;

    isCollectGems: boolean = false;

    public get isPlaying() {
        return this.gameState === GameState.PLAYING;
    }

    public get isQuestCollectGems() {
        return this.questType === QuestType.COLLECT_GEMS;
    }

    public get isQuestCollectItem() {
        return this.questType === QuestType.COLLECT_ITEM;
    }

    public get isQuestSaveHostage() {
        return this.questType === QuestType.SAVE_HOSTAGE;
    }

    public get isQuestKillEnemies() {
        return this.questType === QuestType.KILL_ENEMY;
    }

    public get isQuestOpenChest() {
        return this.questType === QuestType.OPEN_CHEST;
    }

    private _countGemsDestroyed: number = 0;
    public get countGemsDestroyed() {
        return this._countGemsDestroyed;
    }

    public set countGemsDestroyed(value) {
        this._countGemsDestroyed = value;

        if (this._countGemsDestroyed === 15 && !this.isCollectGems) {
            GlobalSignals.questFailSignal.dispatch();
        }
    }

    private _countGemsCollected: number = 0;
    public get countGemsCollected() {
        return this._countGemsCollected;
    }

    public set countGemsCollected(value) {
        this._countGemsCollected = value;
        if (this._countGemsCollected === 5 && this.isQuestCollectGems && this.isPlaying) {
            this.isCollectGems = true;
            GlobalSignals.collectGemsSignal.dispatch();
        }
    }

    private _rockContainer: cc.Node = null;
    public get rockContainer() {
        if (!this._rockContainer) {
            this._rockContainer = new cc.Node();
            this.node.addChild(this._rockContainer);

            // let waterDrawer = this.node.getChildByName('WaterDrawer');
            // if (waterDrawer) {
            //     let idx = waterDrawer.getSiblingIndex();
            //     cc.log("waterDrawer.getSiblingIndex = " + idx);
            //     this._rockContainer.setSiblingIndex(idx);
            // } else {
            //     cc.warn("waterDrawer is null");
            // }
        }
        return this._rockContainer;
    }

    private static _instance: MapLevel = null;
    public static get instance() {
        return MapLevel._instance;
    }

    protected onLoad() {
        MapLevel._instance = this;
    }

    protected onDestroy(): void {
        MapLevel._instance = null;
        this.unscheduleAllCallbacks();
    }

    protected start() {
        this.scheduleOnce(() => {
            this.gameState = GameState.PLAYING;
        }, 0.6);

        let _activeStick = this.onActiveStick.bind(this);
        this.arrStickToActive.forEach((stick) => {
            stick.setHoldCallback(_activeStick);
        });

        if (this.isQuestKillEnemies) {
            let _onEnemiesDead = this.onEnemiesDead.bind(this);
            this.arrEnemies.forEach((obj) => {
                let char = obj.getComponent(Character);
                if (char) {
                    char.setDeadCallback(_onEnemiesDead);
                }
            });
        }

        if (this.isQuestCollectItem && this.itemLoot
            && GameData.checkItemCollected(this.itemLoot)) {
            this.replaceItemByChest();
        }

        if (TouchManager.instance) {
            TouchManager.instance.reset();
        }
    }

    _questFailSignal;
    _questPassSignal;

    protected onEnable(): void {
        this._questFailSignal = this.onQuestFail.bind(this);
        this._questPassSignal = this.onQuestPass.bind(this);

        GlobalSignals.questFailSignal.add(this._questFailSignal);
        GlobalSignals.questPassSignal.add(this._questPassSignal);
    }

    protected onDisable(): void {
        GlobalSignals.questFailSignal.remove(this._questFailSignal);
        GlobalSignals.questPassSignal.remove(this._questPassSignal);
    }

    onQuestFail() {
        this.gameState = GameState.LOSE;
    }

    onQuestPass() {
        this.gameState = GameState.WIN;
    }

    onActiveStick(stick: StickHold) {
        if (this.arrStickToActive.length === 0) {
            return;
        }

        ArrayUtil.removeElement(this.arrStickToActive, stick);
        if (this.arrStickToActive.length === 0) {
            this.scheduleOnce(() => {
                if (this.isPlaying) {
                    GlobalSignals.autoMoveSignal.dispatch();
                }
            }, 0.25);
        }
    }

    onEnemiesDead(ene: cc.Node) {
        if (this.arrEnemies.length === 0) {
            return;
        }

        ArrayUtil.removeElement(this.arrEnemies, ene);

        if (this.arrEnemies.length === 0 && this.isQuestKillEnemies) {
            this.scheduleOnce(() => {
                if (this.isPlaying) {
                    GlobalSignals.questPassSignal.dispatch();
                }
            }, 0.6);
        }
    }

    replaceItemByChest() {
        cc.log("replaceItemByChest");
        let chest = cc.instantiate(this.itemLoot.chestPrefab);
        this.node.addChild(chest);

        chest.position = this.itemLoot.node.position;
        chest.setSiblingIndex(this.itemLoot.node.getSiblingIndex());
        if (this.tipLabel) this.tipLabel.node.active = false;
        this.itemLoot.node.removeFromParent();
        this.questType = QuestType.OPEN_CHEST;
        PlayScreen.instance.updateLevelInfo(GameData.currentLevelId, this.questType);
    }
}
