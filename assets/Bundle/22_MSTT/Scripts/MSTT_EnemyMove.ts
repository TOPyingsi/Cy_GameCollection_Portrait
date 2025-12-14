import { _decorator, Component, director, Node, tween, Vec3 } from 'cc';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('MSTT_EnemyMove')
export class MSTT_EnemyMove extends Component {
    @property
    moveDistance: number = 1; 
    @property
    moveDuration: number = 1;
    protected onLoad(): void {
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        else this.Init();
    }
    Init(){
        this.schedule(this.moveRight, 0.05);
    }
    start() {
        
        
    }

    private moveRight() {
        // 使用 Tween 缓动系统
        tween(this.node)
            .to(this.moveDuration, 
                { position: new Vec3(
                    this.node.position.x + this.moveDistance,
                    this.node.position.y,
                    this.node.position.z
                )}, 
                { easing: 'smooth' } 
            )
            .start();
    }
    moveStop(){
        this.unschedule(this.moveRight);
        tween(this.node).stop();
    }

    onDestroy() {
        // 组件销毁时清除定时器
        this.unschedule(this.moveRight);
        tween(this.node).stop();
    }

    update(deltaTime: number) {
        
    }
}


