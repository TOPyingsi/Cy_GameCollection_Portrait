import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { LWMJ_ToolBlock } from './LWMJ_ToolBlock';
const { ccclass, property } = _decorator;

@ccclass('LWMJ_ToolSpawn')
export class LWMJ_ToolSpawn extends Component {
    @property(Prefab)
    public blockPrefab: Prefab = null!;

    private blocks: Node[] = [];

    protected onLoad(): void {
        this.spawnBlocks();
    }
    start() {
        
    }
    private spawnBlocks() {
        const ids = Array.from({length: 15}, (_, i) => i);
        this.shuffleArray(ids);

        for (let i = 0; i < 15; i++) {
            const block = instantiate(this.blockPrefab);
            this.node.addChild(block);
            
            // 设置随机分配的固定ID
            block.getComponent(LWMJ_ToolBlock)?.setID(ids[i]);
            this.blocks.push(block);
        }
    }
    private shuffleArray(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    update(deltaTime: number) {
        
    }
}


