import {PrefabType} from "./PrefabType";
import {ResUtil} from "./ResUtil";

const {ccclass, property} = cc._decorator;

@ccclass('MyPrefabData')
export class MyPrefabData {

    @property({
        type: cc.Enum(PrefabType)
    })
    type: PrefabType = PrefabType.NONE;

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.String)
    prefabRes: string = "";
}

@ccclass
export default class PrefabManager extends cc.Component {

    @property([MyPrefabData])
    prefabsData: MyPrefabData[] = [];
    private static _instance: PrefabManager = null;

    static get instance() {
        return this._instance;
    }

    onLoad() {
        PrefabManager._instance = this;
    }

    getPrefabDataByType(type: PrefabType) {
        for (let i = 0; i < this.prefabsData.length; i++) {
            if (this.prefabsData[i].type === type) {
                return this.prefabsData[i];
            }
        }
        return null;
    }

    loadPrefabByType(type: PrefabType, callback: (prefab) => void) {
        cc.log("loadPrefabByType: " + type);
        let data = this.getPrefabDataByType(type);
        if (data) {
            if (data.prefab != null) {
                callback(data.prefab);
                return;
            }

            if (data.prefabRes != "") {
                ResUtil.loadPopupByDir(data.prefabRes, callback, (err) => {
                    callback(null);
                });
                return;
            }
        }
        callback(null);
    }

}