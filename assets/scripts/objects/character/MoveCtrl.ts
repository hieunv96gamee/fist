import Vec2 = cc.Vec2;
import PhysicalEnable from "../../base/PhysicalEnable";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoveCtrl extends cc.Component {

    @property(cc.Float)
    Velocity_X: number = 120;

    @property(cc.Float)
    Jump: number = 25;

    @property(cc.Boolean)
    enableOverTerrain: boolean = true;

    Rigid_Body: cc.RigidBody = null;
    Walk_Force: number;
    Jump_Force: number;
    Direction = 0;

    protected onLoad(): void {
        this.Rigid_Body = this.node.getComponent(cc.RigidBody);
    }

    protected start(): void {
        this.Walk_Force = this.Rigid_Body.getMass() * 1000;
        this.Jump_Force = this.Rigid_Body.getMass() * 1000 * this.Jump;
    }

    moveLeft() {
        this.Direction = -1;
    }

    moveRight() {
        this.Direction = 1;
    }

    moveJump() {
        this.Rigid_Body.applyForceToCenter(cc.v2(0, this.Jump_Force), true);
    }

    stopMove() {
        this.Direction = 0;
        this.Rigid_Body.linearVelocity = Vec2.ZERO;
    }

    update(dt) {
        if ((this.Direction > 0 && this.Rigid_Body.linearVelocity.x < this.Velocity_X)
            || (this.Direction < 0 && this.Rigid_Body.linearVelocity.x > -this.Velocity_X)) {
            this.Rigid_Body.applyForceToCenter(cc.v2(this.Direction * this.Walk_Force * PhysicalEnable.REAL_GRAVITY_SCALE, 0), true);
        }

        if (!this.enableOverTerrain) {
            return;
        }
        if ((this.Direction > 0 && this.Rigid_Body.linearVelocity.x < 10)
            || (this.Direction < 0 && this.Rigid_Body.linearVelocity.x > -10)) {
            // cc.log("this.Rigid_Body.linearVelocity.y = " + this.Rigid_Body.linearVelocity.y);

            let vec = this.Rigid_Body.linearVelocity.y < 30 ? 5 : -10;
            this.Rigid_Body.applyForceToCenter(cc.v2(0, vec * this.Walk_Force * PhysicalEnable.REAL_GRAVITY_SCALE), true);
        }

    }
}
