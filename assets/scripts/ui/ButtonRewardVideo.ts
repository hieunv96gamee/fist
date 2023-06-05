
import { FBInstantAds } from "../plugins/fb/FBInstantAds";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonRewardVideo extends cc.Component {

    @property(cc.Node)
    loading: cc.Node = null;

    btn: cc.Button = null;

    protected onLoad(): void {
        this.btn = this.getComponent(cc.Button);
        this.loading.active = false; //todo
    }

    // protected onEnable(): void {
    //     this.onLoadingRewardVideo(!FBInstantAds.isRewardedVideoReady);
    //     this._onLoadingRewardVideo = this.onLoadingRewardVideo.bind(this);
    //     FBInstantAds.LoadingRewardedVideoSignal.add(this._onLoadingRewardVideo);
    // }

    // protected onDisable(): void {
    //     if (this._onLoadingRewardVideo){
    //         FBInstantAds.LoadingRewardedVideoSignal.remove(this._onLoadingRewardVideo);
    //     }
    // }

    // _onLoadingRewardVideo;
    // onLoadingRewardVideo(isLoading) {
    //     // this.loading.active = isLoading;
    //     this.btn.interactable = !isLoading;
    //     this.btn.node.opacity = isLoading ? 0 : 255;
    // }
}
