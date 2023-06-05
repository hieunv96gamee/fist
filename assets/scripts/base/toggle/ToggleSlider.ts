const {ccclass, property} = cc._decorator;

@ccclass
export default class ToggleSlider extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Node)
    dotSlider: cc.Node = null;

    p1: cc.Vec3 = new cc.Vec3();
    p2: cc.Vec3 = new cc.Vec3();
    isOn: boolean = false;

    protected onLoad(): void {
        this.p1.x = -this.dotSlider.position.x;
        this.p1.y = this.dotSlider.position.y;

        this.p2.x = this.dotSlider.position.x;
        this.p2.y = this.dotSlider.position.y;
    }

    toggle(){
        this.setToggleState(!this.isOn);
    }

    setToggleState(isOn: boolean, sliding: boolean = true) {
        this.isOn = isOn;

        if (isOn) {
            this.node.active = true;
            if (!sliding){
                this.dotSlider.position = this.p2;

            }else {
                this.dotSlider.position = this.p1;
                cc.tween(this.dotSlider).to(0.2, {
                    position: this.p2
                }).start();
            }

        }else {
            this.node.active = false;
        }
    }
}
