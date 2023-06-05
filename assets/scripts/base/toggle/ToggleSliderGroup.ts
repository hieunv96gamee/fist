import ToggleSlider from "./ToggleSlider";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ToggleSliderGroup extends cc.Component {

    @property(ToggleSlider)
    toggleOn: ToggleSlider = null;

    @property(ToggleSlider)
    toggleOff: ToggleSlider = null;

    isOn: boolean = true;
    onClickCallback: Function = null;

    toggle(){
        this.setToggleState(!this.isOn);
    }

    setToggleState(isOn: boolean, sliding: boolean = true) {
        this.isOn = isOn;
        this.toggleOn.setToggleState(isOn, sliding);
        this.toggleOff.setToggleState(!isOn, sliding);

        if (this.onClickCallback) {
            this.onClickCallback(isOn);
        }
    }

    setOnClickCallback(cb: Function) {
        this.onClickCallback = cb;
    }
}
