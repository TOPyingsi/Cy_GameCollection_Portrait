import { _decorator, Component, director, Node, tween, Vec3 } from 'cc';
import { MSTT_BlockSpawn } from './MSTT_BlockSpawn';
import { MSTT_BlockSet } from './MSTT_BlockSet';
const { ccclass, property } = _decorator;

@ccclass('MSTT_GameRule')
export class MSTT_GameRule extends Component {
    private isAnimating = false;
    protected onLoad(): void {
        director.on('BLOCK_SELECTED', this.onBlockSelected, this);
    }

    private selectedBlock1: Node | null = null;
    private selectedBlock2: Node | null = null;
    start() {

    }

    update(deltaTime: number) {

    }
    private onBlockSelected(event: { id: number, pos: Vec3, node: Node }) {
        console.log(`选中方块 ID:${event.id} 坐标:[${event.pos.x},${event.pos.y}]`);
        this.processBlockSelection(event.id, event.pos, event.node);
    }
    private async processBlockSelection(blockId: number, position: Vec3, blockNode: Node) {
        const blockSpawn = this.node.getComponent(MSTT_BlockSpawn)!;

        if (!this.selectedBlock1) {
            this.selectedBlock1 = blockNode;
            return;
        }

        this.selectedBlock2 = blockNode;

        if (this.selectedBlock1 && this.selectedBlock2) {
            if (this.selectedBlock1 === this.selectedBlock2) {
                this.selectedBlock1.getChildByName("选中框").active = false;
                this.selectedBlock2.getChildByName("选中框").active = false;
                this.clearSelection();
                return;
            }

            if (!this.checkAdjacent(this.selectedBlock1, this.selectedBlock2)) {
                this.selectedBlock1.getChildByName("选中框").active = false;
                this.selectedBlock2.getChildByName("选中框").active = false;
                this.clearSelection()
                return;
            }
            this.isAnimating = true;

            MSTT_BlockSet.isMoving = true;
            // 异步执行交换动画
            const swapSuccess = await this.swapBlocksWithAnimation(blockSpawn);

            if (!swapSuccess) {
                // 播放回滚动画
                await this.revertSwapAnimation();

            }
            MSTT_BlockSet.isMoving = false;
            this.selectedBlock1.getChildByName("选中框").active = false;
            this.selectedBlock2.getChildByName("选中框").active = false;

            this.clearSelection();
            this.isAnimating = false;
        }
    }

    private async swapBlocksWithAnimation(spawner: MSTT_BlockSpawn): Promise<boolean> {
        const node1 = this.selectedBlock1!;
        const node2 = this.selectedBlock2!;
        const pos1 = node1.position.clone();
        const pos2 = node2.position.clone();
        await Promise.all([
            this.playSwapAnimation(node1, pos2),
            this.playSwapAnimation(node2, pos1)
        ]);
        const index1 = spawner.getBlockIndex(node1);
        const index2 = spawner.getBlockIndex(node2);
        [spawner.blockArray[index1.row][index1.col], spawner.blockArray[index2.row][index2.col]] =
            [spawner.blockArray[index2.row][index2.col], spawner.blockArray[index1.row][index1.col]];

        const eliminatedBlocks = new Set<Node>();
        this.checkForMatch(index1.row, index1.col, spawner, eliminatedBlocks);
        this.checkForMatch(index2.row, index2.col, spawner, eliminatedBlocks);

        if (eliminatedBlocks.size === 0) {
            return false;
        }

        // 执行消除
        eliminatedBlocks.forEach(node => {
            const rowCol = spawner.getBlockIndex(node);
            spawner.blockArray[rowCol.row][rowCol.col] = null;
            node.destroy();
        });
        return true;
    }

    private playSwapAnimation(node: Node, targetPos: Vec3): Promise<void> {
        return new Promise(resolve => {
            tween(node)
                .to(0.3, { position: targetPos }, {
                    easing: 'sineOut',
                    onComplete: () => resolve()
                })
                .start();
        });
    }

