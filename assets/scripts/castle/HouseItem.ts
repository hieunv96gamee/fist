import {GameData} from "../GameData";
import {StringUtil} from "../base/utils/StringUtil";
import {GlobalSignals} from "../config/GlobalSignals";
import {HouseItemConfig} from "./KingdomBuilder";
import {KingdomConfig} from "../config/KingdomConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HouseItem extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Label)
    completeLabel: cc.Label = null;

    @property(cc.Sprite)
    progressBar: cc.Sprite = null;

    @property([cc.SpriteFrame])
    starFrames: cc.SpriteFrame[] = [];

    @property([cc.Sprite])
    arrayStars: cc.Sprite[] = [];

    @property(cc.Sprite)
    icon1: cc.Sprite = null;

    @property(cc.Sprite)
    icon2: cc.Sprite = null;

    @property(cc.Sprite)
    arrow: cc.Sprite = null;

    @property(cc.Button)
    btnBuild: cc.Button = null;

    @property(cc.Button)
    btnUpgrade: cc.Button = null;

    level: number = 0;
    icon1Pos: cc.Vec3 = null;

    config: HouseItemConfig = null;
    prices: number[] = null;
    rootPopup: cc.Node = null;

    protected onLoad(): void {
        this.icon1Pos = this.icon1.node.position;
    }

    initHouseItem(cfg: HouseItemConfig, rootPopup: cc.Node) {
        this.config = cfg;
        this.rootPopup = rootPopup;
        this.prices = KingdomConfig.getKingdomCfg(cfg.kingdomName).prices;
        this.updateBuild(0);
    }

    updateBuild(n) {
        //n = 0, 1, 2, 3, 4, 5
        this.level = n;
        this.arrayStars.forEach((star, i) => {
            star.spriteFrame = i < n ? this.starFrames[1] : this.starFrames[0];
        });

        this.progressBar.fillRange = (n - 1) / (this.arrayStars.length - 1);

        if (n > 0 && n < this.arrayStars.length) {
            this.icon2.node.active = true;
            this.arrow.node.active = true;
            this.icon1.node.position = this.icon1Pos;
            this.icon1.spriteFrame = this.config.houseFrames[n - 1];
            this.icon2.spriteFrame = this.config.houseFrames[n];

        } else {
            this.icon2.node.active = false;
            this.arrow.node.active = false;
            this.icon1.node.position = this.arrow.node.position;
            this.icon1.spriteFrame = n === 0 ? this.config.houseFrames[0]
                : this.config.houseFrames[n - 1];
        }

        this.btnBuild.node.active = n === 0;
        this.btnUpgrade.node.active = n > 0 && n < this.arrayStars.length;
        this.completeLabel.node.active = n === this.arrayStars.length;
        this.coinLabel.node.active = n < this.arrayStars.length;

        let enoughCoin = false;
        if (n < this.arrayStars.length) {
            let price = this.prices[n];
            this.coinLabel.string = StringUtil.preprocessingMoney(price);

            if (GameData.playerCoin >= price) {
                enoughCoin = true;
            }
        }
        this.btnBuild.interactable = enoughCoin;
        this.btnUpgrade.interactable = enoughCoin;
    }

    onClickBuild() {
        if (this.level >= this.arrayStars.length) {
            return;
        }
        let price = this.prices[this.level];
        if (GameData.playerCoin < price) {
            cc.warn("not enough coin to build");
            return;
        }
        let nextLevel = this.level + 1;
        GameData.saveKingdomItem(this.config.kingdomName,
            this.config.houseName, nextLevel, (err) => {
                if (!err) {
                    console.log("Build Success!");
                    GameData.addCoin(-price);
                    this.rootPopup.active = false;
                    GlobalSignals.castleUpgradeSignal.dispatch(this.config.houseName, nextLevel);

                } else {
                    console.warn("Build failure!");
                }
            });
    }

}
