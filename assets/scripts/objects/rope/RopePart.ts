import {GroupConfig} from "../../config/GroupConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class RopePart extends cc.Component {

    private cutCallback: Function = null;

    protected start(): void {
        if (!this.getComponent(cc.BoxCollider)) {
            let boxPhysics = this.getComponent(cc.PhysicsBoxCollider);
            let boxCollider = this.addComponent(cc.BoxCollider);
            boxCollider.offset = boxPhysics.offset;
            boxCollider.size = boxPhysics.size;
        }
    }

    setCutCallback(cb: Function){
        this.cutCallback = cb;
    }

    onCollisionEnter(other, self) {
        if (other.node.group === GroupConfig.TOUCH) {
            if (this.cutCallback) this.cutCallback(this.node);
            return;
        }
    }
}
