import Character from "../Character";
import {GroupConfig} from "../../../config/GroupConfig";
import MapLevel from "../../../level/MapLevel";
import {AudioPlayId} from "../../../config/AudioPlayId";
import MainScene from "../../../MainScene";
import {TagConfig} from "../../../config/TagObject";
import FireBall from "../../more/FireBall";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Dragon extends Character {

    @property(cc.Prefab)
    fireBallPrefab: cc.Prefab = null;

    isAttack: boolean = false;

    protected start(): void {
        this.hit.active = true;
    }

    onHeadCollider(other, self): void {
        if (!this.isAlive) return;
        if (other.node.group === GroupConfig.ROCK) {
            this.onDieNormal();
            return;
        }

        if (other.node.group === GroupConfig.ITEM && other.node.name == TagConfig.CHEST) {
            this.onDieNormal();
            return;
        }
    }

    onBodyCollider(other, self): void {
        if (!this.isAlive) return;

        if (this.checkIgnoreFluid(other.node.group)) {
            return;
        }

        if (other.node.group === GroupConfig.SNOW) {
            this.onDieIce();
            return;
        }

        if (other.node.group === GroupConfig.COLLIDER) {
            if (other.node.name == TagConfig.GAS || other.node.name == TagConfig.BOMB) {
                this.onDieNormal();
                return;
            }
        }
    }

    onSearchCollider(other): void {
        if (!this.isAlive) return;
        cc.log("Dragon onSearchCollider: " + other.node.name);
        if (!MapLevel.instance.isPlaying) {
            return;
        }

        if (other.node.group === GroupConfig.CHARACTER) {
            this.playAttack(other);
            return;
        }
    }

    playAttack(other) {
        if (this.isAttack) {
            return;
        }

        this.isAttack = true;

        this.playAnimation(this.attackAnim);
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dragon_fire);

        let fireball = cc.instantiate(this.fireBallPrefab);
        this.hit.addChild(fireball);

        let s = 800;
        let dt = s / FireBall.velocityHit;

        let jump = cc.jumpBy(dt, cc.v2(s, -s / 2), s / 7, 1);
        fireball.runAction(cc.sequence(
            jump,
            cc.callFunc(() => {
                if (fireball.active) {
                    fireball.active = false;
                    fireball.removeFromParent();
                }
            })
        ));

        // cc.tween(fireball).by(dt, {
        //     position: new cc.Vec3(s, 0, 0)
        //
        // }).call(() => {
        //     if (fireball.active) {
        //         fireball.active = false;
        //         fireball.removeFromParent();
        //     }
        // }).start();

        this.scheduleOnce(() => {
            if (!this.isAlive) {
                return;
            }
            this.playAnimation(this.idleAnim, true);
        }, 0.5);

        this.scheduleOnce(() => {
            if (!this.isAlive) {
                return;
            }

            this.isAttack = false;
            this.searchCollider.refreshPingToTarget();
        }, 1);
    }

    onDieNormal() {
        this.stun.node.active = true;
        this.playAnimation(this.dieAnim);
        this.isAlive = false;
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dragon_die);
    }

    onDieIce() {
        this.stun.node.active = true;
        this.playAnimation(this.dieIceAnim);
        this.isAlive = false;
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dragon_die);
    }
}
