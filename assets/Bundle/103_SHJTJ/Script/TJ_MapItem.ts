import { _decorator, Color, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { TJ_GameManager } from './TJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TJ_MapItem')
export class TJ_MapItem extends Component {

    init(sf: SpriteFrame) {
        let icon = this.node.getChildByName("Icon").getComponent(Sprite);
        let name = this.node.getChildByName("Name").getComponent(Label);
        icon.spriteFrame = sf;
        name.string = sf.name;
        this.node.name = sf.name;

        const active = TJ_GameManager.instance.activeRoles.find(role => role == sf.name)
        if (active) {
            console.log("active", active)
            icon.color = Color.WHITE;
        } 
    }
}


