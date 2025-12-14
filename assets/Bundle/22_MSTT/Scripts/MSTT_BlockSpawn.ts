import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MSTT_BlockSpawn')
export class MSTT_BlockSpawn extends Component {
    @property(Prefab)
    public blockPrefab: Prefab | null = null;

    public blockArray: Node[][] = [];
    start() {
        this.generateBlock();
    }

    update(deltaTime: number) {

    }

    private generateBlock() {
        const gridSizeX = 7;
        const gridSizeY = 8;
        const spacing = 0;
        const startX = 65;
        const startY = 80;
        const blockSize = 128;

        for (let row = 0; row < gridSizeX; row++) {
            this.blockArray[row] = [];
            for (let col = 0; col < gridSizeY; col++) {
                const position = new math.Vec3(
                    startX + col * (blockSize + spacing),
                    startY + row * (blockSize + spacing),
                    0
                );

                const block = this.instantiateBlock(position);
                this.blockArray[row][col] = block;
            }
        }
    }

    private instantiateBlock(position: math.Vec3) {
        const block = instantiate(this.blockPrefab);
        block.setPosition(position);
        this.node.addChild(block);
        return block;
    }
    public getBlockIndex(node: Node): { row: number, col: number } {
        for (let row = 0; row < this.blockArray.length; row++) {
            for (let col = 0; col < this.blockArray[row].length; col++) {
                if (this.blockArray[row][col] === node) {
                    return { row, col };
                }
            }
        }
        return { row: -1, col: -1 };
    }
}


