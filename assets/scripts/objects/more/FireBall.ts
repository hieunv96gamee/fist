import {GroupConfig} from "../../config/GroupConfig";
import MainScene from "../../MainScene";
import {AudioPlayId} from "../../config/AudioPlayId";


const {ccclass, property} = cc._decorator;

@ccclass
export default class FireBall extends cc.Component {

    @property(cc.Prefab)
    bumPrefab: cc.Prefab = null;

    public static velocityHit: number = 500;

    onCollisionEnter(other, self) {
        if (other.node.group === GroupConfig.BERRIE) {
            this.showBumEffect();
            this.node.active = false;
            this.node.stopAllActions();
            this.node.removeFromParent();
            return;
        }

        if (other.node.group === GroupConfig.CHARACTER) {
            this.showBumEffect();
            this.scheduleOnce(() => {
                this.node.opacity = 0;
                this.node.stopAllActions();
                cc.Tween.stopAllByTarget(this.node);
            }, 0.05);

            this.scheduleOnce(() => {
                this.node.active = false;
                this.node.removeFromParent();
            }, 0.2);
        }
    }

    showBumEffect() {
        let bum = cc.instantiate(this.bumPrefab);
        bum.setPosition(this.node.getPosition());
        bum.scale = 0.66;
        this.node.getParent().addChild(bum);
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dragon_fire_ball);

        cc.tween(bum).delay(0.8).call(() => {
            bum.removeFromParent();
        }).start();
    }
}
