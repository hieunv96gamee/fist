import ColliderSearch from "../character/ColliderSearch";
import MapLevel from "../../level/MapLevel";
import {GroupConfig} from "../../config/GroupConfig";
import MainScene from "../../MainScene";
import {AudioPlayId} from "../../config/AudioPlayId";
import ColliderCallback from "../../base/ColliderCallback";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Pow extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.Node)
    hit: cc.Node = null;

    @property(cc.String)
    attackAnim: string = "Animation";

    @property(ColliderSearch)
    searchCollider: ColliderSearch = null;

    protected onLoad(): void {
        this.hit.addComponent(ColliderCallback).setColliderCallback(this.onHitColliderCallback.bind(this));
        this.searchCollider.setColliderCallback(this.onSearchCollider.bind(this));
        this.searchCollider.node.active = true;
    }

    onHitColliderCallback(other) {
        if (other.node.group === GroupConfig.CHARACTER || other.node.group === GroupConfig.BERRIE) {
            this.hit.opacity = 0;
            this.scheduleOnce(() => {
                cc.Tween.stopAllByTarget(this.hit);
                this.hit.active = false;
            }, 0.2);
        }
    }

    onSearchCollider(other): void {
        cc.log("Pow onSearchCollider: " + other.node.name);
        if (!this.hit.active) return;
        if (!MapLevel.instance.isPlaying) {
            return;
        }

        if (other.node.group === GroupConfig.CHARACTER) {
            this.playAttack(other);
            return;
        }
    }

    playAttack(other) {
        this.skeleton.setAnimation(0, this.attackAnim, false);
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.shoot);

        let p = this.hit.getParent().convertToNodeSpaceAR(
            other.node.getParent().convertToWorldSpaceAR(other.node.position));
        p.y -= 800;
        p.x = this.hit.x;

        cc.Tween.stopAllByTarget(this.hit);
        cc.tween(this.hit).to(1.5, {
            position: p

        }).call(() => {
            this.hit.active = false;
        }).start();
    }
}
