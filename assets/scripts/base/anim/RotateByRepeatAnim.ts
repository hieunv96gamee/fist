import menu = cc._decorator.menu;


const { ccclass, property } = cc._decorator;

@ccclass
@menu('Add Anim/RotateByRepeatAnim')
export default class RotateByRepeatAnim extends cc.Component {

    @property(cc.Boolean)
    public repeatForever: boolean = true;

    @property(cc.Float)
    public duration1: number = 1;

    @property(cc.Float)
    public rotate1: number = 360;

    @property(cc.Boolean)
    public autoPlay: boolean = true;

    play(target: cc.Node) {
        let action = cc.rotateBy(this.duration1, this.rotate1);

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
        if (this.autoPlay) {
            this.play(this.node);
        }
    }
    onDisable() {
        this.node.stopAllActions();
    }
}
