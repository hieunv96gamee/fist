const {ccclass, property} = cc._decorator;

@ccclass
export default class NodeFixSize extends cc.Component {

    @property(cc.Boolean)
    fixWidth: boolean = false;

    @property(cc.Boolean)
    fixHeight: boolean = false;

    @property(cc.Boolean)
    auto: boolean = false;

    protected onEnable(): void {
        if (!this.fixWidth && !this.fixHeight && !this.auto) {
            return;
        }

        let screen = cc.winSize;

        if (this.auto) {
            let rate = this.node.width / this.node.height;
            if (rate < screen.width / screen.height) {
                this.fixHeight = false;
                this.fixWidth = true;

            } else {
                this.fixHeight = true;
                this.fixWidth = false;
            }
        }

        if (this.fixWidth && this.fixHeight) {
            this.node.width = screen.width;
            this.node.height = screen.height;
            return;
        }

        let scale = this.fixWidth ? screen.width / this.node.width
            : screen.height / this.node.height;
        this.node.width *= scale;
        this.node.height *= scale;
    }
}
