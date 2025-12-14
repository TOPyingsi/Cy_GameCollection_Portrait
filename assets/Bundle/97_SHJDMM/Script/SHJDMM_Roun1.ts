import { _decorator, Component, director, Node, Sprite, SpriteFrame } from 'cc';
import { SHJDMM_GameManager } from './SHJDMM_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SHJDMM_Roun1')
export class SHJDMM_Roun1 extends Component {

    @property(SpriteFrame) sf1: SpriteFrame = null;
    @property(SpriteFrame) sf2: SpriteFrame = null;
    @property(SpriteFrame) sf3: SpriteFrame = null;

    @property(Node) role1: Node = null;
    @property(Node) role2: Node = null;
    @property(Node) role3: Node = null;

    protected onLoad(): void {
        director.on("round1_changeSf", this.changeSf, this);
    }

    changeSf() {
        const _map = SHJDMM_GameManager.instance._map;
        if (_map.size != 3) {
            if (this.role1 && this.role1.isValid && !_map.has(this.role1)) {
                this.role1.getComponent(Sprite).spriteFrame = this.sf1;
            }
            if (this.role2 && this.role2.isValid && !_map.has(this.role2)) {
                this.role2.getComponent(Sprite).spriteFrame = this.sf2;
            }
            if (this.role3 && this.role3.isValid && !_map.has(this.role3)) {
                this.role3.getComponent(Sprite).spriteFrame = this.sf3;
            }
        }

        SHJDMM_GameManager.instance.map.forEach((value, key) => {
            console.log("SHJDMM_Roun1_changeSf", value, key)
            if (key && key.isValid && key == this.role1) {
                this.role1.getComponent(Sprite).spriteFrame = this.sf1;
            }
            if (key && key.isValid && key == this.role2) {
                this.role2.getComponent(Sprite).spriteFrame = this.sf2;
            }
            if (key && key.isValid && key == this.role3) {
                this.role3.getComponent(Sprite).spriteFrame = this.sf3;
            }
        });
    }
}


