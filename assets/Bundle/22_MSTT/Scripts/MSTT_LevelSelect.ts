import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MSTT_LevelSelect')
export class MSTT_LevelSelect extends Component {
    @property([Prefab])
    private levelPrefabs: Prefab[] = [];

    @property
    private levelNum: number = 0;
    protected onLoad(): void {
        this.scheduleOnce(() => {
            let level = instantiate(this.levelPrefabs[this.levelNum]);
            this.node.addChild(level);
        }, 0.5);
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


