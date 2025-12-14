import { _decorator, Component, EventTouch, find, Node, UITransform, Vec3 } from 'cc';
import { BDSN_GameManager } from './BDSN_GameManager';
import { BDSN_Box } from './BDSN_Box';
const { ccclass, property } = _decorator;

@ccclass('BDSN_FoodTouch')
export class BDSN_FoodTouch extends Component {

    private gameArea: Node = null;
    private grids: Node = null;
    private startPos: Vec3 = new Vec3();
    private originalPositions: Map<Node, Vec3> = new Map(); // 存储所有节点的初始位置

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected start(): void {
        this.gameArea = find("Canvas/GameArea");
        this.grids = find("Canvas/GameArea/Grids");
    }

    private Allbox: Node[] = [];

    onTouchStart(event: EventTouch) {
        // 检查gridNodes是否已初始化
        if (!BDSN_GameManager.instance.gridNodes ||
            BDSN_GameManager.instance.gridNodes.length === 0) {
            console.error("Grid nodes not initialized");
            return;
        }

        this.Allbox = [];
        const pos = event.getUILocation();
        this.startPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));
        // 存储所有节点的初始位置
        this.originalPositions.clear();
        BDSN_GameManager.instance.bds.forEach(bd => {
            this.originalPositions.set(bd, bd.position.clone());
        });
        this.Allbox.push(this.node);
        this.FinAllBox(this.node)
        console.log(this.Allbox);
    }

    FinAllBox(boxNode: Node) {
        const com = boxNode.getComponent(BDSN_Box);
        const x = com.x;
        const y = com.y;
        const l = com.left;
        const r = com.right;
        const t = com.top;
        const b = com.bottom;

        if (l) {
            // 检查y-1是否在有效范围内
            if (y - 1 >= 0 && BDSN_GameManager.instance.gridNodes[x]) {
                let nd = BDSN_GameManager.instance.gridNodes[x][y - 1];
                if (nd && this.Allbox.indexOf(nd) == -1) {
                    this.Allbox.push(nd);
                    this.FinAllBox(nd);
                }
            }
        }
        if (r) {
            // 检查y+1是否在有效范围内
            if (y + 1 < 10 && BDSN_GameManager.instance.gridNodes[x]) {
                let nd = BDSN_GameManager.instance.gridNodes[x][y + 1];
                if (nd && this.Allbox.indexOf(nd) == -1) {
                    this.Allbox.push(nd);
                    this.FinAllBox(nd);
                }
            }
        }
        if (t) {
            // 检查x-1是否在有效范围内
            if (x - 1 >= 0 && BDSN_GameManager.instance.gridNodes[x - 1]) {
                let nd = BDSN_GameManager.instance.gridNodes[x - 1][y];
                if (nd && this.Allbox.indexOf(nd) == -1) {
                    this.Allbox.push(nd);
                    this.FinAllBox(nd);
                }
            }
        }
        if (b) {
            // 检查x+1是否在有效范围内
            if (x + 1 < 10 && BDSN_GameManager.instance.gridNodes[x + 1]) {
                let nd = BDSN_GameManager.instance.gridNodes[x + 1][y];
                if (nd && this.Allbox.indexOf(nd) == -1) {
                    this.Allbox.push(nd);
                    this.FinAllBox(nd);
                }
            }
        }
    }

    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        const currentPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));

        // 计算偏移量
        const offsetX = currentPos.x - this.startPos.x;
        const offsetY = currentPos.y - this.startPos.y;

        // 应用偏移量到所有节点
        this.Allbox.forEach(bd => {
            const originalPos = this.originalPositions.get(bd);
            if (originalPos) {
                bd.setPosition(originalPos.x + offsetX, originalPos.y + offsetY);
            }
        });
    }

    // onTouchEnd(event: EventTouch) {
    //     // 松开时可以将节点吸附到最近的网格位置
    //     BDSN_GameManager.instance.bds.forEach(bd => {
    //         const nearestGridNode = this.getNearestGridNode(bd.position);
    //         if (nearestGridNode) {
    //             const worldPos = nearestGridNode.getWorldPosition();
    //             const localPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
    //             bd.setPosition(localPos);
    //         }
    //     });
    // }
    onTouchEnd(event: EventTouch) {
        // 记录是否所有食物块都能放置
        let canPlaceAll = true;

        // 先检查所有食物块是否能放置
        this.Allbox.forEach(bd => {
            const nearestGridNode = this.getNearestGridNode(bd.position);
            if (nearestGridNode) {
                const gridIndex = this.grids.children.indexOf(nearestGridNode);
                if (gridIndex !== -1) {
                    const newRow = Math.floor(gridIndex / 10);
                    const newCol = gridIndex % 10;

                    // 检查目标位置是否已有食物
                    if (BDSN_GameManager.instance.gridNodes[newRow][newCol] !== null) {
                        canPlaceAll = false;
                    }
                }
            }
        });

        if (canPlaceAll) {
            // 如果可以放置，则更新位置
            this.Allbox.forEach(bd => {
                const nearestGridNode = this.getNearestGridNode(bd.position);
                if (nearestGridNode) {
                    const worldPos = nearestGridNode.getWorldPosition();
                    const localPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
                    bd.setPosition(localPos);

                    const boxCom = bd.getComponent(BDSN_Box);
                    if (boxCom) {
                        const gridIndex = this.grids.children.indexOf(nearestGridNode);
                        if (gridIndex !== -1) {
                            const newRow = Math.floor(gridIndex / 10);
                            const newCol = gridIndex % 10;
                            const oldRow = boxCom.x;
                            const oldCol = boxCom.y;

                            // 更新旧位置为null
                            if (oldRow >= 0 && oldCol >= 0 && (oldRow !== newRow || oldCol !== newCol)) {
                                BDSN_GameManager.instance.gridNodes[oldRow][oldCol] = null;
                            }

                            // 更新新位置
                            boxCom.x = newRow;
                            boxCom.y = newCol;
                            BDSN_GameManager.instance.gridNodes[newRow][newCol] = bd;
                        }
                    }
                }
            });

            // 检查胜利条件
            if (BDSN_GameManager.instance.checkWinCondition()) {
                if (BDSN_GameManager.instance.level >= 5) {
                    BDSN_GameManager.instance.gamePanel.Win();
                } else {
                    BDSN_GameManager.instance.nextBtn.active = true;
                    BDSN_GameManager.instance.mask.active = true;
                }
            }
        } else {
            // 如果不能放置，则复位
            this.Allbox.forEach(bd => {
                const originalPos = this.originalPositions.get(bd);
                if (originalPos) {
                    bd.setPosition(originalPos);
                }
            });
        }
    }

    private getNearestGridNode(currentPos: Vec3): Node | null {
        if (!this.grids || this.grids.children.length === 0) {
            return null;
        }

        let nearestNode: Node = null;
        let minDistance = Number.MAX_VALUE;

        for (const gridNode of this.grids.children) {
            const gridPos = gridNode.getPosition();
            const distance = Vec3.distance(currentPos, gridPos);

            if (distance < minDistance) {
                minDistance = distance;
                nearestNode = gridNode;
            }
        }

        return nearestNode;
    }
}