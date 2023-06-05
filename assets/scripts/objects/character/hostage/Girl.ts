import Character from "../Character";
import {GroupConfig} from "../../../config/GroupConfig";
import {GlobalSignals} from "../../../config/GlobalSignals";
import TagObject, {TagConfig} from "../../../config/TagObject";
import {AudioPlayId} from "../../../config/AudioPlayId";
import MainScene from "../../../MainScene";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Girl extends Character {

    outAnim: string = "Out";
    winAnim: string = "Win";
    flowerAnim: string = "Flower";

    wonderSkin: string = "Wonder";
    wonderAppearAnim: string = "WonderAppear";
    wonderIdleAnim: string = "WonderIdle";
    wonderAttackAnim: string = "WonderAttack";
    wonderOutAnim: string = "WonderOut";
    wonderWinAnim: string = "WonderWin";

    protected onLoad(): void {
        super.onLoad();

        if (this.hit) {
            this.hit.active = false;
        }
    }

    protected onEnable(): void {
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.girl_help);
    }

    onAttackCollider(other, self): void {
        super.onAttackCollider(other, self);

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
                this.changeSkinToWonder();
                return;
            }
        }

        if (other.node.group === GroupConfig.CHARACTER) {
            if (this.getCurrentSkin() === this.wonderSkin) {

                if (other.node.name != TagConfig.BOSS) {
                    this.playAttack(other.node);
                    return;
                }
            }
            return;
        }
    }

    playOutAnimation(target: cc.Node) {
        this.rotateFaceToTarget(target);
        if (this.getCurrentSkin() === this.wonderSkin) {
            this.playAnimation(this.wonderOutAnim)
                .addAnimation(this.wonderWinAnim, true);

        } else {
            this.playAnimation(this.outAnim)
                .addAnimation(this.winAnim)
                .addAnimation(this.flowerAnim, true);
        }
    }

    changeSkinToWonder() {
        this.changeSkin(this.wonderSkin);
        this.playAnimation(this.wonderAppearAnim).addAnimation(this.wonderIdleAnim, true);

        let dt = this.skeleton.findAnimation(this.wonderAppearAnim).duration;
        cc.tween(this.skeleton.node).by(dt, {
            position: new cc.Vec3(0, 20, 0)
        }).start();

        this.attackCollider.node.getComponent(cc.BoxCollider).size.width += 40;
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.boss_take_stick);

        let tagObj = this.groundCollider.node.getComponent(TagObject);
        if (tagObj) {
            tagObj.setTag(TagConfig.GIRL_WONDER);
            cc.log("changeSkinToWonder");
        }

        // this.scheduleOnce(() => {
        //     this.searchCollider.refreshPingToTarget();
        // }, 0.1);
    }

    playAttack(target: cc.Node) {
        if (!this.hit) {
            return;
        }

        cc.log("wonder playAttack");
        this.rotateFaceToTarget(target);
        this.playAnimation(this.wonderAttackAnim);
        this.stopMove();

        this.scheduleOnce(() => {
            this.hit.active = true;
        }, 0.35);

        this.skeleton.setCompleteListener(() => {
            this.skeleton.setCompleteListener(null);
            this.playAnimation(this.wonderIdleAnim, true);
            this.hit.active = false;
            this.stopMove();
        });
    }

    onHeadCollider(other, self): void {
        if (!this.isAlive) return;

        if (this.getCurrentSkin() === this.wonderSkin) {
            return;
        }

        if (other.node.group === GroupConfig.ROCK) {
            //this.onDieNormal();
            if (other.node.name == TagConfig.BIG_ROCK) {
                this.onDieNormal();
                this.disablePhysicsBody();
            }
            return;
        }

        if (other.node.group === GroupConfig.ITEM) {
            if (other.node.name == TagConfig.CHEST || other.node.name == TagConfig.ITEM) {
                this.onDieNormal();
                return;
            }
        }
    }

    onBodyCollider(other, self) {
        if (!this.isAlive) {
            return;
        }

        if (this.getCurrentSkin() === this.wonderSkin) {
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

            if (other.node.name == TagConfig.REDIRECT_RIGHT
                || other.node.name == TagConfig.REDIRECT_LEFT) {
                other.node.removeFromParent();
                return;
            }

            if (other.node.name == TagConfig.GAS || other.node.name == TagConfig.BOMB) {
                this.onDieNormal();
                return;
            }

            if (other.node.name == TagConfig.HIT) {
                this.onDieNormal();
                return;
            }
        }
    }

    onDieNormal() {
        this.stun.node.active = true;
        this.playAnimation(this.dieAnim);
        this.isAlive = false;
        GlobalSignals.questFailSignal.dispatch();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.girl_die);
    }

    onDieFire() {
        this.stun.node.active = true;
        this.playAnimation(this.dieFireAnim);
        this.isAlive = false;
        GlobalSignals.questFailSignal.dispatch();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.girl_die);
    }

    onDieIce() {
        this.stun.node.active = true;
        this.playAnimation(this.dieIceAnim);
        this.isAlive = false;
        GlobalSignals.questFailSignal.dispatch();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.girl_die);
    }
}
