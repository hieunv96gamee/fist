import Enemies from "./Enemies";
import {GroupConfig} from "../../../config/GroupConfig";
import {TagConfig} from "../../../config/TagObject";
import {AudioPlayId} from "../../../config/AudioPlayId";
import MainScene from "../../../MainScene";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Dog extends Enemies {

    @property(cc.String)
    eatAnim: string = "Eat";

    isEating: boolean = false;

    onAttackCollider(other, self): void {
        if (this.isEating) return;
        super.onAttackCollider(other, self);

        if (other.node.group === GroupConfig.ITEM && other.node.name == TagConfig.MEAT) {
            this.isEating = true;
            this.stopMove();
            this.rotateFaceToTarget(other.node);
            this.skeleton.setCompleteListener(null);
            this.playAnimation(this.eatAnim, true);
            other.node.removeFromParent();
        }
    }

    onSearchCollider(other): void {
        if (this.isEating) return;
        super.onSearchCollider(other);
    }

    playAttack(target: cc.Node) {
        super.playAttack(target);
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dog_bite);
    }

    onDieIce() {
        super.onDieIce();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dog_die);
    }

    onDieNormal() {
        super.onDieNormal();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dog_die);
    }

    onDieFire() {
        super.onDieFire();
        MainScene.instance.audioPlayer.playAudio(AudioPlayId.dog_die);
    }
}