    private async revertSwapAnimation() {
        const node1 = this.selectedBlock1!;
        const node2 = this.selectedBlock2!;
        const blockSpawn = this.node.getComponent(MSTT_BlockSpawn)!;

        const index1 = blockSpawn.getBlockIndex(node1);
        const index2 = blockSpawn.getBlockIndex(node2);
        [blockSpawn.blockArray[index1.row][index1.col], blockSpawn.blockArray[index2.row][index2.col]] =
            [blockSpawn.blockArray[index2.row][index2.col], blockSpawn.blockArray[index1.row][index1.col]];

        const pos1 = node1.position.clone();
        const pos2 = node2.position.clone();
        await Promise.all([
            this.playSwapAnimation(node1, pos2),
            this.playSwapAnimation(node2, pos1)
        ]);

        // 重新检测原始位置
        const eliminatedBlocks = new Set<Node>();
        this.checkForMatch(index1.row, index1.col, blockSpawn, eliminatedBlocks);
        this.checkForMatch(index2.row, index2.col, blockSpawn, eliminatedBlocks);

        // 执行消除
        eliminatedBlocks.forEach(node => {
            const rowCol = blockSpawn.getBlockIndex(node);
            blockSpawn.blockArray[rowCol.row][rowCol.col] = null;
            node.destroy();
        });


    }
    private clearSelection() {
        this.selectedBlock1 = null;
        this.selectedBlock2 = null;
        console.log("已清空选中状态");
    }
    private checkAdjacent(blockA: Node, blockB: Node): boolean {
        const POSITION_TOLERANCE = 5;
        const GRID_SPACING = 128; //方块尺寸

        const dx = Math.abs(blockA.position.x - blockB.position.x);
        const dy = Math.abs(blockA.position.y - blockB.position.y);

        // 横向相邻：x差128且y相同
        const horizontal = dx >= GRID_SPACING - POSITION_TOLERANCE
            && dx <= GRID_SPACING + POSITION_TOLERANCE
            && dy <= POSITION_TOLERANCE;

        // 纵向相邻：y差128且x相同
        const vertical = dy >= GRID_SPACING - POSITION_TOLERANCE
            && dy <= GRID_SPACING + POSITION_TOLERANCE
            && dx <= POSITION_TOLERANCE;

        return horizontal || vertical;
    }
    private checkForMatch(row: number, col: number, spawner: MSTT_BlockSpawn, set: Set<Node>) {
        const currentBlock = spawner.blockArray[row][col];
        if (!currentBlock) return;
        const currentId = currentBlock.getComponent(MSTT_BlockSet)!.getBlockId();
        // 横向检测
        let left = col;
        while (left >= 0 && this.isSameId(row, left, currentId, spawner)) left--;
        let right = col;
        while (right < 8 && this.isSameId(row, right, currentId, spawner)) right++;

        // 纵向检测
        let up = row;
        while (up >= 0 && this.isSameId(up, col, currentId, spawner)) up--;
        let down = row;
        while (down < 7 && this.isSameId(down, col, currentId, spawner)) down++;
        //收集判定方块
        if (right - left - 1 >= 3) {
            for (let c = left + 1; c < right; c++) {
                if (c === col) continue;
                set.add(spawner.blockArray[row][c]!);
            }
            set.add(currentBlock);
        }

        if (down - up - 1 >= 3) {
            for (let r = up + 1; r < down; r++) {
                if (r === row) continue;
                set.add(spawner.blockArray[r][col]!);
            }
            set.add(currentBlock);
        }
    }

    private isSameId(row: number, col: number, targetId: number, spawner: MSTT_BlockSpawn): boolean {
        const block = spawner.blockArray[row][col];
        return block?.getComponent(MSTT_BlockSet)?.getBlockId() === targetId;
    }
}


