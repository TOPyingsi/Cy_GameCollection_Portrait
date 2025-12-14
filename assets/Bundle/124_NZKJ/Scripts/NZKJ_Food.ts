import { _decorator, Component, director, Node, Vec2 } from 'cc';
import { NZKJ_GameManager } from './NZKJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('NZKJ_Food')
export class NZKJ_Food extends Component {
    public PosX: number = 0;
    public PosY: number = 0;
    public NodeColor: number = 0;
    start() {
        director.getScene().on("逆转空间_玩家移动", this.IsFood, this);
    }
    Init(NodeX: number, NodeY: number, NodeColor: number) {
        this.PosX = NodeX;
        this.PosY = NodeY;
        this.NodeColor = NodeColor;
    }
    IsFood(NodeColor: number, Pos: Vec2) {
        if (NodeColor == this.NodeColor && this.PosX == Pos.x && this.PosY == Pos.y) {
            NZKJ_GameManager.Instance.AddScore();
            this.node.destroy();
        }

    }
}


