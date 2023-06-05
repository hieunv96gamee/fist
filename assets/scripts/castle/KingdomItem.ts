import MainScene from "../MainScene";
import {GameData} from "../GameData";
import CastleScreen from "../CastleScreen";
import {LevelConfig} from "../config/LevelConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class KingdomItem extends cc.Component {

    @property(cc.String)
    kingdomName: string = "";

    @property(cc.Integer)
    levelUnlock: number = 0;

    @property(cc.Node)
    lock: cc.Node = null;

    @property(cc.Label)
    label_unlock: cc.Label = null;

    @property(cc.Button)
    btn_visit: cc.Button = null;

    protected onEnable(): void {

        if (GameData.currentLevelId >= this.levelUnlock
            && LevelConfig.realLevelSize >= this.levelUnlock) {

            this.lock.active = false;
            this.btn_visit.node.active = true;

        } else {
            this.lock.active = true;
            this.btn_visit.node.active = false;

            if (LevelConfig.realLevelSize < this.levelUnlock) {
                this.label_unlock.string = "COMING SOON";
                this.label_unlock.fontSize = 18;

            } else {
                this.label_unlock.string = "LEVEL " + this.levelUnlock;
            }
        }
    }

    private onVisit() {
        MainScene.instance.selectKingdomPopup.active = false;
        CastleScreen.instance.showCastleByName(this.kingdomName);
    }
}
