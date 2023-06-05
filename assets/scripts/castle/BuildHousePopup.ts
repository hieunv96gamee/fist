import HouseItem from "./HouseItem";
import {GameData} from "../GameData";
import KingdomBuilder, {HouseItemConfig} from "./KingdomBuilder";
import {ResUtil} from "../ResUtil";
import CastleScreen from "../CastleScreen";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuildHousePopup extends cc.Component {

    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    arrayItem: HouseItem[] = [];
    currentKingdom: string = "";

    protected onEnable(): void {
        this.loadKingdomBuilder(CastleScreen.instance.visibleKingdom);
    }

    loadKingdomBuilder(name: string) {
        cc.log("setCurrentKingdom: " + name);
        if (this.currentKingdom === name) {
            this.reloadData();
            return;
        }

        this.currentKingdom = name;
        ResUtil.loadKingdomBuilderByName(name, (prefab) => {
            let kdBuilder = cc.instantiate(prefab).getComponent(KingdomBuilder);
            if (kdBuilder) {
                this.initKingdomBuilder(kdBuilder);
                this.reloadData();
            }
        });
    }

    initKingdomBuilder(kdBuilder: KingdomBuilder) {
        let arrayConfig = kdBuilder.arrayConfig;
        cc.log("initKingdomBuilder: " + arrayConfig.length);
        for (let i = 0; i < arrayConfig.length; i++) {
            arrayConfig[i].kingdomName = kdBuilder.kingdomName;
            this.createItem(arrayConfig[i]);
        }
    }

    createItem(cfg: HouseItemConfig) {
        cc.log("createItem: " + cfg.houseName);

        let item = cc.instantiate(this.itemPrefab);
        this.container.addChild(item);

        let houseItem = item.getComponent(HouseItem);
        this.arrayItem.push(houseItem);

        houseItem.initHouseItem(cfg, this.node);
    }

    reloadData() {
        let data = GameData.kingdoms[this.currentKingdom];
        if (!data) {
            console.warn("Kingdom name = " + this.currentKingdom + " is undefined");
            data = {};
        }

        cc.log("reloadData: " + JSON.stringify(data));
        this.arrayItem.forEach((item) => {
            let key = item.config.houseName;
            let level = data[key];
            if (level != undefined) {
                item.updateBuild(level);

            } else {
                item.updateBuild(0);
            }
        });
    }

}
