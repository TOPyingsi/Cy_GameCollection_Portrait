import { _decorator, Component, Node, size, Size, UITransform, Vec2 } from 'cc';
import { CraftingBlocksBlockData } from './CraftingBlocksManager';
const { ccclass, property } = _decorator;

@ccclass('CraftingBlocksItem')
export class CraftingBlocksItem extends Component {

    trans: UITransform = null;
    data: CraftingBlocksBlockData = null;

    x: number = 0;
    y: number = 0;

    protected onLoad(): void {
        this.trans = this.node.getComponent(UITransform);
    }

    Init(data: CraftingBlocksBlockData) {
        this.data = data;
    }

    IsInBoundingBox(point: Vec2) {
        return this.trans.getBoundingBox().contains(point);
    }


    update(deltaTime: number) {

    }

}