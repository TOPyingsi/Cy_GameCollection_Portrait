import { _decorator, Button, Component, Node } from 'cc';
import { SHJZWD_GameMgr } from './SHJZWD_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJZWD_Level')
export class SHJZWD_Level extends Component {

    public index: number = 0;

    private BtnArr: Button[] = [];

    initData(levelIndex: number) {
        let btn = this.node.getChildByName("Btn");

        for (let i = 0; i < btn.children.length; i++) {
            this.BtnArr.push(btn.children[i].getComponent(Button));
            this.BtnArr[i].node.on(Button.EventType.CLICK, this.onBtnClick(i), this);
        }

        this.index = levelIndex;
    }

    protected onEnable(): void {
        SHJZWD_GameMgr.instance.levelIndex = this.index;

        let answer = SHJZWD_GameMgr.instance.levelAnswerArr;

        SHJZWD_GameMgr.instance.levelType = answer[this.index].length;

        SHJZWD_GameMgr.instance.changeTitle();
    }

    onBtnClick(index: number) {
        return () => {

            SHJZWD_GameMgr.instance.playSFX("点击");

            if (SHJZWD_GameMgr.instance.levelType === 1) {
                for (let i = 0; i < SHJZWD_GameMgr.instance.selectNode.length; i++) {
                    SHJZWD_GameMgr.instance.selectNode[i].active = false;
                }
            }

            let flag = SHJZWD_GameMgr.instance.selectNode[index].active;

            SHJZWD_GameMgr.instance.selectNode[index].active = !flag;

            let pos = this.BtnArr[index].node.worldPosition.clone();

            SHJZWD_GameMgr.instance.selectNode[index].worldPosition = pos;
        }
    }

    public offBtn() {
        let btn = this.node.getChildByName("Btn");

        for (let i = 0; i < btn.children.length; i++) {
            this.BtnArr[i].enabled = false;
            this.BtnArr[i].node.off(Button.EventType.CLICK, this.onBtnClick, this);
        }
    }
}


