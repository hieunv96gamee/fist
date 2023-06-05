const {ccclass, property} = cc._decorator;


export enum ScreenId {
    NONE = 0,
    HOME_SCREEN = 1,
    PLAY_SCREEN = 2,
    CASTLE_SCREEN = 3
}

@ccclass('ScreenConfig')
export class ScreenConfig {

    @property({
        type: cc.Enum(ScreenId)
    })
    screenId: ScreenId = ScreenId.HOME_SCREEN;

    @property(cc.Node)
    screen: cc.Node = null;
}

@ccclass
export default class ScreenManager extends cc.Component {

    @property(cc.Node)
    flash: cc.Node = null;

    @property([ScreenConfig])
    arrayConfig: ScreenConfig[] = [];

    showScreenById(id: ScreenId, callback: (screen: cc.Node) => void, immediately: boolean = false) {
        cc.log("showScreenById: " + id);

        if (immediately) {
            let screen = this.activeScreenById(id);
            if (callback) callback(screen);

        } else {
            this.showFlash(1, () => {
                let screen = this.activeScreenById(id);
                if (callback) callback(screen);
            });
        }
    }

    activeScreenById(id: ScreenId) {
        let screen = null;
        for (let i = 0; i < this.arrayConfig.length; i++) {
            if (this.arrayConfig[i].screenId === id) {
                this.arrayConfig[i].screen.active = true;
                screen = this.arrayConfig[i].screen;

            } else {
                this.arrayConfig[i].screen.active = false;
            }
        }
        return screen;
    }

    getScreenById(id: ScreenId) {
        for (let i = 0; i < this.arrayConfig.length; i++) {
            if (this.arrayConfig[i].screenId === id) {
                return this.arrayConfig[i].screen;
            }
        }
        return null;
    }

    showFlash(dt: number, callback: Function = null) {
        this.flash.opacity = 0;
        this.flash.active = true;

        cc.Tween.stopAllByTarget(this.flash);
        cc.tween(this.flash).to(dt / 2, {
            opacity: 255

        }).call(() => {
            if (callback) callback();

        }).to(dt / 2, {
            opacity: 0
        }).call(() => {
            this.flash.active = false;
        }).start();
    }

}
