import GUIUtil from "./utils/GUIUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PopupDisplay extends cc.Component {

    @property(cc.Node)
    targetAction: cc.Node = null;

    @property(cc.Boolean)
    enabledAnim: boolean = false;

    @property(cc.Float)
    time_show: number = 0.2;

    @property(cc.Float)
    time_hide: number = 0.2;

    @property(cc.Boolean)
    init_fog: boolean = true;

    @property({
        type: cc.Integer,

        visible() {
            return this.init_fog;
        }
    })
    opacity_fog: number = 150;

    @property({
        visible() {
            return this.init_fog;
        }
    })
    touchFogToHide: boolean = false;

    @property(cc.Node)
    btn_close: cc.Node = null;

    exitCallback: Function = null;
    fog: cc.Node = null;

    graphics: cc.Graphics = null;
    fadeInCallback: Function = null;

    onLoad() {
        if (!this.targetAction) {
            this.targetAction = this.node;
        }

        if (this.btn_close !== null) {
            GUIUtil.addClickListener(this.btn_close, this.node, 'PopupDisplay', 'onClickExit');
        }

        if (this.init_fog) {
            this.fog = new cc.Node();
            this.fog.width = cc.visibleRect['width'];
            this.fog.height = cc.visibleRect['height'];
            this.node.addChild(this.fog, -1);
            this.fog.addComponent(cc.BlockInputEvents);

            let graphics = this.fog.addComponent(cc.Graphics);
            graphics.lineWidth = 0;
            graphics.fillColor = new cc.Color(0, 0, 0, this.opacity_fog);
            let width = cc.visibleRect['width'];
            let height = cc.visibleRect['height'];
            graphics.fillRect(-width / 2, -height / 2, width, height);
            this.graphics = graphics;


            if (this.touchFogToHide) {
                let btn = this.fog.addComponent(cc.Button);
                GUIUtil.addClickListener(btn, this.node, 'PopupDisplay', 'onClickExit');
            }
        }

    }

    onClickExit() {
        this.hide();

        if (this.exitCallback) {
            this.exitCallback();
        }
    }

    setExitCallback(cb: Function) {
        this.exitCallback = cb;
    }

    activePopup() {
        this.node.active = true;
    }

    protected onEnable(): void {
        this.show();
    }

    show() {
        if (!this.enabledAnim) {
            return;
        }

        this.targetAction.stopAllActions();
        this.targetAction.opacity = 0;
        this.targetAction.scale = 0.4;
        this.targetAction.runAction(cc.sequence(
            cc.show(),
            cc.spawn(
                cc.fadeIn(this.time_show),
                cc.scaleTo(this.time_show, 1.0).easing(cc.easeBackInOut()),
                cc.sequence(
                    cc.delayTime(this.time_show * 0.75),
                    cc.callFunc(() => {
                        this.fadeInFog();
                    })
                )
            )
        ));
    }

    fadeInFog() {
        if (!this.fog) {
            return;
        }

        this.fog.active = true;
        if (this.fadeInCallback) {
            this.unschedule(this.fadeInCallback);
        }

        let opacity = 0;
        let dt = this.time_show / this.opacity_fog;
        this.fadeInCallback = () => {
            opacity++;
            this.graphics.fillColor = new cc.Color(0, 0, 0, opacity);
            if (opacity === this.opacity_fog) {
                this.unschedule(this.fadeInCallback);
                this.fadeInCallback = null;
            }
        };
        this.schedule(() => {
            if (this.fadeInCallback) {
                this.fadeInCallback();
            }
        }, dt);
    }

    hide() {
        if (!this.enabledAnim) {
            this.node.active = false;
            return;
        }

        if (!this.node.active) {
            return;
        }

        if (this.fog) {
            this.fog.active = false;
        }

        if (this.fadeInCallback) {
            this.unschedule(this.fadeInCallback);
        }

        this.targetAction.stopAllActions();
        this.targetAction.runAction(cc.sequence(
            cc.spawn(
                cc.fadeOut(this.time_hide),
                cc.scaleTo(this.time_hide, 0.4)
            ),
            cc.hide(),
            cc.callFunc(() => {
                this.node.active = false;
            })
        ));
    }

}
