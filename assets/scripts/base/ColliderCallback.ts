const {ccclass, property} = cc._decorator;

@ccclass
export default class ColliderCallback extends cc.Component {

    private colliderEnterCb: Function = null;
    private colliderExitCb: Function = null;

    setColliderCallback(enterCb: Function, exitCb: Function = null) {
        this.colliderEnterCb = enterCb;
        this.colliderExitCb = exitCb;
    }

    onCollisionEnter(other, self) {
        if (this.colliderEnterCb) {
            this.colliderEnterCb(other, self);
        }
    }

    onCollisionExit(other, self) {
        if (this.colliderExitCb) {
            this.colliderExitCb(other, self);
        }
    }
}
