import {GroupConfig} from "../../config/GroupConfig";
import MapLevel from "../../level/MapLevel";
import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SnowGO extends cc.Component {

    @property(cc.Node)
    border: cc.Node = null;

    @property(cc.Node)
    drop: cc.Node = null;

    @property(cc.Prefab)
    icePrefab: cc.Prefab = null;

    available: boolean = true;

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'snow');
    }

    protected start() {
        this.border.active = true;
        this.drop.active = true;

        let sp = this.getComponent(cc.Sprite);
        if (sp) {
            sp.enabled = false;
        }
    }

    transformToRock() {
        let root = MapLevel.instance.rockContainer;
        let rock = cc.instantiate(this.icePrefab);
        rock.position = root.convertToNodeSpaceAR(
            this.node.getParent().convertToWorldSpaceAR(this.node.position));
        rock.parent = root;
        this.node.removeFromParent();
    }

    onCollisionEnter(other, self) {
        if (!this.available) {
            return;
        }

        if (other.node.group === GroupConfig.WATER || other.node.group === GroupConfig.ROCK) {
            this.available = false;
            this.transformToRock();
        }
    }
}
