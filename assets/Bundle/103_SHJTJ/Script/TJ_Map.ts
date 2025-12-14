import { _decorator, Color, Component, instantiate, Node, Prefab, ScrollView, Sprite, SpriteFrame } from 'cc';
import { TJ_MapItem } from './TJ_MapItem';
const { ccclass, property } = _decorator;

@ccclass('TJ_Map')
export class TJ_Map extends Component {

    @property(Prefab) item: Prefab = null;
    @property(ScrollView) scrollView: ScrollView = null;

    init(sfs: SpriteFrame[]) {
        sfs.forEach(sf => {
            let node = instantiate(this.item);
            node.getComponent(TJ_MapItem).init(sf);
            node.setParent(this.scrollView.content);
            
        });
    }
}


