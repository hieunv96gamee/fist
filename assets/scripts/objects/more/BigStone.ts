import {GroupConfig} from "../../config/GroupConfig";
import MainScene from "../../MainScene";
import {AudioPlayId} from "../../config/AudioPlayId";
import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class BigStone extends cc.Component {

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'big_stone');
    }

    onCollisionEnter(other, self) {
        if (other.node.group === GroupConfig.BERRIE || other.node.group === GroupConfig.ROCK) {
            MainScene.instance.audioPlayer.playAudio(AudioPlayId.effect_rock1);
        }
    }
}
