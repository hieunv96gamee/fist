import ColliderCallback from "../../base/ColliderCallback";
import { GroupConfig } from "../../config/GroupConfig";
import ArrayUtil from "../../base/utils/ArrayUtil";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ColliderSearch extends cc.Component {

    @property(ColliderCallback)
    signalCollider: ColliderCallback = null;

    @property([cc.Node])
    listIgnore: cc.Node[] = [];

    @property(cc.Boolean)
    isDebug: boolean = false;

    rootPosition: cc.Vec3 = null;
    searchCallback: Function = null;
    listColliderEnter = [];

    protected onLoad(): void {
        let signal = this.signalCollider.node;
        signal.getComponent(cc.Sprite).enabled = this.isDebug;
        this.rootPosition = signal.position;
        this.signalCollider.setColliderCallback(this.onSignalCollider.bind(this));
        this.listIgnore.push(signal);
    }

    protected onDisable(): void {
        cc.Tween.stopAllByTarget(this.signalCollider.node);
    }

    addToIgnore(tg: cc.Node) {
        if (this.listIgnore.indexOf(tg) === -1) {
            cc.log("addToIgnore: " + tg.name);
            this.listIgnore.push(tg);
        }
    }

    checkSearchTarget(other): boolean {
        if (other.node.group != GroupConfig.CHARACTER) {
            return false;
        }

        if (this.listIgnore.indexOf(other.node) != -1) {
            return false;
        }

        return true;
    }

    setColliderCallback(cb: Function) {
        this.searchCallback = cb;
    }

    onCollisionEnter(other, self) {
        if (!this.checkSearchTarget(other)) {
            return;
        }

        let id = this.listColliderEnter.indexOf(other);
        if (id == -1) this.listColliderEnter.push(other);

        cc.Tween.stopAllByTarget(this.signalCollider.node);
        this.pingToTarget(other);
    }

    onCollisionExit(other, self) {
        if (this.checkSearchTarget(other)) {
            ArrayUtil.removeElement(this.listColliderEnter, other);
        }
        this.refreshPingToTarget();
    }

    pingToTarget(other, loop: boolean = true) {
        let signal = this.signalCollider.node;
        signal.position = this.rootPosition;

        let p = signal.getParent().convertToNodeSpaceAR(
            other.node.getParent().convertToWorldSpaceAR(other.node.position));
        p.y += other.offset.y - other.size.height / 2 + 20;
        p.x += other.offset.x - other.size.width / 2 + 20;

        cc.tween(signal).to(0.1, {
            position: p

        }).delay(0.5).call(() => {
            if (loop) {
                this.pingToTarget(other);
            }
        }).start();
    }

    refreshPingToTarget() {
        // cc.log("refreshPingToTarget ping ping ping...");
        if (this.listColliderEnter.length > 0) {
            this.pingToTarget(this.listColliderEnter[0], false);
        }
    }

    onSignalCollider(other, self) {
        if (this.listIgnore.indexOf(other.node) != -1) {
            return;
        }
        let signal = this.signalCollider.node;
        signal.position = this.rootPosition;
        cc.Tween.stopAllByTarget(signal);
        // signal.active = false;

        // cc.log("searchCallback: " + other.node.name);
        if (this.searchCallback) {
            this.searchCallback(other);
        }
    }
}
