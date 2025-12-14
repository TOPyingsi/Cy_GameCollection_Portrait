import { _decorator, BoxCollider2D, Button, Component, director, ERigidBody2DType, error, EventTouch, find, Input, instantiate, Label, Node, PostSettingsInfo, Prefab, resources, size, Size, TiledMap, tween, Tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { AStar_Node_Type, AStarManager, AStarNode } from 'db://assets/Scripts/Framework/Algorithm/AStar';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
const { ccclass, property } = _decorator;


const v2_1 = v2();
const v3_1 = v3();
@ccclass('DMM_NpcManager')
export class DMM_NpcManager extends Component {
    @property(TiledMap)
    tiledMap: TiledMap | null = null;
    @property(Node)
    NpcArray: Node[] = [];
    AStarTrans: UITransform | null = null;



    lastNode: AStarNode = null;
    speed: number = 200;
    gridSize: number = 50;
    canvasHeight: number = 2350;

    redDots: Node[] = [];
    map: Node[] = [];
    obstacleMap: Node[] = [];//标记为障碍物的节点

    endPosition: Vec2 = new Vec2();
    PlayerStartPos: Vec3 = null;
    NpcStartPos: Vec3[] = [];
    public static Instance: DMM_NpcManager = null;

    protected onLoad(): void {
        DMM_NpcManager.Instance = this;
        this.AStarTrans = this.tiledMap.node.getChildByName("AStar").getComponent(UITransform);
        this.InitMap();
    }
    start() {
        this.hideNode = find("Canvas/BG/躲藏选择");
    }
    update(deltaTime: number) {

    }

    hideNode: Node = null;
    Zancun: Node = null;
    Chasing(node: Node, path: AStarNode[]) {
        if (!path) return;

        let index = path.some(e => e == this.lastNode) ? 1 : 0;

        if (path.length <= 0) {
            this.hideNode.children.forEach(e => {
                for (let i = 0; i < this.NpcArray.length; i++) {
                    let Distance: number = Vec3.distance(e.worldPosition, this.NpcArray[i].worldPosition);

                    if (Distance < 50) {
                        this.Zancun = e;
                        if (!e.active) {
                            for (let j = 0; j < this.hideNode.children.length; j++) {
                                if (this.hideNode.children[j].active == true) {
                                    this.CheckDown(this.hideNode.children[j].worldPosition, this.NpcArray[i]);
                                }
                            }
                        }
                        else {
                            e.getComponent(Button).interactable = false;
                        }

                    }
                }


            });
        }

        for (let i = index; i < path.length; i++) {
            const e = path[i];
            Tween.stopAllByTarget(node);
            this.lastNode = e;

            let position = this.GetPositionByAStarPoint(v2(e.x, e.y));
            let worldPosition = this.AStarTrans.convertToWorldSpaceAR(v3(position.x, position.y));
            let time = Vec3.distance(node.worldPosition, worldPosition) / this.speed;

            tween(node).to(time, { worldPosition: worldPosition }).call(() => {
                path.splice(0, path.indexOf(e) + 1)
                this.Chasing(node, path);
            }).start();

            break;
        }
    }

    InitMap() {
        AStarManager.Instance.InitMapInfo(this.tiledMap.getLayer(`Map`).getLayerSize().width, this.tiledMap.getLayer(`Map`).getLayerSize().height);

        //Astar 寻路层 - 用于寻路
        let layer = this.tiledMap.getLayer(`AStar`);
        for (let i = 0; i < layer.getLayerSize().width; i++) {
            for (let j = 0; j < layer.getLayerSize().height; j++) {
                let tiled = layer.getTiledTileAt(i, j, true);
                AStarManager.Instance.SetMap(i, j, tiled.grid != 0 ? AStar_Node_Type.Obstacle : AStar_Node_Type.Normal);
                this.map.push(tiled.node);

                if (tiled.grid != 0) {

                    // resources.load("Label", Prefab, (err, prefab) => {
                    //     let nd = instantiate(prefab);
                    //     this.Player.parent.addChild(nd);
                    //     let point = this.GetPositionByAStarPoint(v2(i, j));
                    //     nd.getComponent(Label).string = `■`;
                    //     nd.setWorldPosition(this.AStarTrans.convertToWorldSpaceAR(v3(point.x, point.y)));
                    // });

                    this.obstacleMap.push(tiled.node);
                }
            }
        }
    }

    //玩家在标记为障碍物的位置时不寻路
    CanArrive(pos: Vec2): boolean {
        let x = Math.floor(pos.x / this.gridSize) * this.gridSize;
        let y = Math.floor(pos.y / this.gridSize) * this.gridSize;
        const result = this.obstacleMap.find(e => e.position.x == x && e.position.y == y);

        if (result) {
            return false;
        }

        return true;
    }

    /**把A*数组位标转化成局部坐标 */
    GetPositionByAStarPoint(point: Vec2): Vec2 {
        return v2(point.x * this.gridSize + this.gridSize / 2, (this.canvasHeight / this.gridSize - point.y - 1) * this.gridSize + this.gridSize / 2);
    }

    /**把局部坐标转化成A*数组位标 */
    GetAStarPointByPosition(pos: Vec2) {
        return v2(Math.floor(pos.x / this.gridSize), this.canvasHeight / this.gridSize - Math.floor(pos.y / this.gridSize) - 1);
    }
    /*将npc挨个启动让其找到躲藏点*/
    NpcHide() {
        for (let i = 0; i < this.NpcArray.length; i++) {
            if (this.hideNode.children[i].active) {
                const HideNode = this.hideNode.children[i].getWorldPosition();
                this.CheckDown(HideNode, this.NpcArray[i]);
            }
            else {

            }
        }
    }
    NpcReturn() {
        for (let i = 0; i < this.NpcArray.length; i++) {
            this.NpcArray[i].setWorldPosition(find("Canvas/BG/起始位置").children[i].worldPosition);

        }
    }
    //#endregion
    CheckDown(pos: Vec3, node: Node) {
        if (this.Zancun) {
            this.Zancun.active = true;
        }
        v3_1.set(pos.x, pos.y);
        v3_1.set(this.AStarTrans.convertToNodeSpaceAR(v3_1))
        v2_1.set(v3_1.x, v3_1.y);

        if (!this.CanArrive(v2_1)) {
            console.log("目标不可达");
            return;
        }

        v3_1.set(this.AStarTrans.convertToNodeSpaceAR(node.worldPosition.clone()))
        let start = this.GetAStarPointByPosition(v2(v3_1.x, v3_1.y));
        let end = this.GetAStarPointByPosition(v2_1);

        let path = AStarManager.Instance.FindPath(start, end);
        console.log("目标可达", path);

        this.Chasing(node, path);
    }

}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


