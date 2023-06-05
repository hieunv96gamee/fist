import ToggleSliderGroup from "../base/toggle/ToggleSliderGroup";
import AudioManager from "../base/audio/AudioManager";
import { GameData } from "../GameData";
import { LocalStorageManager } from "../base/LocalStorageManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingsPopup extends cc.Component {

    @property(ToggleSliderGroup)
    btn_sound_effect: ToggleSliderGroup = null;

    @property(ToggleSliderGroup)
    btn_sound_music: ToggleSliderGroup = null;

    @property(cc.Button)
    btn_reset_data: cc.Button = null;
    private static _instance: SettingsPopup = null;
    public static get instance() {
        return SettingsPopup._instance;
    }
    protected onLoad(): void {
        let sound_effect = JSON.parse(LocalStorageManager.getItem("sound_effect"));
        let sound_music = JSON.parse(LocalStorageManager.getItem("sound_music"));

        if (sound_effect == null) {
            this.btn_sound_effect.isOn = sound_effect;
            LocalStorageManager.setItem("sound_effect", JSON.stringify(true));
        } else {
            this.btn_sound_effect.isOn = sound_effect;
            AudioManager.EffectEnable = sound_effect;
        }

        if (sound_music == null) {
            this.btn_sound_music.isOn = sound_music;
            LocalStorageManager.setItem("sound_music", JSON.stringify(true));
        } else {
            this.btn_sound_music.isOn = sound_music;
            AudioManager.MusicEnable = sound_music;
        }

        this.btn_sound_effect.setOnClickCallback((isOn) => {
            AudioManager.EffectEnable = isOn;
            LocalStorageManager.setItem("sound_effect", JSON.stringify(isOn));
        });

        this.btn_sound_music.setOnClickCallback((isOn) => {
            AudioManager.MusicEnable = isOn;
            LocalStorageManager.setItem("sound_music", JSON.stringify(isOn));
        });

        if (this.btn_reset_data) {
            this.btn_reset_data.node.active = false;
        }
    }

    protected start(): void {
        this.btn_sound_effect.setToggleState(AudioManager.EffectEnable, false);
        this.btn_sound_music.setToggleState(AudioManager.MusicEnable, false);
    }
    onClearData() {
        cc.warn("onClearData");
        GameData.clearData();
    }
}
