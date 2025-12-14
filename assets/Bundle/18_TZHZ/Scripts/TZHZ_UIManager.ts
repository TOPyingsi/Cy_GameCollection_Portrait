import { _decorator, Component, find, Node, Event, Button, Label, color, Color, Prefab } from 'cc';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('TZHZ_UIManager')
export class TZHZ_UIManager extends Component {
    @property(GamePanel)
    gamePanel: GamePanel = null;

    // @property(Prefab)
    // answer: Prefab = null;
    OnButtonClick(event: Event) {
        switch (event.target.name) {
            case "头发":
                find("Canvas/菜单栏/头发/选框").active = true;
                find("Canvas/菜单栏/衣服/选框").active = false;
                find("Canvas/菜单栏/表情/选框").active = false;
                find("Canvas/菜单栏/服饰/选框").active = false;
                find("Canvas/菜单栏/背景/选框").active = false;

                find("Canvas/菜单栏/头发").getComponent(Button).interactable = false;
                find("Canvas/菜单栏/衣服").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/表情").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/服饰").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/背景").getComponent(Button).interactable = true;

                find("Canvas/菜单栏/头发/头发").getComponent(Label).color = new Color(255, 63, 252);
                find("Canvas/菜单栏/衣服/衣服").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/表情/表情").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/服饰/服饰").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/背景/背景").getComponent(Label).color = new Color(255, 255, 255);
                break;
            case "衣服":
                find("Canvas/菜单栏/头发/选框").active = false;
                find("Canvas/菜单栏/衣服/选框").active = true;
                find("Canvas/菜单栏/表情/选框").active = false;
                find("Canvas/菜单栏/服饰/选框").active = false;
                find("Canvas/菜单栏/背景/选框").active = false;

                find("Canvas/菜单栏/头发").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/衣服").getComponent(Button).interactable = false;
                find("Canvas/菜单栏/表情").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/服饰").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/背景").getComponent(Button).interactable = true;

                find("Canvas/菜单栏/头发/头发").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/衣服/衣服").getComponent(Label).color = new Color(255, 63, 252);
                find("Canvas/菜单栏/表情/表情").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/服饰/服饰").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/背景/背景").getComponent(Label).color = new Color(255, 255, 255);
                break;
            case "表情":
                find("Canvas/菜单栏/头发/选框").active = false;
                find("Canvas/菜单栏/衣服/选框").active = false;
                find("Canvas/菜单栏/表情/选框").active = true;
                find("Canvas/菜单栏/服饰/选框").active = false;
                find("Canvas/菜单栏/背景/选框").active = false;

                find("Canvas/菜单栏/头发").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/衣服").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/表情").getComponent(Button).interactable = false;
                find("Canvas/菜单栏/服饰").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/背景").getComponent(Button).interactable = true;

                find("Canvas/菜单栏/头发/头发").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/衣服/衣服").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/表情/表情").getComponent(Label).color = new Color(255, 63, 252);
                find("Canvas/菜单栏/服饰/服饰").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/背景/背景").getComponent(Label).color = new Color(255, 255, 255);
                break;
            case "服饰":
                find("Canvas/菜单栏/头发/选框").active = false;
                find("Canvas/菜单栏/衣服/选框").active = false;
                find("Canvas/菜单栏/表情/选框").active = false;
                find("Canvas/菜单栏/服饰/选框").active = true;
                find("Canvas/菜单栏/背景/选框").active = false;

                find("Canvas/菜单栏/头发").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/衣服").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/表情").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/服饰").getComponent(Button).interactable = false;
                find("Canvas/菜单栏/背景").getComponent(Button).interactable = true;

                find("Canvas/菜单栏/头发/头发").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/衣服/衣服").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/表情/表情").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/服饰/服饰").getComponent(Label).color = new Color(255, 63, 252);
                find("Canvas/菜单栏/背景/背景").getComponent(Label).color = new Color(255, 255, 255);
                break;
            case "背景":

                find("Canvas/菜单栏/头发/选框").active = false;
                find("Canvas/菜单栏/衣服/选框").active = false;
                find("Canvas/菜单栏/表情/选框").active = false;
                find("Canvas/菜单栏/服饰/选框").active = false;
                find("Canvas/菜单栏/背景/选框").active = true;

                find("Canvas/菜单栏/头发").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/衣服").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/表情").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/服饰").getComponent(Button).interactable = true;
                find("Canvas/菜单栏/背景").getComponent(Button).interactable = false;

                find("Canvas/菜单栏/头发/头发").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/衣服/衣服").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/表情/表情").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/服饰/服饰").getComponent(Label).color = new Color(255, 255, 255);
                find("Canvas/菜单栏/背景/背景").getComponent(Label).color = new Color(255, 63, 252);
                break;
            case "完成":
                this.gamePanel.Win();
                break;
        }


    }
}

