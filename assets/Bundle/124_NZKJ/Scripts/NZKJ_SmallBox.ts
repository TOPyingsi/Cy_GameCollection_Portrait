import { _decorator, Component, director, Node } from 'cc';
import { NZKJ_GameManager } from './NZKJ_GameManager';
import { NZKJ_Player } from './NZKJ_Player';
const { ccclass, property } = _decorator;

@ccclass('NZKJ_SmallBox')
export class NZKJ_SmallBox extends Component {
    public PosX: number = 0;
    public PosY: number = 0;

    @property({ type: [Node] })
    public spriteNodes: Node[] = [];

    public NodeColor: number = 0;//(0白1黑2灰)
    start() {
        director.getScene().on("逆转空间_渲染刷新", this.Show, this);
    }

    Init(NodeX: number, NodeY: number, ColorNum: number) {
        if (ColorNum == 3) {//3或者4代表玩家，颜色上还是0和1
            ColorNum = 0
        }
        if (ColorNum == 4) {
            ColorNum = 1
        }
        this.NodeColor = ColorNum;
        this.PosX = NodeX;
        this.PosY = NodeY;
    }


    Show() {
        if (this.node.getComponent(NZKJ_Player)) return;//玩家不参与

        // 初始化所有节点为隐藏
        this.spriteNodes.forEach(node => {
            if (node) node.active = false;
        });
        if (this.NodeColor != NZKJ_GameManager.Instance.environmentState && this.NodeColor != 2) {
            return;
        }

        // 检查上方 (PosY + 1)
        if (this.PosY + 1 < NZKJ_GameManager.Instance.SceneData.length &&
            NZKJ_GameManager.Instance.SceneData[this.PosY + 1][this.PosX] === this.NodeColor) {
            this.spriteNodes[0].active = false;
        } else {
            this.spriteNodes[0].active = true;
        }

        // 检查右方 (PosX + 1)
        if (this.PosX + 1 < NZKJ_GameManager.Instance.SceneData[this.PosY].length &&
            NZKJ_GameManager.Instance.SceneData[this.PosY][this.PosX + 1] === this.NodeColor) {
            this.spriteNodes[1].active = false;
        } else {
            this.spriteNodes[1].active = true;
        }

        // 检查左方 (PosX - 1)
        if (this.PosX - 1 >= 0 &&
            NZKJ_GameManager.Instance.SceneData[this.PosY][this.PosX - 1] === this.NodeColor) {
            this.spriteNodes[2].active = false;
        } else {
            this.spriteNodes[2].active = true;
        }

        // 检查下方 (PosY - 1)
        if (this.PosY - 1 >= 0 &&
            NZKJ_GameManager.Instance.SceneData[this.PosY - 1][this.PosX] === this.NodeColor) {
            this.spriteNodes[3].active = false;
        } else {
            this.spriteNodes[3].active = true;
        }

        // 检查左上角 (PosX - 1, PosY + 1)
        if (this.PosX - 1 >= 0 && this.PosY + 1 < NZKJ_GameManager.Instance.SceneData.length &&
            (NZKJ_GameManager.Instance.SceneData[this.PosY][this.PosX - 1] === this.NodeColor
                || NZKJ_GameManager.Instance.SceneData[this.PosY + 1][this.PosX] === this.NodeColor)) {
            this.spriteNodes[4].active = false;
        } else {
            this.spriteNodes[4].active = true;
        }

        // 检查右下角 (PosX + 1, PosY - 1)
        if (this.PosX + 1 < NZKJ_GameManager.Instance.SceneData[this.PosY].length && this.PosY - 1 >= 0 &&
            (NZKJ_GameManager.Instance.SceneData[this.PosY][this.PosX + 1] === this.NodeColor
                || NZKJ_GameManager.Instance.SceneData[this.PosY - 1][this.PosX] === this.NodeColor)) {
            this.spriteNodes[5].active = false;
        } else {
            this.spriteNodes[5].active = true;
        }
    }
}


