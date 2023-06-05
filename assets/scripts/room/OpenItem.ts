import {ItemConfig} from "../objects/more/ItemLoot";
import MainScene from "../MainScene";
import {AudioPlayId} from "../config/AudioPlayId";


const {ccclass, property} = cc._decorator;

@ccclass
export default class OpenItem extends cc.Component {

    @property(sp.Skeleton)
    itemSkeleton: sp.Skeleton = null;

    @property(cc.Prefab)
    effectAppear: cc.Prefab = null;

    callback: Function = null;
    itemConfig: ItemConfig = null;

    onOpenClick() {
        this.itemSkeleton.node.removeFromParent();
        this.node.getParent().addChild(this.itemSkeleton.node);
        if (this.callback) {
            this.callback(this.itemSkeleton.node, this.effectAppear);
        }
        this.node.removeFromParent();
    }

    setOpenCallback(cb: (itemSkeleton: cc.Node, effectPrefab: cc.Prefab) => void) {
        this.callback = cb;
    }

    show(itemConfig: ItemConfig) {
        cc.log("OpenItem show " + itemConfig.skin);
        this.itemConfig = itemConfig;
        this.itemSkeleton.setSkin(itemConfig.skin);
        this.itemSkeleton.setSlotsToSetupPose();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.button_open);
    }
}
