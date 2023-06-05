const {ccclass, property} = cc._decorator;

@ccclass
export default class GasGO extends cc.Component {


    @property(cc.RigidBody)
    body: cc.RigidBody = null;

    force: number = 6000;
    timeFly: number = 0;

    protected start(): void {
        this.timeFly = Math.random() * 2;
    }

    protected update(dt: number): void {

        this.timeFly -= dt;
        if (this.timeFly <= 0) {
            let vX = this.force * (Math.random() * 2 - 1);
            let vY = this.force * (Math.random() * 2 - 1);
            this.body.applyForceToCenter(cc.v2(vX, vY), true);
            this.timeFly = 1;
        }

    }

}
