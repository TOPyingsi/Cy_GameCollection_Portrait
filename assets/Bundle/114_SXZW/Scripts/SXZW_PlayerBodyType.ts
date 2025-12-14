import { _decorator, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('SXZW_PlayerBodyType')
export class SXZW_PlayerBodyType extends Component {

    @property(Boolean)
    head: boolean = false
    @property(Boolean)
    body: boolean = false
    @property(Boolean)
    hand: boolean = false
    @property(Boolean)
    leg: boolean = false

    start() {

    }

    update(deltaTime: number) {

    }
}
