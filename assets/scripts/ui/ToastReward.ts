import easeBackOut = cc.easeBackOut;

const {ccclass, property} = cc._decorator;

@ccclass
export default class ToastReward extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    show(value, dt) {
        if (value < 0) {
            cc.warn("Reward = " + value);
            return;
        }
        this.label.string = "+" + value;
        this.node.active = true;
        this.node.opacity = 0;
        this.node.scale = 0.4;
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node).to(0.2, {
            opacity: 255,
            scale: 1.0
        }, easeBackOut()).delay(dt).call(() => {
            this.hide();
        }).start();
    }

    hide() {
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node).to(0.5, {
            opacity: 0
        }).call(() => {
            this.node.active = false;
        }).start();

    }
}
