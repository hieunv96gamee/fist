const {ccclass, property} = cc._decorator;

@ccclass
export default class ScaleRepeatAnim extends cc.Component {
    @property(cc.Boolean)
    public repeatForever: boolean = true;

    @property(cc.Float)
    public duration1: number = 0.2;

    @property(cc.Float)
    public scale1: number = 1.2;

    @property(cc.Float)
    public duration2: number = 0.2;

    @property(cc.Float)
    public scale2: number = 1.0;

    play(target: cc.Node) {
        let action = cc.sequence(
            cc.scaleTo(this.duration1, this.scale1),
            cc.scaleTo(this.duration2, this.scale2)
        );

        if (this.repeatForever) {
            action = action.repeatForever();
        }
        target.stopAllActions();
        if (!target.active) {
            target.active = true;
        }
        target.runAction(action);
    }

    onEnable() {
        this.play(this.node);
    }
}
