import { _decorator, Component, director, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('objectController')
export class objectController extends Component {
    @property(Boolean)
    canCross : boolean = true;

    @property(SpriteFrame)
    sfs : SpriteFrame[] = [];


    protected onLoad(): void {
        let idx = Number(director.getScene().name[director.getScene().name.length - 1]);
        console.log(director.getScene().name);
        this.getComponentInChildren(Sprite).spriteFrame = this.sfs[idx - 1];

    }
}


