import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SHJAJS_Panel')
export class SHJAJS_Panel extends Component {
    @property(CCInteger) index: number = 0;
}


