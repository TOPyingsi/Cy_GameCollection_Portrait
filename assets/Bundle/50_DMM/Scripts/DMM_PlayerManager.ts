import { _decorator, BoxCollider2D, Button, Component, ERigidBody2DType, error, EventTouch, find, Input, instantiate, Label, Node, PostSettingsInfo, Prefab, resources, size, Size, TiledMap, tween, Tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { AStar_Node_Type, AStarManager, AStarNode } from 'db://assets/Scripts/Framework/Algorithm/AStar';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { DMM_GameManager } from './DMM_GameManager';
const { ccclass, property } = _decorator;

const v2_1 = v2();
const v3_1 = v3();

@ccclass('DMM_PlayerManager')
export class DMM_PlayerManager extends Component {

    @property(TiledMap)
    tiledMap: TiledMap | null = null;

    AStarTrans: UITransform | null = null;
    @property(Prefab)
    Lable: Prefab = null;
    @property(Node)
    Npc: Node = null;
    @property(Node)
    Player: Node | null = null;
    lastNode: AStarNode = null;
    speed: number = 270;
    gridSize: number = 50;
    canvasHeight: number = 2350;

    redDots: Node[] = [];
    map: Node[] = [];
    obstacleMap: Node[] = [];//标记为障碍物的节点

    endPosition: Vec2 = new Vec2();
    public static Instance: DMM_PlayerManager = null;
    PlayerStartPos: Vec3 = null;
    PlayerMove: boolean = false;
    start() {

    }

    update(deltaTime: number) {

    }



    protected onLoad(): void {
        DMM_PlayerManager.Instance = this;
        this.AStarTrans = this.tiledMap.node.getChildByName("AStar").getComponent(UITransform);
        this.InitMap();
    }

    //#region 



    Zancun: Node = null;
    Chasing(node: Node, path: AStarNode[]) {
        if (!path) return;

        let index = path.some(e => e == this.lastNode) ? 1 : 0;

        //寻路点
        // this.redDots.forEach(e => e.destroy());
        // this.redDots = [];
        // for (let i = 0; i < path.length; i++) {
        //     const e = path[i];

        //     resources.load("Label2", Prefab, (err, prefab) => {
        //         let nd = instantiate(prefab);
        //         this.Player.parent.addChild(nd);

        //         let point = this.GetPositionByAStarPoint(v2(e.x, e.y));

        //         nd.getComponent(Label).string = `${point.x},${point.y}`;
        //         nd.setWorldPosition(this.AStarTrans.convertToWorldSpaceAR(v3(point.x, point.y)));
        //         this.redDots.push(nd);
        //     });
        // }
        if (path.length <= 0) {
            find("Canvas/BG/躲藏选择").children.forEach(e => {

                let Distance: number = Vec3.distance(e.worldPosition, this.Player.worldPosition);

                if (Distance < 50) {
                    this.Zancun = e;
                    if (e.getComponent(Button).interactable == false) {
                        this.PlayerReturn();
                    }
                    else {
                        DMM_GameManager.Instance.ChoseClose1();
                        e.active = false;
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

    //#endregion
    PlayerReturn() {
        this.Player.setWorldPosition(find("Canvas/BG/Player").worldPosition);
        this.PlayerMove = false;
    }
    CheckDown(Node: Node) {
        if (this.Zancun != null) {
            this.Zancun.active = true;
        }
        this.PlayerMove = true;
        v3_1.set(Node.worldPosition.x, Node.worldPosition.y);
        v3_1.set(this.AStarTrans.convertToNodeSpaceAR(v3_1))
        v2_1.set(v3_1.x, v3_1.y);

        if (!this.CanArrive(v2_1)) {
            console.log("目标不可达");
            return;
        }

        v3_1.set(this.AStarTrans.convertToNodeSpaceAR(this.Player.worldPosition.clone()))
        let start = this.GetAStarPointByPosition(v2(v3_1.x, v3_1.y));
        let end = this.GetAStarPointByPosition(v2_1);

        let path = AStarManager.Instance.FindPath(start, end);
        console.log("目标可达", path);

        this.Chasing(this.Player, path);
    }

    // protected onEnable(): void {
    //     this.tiledMap.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    //     this.tiledMap.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    // }

    // protected onDisable(): void {
    //     this.tiledMap.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    //     this.tiledMap.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    // }
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

