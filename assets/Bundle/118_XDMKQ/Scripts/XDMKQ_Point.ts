import { _decorator, Component, Node } from 'cc';
import { XDMKQ_PathManager } from './XDMKQ_PathManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_Point')
export class XDMKQ_Point extends Component {

    @property(Node)
    Neighbors: Node[] = [];

    public get ID(): string { return this.node.name; }
    public get WorldPosition() {
        return this.node.worldPosition.clone();
    }

    protected start(): void {
        XDMKQ_PathManager.Instance.MapPoint.set(this.ID, this);
    }

}


