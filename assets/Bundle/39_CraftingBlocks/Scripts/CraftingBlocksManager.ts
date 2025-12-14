import { _decorator, Component, EventTouch, Node, Size, tween, v2, v3, Vec2, Vec3 } from 'cc';
import { CraftingBlocksItem } from './CraftingBlocksItem';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('CraftingBlocksManager')
export class CraftingBlocksManager extends Component {

    grid: CraftingBlocksGrid = null;
    items: CraftingBlocksItem[] = [];

    startPos: Vec2 = new Vec2();

    @property(Node)
    input: Node = null;

    @property(Node)
    blocks: Node = null;

    @property(CraftingBlocksItem)
    item: CraftingBlocksItem = null;

    onLoad() {
        this.input.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.input.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.input.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.grid = new CraftingBlocksGrid();
    }

    protected start(): void {
        this.item.Init(new CraftingBlocksBlockData(2, 2));
        this.grid.setItem(this.item);
        this.MoveBlock(this.item, v3(this.item.x, this.item.y))
    }

    Move(item: CraftingBlocksItem, dir: Vec2) {
        if (dir.x == 1) {
        }

        if (dir.x == -1) {

        }

        if (dir.y == 1) {

        }

        if (dir.y == -1) {

        }
    }

    MoveBlock(item: CraftingBlocksItem, axi: Vec3) {
        console.log(axi);
        let pos = this.blocks.children[axi.y].children[axi.x].worldPosition.clone();
        item.x = axi.x;
        item.y = axi.y;
        tween(item.node).to(0.2, { worldPosition: pos }).start();
    }

    onTouchStart(event: EventTouch) {
        this.startPos = event.getLocation(); //记录触摸起点

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if (item.IsInBoundingBox(event.getLocation())) {
                this.item = item;
                break;
            }
        }
    }

    onTouchMove(event: EventTouch) {
    }

    onTouchEnd(event: EventTouch) {
        let endPos = event.getLocation();
        let deltaX = endPos.x - this.startPos.x;
        let deltaY = endPos.y - this.startPos.y;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                this.MoveBlock(this.item, this.grid.GetTargetPos(this.item, "right"));
            } else {
                this.MoveBlock(this.item, this.grid.GetTargetPos(this.item, "left"));
            }
        } else {
            if (deltaY > 0) {
                this.MoveBlock(this.item, this.grid.GetTargetPos(this.item, "up"));
            } else {
                this.MoveBlock(this.item, this.grid.GetTargetPos(this.item, "down"));
            }
        }
    }

}

/**数据层 */
class CraftingBlocksGrid {

    maxRow: number = 6;
    maxCol: number = 7;

    private grid: (CraftingBlocksItem | null)[][] = [];

    constructor() {
        this.grid = new Array(6).fill(null).map(() => new Array(7).fill(null));
    }

    // 获取当前网格数据
    public getGrid(): (CraftingBlocksItem | null)[][] {
        return this.grid;
    }

    ClearBlock() {

    }

    GetTargetPos(item: CraftingBlocksItem, dir: string) {
        console.log(this.grid);
        let position: Vec3 = v3(item.x, item.y);

        switch (dir) {
            case "right":
                console.log(`right`);
                if (item.x + item.data.width == this.grid[item.y].length) return;
                for (let i = item.x + item.data.width; i < this.grid[item.y].length; i++) {
                    for (let j = 0; j < item.data.height; j++) {
                        let grid = this.grid[item.y + j][i];
                        if (grid != null) {
                            // console.error(,position);
                            return position;
                        }
                    }
                    position = v3(i - item.data.width, item.y);
                }
                console.error(position);
                return position;
            case "left":
                console.log(`left`);
                if (item.x == 0) return position;
                for (let i = item.x - 1; i >= 0; i--) {
                    for (let j = 0; j < item.data.height; j++) {
                        let grid = this.grid[item.y + j][i];
                        if (grid != null) return position;
                    }

                    position = v3(i, item.y);
                }
                return position;
            case "up":
                console.log(`up`);
                if (item.y == 0) return position;
                for (let i = item.y; i >= 0; i--) {
                    for (let j = 0; j < item.data.width; j++) {
                        let grid = this.grid[i][item.x];

                        if (grid != null) return position;
                    }
                    position = v3(item.x, i);
                }
                return position;
            case "down":
                console.log(`down`);
                if (item.y + item.data.height == this.maxRow) return position;
                for (let i = item.y + item.data.height; i < this.maxRow - item.data.height; i++) {
                    for (let j = 0; j < item.data.width; j++) {
                        let grid = this.grid[i][item.x];

                        if (grid != null) return position;
                    }
                    position = v3(item.x, i);
                }
                console.error(position);
                return position;
            default:
                break;
        }

    }

    // 更新网格数据
    public setItem(item: CraftingBlocksItem) {
        for (let col = item.x; col < item.x + item.data.height; col++) {
            for (let row = item.y; row < item.y + item.data.width; row++) {
                this.grid[row][col] = item;
            }
        }

        console.log(this.grid);
    }

    public removeItem(item: CraftingBlocksItem) {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                if (this.grid[row][col] === item) this.grid[row][col] = null;
            }
        }
    }
}


export class CraftingBlocksBlockData {
    constructor(public width: number = 1, public height: number = 1) {
        this.width = width;
        this.height = height;
    }

}