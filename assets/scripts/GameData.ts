import { LocalStorageManager } from "./base/LocalStorageManager";
import ItemLoot from "./objects/more/ItemLoot";
import { FBInstantData } from "./plugins/fb/FBInstantData";
import { KingdomData } from "./config/KingdomData";
import { GlobalSignals } from "./config/GlobalSignals";
import { RoomConfig } from "./config/RoomConfig";
import { GameConfig } from "./config/GameConfig";
import { LevelConfig } from "./config/LevelConfig";


export class GameData {
    private static KEY_DATA = "hp_data";
    private static KEY_SHORTCUT = "hp_shortcut";

    private static KEY_LEVEL = "hp_level";
    private static KEY_LEVEL_REAL = "hp_level_real";
    private static KEY_LEVEL_SIZE = "hp_level_size";

    private static KEY_ROOM = "hp_room";
    private static KEY_ITEMS = "hp_items";
    private static KEY_COIN = "hp_coin";

    private static KEY_BOSS_CURRENT_SKIN = "hp_boss_current_skin";
    private static KEY_BOSS_SKINS = "hp_boss_skins";

    private static KEY_WIFE_CURRENT_SKIN = "hp_wife_current_skin";
    private static KEY_WIFE_SKINS = "hp_wife_skins";

    private static KEY_KINGDOM_SPRING = "hp_kingdom_spring";

    public static currentLevelReal = 0;
    public static currentLevelId = 0;
    public static currentRoomId = 0;

    public static myBossSkins = [];
    public static myWifeSkins = [];
    public static currentSkinBoss = GameConfig.boss_skin_default;
    public static currentSkinWife = "";

    public static arrayItem = [];
    public static playerCoin = 0;
    public static kingdoms = {};

    public static CURRENT_VERSION_CODE = 2;
    public static DELTA_TIME = 1 / 60;

    public static initPlayerData(callback: Function) {
        cc.log("initPlayerData");

        let dataStr = LocalStorageManager.getItem(GameData.KEY_DATA);
        if (dataStr) {
            cc.log("init Data from Local");
            let dataLocal = JSON.parse(dataStr);
            this.setPlayerData(dataLocal);
            console.log(dataLocal + "213123124124312")
            LocalStorageManager.removeItem(GameData.KEY_DATA);

            //syn local with cloud
            FBInstantData.setData(dataLocal);
            if (callback) callback();
            return;
        }

        FBInstantData.getData([
            GameData.KEY_LEVEL,
            GameData.KEY_LEVEL_REAL,
            GameData.KEY_ROOM,
            GameData.KEY_ITEMS,
            GameData.KEY_COIN,
            GameData.KEY_BOSS_CURRENT_SKIN,
            GameData.KEY_BOSS_SKINS,
            GameData.KEY_WIFE_CURRENT_SKIN,
            GameData.KEY_WIFE_SKINS,
            GameData.KEY_KINGDOM_SPRING

        ], (data) => {
            this.setPlayerData(data);
            if (callback) callback();

        }, (e) => {
            this.setPlayerData({});
            if (callback) callback();
        });
    }

    private static setPlayerData(data: any) {
        this.currentLevelId = this.getValue(data, GameData.KEY_LEVEL, 0);
        this.currentRoomId = this.getValue(data, GameData.KEY_ROOM, 0);
        this.arrayItem = this.getValue(data, GameData.KEY_ITEMS, []);
        this.playerCoin = this.getValue(data, GameData.KEY_COIN, 0);

        this.currentSkinBoss = this.getValue(data, GameData.KEY_BOSS_CURRENT_SKIN, GameConfig.boss_skin_default);
        this.myBossSkins = this.getValue(data, GameData.KEY_BOSS_SKINS, []);

        this.kingdoms = KingdomData.getKingdomData(data);

        //fix new level
        this.currentLevelReal = this.getValue(data, GameData.KEY_LEVEL_REAL, this.currentLevelId);
        let levelSize = this.getValue(data, GameData.KEY_LEVEL_SIZE, 100);
        if (this.currentLevelReal > levelSize) {
            this.currentLevelReal = levelSize;
        }

        if (levelSize < LevelConfig.levels.length) {
            let data = {};
            data[GameData.KEY_LEVEL_SIZE] = LevelConfig.realLevelSize;
            FBInstantData.setData(data);
        }
    }

