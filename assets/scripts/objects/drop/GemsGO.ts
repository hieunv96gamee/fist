import Vec3 = cc.Vec3;
import MapLevel from "../../level/MapLevel";
import {AudioPlayId} from "../../config/AudioPlayId";
import {GroupConfig} from "../../config/GroupConfig";
import MainScene from "../../MainScene";
import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GemsGO extends cc.Component {

    target: cc.Node = null;
    available: boolean = true;
    private static transformCount = 0;
    private static colliderBarrieCount = 0;

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'gems');
    }

    protected start(): void {
        GemsGO.transformCount = 0;
        GemsGO.colliderBarrieCount = 0;
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }

    onCollisionEnter(other, self) {
        // cc.log("onCharCollisionEnter: " + self.node.group);
        if (!this.available) {
            return;
        }

        if (other.node.group === GroupConfig.LAVA) {
            this.available = false;
            MapLevel.instance.countGemsDestroyed++;
            this.startTransform();
            this.node.removeFromParent();
            return;
        }

        if (other.node.group === GroupConfig.BERRIE || other.node.group === GroupConfig.ROCK) {
            GemsGO.colliderBarrieCount++;
            if (GemsGO.colliderBarrieCount === 6) {
                MainScene.instance.audioPlayer.playAudio(AudioPlayId.effect_gems);
                this.scheduleOnce(() => {
                    GemsGO.colliderBarrieCount = 0;
                }, 2.0);
            }
            return;
        }
    }

    startTransform() {
        GemsGO.transformCount++;
        if (GemsGO.transformCount === 8 && MapLevel.instance.isPlaying) {
            MainScene.instance.audioPlayer.playAudio(AudioPlayId.effect_lava_x_water);
        }
    }

    updatePositionToTarget() {
        if (!this.node.getParent()) {
            return;
        }
        let p = this.node.getParent().convertToNodeSpaceAR(
            this.target.getParent().convertToWorldSpaceAR(this.target.position));
        let p2 = new Vec3(p.x, p.y + 20, 0);

        let p1 = this.node.position;
        if (Math.abs(p1.x - p2.x) < 10 && Math.abs(p1.y - p2.y) < 10) {
            this.node.removeFromParent();

        } else {
            this.node.position = p1.lerp(p2, 0.1);
        }
    }

    moveToTarget(target: cc.Node, delay: number) {
        this.scheduleOnce(() => {
            if (!MapLevel.instance.isCollectGems) {
                return;
            }

            this.target = target;
            this.node.removeComponent(cc.RigidBody);
            this.node.removeComponent(cc.PhysicsCollider);
            this.schedule(this.updatePositionToTarget.bind(this));
        }, delay);
    }

}
