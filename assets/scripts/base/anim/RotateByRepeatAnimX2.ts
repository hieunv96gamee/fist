import menu = cc._decorator.menu;


const {ccclass, property} = cc._decorator;

@ccclass
@menu('Add Anim/RotateByRepeatAnimX2')
export default class RotateByRepeatAnimX2 extends cc.Component {

    @property(cc.Boolean)
    public repeatForever: boolean = true;

    @property(cc.Float)
    public duration1: number = 0.2;

    @property(cc.Float)
    public rotate1: number = 20;

    @property(cc.Float)
    public duration2: number = 0.2;

    @property(cc.Float)
    public rotate2: number = -20;

    @property(cc.Boolean)
    public autoPlay: boolean = true;

    rotateStart: number = 0;

    protected onLoad(): void {
        this.rotateStart = this.node.angle;
    }

    play(target: cc.Node) {
        let action = cc.sequence(
            cc.rotateTo(this.duration1, this.rotateStart + this.rotate1),
            cc.rotateTo(this.duration2, this.rotateStart + this.rotate2)
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

    onEnable(){
        if (this.autoPlay){
            this.play(this.node);
        }
    }
}
