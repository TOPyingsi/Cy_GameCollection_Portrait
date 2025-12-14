import { _decorator, Component, Node, Event, find, Button } from 'cc';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GKDR_GameManager } from './GKDR_GameManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('GKDR_UIManager')
export class GKDR_UIManager extends Component {
    @property(GamePanel)
    gamePanel: GamePanel = null;
    OnButtonClick(event: Event) {

        console.log("event.target.name" + event.target.name);
        switch (event.target.name) {
            case "透明底":
                find("Canvas/菜单栏/透明底/选框").active = true;
                find("Canvas/菜单栏/裱花/选框").active = false;
                find("Canvas/菜单栏/亮片/选框").active = false;
                find("Canvas/菜单栏/贴纸/选框").active = false;
                find("Canvas/菜单栏/3D贴纸/选框").active = false;
                find("Canvas/菜单栏/贴纸/贴纸重置").active = false;
                find("Canvas/菜单栏/3D贴纸/3D贴纸重置").active = false;
                find("Canvas/菜单栏/项链/选框").active = false;

                find("Canvas/菜单栏/透明底").getComponent(Button).interactable = false;
                find("Canvas/菜单栏/裱花").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/亮片").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/贴纸").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/3D贴纸").getComponent(Button).interactable = true;

                find("Canvas/菜单栏/项链").getComponent(Button).interactable = true;
                break;
            case "裱花":
                find("Canvas/菜单栏/透明底/选框").active = false;
                find("Canvas/菜单栏/裱花/选框").active = true;
                find("Canvas/菜单栏/亮片/选框").active = false;
                find("Canvas/菜单栏/贴纸/选框").active = false;
                find("Canvas/菜单栏/3D贴纸/选框").active = false;
                find("Canvas/菜单栏/项链/选框").active = false;

                find("Canvas/菜单栏/贴纸/贴纸重置").active = false;
                find("Canvas/菜单栏/3D贴纸/3D贴纸重置").active = false;

                find("Canvas/菜单栏/透明底").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/裱花").getComponent(Button).interactable = false;
                find("Canvas/菜单栏/亮片").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/贴纸").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/3D贴纸").getComponent(Button).interactable = true;

                find("Canvas/菜单栏/项链").getComponent(Button).interactable = true;
                break;
            case "亮片":
                find("Canvas/菜单栏/透明底/选框").active = false;
                find("Canvas/菜单栏/裱花/选框").active = false;
                find("Canvas/菜单栏/亮片/选框").active = true;
                find("Canvas/菜单栏/贴纸/选框").active = false;
                find("Canvas/菜单栏/3D贴纸/选框").active = false;
                find("Canvas/菜单栏/项链/选框").active = false;

                find("Canvas/菜单栏/贴纸/贴纸重置").active = false;
                find("Canvas/菜单栏/3D贴纸/3D贴纸重置").active = false;

