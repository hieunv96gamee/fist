import {GroupConfig} from "../../config/GroupConfig";
import {TagConfig} from "../../config/TagObject";
import {AudioPlayId} from "../../config/AudioPlayId";
import MapLevel from "../../level/MapLevel";
import MainScene from "../../MainScene";
import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class WaterGO extends cc.Component {

    @property(cc.Node)
    border: cc.Node = null;

    @property(cc.Node)
    drop: cc.Node = null;

    @property(cc.Prefab)
    rockPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    icePrefab: cc.Prefab = null;

    available: boolean = true;

    private static isTransform = false;
    private static colliderBarrieCount = 0;

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'water');
    }

    protected start() {
        this.border.active = true;
        this.drop.active = true;
        WaterGO.isTransform = false;
        WaterGO.colliderBarrieCount = 0;

        let sp = this.getComponent(cc.Sprite);
        if (sp) {
            sp.enabled = false;
        }
    }

    protected onDisable(): void {
        this.unscheduleAllCallbacks();
    }

    transformToRock(prefab: cc.Prefab) {
        let root = MapLevel.instance.rockContainer;
        let rock = cc.instantiate(prefab);
        rock.position = root.convertToNodeSpaceAR(
            this.node.getParent().convertToWorldSpaceAR(this.node.position));
        rock.parent = root;
        this.node.removeFromParent();

        if (!WaterGO.isTransform && MapLevel.instance.isPlaying) {
            MainScene.instance.audioPlayer.playAudio(AudioPlayId.effect_lava_x_water);
            WaterGO.isTransform = true;
        }
    }

    onCollisionEnter(other, self) {
        // cc.log("onCharCollisionEnter: " + self.node.group);
        if (!this.available) {
            return;
        }

        if (other.node.group === GroupConfig.BERRIE) {
            WaterGO.colliderBarrieCount++;

            if (WaterGO.colliderBarrieCount === 3) {
                MainScene.instance.audioPlayer.playAudio(AudioPlayId.effect_lava_appear);

                this.scheduleOnce(() => {
                    WaterGO.colliderBarrieCount = 0;
                }, 2.0);
            }
            return;
        }


        let prefab = null;
        switch (other.node.group) {
            case GroupConfig.ROCK:
                if (other.node.name == TagConfig.ROCK) {
                    prefab = this.rockPrefab;

                } else {
                    prefab = this.icePrefab;
                }
                break;
            case GroupConfig.LAVA:
                prefab = this.rockPrefab;
                break;
            case GroupConfig.SNOW:
                prefab = this.icePrefab;
                break;
        }

        if (prefab) {
            this.available = false;
            this.scheduleOnce(() => {
                this.transformToRock(prefab);
            }, 0.2);
        }
    }
}
