import { _decorator, BoxCollider, Collider2D, Color, Component, Contact2DType, EventTouch, find, IPhysics2DContact, Node, Sprite, tween, UITransform, v3, Vec2, Vec3 } from 'cc';
import { FJPT_PuzzleType } from './FJPT_PuzzleType';
import { GridManager } from './FJPT_GridManager';
import { FJPT_GridSence } from './FJPT_GridSence';
import { FJPT__GameManager } from './FJPT_ GameManager';
const { ccclass, property } = _decorator;

@ccclass('FJPT_PuzzlePiece')
export class FJPT_PuzzlePiece extends Component {
    @property(Node)
    whiteGridContainer: Node = null;
    private isDragging: boolean = null;
    private initialPosition: Vec3 = new Vec3();
    private puzzleType: number[][] = null;
    private resetDragging: boolean = false;
    private _cells: Node[] = [];
    private NodeLevel: number = 0;
    private TouchMoves: boolean = false;
    onLoad() {
        this.puzzleType = FJPT_PuzzleType[this.node.name].grid;
        this.initialPosition = this.node.worldPosition.clone();
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    start() {
    }


    onTouchStart(event: EventTouch) {
        this.isDragging = true;
        if (this.resetDragging == true) {
            this.resetGirdState();


        }
        if (this.node.parent.name == "content") {
            for (let i = 0; i < this.node.parent.children.length; i++) {
                if (this.node.parent.children[i].name == this.node.name) {
                    this.NodeLevel = i;
                    break;
                }
            }
            find("Canvas/BG/底层").addChild(this.node);
        }
    }

    onTouchMove(event: EventTouch) {
        if (this.isDragging) {
            const pos = event.getUILocation()
            this.node.worldPosition = v3(pos.x - 100, pos.y + 120, 0);
            const canPlace = this.checkPlacement();
            this.resetGridColor();
            this.ChangeColorMove();
            this.TouchMoves = true;
        }
    }


    onTouchEnd() {
        this.isDragging = false;


        const canPlace = this.checkPlacement();

        if (canPlace) {
            if (this.TouchMoves == true) {
                this.alignToNearestGrid();
                this.updateGridState();
                FJPT__GameManager.Instance.WinorLose();
            }
        } else {

            let i = this.NodeLevel;
            find("Canvas/BG/底层/ScrollView/view/content").addChild(this.node);
            this.node.setSiblingIndex(i);
            this.node.worldPosition = this.initialPosition;

        }
        this.resetGridColor();

        this.TouchMoves = false;
    }

    checkPlacement(): boolean {
        // 获取拼图块的左上角位置
        const puzzleLeft = this.node.position.x;
        const puzzleBottom = -this.node.position.y;
        // 遍历拼图块的二维数组
        this._cells = [];
        for (let i = 0; i < this.puzzleType.length; i++) {
            for (let j = 0; j < this.puzzleType[i].length; j++) {
                if (this.puzzleType[i][j] === 1) {
                    // 计算拼图块当前覆盖的白格子位置
                    const gridX = Math.round((puzzleLeft + j * 100) / 100);
                    const gridY = Math.round((puzzleBottom + i * 100) / 100);

                    if (gridX >= 0 && gridX < 10 && gridY >= 0 && gridY < 12 && FJPT_GridSence.Instance.gridManager.grid[gridY][gridX] != 1) {

                        this.whiteGridContainer.children[(gridX + 1) + (gridY * 10) - 1].getComponent(Sprite).color = Color.GREEN;

                        this._cells.push(this.whiteGridContainer.children[(gridX + 1) + (gridY * 10) - 1]);



                    }


                    // 检查是否超出边界或已被占用
                    if (gridX < 0 || gridX >= 10 || // 超出水平边界
                        gridY < 0 || gridY >= 12 || // 超出垂直边界
                        FJPT_GridSence.Instance.gridManager.grid[gridY][gridX] == 1 // 格子已被占用
                    ) {

                        return false;
                    }
                }
            }
        }
        return true;
    }
    Other(number: number): number[] {
        let allNumbers: number[] = Array.from({ length: 120 }, (_, i) => i); // 生成0到119的数字数组
        allNumbers = allNumbers.filter(item => item !== number)
        return allNumbers
    }

    /**
     *         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
               [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
               [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
               [1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
               [0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
               [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
               [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
               [0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
               [1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
               [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
               [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
               [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
     */

    // 对齐到最近的白格子
    alignToNearestGrid() {
        const gridX = Math.round(this.node.position.x / 100);
        const gridY = Math.round(this.node.position.y / 100);
        tween(this.node)
            .to(0, { position: v3(this.node.position.x, this.node.position.y) })
            .to(0.3, { position: v3(gridX * 100, gridY * 100) })
            // this.node.position = v3(gridX * 100, gridY * 100, 0);
            .start();

    }

    // 更新白格子状态
    updateGridState() {
        const puzzleLeft = this.node.position.x;
        const puzzleBottom = -this.node.position.y;

        // 遍历拼图块的二维数组
        for (let i = 0; i < this.puzzleType.length; i++) {
            for (let j = 0; j < this.puzzleType[i].length; j++) {
                if (this.puzzleType[i][j] === 1) {
                    // 计算拼图块当前覆盖的白格子位置
                    const gridX = Math.round((puzzleLeft + j * 100) / 100);
                    const gridY = Math.round((puzzleBottom + i * 100) / 100);
                    // 标记白格子为已占用
                    FJPT_GridSence.Instance.gridManager.grid[gridY][gridX] = 1;
                    this.resetDragging = true;
                }
            }
        }
    }
    resetGirdState() {
        const puzzleLeft = this.node.position.x;
        const puzzleBottom = -this.node.position.y;

        // 遍历拼图块的二维数组
        for (let i = 0; i < this.puzzleType.length; i++) {
            for (let j = 0; j < this.puzzleType[i].length; j++) {
                if (this.puzzleType[i][j] === 1) {
                    // 计算拼图块当前覆盖的白格子位置
                    const gridX = Math.round((puzzleLeft + j * 100) / 100);
                    const gridY = Math.round((puzzleBottom + i * 100) / 100);
                    // 标记白格子为已释放
                    FJPT_GridSence.Instance.gridManager.grid[gridY][gridX] = 0;
                    this.resetDragging = false;
                }
            }
        }
    }
    //颜色更改
    resetGridColor() {
        this.whiteGridContainer.children.forEach(grid => {
            grid.getComponent(Sprite).color = Color.WHITE;
        });
    }

    ChangeColorMove() {
        this._cells.forEach(e => {
            e.getComponent(Sprite).color = Color.GREEN;
        })
    }
}


