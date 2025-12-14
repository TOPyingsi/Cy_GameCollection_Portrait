import { _decorator, Color, Component, Node } from 'cc';
import { SXZW_RoleControl } from './SXZW_RoleControl';
const { ccclass, property } = _decorator;

@ccclass('SXZW_PlayerControl')
export class SXZW_PlayerControl extends Component {

    private _role: SXZW_RoleControl
    public get role() {
        if (this._role == null) {
            this._role = this.getComponent(SXZW_RoleControl)
        }
        return this._role;
    }

    private angle = 70;

    start() {
        this.role.angle = this.angle;
        this.role.setColor(new Color(14, 220, 179, 255))
    }

    update(deltaTime: number) {

    }
}


