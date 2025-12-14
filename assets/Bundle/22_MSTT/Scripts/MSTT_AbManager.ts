import { _decorator, CCInteger, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('MSTT_AbManager')
export class MSTT_AbManager extends Component {
    @property(Prefab)
    AbPrefab: Prefab | null = null;

    @property(CCInteger) totalCount: number = 120;
    protected onLoad(): void {
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        else this.Init();
    }
    start() {

    }
    Init() {
        this.generateAbs();
    }

    update(deltaTime: number) {

    }
    private generateAbs() {
        const spawnArea = 300;

        for (let i = 0; i < this.totalCount; i++) {
            const position = new Vec3(
                Math.random() * spawnArea - spawnArea / 2,
                Math.random() * spawnArea - spawnArea / 2,
                0
            );
            const peach = instantiate(this.AbPrefab!);
            peach.setPosition(position);
            this.node.addChild(peach);
        }
    }
}