    public static saveKingdomItem(kingdom, item, value, callback = null) {
        if (!this.kingdoms[kingdom]) {
            this.kingdoms[kingdom] = {};
        }
        this.kingdoms[kingdom][item] = value;
        KingdomData.saveKingdomData(kingdom, this.kingdoms[kingdom], callback);
    }

    public static saveLevelUp() {
        this.currentLevelId++;
        this.currentLevelReal++;

        let data = {};
        data[GameData.KEY_LEVEL] = this.currentLevelId;
        data[GameData.KEY_LEVEL_REAL] = this.currentLevelReal;
        FBInstantData.setData(data);
    }

    public static saveCoin(coin) {
        this.playerCoin = coin;
        GlobalSignals.coinUpdateSignal.dispatch();

        let data = {};
        data[GameData.KEY_COIN] = coin;
        FBInstantData.setData(data);
    }

    public static addCoin(changeCoin) {
        this.saveCoin(this.playerCoin + changeCoin);
    }

    public static addRoomItem(itemId, roomId) {
        if (this.arrayItem.indexOf(itemId) != -1) {
            cc.log("ArrayItems already contains this id");
            return;
        }

        this.arrayItem.push(itemId);
        this.currentRoomId = roomId;

        if (this.arrayItem.length === RoomConfig.rooms[roomId].size) {
            this.currentRoomId = roomId + 1;
            this.arrayItem = [];
            cc.log("unlock roomId = " + this.currentRoomId);
        }

        let data = {};
        data[GameData.KEY_ITEMS] = this.arrayItem;
        data[GameData.KEY_ROOM] = this.currentRoomId;
        FBInstantData.setData(data);
    }

    public static setSkinBoss(skinId: string, callback) {
        if (this.currentSkinBoss === skinId) {
            return;
        }

        this.currentSkinBoss = skinId;

        let data = {};
        data[GameData.KEY_BOSS_CURRENT_SKIN] = this.currentSkinBoss;
        FBInstantData.setData(data, callback);
    }

    public static addSkinBoss(skinId: string, callback) {
        if (this.myBossSkins.indexOf(skinId) != -1) {
            cc.log("myBossSkins already contains this skinId");
            return;
        }

        this.myBossSkins.push(skinId);

        let data = {};
        data[GameData.KEY_BOSS_SKINS] = this.myBossSkins;
        FBInstantData.setData(data, callback);
    }

    public static clearData() {
        let data = {};
        data[GameData.KEY_LEVEL] = 0;
        data[GameData.KEY_ROOM] = 0;
        data[GameData.KEY_ITEMS] = [];
        data[GameData.KEY_COIN] = 0;

        FBInstantData.setData(data);
        LocalStorageManager.removeItem(GameData.KEY_DATA);
    }

    public static checkItemCollected(item: ItemLoot): boolean {
        let cfg = item.itemConfig;
        if (cfg.roomId - 1 < GameData.currentRoomId) {
            return true;
        }

        if (cfg.roomId - 1 === GameData.currentRoomId) {
            return GameData.arrayItem.indexOf(cfg.itemId) != -1;
        }

        return false;
    }

    public static get isCreatShortcut() {
        let dataStr = LocalStorageManager.getItem(GameData.KEY_SHORTCUT);
        if (dataStr) {
            return dataStr === "true";
        }
        return false;
    }

    public static set isCreatShortcut(value: boolean) {
        LocalStorageManager.setItem(GameData.KEY_SHORTCUT, value ? "true" : "false");
    }

    private static getValue(data: any, key: string, def: any) {
        if (data[key] === "" || data[key] === null || data[key] === undefined) {
            return def;
        }
        return data[key];
    }
}