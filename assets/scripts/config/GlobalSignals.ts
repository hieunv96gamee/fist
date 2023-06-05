import {Signal} from "../base/Signal";


export class GlobalSignals{

    public static coinUpdateSignal = new Signal();

    public static collectGemsSignal = new Signal();
    public static autoMoveSignal = new Signal();

    public static questFailSignal = new Signal();
    public static questPassSignal = new Signal();

    public static castleUpgradeSignal = new Signal();
    public static changeSkinBossSignal = new Signal();

}