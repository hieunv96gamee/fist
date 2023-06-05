import {RoomConfig} from "./config/RoomConfig";
import {LevelConfig} from "./config/LevelConfig";
import {KingdomConfig} from "./config/KingdomConfig";

export class ResUtil {

    private static mapPrefab: Map<string, cc.Prefab> = new Map<string, cc.Prefab>();

    public static loadPopupByDir(dir: string, callback: Function = null, errCb: Function = null) {
        let key = dir.split('/').pop();
        cc.log("loadPopupByDir: " + key);
        if (this.mapPrefab.has(key)) {
            if (callback) {
                callback(this.mapPrefab.get(key));
            }
            return;
        }
        this.loadPrefab(dir, (prefab) => {
            this.mapPrefab.set(key, prefab);
            if (callback) {
                callback(prefab);
            }
        }, errCb);
    }

    public static loadKingdomByName(name: string, callback: Function = null, errCb: Function = null) {
        let cfg = KingdomConfig.getKingdomCfg(name);
        if (!cfg) {
            cc.warn("loadKingdomByName name = " + name + ", cfg is null!");
            if (errCb) errCb();
            return;
        }

        if (this.mapPrefab.has(cfg.kingdom)) {
            if (callback) {
                callback(this.mapPrefab.get(cfg.kingdom));
            }
            return;
        }

        let dir = "prefabs/castle/" + cfg.name + "/" + cfg.kingdom;
        this.loadPrefab(dir, (prefab) => {
            this.mapPrefab.set(cfg.kingdom, prefab);
            if (callback) {
                callback(prefab);
            }
        }, errCb);
    }

    public static loadKingdomBuilderByName(name: string, callback: Function = null, errCb: Function = null) {
        let cfg = KingdomConfig.getKingdomCfg(name);
        if (!cfg) {
            cc.warn("loadKingdomBuilderByName name = " + name + ", cfg is null!");
            if (errCb) errCb();
            return;
        }

        if (this.mapPrefab.has(cfg.builder)) {
            if (callback) {
                callback(this.mapPrefab.get(cfg.builder));
            }
            return;
        }

        let dir = "prefabs/castle/" + cfg.name + "/" + cfg.builder;
        this.loadPrefab(dir, (prefab) => {
            this.mapPrefab.set(cfg.builder, prefab);
            if (callback) {
                callback(prefab);
            }
        }, errCb);
    }

    public static loadRoomById(id: number, callback: Function = null, errCb: Function = null) {
        if (id < 0 || id >= RoomConfig.rooms.length) {
            cc.warn("loadRoomById: " + id);
            if (errCb) errCb();
            return;
        }

        let name = RoomConfig.rooms[id].name;
        if (this.mapPrefab.has(name)) {
            if (callback) {
                callback(this.mapPrefab.get(name));
            }
            return;
        }

        this.loadRoomByName(name, (prefab) => {
            this.mapPrefab.set(name, prefab);
            if (callback) {
                callback(prefab);
            }
        }, errCb);
    }

    // public static releaseRoomById(id: number) {
    //     if (id < 0 || id >= RoomConfig.rooms.length) {
    //         return;
    //     }
    //     let name = RoomConfig.rooms[id].name;
    //     if (this.mapPrefab.has(name)) {
    //         this.mapPrefab.delete(name);
    //         cc.log("release: " + name);
    //     }
    // }

    public static loadLevelById(id: number, callback: Function = null, errCb: Function = null) {
        if (id < 0 || id >= LevelConfig.levels.length) {
            let rand = Math.floor(Math.random() * LevelConfig.levels.length);
            LevelConfig.levels[id] = LevelConfig.levels[rand];
        }

        let name = LevelConfig.levels[id];

        if (this.mapPrefab.has(name)) {
            if (callback) {
                callback(this.mapPrefab.get(name));
            }
            return;
        }

        this.loadLevelByName(name, (prefab) => {
            this.mapPrefab.set(name, prefab);
            if (callback) {
                callback(prefab);
            }
        }, errCb);
    }

    public static releaseLevelById(id: number) {
        if (id < 0 || id >= LevelConfig.levels.length) {
            return;
        }
        let name = LevelConfig.levels[id];
        if (this.mapPrefab.has(name)) {
            this.mapPrefab.delete(name);
            cc.log("release: " + name);
        }
    }

    private static loadLevelByName(name: string, callback: Function = null, errCb: Function = null) {
        let dir = "prefabs/levels/" + name;
        this.loadPrefab(dir, callback, errCb);
    }

    private static loadRoomByName(name: string, callback: Function = null, errCb: Function = null) {
        let dir = "prefabs/rooms/" + name;
        this.loadPrefab(dir, callback, errCb);
    }

    public static loadScreenByName(name: string, callback: Function = null, errCb: Function = null) {
        let dir = "prefabs/screens/" + name;
        this.loadPrefab(dir, callback, errCb);
    }

    public static loadPrefab(dir: string, callback: Function, errCb: Function) {
        cc.resources.load(dir, (err, prefab: cc.Prefab) => {
            if (err) {
                cc.log(err);
                if (errCb) errCb(err);
                return;
            }

            if (callback) {
                cc.log("loadPrefab: " + dir);
                callback(prefab);
            }
        });
    }
}