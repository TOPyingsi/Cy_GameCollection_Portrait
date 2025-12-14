import { _decorator, Component, director, Node, PhysicsSystem2D } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('gameWorld')
export class gameWorld extends Component {

    @property(GamePanel)
    gamepanel : GamePanel;
    protected onLoad(): void {
        // PhysicsSystem2D.instance.debugDrawFlags = 1;
    }

    protected start(): void {
        this.gamepanel.lostStr = "好可惜！再来一次试试吧";
    }
    isOver : Boolean = false;
    protected onEnable(): void {
        director.getScene().on("Win", this.Win, this);
        director.getScene().on("Lose", this.Lose, this);
    }
    
    Win(){
        if (this.isOver){
            return;
        }
        this.isOver = true;
        this.gamepanel.Win();
        console.log("Win");
    }
    
    Lose(){
        if (this.isOver){
            return;
        }
        this.isOver = true;
        console.log("Lose");
        this.gamepanel.Lost();
    }
    
    protected onDisable(): void {
        director.getScene().off("Win", this.Win, this);
        director.getScene().off("Lose", this.Lose, this);
        
    }
}


