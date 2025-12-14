import { _decorator, director } from 'cc';
export class MyEvent {
    public static RefreshAP: string = 'MyEvent.RefreshAP';
    public static RefreshAPTimer: string = 'MyEvent.RefreshAPTimer';
    public static ShowAPTimer: string = 'MyEvent.ShowAPTimer';
    public static Start_Game: string = 'MyEvent.Start_Game';
    public static Pause_Game: string = 'MyEvent.Pause_Game';
    public static Resume_Game: string = 'MyEvent.Resume_Game';
    public static MOVEMENT: string = 'MyEvent.MOVEMENT';
    public static MOVEMENT_STOP: string = 'MyEvent.MOVEMENT_STOP';
    public static SET_ATTACK_DIR: string = 'MyEvent.SET_ATTACK_DIR';
    public static Start_Fire: string = 'MyEvent.Start_Fire';
    public static Stop_Fire: string = 'MyEvent.Stop_Fire';
    public static TreasureBoxShow: string = 'MyEvent.TreasureBoxShow';
    public static TreasureBoxDestroy: string = 'MyEvent.TreasureBoxDestroy';
    public static IsMusicOn: string = 'MyEvent.IsMusicOn';
    public static IsSoundOn: string = 'MyEvent.IsSoundOn';
    public static IsVibrateOn: string = 'MyEvent.IsVibrateOn';

}

export class EventManager {
    public static get Scene() {
        return director.getScene();
    }
    public static on(type: string, callback: Function, target?: any) {
        director.getScene().on(type, callback, target);
    }
    public static off(type: string, callback?: Function, target?: any) {
        director.getScene()?.off(type, callback, target);
    }
}