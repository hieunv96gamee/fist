import Enemies from "./Enemies";
import MapLevel from "../../../level/MapLevel";
import { GroupConfig } from "../../../config/GroupConfig";
import { TagConfig } from "../../../config/TagObject";
import MainScene from "../../../MainScene";
import { AudioPlayId } from "../../../config/AudioPlayId";
import Bullet from "../../more/Bullet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shooter extends Enemies {

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    protected start(): void {
        super.start();

        this.hit.active = true;
    }

    onAttackCollider(other, self): void {
        //Overwrite
    }

    onSearchCollider(other): void {

        if (!this.isAlive) return;
        cc.log("Enemies onSearchCollider: " + other.node.name);
        if (!MapLevel.instance.isPlaying) {
            return;
        }

        if (other.node.group === GroupConfig.CHARACTER) {
            if (other.node.name == TagConfig.BOSS
                || other.node.name == TagConfig.GIRL
                || other.node.name == TagConfig.DOG) {
                this.playAttack(other);
            }
            else {
                this.addToIgnoreSearchCollier(other.node);
            }
            return;
        }
    }

    playAttack(other) {
        //Overwrite
        if (this.isAttack) {
            return;
        }

        this.isAttack = true;
        this.playAnimation(this.attackAnim);

        let bullet = cc.instantiate(this.bulletPrefab);
        bullet.active = false;
        this.hit.addChild(bullet);

        let s = 500;
        let dt = s / Bullet.velocityHit;
        cc.tween(bullet).delay(0.8).call(() => {
            if (!this.isAlive) {
                cc.Tween.stopAllByTarget(bullet);
                bullet.removeFromParent();
            }
            bullet.active = true;
            MainScene.instance.audioPlayer.playAudio(AudioPlayId.shoot);

        }).by(dt, {
            position: new cc.Vec3(s, 0, 0)

        }).call(() => {

            if (bullet.active) {
                bullet.active = false;
                bullet.removeFromParent();
            }
        }).start();

        this.scheduleOnce(() => {
            if (!this.isAlive) {
                return;
            }

            this.isAttack = false;
            this.playAnimation(this.idleAnim, true);

            this.scheduleOnce(() => {
                this.searchCollider.refreshPingToTarget();
            }, 0.5);

        }, 0.8);
    }

    onDieIce() {
        super.onDieIce();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.stealer_die);
    }

    onDieNormal() {
        super.onDieNormal();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.stealer_die);
    }

    onDieFire() {
        super.onDieFire();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.stealer_die);
    }
}
