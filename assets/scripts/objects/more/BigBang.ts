import MainScene from "../../MainScene";
import {AudioPlayId} from "../../config/AudioPlayId";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BigBang extends cc.Component {

    @property(cc.Float)
    timeAttack: number = 0.5;

    @property(cc.Node)
    hitAttack: cc.Node = null;

    @property(cc.Prefab)
    bumPrefab: cc.Prefab = null;

    protected onEnable(): void {
        this.scheduleOnce(() => {
            this.hitAttack.removeComponent(cc.CircleCollider);
            this.node.removeFromParent();

        }, this.timeAttack);

        this.showBumEffect();
    }

    showBumEffect() {
        let bum = cc.instantiate(this.bumPrefab);
        bum.setPosition(this.node.getPosition());
        bum.scale = 0.66;
        this.node.getParent().addChild(bum);
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dragon_fire_ball);

        cc.tween(bum).delay(2).call(() => {
            bum.removeFromParent();
        }).start();
    }
}
