import SkinItem from "./SkinItem";
import {SkinConfig} from "../config/SkinConfig";
import {GlobalSignals} from "../config/GlobalSignals";
import {GameData} from "../GameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SkinPopup extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Prefab)
    rowPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    skinPrefab: cc.Prefab = null;

    arraySkin: SkinItem[] = [];

    protected onLoad(): void {
        this.initData();
    }

    selectSkinBossByCfg(cfg) {
        let skinName = cfg.skins[cfg.skins.length - 1];
        this.skeleton.setSkin(skinName);
        this.skeleton.setSlotsToSetupPose();
        this.skeleton.setAnimation(0, 'Idle', true);

        if (cfg.type === SkinConfig.get_type.free
            || GameData.myBossSkins.indexOf(cfg.skinId) != -1) {

            GameData.setSkinBoss(cfg.skinId, (err) => {
                if (err) return;

                GlobalSignals.changeSkinBossSignal.dispatch();
                this.arraySkin.forEach((skin) => {
                    if (skin.skinConfig.skinId === cfg.skinId) {
                        skin.light.active = true;

                    } else {
                        if (skin.light.active) {
                            skin.light.active = false;
                        }
                    }
                });

            });
        }

    }

    initData() {
        //todo hide skin giftcode + dailyReward
        let arraySkin = [];
        SkinConfig.arraySkinBoss.forEach((skin) => {
            if (skin.type != SkinConfig.get_type.daily_reward
                && skin.type != SkinConfig.get_type.gift_code) {
                arraySkin.push(skin);
            }
        });

        // let arraySkin = SkinConfig.arraySkinBoss;
        let numSkins = arraySkin.length;
        let numRows = Math.ceil(numSkins / 3);

        let count = 0;
        for (let i = 0; i < numRows; i++) {
            let row = cc.instantiate(this.rowPrefab);
            this.container.addChild(row);

            for (let j = 0; j < 3; j++) {
                if (count >= numSkins) {
                    break;
                }
                let skinCfg = arraySkin[count];
                let skin = cc.instantiate(this.skinPrefab);
                skin.position = row.children[j].position;
                row.addChild(skin);

                let skinItem = skin.getComponent(SkinItem);
                skinItem.initSkinItem(skinCfg, (cfg) => {
                    this.selectSkinBossByCfg(cfg);
                });

                this.arraySkin.push(skinItem);
                count++;
            }
        }
    }

    onClickBack() {
        this.node.active = false;
    }
}
