import {GlobalSignals} from "../config/GlobalSignals";
import {SkinConfig} from "../config/SkinConfig";
import {GameData} from "../GameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SkinBossUpdater extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.String)
    anim: string = "Idle";

    _onUpdateSkinBoss = null;

    protected onLoad(): void {
        if (!this.skeleton) {
            this.skeleton = this.node.getComponent(sp.Skeleton);
        }
    }

    protected onEnable(): void {
        this._onUpdateSkinBoss = this.onUpdateSkinBoss.bind(this);
        GlobalSignals.changeSkinBossSignal.add(this._onUpdateSkinBoss);
        this.onUpdateSkinBoss();
    }

    protected onDisable(): void {
        GlobalSignals.changeSkinBossSignal.remove(this._onUpdateSkinBoss);
    }

    onUpdateSkinBoss() {
        let skinName = SkinConfig.getSkinNameById(GameData.currentSkinBoss);
        cc.log("onUpdateSkinBoss: " + skinName);
        this.skeleton.setSkin(skinName);
        this.skeleton.setSlotsToSetupPose();

        if (this.anim) {
            this.skeleton.setAnimation(0, this.anim, true);
        }
    }
}
