import Character from "../Character";
import {GroupConfig} from "../../../config/GroupConfig";
import TagObject, {TagConfig} from "../../../config/TagObject";
import MapLevel from "../../../level/MapLevel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemies extends Character {

    isSuper: boolean = false;
    isAttack: boolean = false;
    superAppearAnim: string = "Appear1";

    protected start(): void {
        this.hit.active = false;
    }

    playAttack(target: cc.Node) {
        if (this.isAttack) {
            return;
        }

        this.isAttack = true;
        this.rotateFaceToTarget(target);
        this.playAnimation(this.attackAnim);
        this.stopMove();

        this.scheduleOnce(() => {
            this.hit.active = true;
        }, 0.2);

        this.skeleton.setCompleteListener(() => {
            if (!this.isAlive) {
                return;
            }
            this.skeleton.setCompleteListener(null);
            this.playAnimation(this.idleAnim, true);
            this.hit.active = false;
            this.isAttack = false;
            this.stopMove();
            this.searchCollider.refreshPingToTarget();
        });
    }

    onHeadCollider(other, self): void {
        if (!this.isAlive) return;
        if (other.node.group === GroupConfig.ROCK) {
            this.onDieNormal();
            this.disablePhysicsBody();
            return;
        }

        if (other.node.group === GroupConfig.ITEM) {
            if (other.node.name == TagConfig.CHEST || other.node.name == TagConfig.ITEM
                || other.node.name == TagConfig.STICK) {
                this.onDieNormal();
                return;
            }
        }
    }

    onBodyCollider(other, self): void {
        if (!this.isAlive) return;

        if (this.checkIgnoreFluid(other.node.group)) {
            return;
        }

        if (other.node.group === GroupConfig.LAVA) {
            this.onDieFire();
            return;
        }

        if (other.node.group === GroupConfig.SNOW) {
            this.onDieIce();
            return;
        }

        if (other.node.group === GroupConfig.COLLIDER) {
            if (other.node.name == TagConfig.HIT) {
                let tag2 = other.node.getComponent(TagObject).tag2;
                cc.log(this.node.name + " onBodyCollider: " + other.node.group + " tag2 = " + tag2);


                if (this.tagHit == TagConfig.DOG) {
                    if (tag2 != TagConfig.DOG) this.onDieNormal();

                } else {
                    if (tag2 == TagConfig.FIRE_BALL || tag2 == TagConfig.BOSS || tag2 == TagConfig.STICK
                        || tag2 == TagConfig.ITEM || tag2 == TagConfig.TRAP
                        || tag2 == TagConfig.ROCK || tag2 == TagConfig.BIG_ROCK
                        || tag2 == TagConfig.BULLET || tag2 == TagConfig.POW
                        || tag2 == TagConfig.SAW || tag2 == TagConfig.LAZE) {
                        this.onDieNormal();
                    }
                }
                return;
            }

            if (other.node.name == TagConfig.GAS || other.node.name == TagConfig.BOMB) {
                this.onDieNormal();
                return;
            }
        }

    }

    onAttackCollider(other, self): void {
        if (!this.isAlive) return;
        cc.log(this.node.name + " onAttackCollider: " + other.node.name);

        if (other.node.group === GroupConfig.CHARACTER && other.node != this.groundCollider.node) {
            if (other.node.name == TagConfig.BOSS || other.node.name == TagConfig.GIRL
                || other.node.name == TagConfig.DOG) {
                this.playAttack(other.node);
                return;

            } else {
                this.stopMove();
                this.playAnimation(this.idleAnim, true);
            }
            return;
        }

        if (other.node.group === GroupConfig.ITEM) {
            if (other.node.name == TagConfig.HOLY_WATER) {
                try {
                    other.node.removeComponent(cc.PhysicsCollider);
                    other.node.removeComponent(cc.BoxCollider);
                    other.node.removeFromParent();

                } catch (e) {
                    cc.warn(e);
                }
                this.stopMove();
                this.changeSkinToSuper();
                return;
            }
        }
    }

    changeSkinToSuper() {
        this.isSuper = true;
        this.idleAnim += "2";
        this.attackAnim += "2";
        this.walkAnim += "2";
        this.runAnim += "2";

        this.hit.removeFromParent();
        this.node.addChild(this.hit);

        let attack = this.attackCollider.getComponent(cc.BoxCollider);
        let hitCollider = this.hit.getComponent(cc.BoxCollider);
        this.hit.position = this.attackCollider.node.position;
        this.hit.angle = this.attackCollider.node.angle;
        hitCollider.offset = attack.offset;
        hitCollider.size = attack.size;

        this.playAnimation(this.superAppearAnim).addAnimation(this.idleAnim, true);
    }

    onSearchCollider(other): void {
        if (!this.isAlive || !MapLevel.instance.isPlaying || this.isAttack) {
            return;
        }

        // cc.log(this.node.name + " onSearchCollider: " + other.node.name);

        if (other.node.group === GroupConfig.CHARACTER && other.node != this.groundCollider.node) {
            if (other.node.name == TagConfig.BOSS || other.node.name == TagConfig.GIRL || other.node.name == TagConfig.GIRL_WONDER
                || other.node.name == TagConfig.DOG) {
                this.walkToTarget(other.node);

            } else {
                this.addToIgnoreSearchCollier(other.node);
            }
            return;
        }
    }

    onAutoMove() {
        if (this.isAlive) {
            this.walkToTarget(null);
        }
    }

    onDieFire() {
        this.stun.node.active = true;
        this.playAnimation(this.dieFireAnim);
        this.isAlive = false;
    }

    onDieNormal() {
        this.stun.node.active = true;
        this.playAnimation(this.dieAnim);
        this.isAlive = false;
    }

    onDieIce() {
        this.stun.node.active = true;
        this.playAnimation(this.dieIceAnim);
        this.isAlive = false;
    }
}