import TagObject from "../config/TagObject";
import requireComponent = cc._decorator.requireComponent;


const {ccclass, property} = cc._decorator;

@ccclass
@requireComponent(cc.BoxCollider)
export default class RedirectBox extends TagObject {

    protected start(): void {
        let sprite = this.getComponent(cc.Sprite);
        if (sprite){
            sprite.enabled = false;
        }
    }

}
