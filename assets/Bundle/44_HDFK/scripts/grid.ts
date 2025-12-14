import { _decorator, Component, Node, UITransform, Vec2, Vec3 } from 'cc';
import { ObjectController } from './ObjectController';
import { prefabsManager } from './prefabsManager';
const { ccclass, property } = _decorator;

@ccclass('grid')
export class grid extends Component {
    @property(Vec2)
    cellSize: Vec2 = null; // worldpos

    originPoint: Vec3 = Vec3.ONE; // worldpos

    width : number;
    height : number;

    gridMap: Array<boolean> = new Array<boolean>; 
    ControllerMap : Array<ObjectController> = new Array<ObjectController>;

    protected onLoad(): void {
        this.originPoint = this.node.getWorldPosition();
        console.log(this.originPoint);
        this.width = this.node.getComponent(UITransform).width / this.cellSize.x;
        this.height = this.node.getComponent(UITransform).height / this.cellSize.y;  
        console.log(this.width + " , " +  this.height);
        this.gridMap = new Array<boolean>(this.width * this.height);
        this.ControllerMap = new Array<ObjectController>(this.width * this.height);
        this.gridMap.fill(false, 0, this.width * this.height - 1);
        for (let i = 0; i < this.width * this.height; i++){
            this.gridMap[i] = false;
            this.ControllerMap[i] = null;
        }
        // this.ControllerMap.fill(null, 0, this.width * this.height - 1);
        prefabsManager.instance.Grid = this;
    }

    protected start(): void {
    }

    getWorldtoCellPosition(pos: Vec3): Vec3 {
        // console.log(Math.floor(pos.subtract(this.originPoint).y / this.cellSize.y));
        return (new Vec3(Math.floor(pos.clone().subtract(this.originPoint).x / this.cellSize.x), Math.floor(pos.clone().subtract(this.originPoint).y / this.cellSize.y), 0));
    }

    getCelltoWorldPosition(pos: Vec3): Vec3 {
        return (new Vec3(pos.x * this.cellSize.x, pos.y * this.cellSize.y)).add(this.originPoint);
    }

    
    isGridOccupy(x: number, y: number) {
        return this.gridMap[this.getGridMapIndex(x, y)];
    }

    getGridMapIndex(x : number, y : number) : number{
        return (y * this.width + x);
    }

    getGridpos(idx : number){
        return new Vec2(idx % this.width, Math.floor(idx / this.width));
    }

    setGridtype(x: number, y: number, type: boolean) {
        this.gridMap[this.getGridMapIndex(x, y)] = type;
    }

    setGridController(x : number, y : number, controller : ObjectController){
        this.ControllerMap[this.getGridMapIndex(x, y)] = controller;
    }

    getGridController(x : number, y : number){
        return this.ControllerMap[this.getGridMapIndex(x, y)];
    }

    isThisAreaOccupy(x: number, y: number, w: number, h: number) { // 考虑grid坐标，以（x，y）为左下角的矩形是否空旷
        if (x + w - 1 >= this.width) return -1;
        if (y + h - 1 >= this.height) return -1;
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                if (this.isGridOccupy(i, j)) {
                    console.log(i + " , " + j + "   is occupy");
                    return 0;
                }
            }
        }
        return 1;
    }

    OccupyArea(x: number, y: number, w: number, h: number, controller : ObjectController) { // 占据以（x，y）为左下角的矩形
        if (this.isThisAreaOccupy(x, y, w, h) == 0) {
            console.log("Fail Occupy");
            return false;
        }
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.setGridtype(i, j, true);
                this.setGridController(i, j, controller);
            }
        }
        return true;
    }

    RefreeArea(x : number, y : number, w : number, h :number){
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.setGridtype(i, j, false);
                this.setGridController(i, j, null);
            }
        }
    }

    clearEverything(){
        this.RefreeArea(0, 0, this.width, this.height); 
    }
}


