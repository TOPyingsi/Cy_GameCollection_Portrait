import { _decorator, Component, director, Event, Input, input, KeyCode, Label, Node, tween, Tween, v3 } from 'cc';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { GameManager } from '../../../Scripts/GameManager';
import { Panel, UIManager } from '../../../Scripts/Framework/Managers/UIManager';
import { NZKJ_GameData } from './NZKJ_GameData';
const { ccclass, property } = _decorator;

@ccclass('NZKJ_UI')
export class NZKJ_UI extends Component {
    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        director.getScene().on("逆转空间_游戏胜利", () => {
            this.scheduleOnce(() => {
                this.OpenOrExitUI(this.node.getChildByName("通关界面"), true);
            }, 1)
        });
        this.node.getChildByName("关卡数").getComponent(Label).string = "关卡" + (NZKJ_GameData.Instance.Scene + 1);
        if (!NZKJ_GameData.Instance.CourseIsStart) {
            this.OpenOrExitUI(this.node.getChildByName("教程界面"), true);
        }
    }

    OnButtonClick(event: Event) {
        switch (event.target.name) {
            case "上":
                director.getScene().emit("逆转空间_移动", 0);
                break;
            case "下":
                director.getScene().emit("逆转空间_移动", 2);
                break;
            case "左":
                director.getScene().emit("逆转空间_移动", 3);
                break;
            case "右":
                director.getScene().emit("逆转空间_移动", 1);
                break;
            case "交换":
                director.getScene().emit("逆转空间_交换");
                director.getScene().emit("逆转空间_渲染刷新");
                break;
            case "设置":
                this.OpenOrExitUI(this.node.getChildByName("设置面板"), true);
                break;
            case "设置":
                this.OpenOrExitUI(this.node.getChildByName("设置面板"), true);
                break;
            case "关闭设置面板":
                this.OpenOrExitUI(this.node.getChildByName("设置面板"), false);
                break;
            case "关闭教程弹板":
                this.OpenOrExitUI(this.node.getChildByName("教程界面"), false);
                NZKJ_GameData.Instance.CourseIsStart = true;
                break;
            case "右翻页":
                this.OncourseButtomClick(false); break;
            case "左翻页":
                this.OncourseButtomClick(true); break;
            case "教程":
                this.OpenOrExitUI(this.node.getChildByName("教程界面"), true);
                break;
            case "返回主页":
                UIManager.ShowPanel(Panel.ReturnPanel);
                break;
            case "重新开始":
                director.loadScene(director.getScene().name);
                break;
            case "下一关":
                director.loadScene(director.getScene().name);
                break;
        }
    }
    private courseIndex: number = 0;//教程页数
    private courseMaxIndex: number = 3;//教程最大页数
    OncourseButtomClick(Isleft: boolean) {
        this.courseIndex += Isleft ? -1 : 1;
        this.courseIndex = this.courseIndex < 0 ? this.courseMaxIndex : this.courseIndex;
        this.courseIndex = this.courseIndex > this.courseMaxIndex ? 0 : this.courseIndex;
        let nd = this.node.getChildByPath("教程界面/面板/教程");
        nd.children.forEach((item, index) => {
            item.active = index == this.courseIndex;
        })
    }

    // 键盘事件处理
    onKeyDown(event: any) {
        switch (event.keyCode) {
            case KeyCode.KEY_W: // W键
                director.getScene().emit("逆转空间_移动", 0);
                break;
            case KeyCode.KEY_A: // A键
                director.getScene().emit("逆转空间_移动", 3);
                break;
            case KeyCode.KEY_S: // S键
                director.getScene().emit("逆转空间_移动", 2);
                break;
            case KeyCode.KEY_D: // D键
                director.getScene().emit("逆转空间_移动", 1);
                break;
        }
    }

    tw: Tween = null;
    //打开界面
    OpenOrExitUI(nd: Node, IsOpen: boolean = true) {
        if (this.tw) {
            this.tw.stop();
        }
        if (IsOpen) {
            nd.active = true;
        }
        let panel = nd.getChildByName("面板");
        panel.scale = IsOpen ? v3(0, 0, 0) : v3(1, 1, 1);
        this.tw = tween(panel).to(0.4, { scale: IsOpen ? v3(1, 1, 1) : v3(0, 0, 0) }, { easing: IsOpen ? "backOut" : "backIn" })
            .call(() => {
                if (!IsOpen) {
                    nd.active = false;
                }
            }).start();
    }
}


