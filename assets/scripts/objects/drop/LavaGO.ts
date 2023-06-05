import {GroupConfig} from "../../config/GroupConfig";
import {TagConfig} from "../../config/TagObject";
import MainScene from "../../MainScene";
import {AudioPlayId} from "../../config/AudioPlayId";
import MapLevel from "../../level/MapLevel";
import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LavaGO extends cc.Component {

    @property(cc.Node)
    border: cc.Node = null;

    @property(cc.Node)
    drop: cc.Node = null;

    @property(cc.Prefab)
    rockPrefab: cc.Prefab = null;

    available: boolean = true;
    private static colliderBarrieCount = 0;

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'lava');
    }

    protected start() {
        this.border.active = true;
        this.drop.active = true;
        LavaGO.colliderBarrieCount = 0;

        let sp = this.getComponent(cc.Sprite);
        if (sp) {
            sp.enabled = false;
        }
    }

    transformToRock() {
        let root = MapLevel.instance.rockContainer;
        let rock = cc.instantiate(this.rockPrefab);
        rock.position = root.convertToNodeSpaceAR(
            this.node.getParent().convertToWorldSpaceAR(this.node.position));
        rock.parent = root;
        this.node.removeFromParent();
    }

    onCollisionEnter(other, self) {
        if (!this.available) {
            return;
        }

        if (other.node.group === GroupConfig.WATER
            || (other.node.group == GroupConfig.ROCK && other.node.name == TagConfig.ROCK)) {
            this.available = false;
            this.transformToRock();
            return;
        }

        if (other.node.group === GroupConfig.BERRIE) {
            LavaGO.colliderBarrieCount++;
            if (LavaGO.colliderBarrieCount === 6) {
                MainScene.instance.audioPlayer.playAudio(AudioPlayId.effect_lava_appear);
                this.scheduleOnce(() => {
                    LavaGO.colliderBarrieCount = 0;
                }, 2.0);
            }
            return;
        }
    }
}
