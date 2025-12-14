import { _decorator, Component, EventTouch, find, Node, UITransform, Vec3, director, CCInteger } from 'cc';
import { BDSN_GameManager } from './BDSN_GameManager';
import { BDSN_Box } from './BDSN_Box';
const { ccclass, property } = _decorator;

@ccclass('BDSN_KnifeTouch')
export class BDSN_KnifeTouch extends Component {

    /**false 表示竖着 true 表示横着 */
    @property({ type: Boolean, displayName: "不选表示竖着 勾选表示横着" }) direction: boolean = false;
    @property(CCInteger) size: number = 0;
    @property(Node) gameArea: Node = null;
    @property(Node) grids: Node = null; // 添加对 grids 节点的引用

    private startPos: Vec3 = new Vec3();

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const pos = event.getUILocation();
        this.startPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));
    }

    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));
        this.node.setPosition(touchMovePos);
    }

    onTouchEnd(event: EventTouch) {
        const pos = event.getUILocation();
        const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));

        // 找到最近的网格节点
        const nearestGridNode = this.getNearestGridNode(touchMovePos);
        if (nearestGridNode) {
            const worldPos = nearestGridNode.getWorldPosition();
            const localPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(worldPos);

            // 判断松开位置是在最近网格节点的左半边还是右半边
            const gridCenterX = localPos.x;
            const touchX = touchMovePos.x;


            if (this.size % 2 == 0) {
                if (touchX < gridCenterX) {
                    // 左半边
                    this.node.setPosition(localPos.x - 50, localPos.y - 50);
                } else {
                    // 右半边
                    this.node.setPosition(localPos.x + 50, localPos.y - 50);
                }
            } else {
                if (!this.direction) {
                    if (touchX < gridCenterX) {
                        // 左半边
                        this.node.setPosition(localPos.x + 50, localPos.y);
                    } else {
                        // 右半边
                        this.node.setPosition(localPos.x + 50, localPos.y);
                    }
                } else {
                    if (touchX < gridCenterX) {
                        // 左半边
                        this.node.setPosition(localPos.x, localPos.y + 50);
                    } else {
                        // 右半边
                        this.node.setPosition(localPos.x, localPos.y + 50);
                    }
                }
            }
        }
    }

    // onTouchEnd(event: EventTouch) {
    //     const pos = event.getUILocation();
    //     const touchMovePos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(pos.x, pos.y));

    //     // 找到最近的网格节点
    //     const nearestGridNode = this.getNearestGridNode(touchMovePos);
    //     if (nearestGridNode) {
    //         const worldPos = nearestGridNode.getWorldPosition();
    //         const localPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(worldPos);

    //         // 判断松开位置是在最近网格节点的哪个部分
    //         const gridCenterX = localPos.x;
    //         const gridCenterY = localPos.y;
    //         const touchX = touchMovePos.x;
    //         const touchY = touchMovePos.y;

    //         // 网格节点的宽度和高度（假设为正方形）
    //         const gridSize = nearestGridNode.getComponent(UITransform).width // 或者使用 nearestGridNode.height

    //         // 判断触摸位置在网格节点的哪个部分
    //         let finalPosX = localPos.x;
    //         let finalPosY = localPos.y;

    //         if (this.size % 2 == 0) {
    //             if (touchX < gridCenterX) {
    //                 // 左半边
    //                 this.node.setPosition(localPos.x - 50, localPos.y - 50);
    //             } else {
    //                 // 右半边
    //                 this.node.setPosition(localPos.x + 50, localPos.y - 50);
    //             }
    //         } else {
    //             if (!this.direction) {
    //                 if (touchX < gridCenterX) {
    //                     // 左半边
    //                     this.node.setPosition(localPos.x + 50, localPos.y);
    //                 } else {
    //                     // 右半边
    //                     this.node.setPosition(localPos.x + 50, localPos.y);
    //                 }
    //             } else {
    //                 if (touchX < gridCenterX) {
    //                     // 左半边
    //                     this.node.setPosition(localPos.x, localPos.y + 50);
    //                 } else {
    //                     // 右半边
    //                     this.node.setPosition(localPos.x, localPos.y + 50);
    //                 }
    //             }
    //         }


    //         if (this.direction) { // 横着
    //             if (touchY < gridCenterY) {
    //                 // 上半边
    //                 if (touchX < gridCenterX) {
    //                     // 左上角
    //                     finalPosX = localPos.x - gridSize / 2;
    //                     finalPosY = localPos.y - gridSize / 2;
    //                 } else {
    //                     // 右上角
    //                     finalPosX = localPos.x + gridSize / 2;
    //                     finalPosY = localPos.y - gridSize / 2;
    //                 }
    //             } else {
    //                 // 下半边
    //                 if (touchX < gridCenterX) {
    //                     // 左下角
    //                     finalPosX = localPos.x - gridSize / 2;
    //                     finalPosY = localPos.y + gridSize / 2;
    //                 } else {
    //                     // 右下角
    //                     finalPosX = localPos.x + gridSize / 2;
    //                     finalPosY = localPos.y + gridSize / 2;
    //                 }
    //             }
    //         } else { // 竖着
    //             if (touchX < gridCenterX) {
    //                 // 左半边
    //                 if (touchY < gridCenterY) {
    //                     // 左上角
    //                     finalPosX = localPos.x - gridSize / 2;
    //                     finalPosY = localPos.y + gridSize / 2;
    //                 } else {
    //                     // 左下角
    //                     finalPosX = localPos.x - gridSize / 2;
    //                     finalPosY = localPos.y - gridSize / 2;
    //                 }
    //             } else {
    //                 // 右半边
    //                 if (touchY < gridCenterY) {
    //                     // 右上角
    //                     finalPosX = localPos.x + gridSize / 2;
    //                     finalPosY = localPos.y + gridSize / 2;
    //                 } else {
    //                     // 右下角
    //                     finalPosX = localPos.x + gridSize / 2;
    //                     finalPosY = localPos.y - gridSize / 2;
    //                 }
    //             }
    //         }

    //         // 设置最终位置
    //         this.node.setPosition(finalPosX, finalPosY);
    //     }
    // }

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