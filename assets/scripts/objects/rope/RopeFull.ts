import RopePart from "./RopePart";
import {GroupConfig} from "../../config/GroupConfig";
import {AudioPlayId} from "../../config/AudioPlayId";
import MainScene from "../../MainScene";


const {ccclass, property} = cc._decorator;

@ccclass
export default class RopeFull extends cc.Component {

    protected start(): void {

        this.node.children.forEach((ch) => {
            let ropePart = ch.getComponent(RopePart);
            if (ropePart) {
                ropePart.setCutCallback(this.cutRopeInNode.bind(this));
            }
        });
    }

    cutRopeInNode(part: cc.Node) {
        cc.log("cutRopeInNode");

        part.removeFromParent();
        this.node.children.forEach((ch) => {
            let ropePart = ch.getComponent(RopePart);
            if (ropePart) {
                ropePart.enabled = false;
            }
        });

        MainScene.instance.audioPlayer.playAudio(AudioPlayId.rope_cut);
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }

}
