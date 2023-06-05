import { SkinConfig } from "../config/SkinConfig";
import { GameData } from "../GameData";
import GUIUtil from "../base/utils/GUIUtil";
import { FBInstantAds } from "../plugins/fb/FBInstantAds";
import { FBInstantGames } from "../plugins/fb/FBInstantGames";
import { GameTracking } from "../plugins/tracking/GameTracking";
import MainScene from "../MainScene";
import AudioManager from "../base/audio/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SkinItem extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.Button)
    btn_claim: cc.Button = null;

    @property(cc.Button)
    btn_share: cc.Button = null;

    @property(cc.Button)
    btn_giftcode: cc.Button = null;

    @property(cc.Button)
    btn_daily_reward: cc.Button = null;

    @property(cc.Button)
    btn_buy: cc.Button = null;

    @property(cc.Label)
    label_price: cc.Label = null;

    @property(cc.Node)
    light: cc.Node = null;

    skinConfig: { skinId: string, skins: string[], type: string, value: number } = null;
    btn_click: cc.Button = null;
    skinClickCallback: (cfg) => void = null;

    protected onLoad(): void {
        this.btn_click = this.node.getComponent(cc.Button);
        if (!this.btn_click) {
            this.btn_click = this.node.addComponent(cc.Button);
        }

        GUIUtil.addClickListener(this.btn_click, this.node, 'SkinItem', 'onClickBoss');
        GUIUtil.addClickListener(this.btn_buy, this.node, 'SkinItem', 'onClickBuy');
        GUIUtil.addClickListener(this.btn_share, this.node, 'SkinItem', 'onClickShareFb');
        GUIUtil.addClickListener(this.btn_claim, this.node, 'SkinItem', 'onClickClaim');
        GUIUtil.addClickListener(this.btn_giftcode, this.node, 'SkinItem', 'onClickGiftCode');
        GUIUtil.addClickListener(this.btn_daily_reward, this.node, 'SkinItem', 'onClickDailyReward');
    }

    onClickBoss() {
        if (this.skinClickCallback) {
            this.skinClickCallback(this.skinConfig);
        }
    }

    onClickBuy() {
        if (this.skinConfig.value < GameData.playerCoin) {
            GameData.addSkinBoss(this.skinConfig.skinId, (err) => {
                if (!err) {
                    GameData.addCoin(-this.skinConfig.value);
                    this.updateUI();
                }
            });
        }
    }

    onClickShareFb() {
        FBInstantGames.onShareGame(() => {
            GameTracking.logEventShareGame(GameData.currentLevelId);
            GameData.addSkinBoss(this.skinConfig.skinId, (err) => {
                if (!err) {
                    this.updateUI();
                }
            });
        });
    }

    onClickClaim() {
        // FBInstantAds.showRewardedVideoAd((err) => {
        //     if (!err) {
        //         GameData.addSkinBoss(this.skinConfig.skinId, (err) => {
        //             if (!err) {
        //                 this.updateUI();
        //             }
        //         });
        //     }
        // });
        MainScene.instance.rewardType = "claim";
        AudioManager.EffectEnable = false;
        AudioManager.MusicEnable = false;
        window.watchSkin = function () {
            GameData.addSkinBoss(this.skinConfig.skinId, (err) => {
                if (!err) {
                    this.updateUI();
                }
            });
        }.bind(this);
        rewardEvent();
    }

    onClickGiftCode() {
        //todo show popup gift code
    }

    onClickDailyReward() {
        //todo show popup daily reward
    }

    initSkinItem(cfg: { skinId: string, skins: string[], type: string, value: number }, clickCb: (cfg) => void) {
        this.skinConfig = cfg;
        this.skinClickCallback = clickCb;

        if (cfg.skinId === GameData.currentSkinBoss) {
            this.light.active = true;
        }

        if (cfg.skins.length === 1) {
            this.skeleton.setSkin(cfg.skins[0]);

        } else {
            this.skeleton.setSkin(cfg.skins[cfg.skins.length - 1]);
        }
        this.skeleton.setSlotsToSetupPose();
        this.updateUI();
    }

    updateUI() {
        console.log("SkinItem updateUI");
        let cfg = this.skinConfig;
        if (cfg.type === SkinConfig.get_type.free
            || GameData.myBossSkins.indexOf(cfg.skinId) != -1) {
            this.btn_buy.node.active = false;
            this.btn_daily_reward.node.active = false;
            this.btn_claim.node.active = false;
            this.btn_giftcode.node.active = false;
            this.btn_share.node.active = false;
            return;
        }

        switch (cfg.type) {
            case SkinConfig.get_type.buy:
                this.btn_buy.node.active = true;
                this.label_price.string = cfg.value + "";
                this.btn_buy.interactable = GameData.playerCoin >= cfg.value;
                break;
            case SkinConfig.get_type.daily_reward:
                this.btn_daily_reward.node.active = true;
                break;
            case SkinConfig.get_type.claim_ad:
                this.btn_claim.node.active = true;
                break;
            case SkinConfig.get_type.gift_code:
                this.btn_giftcode.node.active = true;
                break;
            case SkinConfig.get_type.share_fb:
                this.btn_share.node.active = true;
                break;
        }
    }


}
