import { _decorator, Component, Node, SceneAsset } from 'cc';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_Game')
export class HCSHJ_Game extends Component {

    gameWin(){
        GamePanel.Instance.Win();
    }



    restartGame(){
        GameManager.Instance.LoadGame(GameManager.GameData);
    }
}


