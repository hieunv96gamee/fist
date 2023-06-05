import {WordArray} from "./crypto-ts/lib/WordArray";
import {AES, enc} from "./crypto-ts/crypto-ts";


export class LocalStorageManager {

    static KEY_ENCRYPTION_VALUE_ITEM = new WordArray([3721848651, 3247274000, 1120155838, 1670014210], 16);
    static IV_ENCRYPTION_VALUE_ITEM = new WordArray([4236774207, 782364970, 1158515808, 2679783514], 16);
    static KEY_ENCRYPTION_KEY_ITEM = new WordArray([1541276774, 3192629469, 1059630479, 1194558349], 16);
    static IV_ENCRYPTION_KEY_ITEM = new WordArray([1156797778, 168578463, 3342295823, 1238504529], 16);

    static encryptKeyItem(key: string): string {
        return AES.encrypt(key + '', this.KEY_ENCRYPTION_KEY_ITEM, {iv: this.IV_ENCRYPTION_KEY_ITEM}).toString();
    }

    static encryptValueItem(value): string {
        return AES.encrypt(value, this.KEY_ENCRYPTION_VALUE_ITEM, {iv: this.IV_ENCRYPTION_VALUE_ITEM}).toString()
    }

    static decryptValueItem(value) {
        return AES.decrypt(value, this.KEY_ENCRYPTION_VALUE_ITEM, {iv: this.IV_ENCRYPTION_VALUE_ITEM}).toString(enc.Utf8);
    }

    static setItem(key: string, value) {
        let encryptedKey = this.encryptKeyItem(key);
        let encryptedValue = this.encryptValueItem(value);
        cc.sys.localStorage.setItem(encryptedKey, encryptedValue);
    }

    static getItem(key: string) {
        let encryptedKey = this.encryptKeyItem(key);
        let value = cc.sys.localStorage.getItem(encryptedKey);
        if (value) {
            return this.decryptValueItem(value);

        } else {
            return null;
        }
    }

    static removeItem(key: string) {
        cc.sys.localStorage.removeItem(this.encryptKeyItem(key));
    }

}