import { _decorator, Component, director, Game, Node, tween, UIOpacity } from 'cc';
import { prefabsManager } from './prefabsManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { Label } from '../../../../extensions/plugin-import-2x/creator/components/Label';
const { ccclass, property } = _decorator;

@ccclass('playSystem')
export class playSystem extends Component {
    
    levelCnt : number = 0;

    @property(Node)
    objectParent : Node;


    @property(UIOpacity)
    black : UIOpacity;

    @property(GamePanel)
    gamepanel : GamePanel;

    @property(UIOpacity)
    tip : UIOpacity;

    protected onEnable(): void {
        director.getScene().on("Win", this.Win, this);
        director.getScene().on("Tip", this.Tip, this);
    }
    protected onDisable(): void {
        director.getScene().off("Win", this.Win, this);
        director.getScene().off("Tip", this.Tip, this);
    }
    Tip(){
        this.tip.opacity = 255;
        tween(this.tip).to(3, {opacity : 0}).call(()=>{
        }).start();
    }

    Win(){
        this.levelCnt++;
        if (this.levelCnt == 1){
            tween(this.black).to(0.5, {opacity : 255}).call(() => {
                this.objectParent.removeAllChildren();
                prefabsManager.instance.Grid.clearEverything();
                prefabsManager.instance.setLevel_Tow();
                tween(this.black).to(0.5, {opacity : 0}).call(() => {
                }).start();
            }).start();
        }else if (this.levelCnt == 2){
            tween(this.black).to(0.5, {opacity : 255}).call(() => {
                this.objectParent.removeAllChildren();
                prefabsManager.instance.Grid.clearEverything();
                prefabsManager.instance.setLevel_Three();
                tween(this.black).to(0.5, {opacity : 0}).call(() => {
                }).start();
            }).start();
        }else if (this.levelCnt == 3){
            tween(this.black).to(0.5, {opacity : 255}).call(() => {
                this.objectParent.removeAllChildren();
                prefabsManager.instance.Grid.clearEverything();
                prefabsManager.instance.setLevel_Four();
                tween(this.black).to(0.5, {opacity : 0}).call(() => {
                }).start();
            }).start();
        }else if (this.levelCnt == 4){
            tween(this.black).to(0.5, {opacity : 255}).call(() => {
                this.objectParent.removeAllChildren();
                prefabsManager.instance.Grid.clearEverything();
                prefabsManager.instance.setLevel_Five();
                tween(this.black).to(0.5, {opacity : 0}).call(() => {
                }).start();
            }).start();
        }
        else{
            // 真正胜利。
            this.gamepanel.Win();
        }
    }

}