                find("Canvas/菜单栏/透明底").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/裱花").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/亮片").getComponent(Button).interactable = false;
                find("Canvas/菜单栏/贴纸").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/3D贴纸").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/项链").getComponent(Button).interactable = true;
                break;
            case "贴纸":
                find("Canvas/菜单栏/透明底/选框").active = false;
                find("Canvas/菜单栏/裱花/选框").active = false;
                find("Canvas/菜单栏/亮片/选框").active = false;
                find("Canvas/菜单栏/贴纸/选框").active = true;
                find("Canvas/菜单栏/3D贴纸/选框").active = false;
                find("Canvas/菜单栏/项链/选框").active = false;

                find("Canvas/菜单栏/贴纸/贴纸重置").active = true;
                find("Canvas/菜单栏/3D贴纸/3D贴纸重置").active = false;

                find("Canvas/菜单栏/透明底").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/裱花").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/亮片").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/贴纸").getComponent(Button).interactable = false;
                find("Canvas/菜单栏/3D贴纸").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/项链").getComponent(Button).interactable = true;
                break;
            case "3D贴纸":

                find("Canvas/菜单栏/透明底/选框").active = false;
                find("Canvas/菜单栏/裱花/选框").active = false;
                find("Canvas/菜单栏/亮片/选框").active = false;
                find("Canvas/菜单栏/贴纸/选框").active = false;
                find("Canvas/菜单栏/3D贴纸/选框").active = true;
                find("Canvas/菜单栏/项链/选框").active = false;

                find("Canvas/菜单栏/贴纸/贴纸重置").active = false;
                find("Canvas/菜单栏/3D贴纸/3D贴纸重置").active = true;

                find("Canvas/菜单栏/透明底").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/裱花").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/亮片").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/贴纸").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/3D贴纸").getComponent(Button).interactable = false;

                find("Canvas/菜单栏/项链").getComponent(Button).interactable = true;
                break;
            case "项链":
                find("Canvas/菜单栏/透明底/选框").active = false;
                find("Canvas/菜单栏/裱花/选框").active = false;
                find("Canvas/菜单栏/亮片/选框").active = false;
                find("Canvas/菜单栏/贴纸/选框").active = false;
                find("Canvas/菜单栏/3D贴纸/选框").active = false;
                find("Canvas/菜单栏/项链/选框").active = true;

                find("Canvas/菜单栏/贴纸/贴纸重置").active = false;
                find("Canvas/菜单栏/3D贴纸/3D贴纸重置").active = false;

                find("Canvas/菜单栏/透明底").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/裱花").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/亮片").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/贴纸").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/3D贴纸").getComponent(Button).interactable = true;

                find("Canvas/菜单栏/项链").getComponent(Button).interactable = false;
                break;
            case "贴纸重置":
                if (find("Canvas/工作台/贴纸").children.length != null)
                    for (let i = 0; i < find("Canvas/工作台/贴纸").children.length; i++) {
                        find("Canvas/工作台/贴纸").children[i].destroy();
                    }
                break;
            case "3D贴纸重置":
                if (find("Canvas/工作台/3D贴纸").children.length != null)
                    for (let i = 0; i < find("Canvas/工作台/3D贴纸").children.length; i++) {
                        find("Canvas/工作台/3D贴纸").children[i].destroy();
                    }
                break;
            case "完成":
                this.gamePanel.Win();
                break;

        }


    }
    BtuonChange() {
        if (find("Canvas/菜单栏/透明底/选框").active = true) {
            let btn = find("Canvas/菜单栏/透明底").getComponent(Button);
            btn.interactable = false;
        }
        else if (find("Canvas/菜单栏/透明底/选框").active = false) {

            let btn = find("Canvas/菜单栏/透明底").getComponent(Button);
            btn.interactable = true;
        }
        if (find("Canvas/菜单栏/裱花/选框").active = true) {
            let btn = find("Canvas/菜单栏/裱花").getComponent(Button);
            btn.interactable = false;
        }
        else if (find("Canvas/菜单栏/裱花/选框").active = false) {
            let btn = find("Canvas/菜单栏/裱花").getComponent(Button);
            btn.interactable = true;
        }
        if (find("Canvas/菜单栏/亮片/选框").active = true) {
            let btn = find("Canvas/菜单栏/亮片").getComponent(Button);
            btn.interactable = false;
        }
        else if (find("Canvas/菜单栏/亮片/选框").active = false) {
            let btn = find("Canvas/菜单栏/亮片").getComponent(Button);
            btn.interactable = true;
        }
        if (find("Canvas/菜单栏/贴纸/选框").active = true) {

            let btn = find("Canvas/菜单栏/贴纸").getComponent(Button);
            btn.interactable = false;
        }
        else if (find("Canvas/菜单栏/贴纸/选框").active = false) {
            let btn = find("Canvas/菜单栏/贴纸").getComponent(Button);
            btn.interactable = true;
        }
        if (find("Canvas/菜单栏/3D贴纸/选框").active = true) {
            let btn = find("Canvas/菜单栏/3D贴纸").getComponent(Button);
            btn.interactable = false;
        }
        else if (find("Canvas/菜单栏/3D贴纸/选框").active = false) {
            let btn = find("Canvas/菜单栏/3D贴纸").getComponent(Button);
            btn.interactable = true;
        }
        if (find("Canvas/菜单栏/项链/选框").active = true) {
            let btn = find("Canvas/菜单栏/项链").getComponent(Button);
            btn.interactable = false;
        }
        else if (find("Canvas/菜单栏/项链/选框").active = false) {
            let btn = find("Canvas/菜单栏/项链").getComponent(Button);
            btn.interactable = true;
        }
    }
}


