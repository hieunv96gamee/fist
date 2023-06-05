const {ccclass, property} = cc._decorator;

@ccclass
export default class SwitchScreen extends cc.Component {

    @property(cc.Node)
    blackImage: cc.Node = null;

    protected start(): void {
        if (!this.blackImage) {
            this.blackImage = this.node;
        }
    }

    switch(src: cc.Node = null, dst: cc.Node = null, callback: Function = null) {

        this.blackImage.opacity = 0;
        this.blackImage.active = true;

        cc.Tween.stopAllByTarget(this.blackImage);
        cc.tween(this.blackImage).to(0.3, {
            opacity: 255

        }).call(() => {
            if (src) src.active = false;
            if (dst) dst.active = true;
            if (callback) callback();

        }).to(0.3, {
            opacity: 0
        }).call(() => {
            this.blackImage.active = false;
        }).start();
    }


}
