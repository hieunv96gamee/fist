import ParticleSystem = cc.ParticleSystem;

const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleLoop extends cc.Component {

    @property(cc.Boolean)
    loop: boolean = true;

    particleSystem: ParticleSystem = null;

    protected onLoad() {
        this.particleSystem = this.getComponent(cc.ParticleSystem);
    }

    protected update(dt: number) {
        if (this.particleSystem.particleCount == 0) {
            if (this.loop) {
                cc.log("particleCount = " + this.particleSystem.particleCount);
                this.particleSystem.resetSystem();
            }
            else {
                this.particleSystem.stopSystem();
            }
        }
    }
}
