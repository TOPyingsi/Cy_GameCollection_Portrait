import { director } from "cc";

export class DMM_MyEvent {
    public static DMM_SHOWITEM = "DMM_SHOWITEM";
    public static DMM_MOVEMENT = "DMM_MOVEMENT";
    public static DMM_MOVEMENT_STOP = "DMM_MOVEMENT_STOP";
    public static DMM_AI_MOVE = "DMM_AI_MOVE";
    public static DMM_HIDE = "DMM_HIDE";
    public static DMM_ARREST = "DMM_ARREST";
    public static DMM_AI_CHANGEPROP = "DMM_AI_CHANGEPROP";
    public static DMM_AI_CHANGEAI = "DMM_AI_CHANGEAI";
}

export class DMM_EventManager {
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


