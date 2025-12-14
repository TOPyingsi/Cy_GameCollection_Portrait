import { _decorator, CCInteger, Component, director, EventTouch, Input, math, Node, tween, Vec2, Vec3 } from 'cc';
import { grid } from './grid';
import { prefabsManager } from './prefabsManager';
const { ccclass, property } = _decorator;

@ccclass('ObjectController')
export class ObjectController extends Component {

    width: number;
    height: number;
    Level: number;

    startMove: Vec2;
    endMove: Vec2;

    moveDir: Vec2;
    Grid: grid;

    gridpos: Vec2;

    moveOver: boolean = true;

    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Input.EventType.TOUCH_END, this.TOUCH_END, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.TOUCH_CANCEL, this);
    }

    setGrid(_grid: grid) {
        this.Grid = _grid;
    }

    TOUCH_START(event: EventTouch) {
        this.startMove = event.getUILocation();
    }

    TOUCH_CANCEL(event: EventTouch) {
        this.work(event);
    }

    TOUCH_END(event: EventTouch) {
        this.work(event);
    }

    private work(event: EventTouch) {
        if (this.moveOver == false) return;
        this.moveOver = false;
        this.endMove = event.getUILocation();
        let d = this.endMove.subtract(this.startMove).clone();
        if (Math.abs(d.x) > Math.abs(d.y)) {
            if (d.x < 0) d.x = -1;
            else d.x = 1;
            d.y = 0;
        } else {
            if (d.y < 0) d.y = -1;
            else d.y = 1;
            d.x = 0;
        }
        this.Grid.RefreeArea(this.gridpos.x, this.gridpos.y, this.width, this.height);
        console.log(this.gridpos.x + " , " + this.gridpos.y);
        let x, y;
        let move = false;
        let needToFind = false;
        for (x = this.gridpos.x, y = this.gridpos.y; x + this.width - 1 < this.Grid.width && y + this.height - 1 < this.Grid.height && x >= 0 && y >= 0; x += d.x, y += d.y) {
            console.log(x + " ---- " + y);
            if (this.Grid.isThisAreaOccupy(x, y, this.width, this.height) == 0) {
                needToFind = true;
                break;
            }
            move = true;
        }
        // for (let u = x; u <= x + this.width - 1; u++){
        //     for (let v = x; v)
        // }
        console.log(x, y);
        let g = x, z = y;
        if (d.x && needToFind) {
            console.log("F1");
            for (let u = x; Math.abs(u - x) < this.width && u < this.Grid.width && u >= 0; u += d.x) {
                let v = y;
                if (this.Grid.getGridController(u, v) != null && this.Grid.getGridController(u, v).Level == this.Level) {
                    x = u, y = v;
                    break;
                }
            }
            console.log(x, y);
        }
        if (d.y && needToFind) {
            console.log("F2");
            for (let v = y; Math.abs(v - y) < this.height && v < this.Grid.height && v >= 0; v += d.y) {
                let u = x;
                console.log("XXX");
                if (this.Grid.getGridController(u, v) != null && this.Grid.getGridController(u, v).Level == this.Level) {
                    x = u, y = v;
                    break;
                }
            }
            console.log(x, y);
        }
        let controller = this.Grid.getGridController(x, y);
        console.log(controller);
        if (x >= 0 && y >= 0 && x < this.Grid.width && y < this.Grid.height && this.Grid.getGridController(x, y) != null && this.Grid.getGridController(x, y).Level == this.Level && (controller.gridpos.x == this.gridpos.x || controller.gridpos.y == this.gridpos.y)) {
            console.log("CNM");
            if (this.Level + 1 < prefabsManager.instance.objectInfo[prefabsManager.instance.currentLevel].length) {
                let xx = x, yy = y;
                x = this.Grid.getGridController(x, y).gridpos.x;
                y = this.Grid.getGridController(x, y).gridpos.y;
                this.Grid.RefreeArea(x, y, this.width, this.height);
                console.log(controller);
                let nextW = prefabsManager.instance.objectInfo[prefabsManager.instance.currentLevel][this.Level + 1].x;
                let nextH = prefabsManager.instance.objectInfo[prefabsManager.instance.currentLevel][this.Level + 1].y;

                let dx = [0, nextW - 1, -(nextW - 1), 0, -(nextW - 1)];
                let dy = [0, nextH - 1, 0, -(nextH - 1), -(nextH - 1)];
                let haveArea = false;
                console.log(x + " , " + y);
                let u = x, v = y;
                for (let k = 0; k < 4; k++) {
                    u = x + dx[k], v = y + dy[k];
                    if (u < this.Grid.width && u >= 0 && v < this.Grid.height && v >= 0 && this.Grid.isThisAreaOccupy(u, v, nextW, nextH) == 1) {
                        haveArea = true;
                        break;
                    }
                }
                if (haveArea) {
                    // 有位置放置
                    let finalPos = this.Grid.getCelltoWorldPosition(new Vec3(xx, yy, 0));
                    let dd = Math.max(Math.abs(this.node.worldPosition.x - finalPos.x), Math.abs(this.node.worldPosition.y - finalPos.y));
                    console.log(dd);
                    tween(this.node).to(dd / 1000, { worldPosition: finalPos }).call(() => {
                        console.log("FUCK");
                        prefabsManager.instance.build(this.Level + 1, u, v);
                        console.log(this.Grid.width + " , " + this.Grid.height);
                        for (let i = this.Grid.height - 1; i >= 0; i--) {
                            let s = "";
                            for (let j = 0; j < this.Grid.width; j++) {
                                s += this.Grid.isGridOccupy(j, i);
                                s += " , ";
                            }
                            s += "AAAAAA" + i;
                            console.log(s);
                        }

                        if (this.Level + 1 == prefabsManager.instance.objectInfo[prefabsManager.instance.currentLevel].length - 1) {
                            director.getScene().emit("Win");
                        }
                        this.moveOver = true;
                        controller.node.destroy();
                        this.node.destroy();
                    }).start();

                } else {
                    console.log("没位置合成更大的方块了");
                    director.getScene().emit("Tip");
                    // 合并生成的方块没有位置
                    this.Grid.OccupyArea(x, y, this.width, this.height, controller);
                    x = g, y = z;
                    x -= d.x;
                    y -= d.y;
                    if (!move) {
                        x = this.gridpos.x;
                        y = this.gridpos.y;
                    }

                    this.Grid.OccupyArea(x, y, this.width, this.height, this);
                    console.log(this.Grid.width + " , " + this.Grid.height);
                    for (let i = this.Grid.height - 1; i >= 0; i--) {
                        let s = "";
                        for (let j = 0; j < this.Grid.width; j++) {
                            s += this.Grid.isGridOccupy(j, i);
                            s += " , ";
                        }
                        s += "AAAAAA" + i;
                        console.log(s);
                    }

                    let finalPos = this.Grid.getCelltoWorldPosition(new Vec3(x, y, 0));
                    let dd = Math.max(Math.abs(this.node.worldPosition.x - finalPos.x), Math.abs(this.node.worldPosition.y - finalPos.y));
                    console.log(dd);
                    tween(this.node).to(dd / 1000, { worldPosition: finalPos }).call(() => {
                        this.moveOver = true;
                        this.gridpos = new Vec2(x, y);
                    }).start();
                }
            }

        } else {
            console.log("hhhh");
            x = g, y = z;
            x -= d.x;
            y -= d.y;
            if (!move) {
                x = this.gridpos.x;
                y = this.gridpos.y;
            }
            this.Grid.OccupyArea(x, y, this.width, this.height, this);
            console.log(this.Grid.width + " , " + this.Grid.height);
            for (let i = this.Grid.height - 1; i >= 0; i--) {
                let s = "";
                for (let j = 0; j < this.Grid.width; j++) {
                    s += this.Grid.isGridOccupy(j, i);
                    s += " , ";
                }
                s += "AAAAAA" + i;
                console.log(s);
            }

            let finalPos = this.Grid.getCelltoWorldPosition(new Vec3(x, y, 0));
            let dd = Math.max(Math.abs(this.node.worldPosition.x - finalPos.x), Math.abs(this.node.worldPosition.y - finalPos.y));
            console.log(dd);
            tween(this.node).to(dd / 1000, { worldPosition: finalPos }).call(() => {
                this.moveOver = true;
                this.gridpos = new Vec2(x, y);
            }).start();
        }
    }

    protected onDisable(): void {

    }
}


