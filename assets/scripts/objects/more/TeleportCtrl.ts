import ColliderCallback from "../../base/ColliderCallback";
import { GroupConfig } from "../../config/GroupConfig";
import TagObject, { TagConfig } from "../../config/TagObject";
import Bullet from "./Bullet";
import FireBall from "./FireBall";
import easeOut = cc.easeOut;


const { ccclass, property } = cc._decorator;

@ccclass
export default class TeleportCtrl extends cc.Component {

    listPort: ColliderCallback[] = [];
    listObj: cc.Node[] = [];

    protected onLoad(): void {
        this.node.children.forEach((ch) => {
            let port = ch.getComponent(ColliderCallback);
            if (port) this.listPort.push(port);
        });

        cc.log("Init Teleport: Length = " + this.listPort.length);
        if (this.listPort.length < 2) {
            return;
        }
        for (let i = 0; i < this.listPort.length; i++) {
            let fromPort = this.listPort[i].node;

            let toPortIdx = (i === this.listPort.length - 1) ? 0 : i + 1;
            let toPort = this.listPort[toPortIdx].node;

            this.listPort[i].setColliderCallback((other, self) => {
                if (other.node.group === GroupConfig.CHARACTER) {
                    this.moveTo(other.node.getParent().getParent(), fromPort, toPort);

                } else if (other.node.group === GroupConfig.COLLIDER) {
                    if (other.node.width * other.node.height > 0) {
                        let callback = null;
                        if (other.node.name == TagConfig.HIT) {
                            let tag2 = other.node.getComponent(TagObject).tag2;
                            if (tag2 == TagConfig.BULLET) {
                                callback = this.onMoveBullet;

                            } else if (tag2 == TagConfig.FIRE_BALL) {
                                callback = this.onMoveFireball;

                            }
                        }

                        this.moveTo(other.node, fromPort, toPort, () => {
                            if (callback) callback(other.node);
                        });
                    }
                }
            });
        }
    }

    onMoveBullet(bullet: cc.Node) {
        let s = 500;
        let v = Bullet.velocityHit;
        let dt = s / v;
        cc.tween(bullet).by(dt, {
            position: new cc.Vec3(s, 0, 0)

        }).call(() => {
            bullet.active = false;
            bullet.removeFromParent();
        }).start();
    }

    onMoveFireball(fireball: cc.Node) {
        let s = 400;
        let v = FireBall.velocityHit;
        let dt = s / v;

        let jump = cc.jumpBy(dt, cc.v2(s, -s / 2), s / 7, 1);
        fireball.runAction(cc.sequence(
            jump,
            cc.callFunc(() => {
                fireball.active = false;
                fireball.removeFromParent();
            })
        ));

        // cc.tween(fireball).parallel(jump).call(() => {
        //     fireball.active = false;
        //     fireball.removeFromParent();
        // }).start();
    }

    moveTo(obj: cc.Node, fromPort: cc.Node, toPort: cc.Node, callback: Function = null) {
        cc.log("Teleport move " + obj.group);
        if (this.listObj.indexOf(obj) != -1) {
            return;
        }

        this.listObj.push(obj);

        let sX = obj.scaleX;
        let sY = obj.scaleY;

        let p1 = obj.getParent().convertToNodeSpaceAR(
            fromPort.getParent().convertToWorldSpaceAR(fromPort.position));

        let p2 = obj.getParent().convertToNodeSpaceAR(
            toPort.getParent().convertToWorldSpaceAR(toPort.position));

        cc.Tween.stopAllByTarget(obj);
        cc.tween(obj).to(0.35, {
            position: p1,
            scaleX: 0,
            scaleY: 0,
        }, easeOut(2.0)).call(() => {
            obj.position = p2;

        }).to(0.2, {
            scaleX: sX,
            scaleY: sY,

        }, easeOut(2.0)).call(() => {
            cc.log("Teleport move done " + (new Date().getTime()));
            let idx = this.listObj.indexOf(obj);
            if (idx != -1) {
                this.listObj.splice(idx, 1);
            }

            if (callback) callback();
        }).start();

    }


}
