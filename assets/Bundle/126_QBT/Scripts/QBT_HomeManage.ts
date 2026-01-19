import { _decorator, Component, director, Node } from 'cc';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('QBT_HomeManage')
export class QBT_HomeManage extends Component {
    start() {
        ProjectEventManager.emit(ProjectEvent.游戏开始, "丘比特");
    }

    update(deltaTime: number) {

    }

    startGame() {

        director.loadScene("QBT_Game");
    }

    exitGame() {
        GameManager.Instance.ReturnAndShowMoreGame();
        //director.loadScene("Start");
    }
}


