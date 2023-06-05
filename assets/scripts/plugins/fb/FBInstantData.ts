import { LocalStorageManager } from "../../base/LocalStorageManager";
export class FBInstantData {

    public static getData(keys: string[], callback: (data: any) => void, errCb: (e) => void) {
        // if (typeof FBInstant === 'undefined') return;
        // FBInstant.player
        //     .getDataAsync(keys)
        //     .then(function (data) {
        //         console.log('data is loaded: ' + JSON.stringify(data));
        //         if (callback) callback(data);

        //     }).catch(function (e) {
        //     console.log('data is not loaded: ' + e);
        //     if (errCb) errCb(e);
        // });
        let data = {};
        for (let i = 0; i <= keys.length; i++) {
            data[keys[i]] = JSON.parse(LocalStorageManager.getItem(keys[i]));
        }
        if (callback) callback(data);
    }

    public static setData(data: any, callback: (e) => void = null) {
        cc.log("setData: " + JSON.stringify(data));
        // if (typeof FBInstant === 'undefined') {
        //     if (callback) callback(null);
        //     return;
        // }
        // FBInstant.player
        //     .setDataAsync(data)
        //     .then(function () {
        //         console.log('data is set');
        //         if (callback) callback(null);

        //     }).catch(function (e) {
        //         console.log('data is not set: ' + e);
        //         if (callback) callback(e);
        //     });
        LocalStorageManager.setItem(Object.keys(data)[0], JSON.stringify(Object.values(data)[0]));
        if (callback) callback(null);
    }
}