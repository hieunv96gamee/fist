import HouseBuilder from "./HouseBuilder";
import {GameData} from "../GameData";
import {GlobalSignals} from "../config/GlobalSignals";
import easeIn = cc.easeIn;

const {ccclass, property} = cc._decorator;

@ccclass
export default class Kingdom extends cc.Component {

    @property(cc.String)
    kingdomName: string = "";

    @property(cc.Node)
    toolBuild: cc.Node = null;

    @property(cc.Prefab)
    effectPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    buildPopup: cc.Prefab = null;

    arrayHouse: HouseBuilder[] = [];
    onUpgradeHouse = null;

    protected onLoad(): void {
        this.toolBuild.active = false;
        this.toolBuild.zIndex = 10;

        this.onUpgradeHouse = this.upgradeHouse.bind(this);

        this.node.children.forEach((child) => {
            let house = child.getComponent(HouseBuilder);
            if (house) {
                this.arrayHouse.push(house);
            }
        });
    }

    protected onEnable(): void {
        GlobalSignals.castleUpgradeSignal.add(this.onUpgradeHouse);
        let data = GameData.kingdoms[this.kingdomName];
        if (!data) {
            console.warn("Kingdom name = " + this.kingdomName + " is undefined");
            data = {};
        }
        this.reloadData(data);
    }

    protected onDisable(): void {
        GlobalSignals.castleUpgradeSignal.remove(this.onUpgradeHouse);
    }

    reloadData(data: any) {
        cc.log("reloadData: " + JSON.stringify(data));
        this.arrayHouse.forEach((house) => {
            let level = data[house.houseName];
            if (level != undefined) {
                house.showLevel(level);

            } else {
                house.showLevel(0);
            }
        });
    }

    getHouseBuilderByName(houseName) {
        for (let i = 0; i < this.arrayHouse.length; i++) {
            if (this.arrayHouse[i].houseName === houseName) {
                return this.arrayHouse[i];
            }
        }
        return null;
    }

    upgradeHouse(houseName, toLevel) {
        let house = this.getHouseBuilderByName(houseName);
        if (!house) {
            cc.warn("upgradeHouse houseName = " + houseName + " is null");
            return;
        }

        this.showBuilderEffect(house.node.position, () => {
            house.showLevel(toLevel);
        });
    }

    showBuilderEffect(pos: cc.Vec3, callback: Function) {
        let times = 6;
        this.toolBuild.active = true;
        this.toolBuild.angle = 15;
        this.toolBuild.x = pos.x - this.toolBuild.width;
        this.toolBuild.y = pos.y - this.toolBuild.height / 2;

        cc.Tween.stopAllByTarget(this.toolBuild);
        cc.tween(this.toolBuild).repeat(times,
            cc.tween().to(0.12, {
                angle: -20

            }, easeIn(2)).delay(0.08).to(0.2, {
                angle: 15
            })
        ).call(() => {
            this.toolBuild.active = false;

        }).start();

        this.scheduleOnce(() => {
            this.showAppearEffect(pos);
            if (callback) callback();

        }, (times - 1) * 0.4);
    }

    showAppearEffect(pos: cc.Vec3) {
        let appear = cc.instantiate(this.effectPrefab);
        appear.position = pos;
        appear.scale = 1.0;
        this.node.addChild(appear);

        cc.tween(appear).delay(0.8).call(() => {
            appear.removeFromParent();
        }).start();
    }
}
