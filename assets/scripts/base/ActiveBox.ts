import requireComponent = cc._decorator.requireComponent;
import {GroupConfig} from "../config/GroupConfig";


const {ccclass, property} = cc._decorator;

@ccclass
@requireComponent(cc.BoxCollider)
export default class ActiveBox extends cc.Component {

    @property(cc.Node)
    targetNode: cc.Node = null;

    @property(cc.Boolean)
    once: boolean = true;

    @property([cc.Component.EventHandler])
    listEvents: cc.Component.EventHandler[] = [];

    protected start(): void {
        this.node.opacity = 0;
    }

    onCollisionEnter(other, self){
        cc.log("ActiveBox " + other.node.name);
        if (other.node === this.targetNode){
            cc.Component.EventHandler.emitEvents(this.listEvents);

            if (this.once){
                this.node.active = false;
            }
        }
    }

}
