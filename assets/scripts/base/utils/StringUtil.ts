export class StringUtil {
    public static ONE_BILLION: number = 1000000000;
    public static ONE_MILLION: number = 1000000;
    public static ONE_THOUSAND: number = 1000;

    public static toKMBString (n) {
        var str = "";
        if (n < 0) {
            str += "-";
            n = -n;
        }
        if (n >= this.ONE_BILLION) {
            str += Math.floor(100 * n / this.ONE_BILLION) / 100 + "B";
        }
        else if (n >= this.ONE_MILLION) {
            str += Math.floor(100 * n / this.ONE_MILLION) / 100 + "M";
        }
        else if (n >= this.ONE_THOUSAND) {
            str += Math.floor(100 * n / this.ONE_THOUSAND) / 100 + "K";
        }
        else {
            str += n;
        }
        return str;
    }

    public static preprocessingMoney (money1:number | string) : string {
        money1 = parseInt(money1 + '');
        let money = Math.abs(money1) + '';
        let string = StringUtil.preprocessingString(money);
        if (money1 < 0) {
            string = "-" + string;
        }
        return string;
    }

    public static preprocessingString (money: string) {
        if (money.length < 4) {
            return money + "";
        }
        let string = "";
        let count = 1;
        for (let i = 0; i < money.length; i++) {
            string = money[money.length - 1 - i] + string;
            if (count % 3 === 0 && count !== money.length) {
                string = "," + string;
            }
            count++;
        }
        return string;
    }

    // preprocessingMoneyFULL: function (money1) {
    //     if (money1 <= 0) {
    //         return this.preprocessingMoney(money1);
    //     }
    //     return "+" + this.preprocessingMoney(money1);
    // },

    public static preprocessingMoneyWithK (money) {
        if (money < 1000){
            return money + '';
        }

        if (money >= 1000000){
            return this.preprocessingMoney(money / 1000) + 'K';
        }
        return money / 1000 + 'K';
    }
    //
    public static toMoneyResultString (n) {
        let str = "";
        if (n > 0) {
            str += "+";
        }
        else if (n < 0) {
            str += "-";
            n = -n;
        }
        if (n >= this.ONE_BILLION) {
            str += Math.floor(100 * n / this.ONE_BILLION) / 100 + "B";
        }
        else if (n >= this.ONE_MILLION) {
            str += Math.floor(100 * n / this.ONE_MILLION) / 100 + "M";
        }
        else if (n >= this.ONE_THOUSAND) {
            str += Math.floor(100 * n / this.ONE_THOUSAND) / 100 + "K";
        }
        else {
            str += n;
        }
        return str;
    }
    public static processTimeNumber(n: number): string {
        let time = (Math.abs(n) + '');
        return time.length <= 1 ? '0' + time : time;
    }
    public static preprocessSignMoney(n: number): string {
        let str: string;
        if (n > 0) {
            str = '+' + this.preprocessingMoney(n );
        }
        else {
            str = this.preprocessingMoney(n);
    // 2019-09-39 08:39:15 -> 2019-09-39
        }
        return str;
    }
    public static getDateOnly(str){
        if(!isNaN(Date.parse(str))){
            return str.split(" ")[0];
        }
        return str;
    }

    public static parseNumberSecondToClock(time: number){
        if (time <= 0){
            return '00:00:00';
        }

        let h = Math.floor(time / 3600);
        time = time % 3600;
        let m = Math.floor(time / 60);
        let s = time % 60;

        let hStr = h < 10 ? '0' + h : '' + h;
        let mStr = m < 10 ? '0' + m : '' + m;
        let sStr = s < 10 ? '0' + s : '' + s;
        return hStr + ':' + mStr + ':' + sStr;
    }
};