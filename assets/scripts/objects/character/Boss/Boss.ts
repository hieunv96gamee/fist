import {GlobalSignals} from "../../../config/GlobalSignals";
import {GroupConfig} from "../../../config/GroupConfig";
import Character from "../Character";
import ColliderCallback from "../../../base/ColliderCallback";
import TagObject, {TagConfig} from "../../../config/TagObject";
import Girl from "../hostage/Girl";
import MapLevel from "../../../level/MapLevel";
import {GameState} from "../../../config/GameState";
import ItemLoot from "../../more/ItemLoot";
import {AudioPlayId} from "../../../config/AudioPlayId";
import MainScene from "../../../MainScene";
import ItemChest from "../../more/ItemChest";
import {SkinConfig} from "../../../config/SkinConfig";
import {GameData} from "../../../GameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Boss extends Character {

    sitAnim: string = "Sit";
    winAnim: string = "Win";
    failAnim: string = "Fail";
    failAnim1: string = "Fail2";
    openLockAnim: string = "OpenLock";
    flowerAnim: string = "Flower";
    flowerAnim2: string = "Flower2";
    stickSkin: string = "Boss0/Stick";
    idleStickAnim: string = "IdleStick";

    superSkin: string = "SuperMan/Boss";
    superAppearAnim: string = "SuperAppear";
    superAttackAnim: string = "SuperAttack";
    superIdleAnim: string = "SuperIdle";
    superWinAnim: string = "SuperWin";
    superOpenLockAnim: string = "SuperChest";
    superFlowerAnim: string = "SuperFlower";
    superFlowerAnim2: string = "SuperFlower2";

    @property(ColliderCallback)
    jumpCollider: ColliderCallback = null;

    isAutoMove: boolean = false;

    private static _instance: Boss = null;
    public static get instance() {
        return Boss._instance;
    }

    protected onLoad() {
        Boss._instance = this;
        super.onLoad();
        this.initBossSkin();
    }

    initBossSkin() {
        let skinName = SkinConfig.getSkinNameById(GameData.currentSkinBoss);
        let rootSkin = skinName.split('/')[0];
        this.stickSkin = rootSkin + "/Stick";
        this.changeSkin(skinName);
    }

    protected start() {
        this.hit.active = false;
        this.jumpCollider.setColliderCallback(this.onJumpCollider.bind(this));
    }

    _onQuestPass;
    _onQuestFail;
    _onCollectGems;
    _onAutoMove;

    protected onEnable(): void {
        this._onQuestFail = this.onQuestFail.bind(this);
        this._onQuestPass = this.onQuestPass.bind(this);
        this._onCollectGems = this.onCollectGems.bind(this);
        this._onAutoMove = this.onAutoMove.bind(this);

        GlobalSignals.questPassSignal.add(this._onQuestPass);
        GlobalSignals.questFailSignal.add(this._onQuestFail);
        GlobalSignals.collectGemsSignal.add(this._onCollectGems);
        GlobalSignals.autoMoveSignal.add(this._onAutoMove);
    }

    protected onDisable(): void {
        GlobalSignals.questPassSignal.remove(this._onQuestPass);
        GlobalSignals.questFailSignal.remove(this._onQuestFail);
        GlobalSignals.collectGemsSignal.remove(this._onCollectGems);
        GlobalSignals.autoMoveSignal.remove(this._onAutoMove);
    }

    protected onDestroy() {
        Boss._instance = null;
        this.unscheduleAllCallbacks();
    }

    onCollectGems() {
        this.stopMove();
        this.playAnimation(this.sitAnim);
        let dt = this.skeleton.findAnimation(this.sitAnim).duration;
        this.scheduleOnce(() => {
            if (MapLevel.instance.gameState != GameState.LOSE) {
                GlobalSignals.questPassSignal.dispatch();
            }
        }, dt);
    }

    onQuestPass() {
        if (!this.isAlive) {
            return;
        }

        if (!MapLevel.instance.isQuestSaveHostage) {
            this.playAnimation(this.winAnim, true);
            MainScene.instance.audioPlayer.playAudio(AudioPlayId.boss_jump_win);
        }
    }

    onQuestFail() {
        this.stopMove();
        if (this.isAlive) {
            this.playAnimation(this.failAnim).addAnimation(this.failAnim1, true);
            MainScene.instance.audioPlayer.playAudio(AudioPlayId.boss_crying);
        }
    }

    onAutoMove() {
        this.isAutoMove = true;
        if (this.isAlive && this.isGround && MapLevel.instance.isPlaying) {
            this.isAutoMove = false;
            this.runToTarget(null);
            this.jumpCollider.node.active = false;
            this.scheduleOnce(() => {
                this.jumpCollider.node.active = true;
            }, 0.2);
        }
    }

    onGroundCollisionEnter(isGround) {
        super.onGroundCollisionEnter(isGround);
        
        if (this.isAutoMove && this.isAlive && this.isGround && MapLevel.instance.isPlaying) {
            this.isAutoMove = false;
            this.runToTarget(null);
        }
    }

    onHeadCollider(other, self): void {
        if (!this.isAlive) return;

        if (this.getCurrentSkin() === this.superSkin) {
            return;
        }

        if (other.node.group === GroupConfig.ROCK) {
            this.onDieNormal();
            this.disablePhysicsBody();
            return;
        }

        // if (other.node.group === GroupConfig.ITEM) {
        //     if (other.node.name == TagConfig.CHEST || other.node.name == TagConfig.ITEM) {
        //         this.onDieNormal();
        //         return;
        //     }
        // }
    }

    onBodyCollider(other, self) {
        if (!this.isAlive || !MapLevel.instance.isPlaying) {
            return;
        }

        if (this.getCurrentSkin() === this.superSkin) {
            return;
        }

        if (other.node.group === GroupConfig.GEMS) {
            MapLevel.instance.countGemsCollected++;
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

            if (other.node.name == TagConfig.REDIRECT_RIGHT) {
                this.moveRight(this.runAnim);
                return;
            }

            if (other.node.name == TagConfig.REDIRECT_LEFT) {
                this.moveLeft(this.runAnim);
                return;
            }

            if (other.node.name == TagConfig.REDIRECT_STOP) {
                this.stopMove();
                return;
            }

            if (other.node.name == TagConfig.BOMB) {
                this.onDieNormal();
                return;
            }

            if (other.node.name == TagConfig.GAS || other.node.name == TagConfig.BOMB ||
                (other.node.name == TagConfig.HIT && other.node != this.hit)) {
                this.onDieNormal();
            }
        }
    }

    onAttackCollider(other, self): void {
        cc.log("onAttackCollider: group: " + other.node.group + ", name: " + other.node.name + ", " + (new Date().getTime()));
        if (!this.isAlive || !MapLevel.instance.isPlaying) return;

        if (other.node.group === GroupConfig.ITEM) {
            if (other.node.name == TagConfig.STICK) {
                cc.log("Boss onAttackCollider: STICK = " + other.node.name);
                try {
                    other.node.removeComponent(cc.PhysicsCollider);
                    other.node.removeComponent(cc.BoxCollider);
                    other.node.removeFromParent();

                } catch (e) {
                    cc.warn(e);
                }
                this.stopMove();
                this.changeSkinToStickBoss();
                return;
            }

            if (other.node.name == TagConfig.HOLY_WATER) {
                try {
                    other.node.removeComponent(cc.PhysicsCollider);
                    other.node.removeComponent(cc.BoxCollider);
                    other.node.removeFromParent();

                } catch (e) {
                    cc.warn(e);
                }
                this.stopMove();
                this.changeSkinToSuperman();
                return;
            }

            if (other.node.name == TagConfig.ITEM) {
                cc.log("Boss onAttackCollider: ITEM = " + other.node.name);
                let item = other.node.getComponent(ItemLoot);
                if (!item) {
                    cc.error("item is null");
                    return;
                }
                this.stopMove();
                this.rotateFaceToTarget(other.node);
                this.playAnimation(this.openLockAnim);
                item.openItem();
                MainScene.instance.audioPlayer.playAudio(AudioPlayId.chest_open);

                let dt = this.skeleton.findAnimation(this.openLockAnim).duration;
                this.scheduleOnce(() => {
                    if (MapLevel.instance.isPlaying && MapLevel.instance.isQuestCollectItem) {
                        GlobalSignals.questPassSignal.dispatch();
                    }
                }, dt);

                return;
            }

            if (other.node.name == TagConfig.CHEST) {
                cc.log("Boss onAttackCollider: ITEM = " + other.node.name);
                let item = other.node.getComponent(ItemChest);
                if (!item) {
                    cc.error("item is null");
                    return;
                }
                this.stopMove();
                this.rotateFaceToTarget(other.node);
                this.playAnimation(this.openLockAnim);
                item.openItem();
                MainScene.instance.audioPlayer.playAudio(AudioPlayId.chest_open);

                let dt = this.skeleton.findAnimation(this.openLockAnim).duration;
                this.scheduleOnce(() => {
                    if (!this.isAlive || !MapLevel.instance.isPlaying) return;
                    MapLevel.instance.isCollectGems = true;
                    GlobalSignals.collectGemsSignal.dispatch();

                    this.scheduleOnce(() => {
                        if (!this.isAlive || !MapLevel.instance.isPlaying) return;

                        MapLevel.instance.gameState = GameState.WIN;
                        if (MapLevel.instance.isPlaying && MapLevel.instance.isQuestOpenChest) {
                            GlobalSignals.questPassSignal.dispatch();
                        }
                    }, 1.5);
                }, dt);

                return;
            }
        }

        if (other.node.group === GroupConfig.CHARACTER) {

            if (other.node.name == TagConfig.GIRL || other.node.name == TagConfig.GIRL_WONDER) {

                this.rescueTheGirl(other.node);
                return;
            }

            if (this.getCurrentSkin() === this.stickSkin) {
                if (other.node.name == TagConfig.STEALER) {
                    this.playAttack(other.node);
                    return;
                }
            }
            return;
        }
    }

    onJumpCollider(other, self) {
        if (!this.isAlive || !this.isGround) return;
        if (other.node.group === GroupConfig.BERRIE) {
            cc.log("Boss onJumpCollider");
            this.moveJump();
        }
    }

    onSearchCollider(other): void {
        if (!this.isAlive || !MapLevel.instance.isPlaying) {
            return;
        }

        cc.log("other.node.name: " + other.node.name);
        if (other.node.group === GroupConfig.CHARACTER && other.node != this.node) {
            if (other.node.name == TagConfig.GIRL) {
                this.runToTarget(other.node);
                return;
            }
            if (this.getCurrentSkin() === this.stickSkin) {
                if (other.node.name == TagConfig.STEALER) {
                    this.walkToTarget(other.node);
                    return;
                }
            }
            return;
        }
    }

    playAttack(target: cc.Node) {
        this.rotateFaceToTarget(target);
        this.playAnimation(this.attackAnim);
        this.stopMove();

        this.scheduleOnce(() => {
            this.hit.active = true;
        }, 0.2);

        this.skeleton.setCompleteListener(() => {
            if (!MapLevel.instance.isPlaying) {
                return;
            }
            this.skeleton.setCompleteListener(null);
            this.playAnimation(this.idleStickAnim, true);
            this.hit.active = false;
            this.stopMove();
        });
    }

    changeSkinToStickBoss() {
        this.changeSkin(this.stickSkin);
        this.playAnimation(this.idleStickAnim, true);
        this.attackCollider.node.getComponent(cc.BoxCollider).size.width += 40;
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.boss_take_stick);

        let tagObj = this.groundCollider.node.getComponent(TagObject);
        if (tagObj) {
            tagObj.setTag(TagConfig.BOSS_STICK);
            cc.log("changeSkinToStickBoss");
        }

        this.scheduleOnce(() => {
            this.searchCollider.refreshPingToTarget();
        }, 0.1);
    }

    changeSkinToSuperman() {
        this.changeSkin(this.superSkin);
        this.playAnimation(this.superAppearAnim).addAnimation(this.superIdleAnim, true);

        let dt = this.skeleton.findAnimation(this.superAppearAnim).duration;
        cc.tween(this.skeleton.node).by(dt, {
            position: new cc.Vec3(0, 20, 0)
        }).start();

        this.attackCollider.node.getComponent(cc.BoxCollider).size.width += 40;
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.boss_take_stick);

        let tagObj = this.groundCollider.node.getComponent(TagObject);
        if (tagObj) {
            tagObj.setTag(TagConfig.BOSS_SUPER);
            cc.log("changeSkinToSuperman");
        }

        // this.scheduleOnce(() => {
        //     this.searchCollider.refreshPingToTarget();
        // }, 0.1);
    }

    rescueTheGirl(target: cc.Node) {
        let girl = target.getParent().getParent().getComponent(Girl);
        if (!girl) {
            cc.error("girl is null");
            return;
        }

        this.stopMove();
        cc.log("Boss: rotateFaceToTarget");
        this.rotateFaceToTarget(target);

        if (this.getCurrentSkin() === this.superSkin) {
            this.playAnimation(this.superOpenLockAnim)
                .addAnimation(this.superWinAnim, true);

        } else {
            this.playAnimation(this.openLockAnim)
                .addAnimation(this.flowerAnim)
                .addAnimation(this.flowerAnim2, true);
        }

        this.scheduleOnce(() => {
            if (MapLevel.instance.isPlaying) {
                GlobalSignals.questPassSignal.dispatch();
            }
        }, 3.0);

        let dt = this.skeleton.findAnimation(this.openLockAnim).duration;
        this.scheduleOnce(() => {
            if (!girl.isAlive) return;
            girl.playOutAnimation(this.node);
        }, dt);
    }

    onDieNormal() {
        this.stopMove();
        this.stun.node.active = true;
        this.playAnimation(this.dieAnim);
        this.isAlive = false;
        GlobalSignals.questFailSignal.dispatch();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.boss_die);
    }

    onDieFire() {
        this.stopMove();
        this.stun.node.active = true;
        this.playAnimation(this.dieFireAnim);
        this.isAlive = false;
        GlobalSignals.questFailSignal.dispatch();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.boss_die_fire);
    }

    onDieIce() {
        this.stopMove();
        this.stun.node.active = true;
        this.playAnimation(this.dieIceAnim);
        this.isAlive = false;
        GlobalSignals.questFailSignal.dispatch();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.boss_die);
    }

    stopMove() {
        super.stopMove();
        this.isAutoMove = false;
    }
}
