import { _decorator, Component, Label, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HLX_Item')
export class HLX_Item extends Component {

    @property(Label) label: Label = null;

    index: Vec2 = new Vec2();
    isActive: boolean = false;

    init(str: string, index: Vec2): Node {
        this.label.string = str;
        this.index = index;
        this.node.name = str;
        return this.node;
    }
}


