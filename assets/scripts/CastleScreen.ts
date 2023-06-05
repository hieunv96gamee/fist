import {ResUtil} from "./ResUtil";
import MainScene from "./MainScene";


const {ccclass, property} = cc._decorator;

@ccclass
export default class CastleScreen extends cc.Component {

    public static KingdomDefault = "spring";
    visibleKingdom = "";

    @property(cc.Prefab)
    buildPopupPrefab: cc.Prefab = null;

    kingdomNode: cc.Node = null;

    private static _instance: CastleScreen = null;
    public static get instance() {
        return CastleScreen._instance;
    }

    protected onLoad(): void {
        CastleScreen._instance = this;
    }

    protected onEnable(): void {
        this.showCastleByName(CastleScreen.KingdomDefault);
    }

    onClickBack() {
        MainScene.instance.showHomeScreen();
    }

    onClickBuild() {
        MainScene.instance.showBuildKingdomPopup();
    }

    onClickMap() {
        MainScene.instance.showSelectKingdomPopup();
    }

    showCastleByName(name, callback = null) {
        if (this.visibleKingdom === name) {
            if (callback) callback();

        } else {
            this.loadCastleByName(name, callback);
        }
    }

    loadCastleByName(name, callback = null) {
        MainScene.instance.showLoading();
        ResUtil.loadKingdomByName(name, (prefab) => {
            MainScene.instance.hideLoading();

            if (this.kingdomNode) {
                this.kingdomNode.removeFromParent();
                this.kingdomNode = null;
            }

            this.visibleKingdom = name;
            this.kingdomNode = cc.instantiate(prefab);
            this.node.addChild(this.kingdomNode, -1);

            //preload popup
            ResUtil.loadKingdomBuilderByName(name);
            if (callback) callback();

        }, (err) => {
            //todo

        });
    }
}
