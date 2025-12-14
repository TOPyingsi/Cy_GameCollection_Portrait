import { director } from "cc";

export class NDPA_MyEvent {
    public static NDPA_FALLING = "NDPA_FALLING";
    public static NDPA_REMAINING = "NDPA_REMAINING";
    public static NDPA_SHOWMZITEM = "NDPA_SHOWMZITEM";
    public static NDPA_SHOWDWITEM = "NDPA_SHOWDWITEM";
    public static NDPA_SHOWMZ = "NDPA_SHOWMZ";
    public static NDPA_SHOWPROP = "NDPA_SHOWPROP";
    public static NDPA_SMILE = "NDPA_SMILE";

    // public static HLGQ_ROTATE = "HLGQ_ROTATE";
    // public static HLGQ_SHOWROTATE = "HLGQ_SHOWROTATE";
    // public static HLGQ_SHOWPENDANT = "HLGQ_SHOWPENDANT";

    // public static DMM_SHOWITEM = "DMM_SHOWITEM";
    // public static DMM_MOVEMENT = "DMM_MOVEMENT";
    // public static DMM_MOVEMENT_STOP = "DMM_MOVEMENT_STOP";
    // public static DMM_AI_MOVE = "DMM_AI_MOVE";
    // public static DMM_HIDE = "DMM_HIDE";
    // public static DMM_ARREST = "DMM_ARREST";
    // public static DMM_AI_CHANGEPROP = "DMM_AI_CHANGEPROP";
    // public static DMM_AI_CHANGEAI = "DMM_AI_CHANGEAI";
}

export class NDPA_EventManager {
    public static get Scene() {
        return director.getScene();
    }
    public static ON(event: string, func: Function, target: Object) {
        director.getScene().on(event, func, target);
    }
    public static OFF(event: string, func: Function, target: Object) {
        director.getScene().off(event, func, target);
    }
}


