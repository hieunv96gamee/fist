import {GlobalSignals} from "../config/GlobalSignals";
import {GameData} from "../GameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerCoinUpdater extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;

    _onUpdateCoin;

    protected onEnable(): void {
        this._onUpdateCoin = this.onUpdateCoin.bind(this);
        GlobalSignals.coinUpdateSignal.add(this._onUpdateCoin);
        this.onUpdateCoin();
    }

    protected onDisable(): void {
        GlobalSignals.coinUpdateSignal.remove(this._onUpdateCoin);
    }

    onUpdateCoin() {
        if (this.coinLabel) {
            this.coinLabel.string = GameData.playerCoin + "";
        }
    }

}
