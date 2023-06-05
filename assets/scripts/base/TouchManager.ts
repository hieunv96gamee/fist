import MapLevel from "../level/MapLevel";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchManager extends cc.Component {

    @property(cc.Node)
    touchCollision: cc.Node = null;

    moving: boolean = false;

    private static _instance: TouchManager = null;
    public static get instance() {
        return TouchManager._instance;
    }

    protected onLoad() {
        TouchManager._instance = this;
    }

    protected onDestroy(): void {
        TouchManager._instance = null;
    }

    protected onEnable() {
        cc.log("init TouchManager");
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseDown.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMouseUp.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseUp.bind(this));
    }

    protected onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onMouseDown.bind(this));
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove.bind(this));
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onMouseUp.bind(this));
        this.node.off(cc.Node.EventType.TOUCH_END, this.onMouseUp.bind(this));
    }

    onMouseDown(event) {
        if (!MapLevel.instance || !MapLevel.instance.isPlaying) {
            this.reset();
            return;
        }

        this.moving = true;
        this.touchCollision.active = true;
        this.touchCollision.position = this.node.convertToNodeSpaceAR(event.getLocation());
    }

    onMouseMove(event) {
        if (this.moving) {
            this.touchCollision.position = this.node.convertToNodeSpaceAR(event.getLocation());
        }
    }

    onMouseUp(event) {
        this.reset();
    }

    reset() {
        this.moving = false;
        this.touchCollision.active = false;
    }

}
