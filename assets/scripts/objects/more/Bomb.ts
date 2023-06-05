import {GroupConfig} from "../../config/GroupConfig";
import {PhysicsConfig} from "../../config/PhysicsConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bomb extends cc.Component {

    @property(cc.Prefab)
    bigBangPrefab: cc.Prefab = null;

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'bomb');
    }

    onCollisionEnter(other, self) {

        if (other.node.group === GroupConfig.CHARACTER
            || other.node.group === GroupConfig.BERRIE
            || other.node.group === GroupConfig.ROCK) {
            this.attack();
        }
    }

    attack() {
        this.node.removeComponent(cc.PhysicsCollider);
        this.node.removeComponent(cc.CircleCollider);

        let bang = cc.instantiate(this.bigBangPrefab);
        let root = this.node.getParent().getParent();
        bang.position = root.convertToNodeSpaceAR(
            this.node.getParent().convertToWorldSpaceAR(this.node.position));
        root.addChild(bang);
        this.node.removeFromParent();
    }
}
