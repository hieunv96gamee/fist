import {GroupConfig} from "../../config/GroupConfig";
import {GlobalSignals} from "../../config/GlobalSignals";
import ColliderCallback from "../../base/ColliderCallback";
import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemChest extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.String)
    dieAnim: string = "Fire";

    @property(cc.String)
    openAnim: string = "Animation";

    @property(cc.Prefab)
    gemsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    firePrefab2: cc.Prefab = null;

    @property(ColliderCallback)
    collider: ColliderCallback = null;

    isAlive: boolean = true;

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'chest');
    }

    protected start(): void {
        this.collider.setColliderCallback(this.onCollisionEnter.bind(this));
    }

    onCollisionEnter(other, self) {
        if (!this.isAlive) {
            return;
        }

        if (other.node.group === GroupConfig.LAVA) {
            this.isAlive = false;
            this.skeleton.setAnimation(0, this.dieAnim, false);
            this.showFireEffect();
            GlobalSignals.questFailSignal.dispatch();
            return;
        }
    }

    openItem() {
        this.playAnimation(this.openAnim, false);
        let dt = this.skeleton.findAnimation(this.openAnim).duration;
        this.node.getComponent(cc.BoxCollider).enabled = false;

        this.scheduleOnce(() => {
            let gems = cc.instantiate(this.gemsPrefab);
            gems.position = cc.Vec3.ZERO;
            this.node.addChild(gems);
        }, dt);
    }

    playAnimation(name: string, loop: boolean = false): ItemChest {
        this.skeleton.setAnimation(0, name, loop);
        return this;
    }

    addAnimation(name: string, loop: boolean = false, delay: number = 0): ItemChest {
        this.skeleton.addAnimation(0, name, loop, delay);
        return this;
    }

    showFireEffect() {
        if (!this.firePrefab2){
            cc.warn("firePrefab is null");
            return;
        }

        let bum = cc.instantiate(this.firePrefab2);
        bum.setPosition(0, 0);
        bum.scale = 1;
        this.node.addChild(bum);
        // MainScene.instance.audioPlayer.playAudio(AudioPlayId.dragon_fire_ball);

        cc.tween(bum).delay(2).call(() => {
            bum.removeFromParent();
        }).start();
    }
}
