import {GroupConfig} from "../../config/GroupConfig";
import {GlobalSignals} from "../../config/GlobalSignals";
import ColliderCallback from "../../base/ColliderCallback";
import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass('ItemConfig')
export class ItemConfig {

    skin: string = "";

    @property(cc.Integer)
    roomId: number = 1;

    @property(cc.Integer)
    itemId: number = 1;
}

@ccclass
export default class ItemLoot extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.String)
    dieAnim: string = "Die";

    @property(cc.String)
    openAnim: string = "animation";

    @property(ColliderCallback)
    collider: ColliderCallback = null;

    @property(ItemConfig)
    itemConfig: ItemConfig = null;

    @property(cc.Prefab)
    chestPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    flashPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    firePrefab: cc.Prefab = null;

    isAlive: boolean = true;

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'item');
    }

    protected start(): void {
        this.itemConfig.skin = this.skeleton.defaultSkin;
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
        this.node.getComponent(cc.BoxCollider).enabled = false;

        this.scheduleOnce(() => {
            this.showFlashEffect();
        }, 0.2);
    }

    playAnimation(name: string, loop: boolean = false): ItemLoot {
        this.skeleton.setAnimation(0, name, loop);
        return this;
    }

    addAnimation(name: string, loop: boolean = false, delay: number = 0): ItemLoot {
        this.skeleton.addAnimation(0, name, loop, delay);
        return this;
    }

    showFireEffect() {
        if (!this.firePrefab) {
            cc.warn("firePrefab is null");
            return;
        }

        let bum = cc.instantiate(this.firePrefab);
        bum.setPosition(0, 0);
        bum.scale = 1;
        this.node.addChild(bum);
        // MainScene.instance.audioPlayer.playAudio(AudioPlayId.dragon_fire_ball);

        cc.tween(bum).delay(2).call(() => {
            bum.removeFromParent();
        }).start();
    }

    showFlashEffect() {
        if (!this.flashPrefab) {
            cc.warn("flashPrefab is null");
            return;
        }

        let bum = cc.instantiate(this.flashPrefab);
        bum.setPosition(0, 70);
        this.node.addChild(bum);
    }

}
