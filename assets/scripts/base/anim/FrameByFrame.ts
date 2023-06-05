const {ccclass, property} = cc._decorator;

@ccclass
export default class FrameByFrame extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    arrayFrames: cc.SpriteFrame[] = [];

    @property(cc.Float)
    dt: number = 0.12;

    @property(cc.Boolean)
    reverse: boolean = false;

    @property(cc.Boolean)
    autoPlay: boolean = true;

    @property(cc.Boolean)
    loop: boolean = false;

    public time: number = 0;
    private anim: cc.Animation = null;
    private repeatCb: Function = null;
    private animDefault = 'default';

    protected onLoad(): void {
        if (!this.sprite) {
            this.sprite = this.node.getComponent(cc.Sprite);

            if (!this.sprite) {
                cc.error('SpriteFrameBF: Please add Sprite Component');
                return;
            }
        }

        let len = this.arrayFrames.length;
        let sample = Math.round(1 / this.dt);
        this.time = len / sample;

        if (this.reverse){
            this.arrayFrames.reverse();
        }

        let clip = cc.AnimationClip.createWithSpriteFrames(this.arrayFrames, sample);
        this.anim = this.sprite.node.addComponent(cc.Animation);
        this.anim.addClip(clip, this.animDefault);
    }

    protected onEnable(): void {
        if (this.autoPlay) {
            this.play();
        }
    }

    protected onDisable(): void {
        this.stop();
    }

    play(loop: boolean = this.loop, count: number = 1) {
        if (!this.anim) {
            return;
        }

        this.anim.stop();
        this.anim.play(this.animDefault, 0);
        count--;

        if (loop || count > 0) {
            this.repeatCb = () => {
                this.play(loop, count);
            };
            this.scheduleOnce(this.repeatCb, this.time);
        }
    }

    stop() {
        if (this.anim) {
            this.anim.stop();
            this.unschedule(this.repeatCb);
        }
    }


}
