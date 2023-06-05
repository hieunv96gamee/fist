import ColliderCallback from "../../base/ColliderCallback";
import {ICharacterCollider} from "./ICharacterCollider";
import MoveCtrl from "./MoveCtrl";
import ColliderSearch from "./ColliderSearch";
import ColliderGround from "./ColliderGround";
import TagObject, {TagConfig} from "../../config/TagObject";
import {GroupConfig} from "../../config/GroupConfig";
import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Character extends cc.Component implements ICharacterCollider {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(sp.Skeleton)
    stun: sp.Skeleton = null;

    @property(cc.Node)
    hit: cc.Node = null;

    @property(cc.String)
    idleAnim: string = "Idle";

    @property(cc.String)
    runAnim: string = "Run";

    @property(cc.String)
    walkAnim: string = "Walk";

    @property(cc.String)
    attackAnim: string = "Attack";

    @property(cc.String)
    dieAnim: string = "Die";

    @property(cc.String)
    dieFireAnim: string = "DieFire";

    @property(cc.String)
    dieIceAnim: string = "Ice";

    @property(cc.Node)
    rootCollider: cc.Node = null;

    @property(ColliderGround)
    groundCollider: ColliderGround = null;

    @property(ColliderCallback)
    headCollider: ColliderCallback = null;

    @property(ColliderCallback)
    bodyCollider: ColliderCallback = null;

    @property(ColliderCallback)
    attackCollider: ColliderCallback = null;

    @property(ColliderSearch)
    searchCollider: ColliderSearch = null;

    @property([cc.String])
    ignoreFluids: string[] = [];

    static SCALE_RIGHT = 1;
    static SCALE_LEFT = -1;

    protected attackDistance: number = 0;
    private currentSkin: string = "";
    protected tagHit: TagConfig;
    private deadCallback: Function = null;
    public isGround: boolean = true;

    private _isAlive: boolean = true;
    public get isAlive() {
        return this._isAlive;
    }

    public set isAlive(value) {
        this._isAlive = value;

        if (!this._isAlive) {
            cc.log(this.node.name + " isAlive = false");
            if (this.deadCallback) {
                this.deadCallback(this.node);
            }

            if (this.moveCtrl) {
                this.moveCtrl.stopMove();
                this.moveCtrl.enabled = false;
            }

            this.scheduleOnce(() => {
                try {
                    this.rootCollider.active = false;

                } catch (e) {
                    cc.warn(e);
                }
            }, 0.2);

        }
    }

    isRunning: boolean = false;
    moveCtrl: MoveCtrl = null;

    protected onLoad(): void {
        if (this.searchCollider) {
            this.searchCollider.node.active = true;
            this.searchCollider.setColliderCallback(this.onSearchCollider.bind(this));
        }

        if (this.hit) {
            let tagObj = this.hit.getComponent(TagObject);
            if (tagObj) this.tagHit = tagObj.tag2;
        }

        this.groundCollider.setGroundColliderCallback(this.onGroundCollisionEnter.bind(this));
        this.headCollider.setColliderCallback(this.onHeadCollider.bind(this));
        this.bodyCollider.setColliderCallback(this.onBodyCollider.bind(this));
        this.attackCollider.setColliderCallback(this.onAttackCollider.bind(this));
        this.moveCtrl = this.getComponent(MoveCtrl);

        this.attackDistance = this.attackCollider.getComponent(cc.BoxCollider).size.width / 2;
        this.currentSkin = this.skeleton.defaultSkin;
        this.playAnimation(this.idleAnim, true);
        this.stun.node.active = false;

        PhysicsConfig.initPhysicConfig(this.node, 'character');
    }

    setDeadCallback(callback: Function) {
        this.deadCallback = callback;
    }

    checkIgnoreFluid(group: string) {
        return this.ignoreFluids.indexOf(group) != -1;
    }

    addToIgnoreSearchCollier(tg: cc.Node) {
        if (this.searchCollider) {
            this.searchCollider.addToIgnore(tg);
        }
    }

    playAnimation(name: string, loop: boolean = false): Character {
        this.skeleton.setAnimation(0, name, loop);
        return this;
    }

    addAnimation(name: string, loop: boolean = false, delay: number = 0): Character {
        this.skeleton.addAnimation(0, name, loop, delay);
        return this;
    }

    changeSkin(nameSkin: string) {
        this.currentSkin = nameSkin;
        this.skeleton.setSkin(nameSkin);
        this.skeleton.setSlotsToSetupPose();
    }

    getCurrentSkin() {
        return this.currentSkin;
    }

    runToTarget(tg: cc.Node) {
        this.moveToTarget(tg, this.runAnim);
    }

    walkToTarget(tg: cc.Node) {
        this.moveToTarget(tg, this.walkAnim);
    }

    moveToTarget(tg: cc.Node, anim: string) {
        let isRight = true;
        if (tg) {
            let p = this.node.getParent().convertToNodeSpaceAR(
                tg.getParent().convertToWorldSpaceAR(tg.position));

            let box = tg.getComponent(cc.BoxCollider);
            let dX = !box ? 0 : box.offset.x + box.size.width / 2;
            if (Math.abs(this.node.position.x - p.x) < this.attackDistance + dX) {
                return;
            }
            isRight = this.node.position.x < p.x;

        } else {
            isRight = this.node.scaleX === Character.SCALE_RIGHT;
        }

        if (isRight) {
            this.moveRight(anim);

        } else {
            this.moveLeft(anim);
        }
    }

    rotateFaceToTarget(tg: cc.Node) {
        let p = this.node.getParent().convertToNodeSpaceAR(
            tg.getParent().convertToWorldSpaceAR(tg.position));

        if (this.node.position.x < p.x) {
            this.node.scaleX = Character.SCALE_RIGHT;

        } else {
            this.node.scaleX = Character.SCALE_LEFT;
        }
    }

    moveLeft(anim: string) {
        if (!this.moveCtrl) {
            return;
        }
        this.isRunning = true;
        this.node.scaleX = Character.SCALE_LEFT;
        this.moveCtrl.moveLeft();

        if (anim != "") {
            this.playAnimation(anim, true);
        }
    }

    moveRight(anim) {
        if (!this.moveCtrl) {
            return;
        }
        this.isRunning = true;
        this.node.scaleX = Character.SCALE_RIGHT;
        this.moveCtrl.moveRight();

        if (anim != "") {
            this.playAnimation(anim, true);
        }
    }

    moveJump() {
        if (this.moveCtrl) {
            this.moveCtrl.moveJump();
        }
    }

    stopMove() {
        if (this.moveCtrl) {
            this.isRunning = false;
            this.moveCtrl.stopMove();
        }
    }

    onAttackCollider(other, self): void {
    }

    onBodyCollider(other, self): void {
    }

    onHeadCollider(other, self): void {
    }

    onSearchCollider(other): void {
    }

    onGroundCollisionEnter(isGround) {
        cc.log("onGroundCollisionEnter: " + isGround);
        this.isGround = isGround;
        this.attackCollider.node.active = isGround;

        if (this.searchCollider) {
            this.searchCollider.node.active = isGround;
        }
    }

    disablePhysicsBody() {
        let physics = this.node.getComponent(cc.PhysicsCollider);
        if (physics) {
            physics.enabled = false;
            physics.node.group = GroupConfig.DEAD;
            physics.enabled = true;

        }
    }
}
