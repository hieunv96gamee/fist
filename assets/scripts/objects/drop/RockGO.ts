import {PhysicsConfig} from "../../config/PhysicsConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class RockGO extends cc.Component {

    protected onLoad(): void {
        PhysicsConfig.initPhysicConfig(this.node, 'rock');
    }


}
