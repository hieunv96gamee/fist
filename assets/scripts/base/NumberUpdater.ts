const {ccclass, property} = cc._decorator;

@ccclass
export default class NumberUpdater extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Integer)
    public step = 0.01;

    private _formatFunc: Function = null;
    private _currentNumber: number = 0;
    private _dstNumber: number = 0;

    public get currentNumber() {
        return this._currentNumber;
    }

    public set currentNumber(value: number) {
        this._currentNumber = value;
        this.updateLabel();
    }

    protected start(): void {
        if (!this.label) {
            this.label = this.getComponent(cc.Label);
        }
    }

    public setFormatFunc(fun: (number) => string) {
        this._formatFunc = fun;
    }

    public updateNumber(number: number, time: number, stepTime?: number) {
        this.currentNumber = this._dstNumber;
        this.setNumber(number, time, stepTime);
    }

    public setNumber(number: number, time: number, stepTime?: number) {
        this._dstNumber = number;
        if (time) {
            this.unscheduleAllCallbacks();
            if (this.currentNumber === number) {
                return;
            }
            if (stepTime) {
                this.step = stepTime;
            }
            let interval = this.step;
            let repeat = Math.floor(time / this.step);
            if (this.currentNumber > number) {
                this.currentNumber = 0;
            }
            let distNumber = Math.ceil((number - this.currentNumber) / repeat);
            if (distNumber <= 0) {
                distNumber = 1;
            }
            this.schedule(() => {
                this.currentNumber += distNumber;
                if (this.currentNumber > number) {
                    this.currentNumber = number;
                    this.unscheduleAllCallbacks();
                }
            }, interval, repeat, 0);

        } else {
            this.currentNumber = number;
        }
    }

    updateLabel() {
        if (cc.isValid(this.label)) {
            if (this._formatFunc) {
                this.label.string = '' + this._formatFunc(this.currentNumber);
            } else {
                this.label.string = '' + this.currentNumber;
            }
        } else {
            cc.warn('this.label is not valid or null or undefined');
        }
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }
}
