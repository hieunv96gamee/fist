import {GroupConfig} from "../../config/GroupConfig";
import ArrayUtil from "../../base/utils/ArrayUtil";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ColliderGround extends cc.Component {

    private groundConfig = [GroupConfig.BERRIE, GroupConfig.ROCK];
    private arrayGround: cc.Node[] = [];
    private callback: Function = null;
    private isGround: boolean = false;

    setGroundColliderCallback(cb: Function) {
        this.callback = cb;
    }

    onCollisionEnter(other, self) {
        if (this.groundConfig.indexOf(other.node.group) === -1) {
            return;
        }

        if (this.arrayGround.indexOf(other.node) != -1) {
            return;
        }

        this.arrayGround.push(other.node);

        if (!this.isGround) {
            this.isGround = true;
            if (this.callback) this.callback(true);
            return;
        }
    }

    onCollisionExit(other, self) {
        if (this.groundConfig.indexOf(other.node.group) === -1) {
            return;
        }

        ArrayUtil.removeElement(this.arrayGround, other.node);

        if (this.arrayGround.length === 0) {
            if (this.callback) this.callback(false);
            this.isGround = false;
        }
    }
}
