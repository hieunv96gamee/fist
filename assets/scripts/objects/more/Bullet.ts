import {GroupConfig} from "../../config/GroupConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    public static velocityHit: number = 500;

    onCollisionEnter(other, self) {
        if (other.node.group === GroupConfig.CHARACTER) {
            this.scheduleOnce(() => {
                this.node.opacity = 0;
                cc.Tween.stopAllByTarget(this.node);
            }, 0.05);

            this.scheduleOnce(() => {
                this.node.active = false;
                this.node.removeFromParent();
            }, 0.2);
        }
    }

}
