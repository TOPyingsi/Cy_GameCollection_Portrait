import { _decorator, Component, director, Node } from 'cc';
import { NZKJ_SmallBox } from './NZKJ_SmallBox';
import { NZKJ_GameManager } from './NZKJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('NZKJ_Player')
export class NZKJ_Player extends Component {
    @property()
    PlayerColor: number = 0;
    public smallbox: NZKJ_SmallBox = null;

    start() {
        this.smallbox = this.node.getComponent(NZKJ_SmallBox);
        director.getScene().on("逆转空间_移动", this.Move, this);
        director.getScene().on("逆转空间_渲染刷新", this.Show, this);
        this.Init();
    }

    Init() {


    }
    Show() {
        let Isthis = this.PlayerColor == NZKJ_GameManager.Instance.environmentState;
        if (!Isthis) {//玩家需要改层级
            this.node.setSiblingIndex(0);
        } else {

        }
        this.node.getChildByPath("眼睛/睁眼").active = Isthis;
        this.node.getChildByPath("眼睛/闭眼").active = !Isthis;
    }
    Move(direction: number) {
        if (this.PlayerColor != NZKJ_GameManager.Instance.environmentState) return;
        if (NZKJ_GameManager.Instance.CanMove(this.smallbox.PosX, this.smallbox.PosY, this.PlayerColor, direction)) {
            NZKJ_GameManager.Instance.AudioPlay(0);
            NZKJ_GameManager.Instance.MovePlayer(this.node, direction);
        } else {
            NZKJ_GameManager.Instance.AudioPlay(1);
        }



    }


}


