import {GlobalSignals} from "../../config/GlobalSignals";
import Vec3 = cc.Vec3;
import easeBounceIn = cc.easeBounceIn;
import easeQuadraticActionIn = cc.easeQuadraticActionIn;
import GemsGO from "./GemsGO";
import Boss from "../character/Boss/Boss";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GemsPool extends cc.Component {

    _collectByBoss;
    protected onEnable(): void {
        this._collectByBoss = this.collectByBoss.bind(this);
        GlobalSignals.collectGemsSignal.add(this._collectByBoss);
    }

    protected onDisable(): void {
        GlobalSignals.collectGemsSignal.remove(this._collectByBoss);
    }

    collectByBoss() {
        cc.log("collectByBoss");
        let boss = Boss.instance.node;
        this.node.children.forEach((gem, i) => {
            gem.getComponent(GemsGO).moveToTarget(boss, 0.25 + i * 0.02);
        });
    }
}
