import { _decorator, Animation, BoxCollider2D, Button, Component, director, ERigidBody2DType, EventTouch, find, Label, Node, PhysicsSystem, PhysicsSystem2D, RigidBody2D, Sprite, SpriteFrame, sys, TiledMap, Tween, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { AStar_Node_Type, AStarManager, AStarNode } from '../../../Scripts/Framework/Algorithm/AStar';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { TLQSH_Enemy } from './TLQSH_Enemy';
import { ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { MyEvent } from '../../../Scripts/Framework/Managers/EventManager';
import { TLQSH_Player } from './TLQSH_Player';
const { ccclass, property } = _decorator;
const v2_1 = v2();
const v3_1 = v3();
@ccclass('TLQSH_GameManager')
export class TLQSH_GameManager extends Component {
    @property(TiledMap)
    tiledMap: TiledMap | null = null;
    @property(Node)
    GameNode: Node = null;
    @property(Node)
    UINode: Node = null;
    @property(Node)
    Player: Node = null;
    @property(SpriteFrame)
    QInErShiSprite: SpriteFrame = null;
    private static _instance: TLQSH_GameManager = null;
    map: Node[] = [];
    obstacleMap: Node[] = [];//标记为障碍物的节点
    AStarTrans: UITransform | null = null;
    lastNode: AStarNode = null;
    speed: number = 200;
    gridSize: number = 10;
    canvasHeight: number = 920;

    public KeyNum: number = 0;
    public GamePause: boolean = false;
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new TLQSH_GameManager();
        }
        return this._instance;
    }
    protected onLoad(): void {
        TLQSH_GameManager._instance = this;
        // PhysicsSystem2D.instance.debugDrawFlags = 1;
    }
    start() {
        this.AStarTrans = this.tiledMap.node.getChildByName("Obstacle").getComponent(UITransform);
        this.InitMap();
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.StartTip, this);
        } else {
            this.StartTip();
        }
    }



    InitMap() {
        let tiledSize = this.tiledMap.getTileSize();//每个格子的大小

        //碰撞层 - 用于主角与地图的碰撞
        let layer = this.tiledMap.getLayer(`Obstacle`);
        for (let i = 0; i < layer.getLayerSize().width; i++) {
            for (let j = 0; j < layer.getLayerSize().height; j++) {
                let tiled = layer.getTiledTileAt(i, j, true);
                if (tiled.grid != 0) {
                    let body: RigidBody2D = tiled.node.addComponent(RigidBody2D);
                    body.type = ERigidBody2DType.Static;
                    let collider: BoxCollider2D = tiled.node.addComponent(BoxCollider2D);
                    body.group = 1 << 11;
                    collider.group = 1 << 11;

                    tiled.node.getComponent(UITransform).setContentSize(tiledSize.width, tiledSize.height);
                    collider.offset = v2(tiledSize.width / 2, tiledSize.height / 2);
                    collider.size = tiledSize;
                    collider.apply();
                }
            }
        }
        this.tiledMap.node.getChildByName("Obstacle").active = true;


        AStarManager.Instance.InitMapInfo(92, 92);

        //Astar 寻路层 - 用于寻路
        layer = this.tiledMap.getLayer(`Obstacle`);
        for (let i = 0; i < layer.getLayerSize().width; i++) {
            for (let j = 0; j < layer.getLayerSize().height; j++) {
                let tiled = layer.getTiledTileAt(i, j, true);
                AStarManager.Instance.SetMap(i, j, tiled.grid != 0 ? AStar_Node_Type.Obstacle : AStar_Node_Type.Normal);
                this.map.push(tiled.node);
                if (tiled.grid != 0) {
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
        // return v2(point.x * this.gridSize, point.y * this.gridSize);
        return v2(point.x * this.gridSize + this.gridSize / 2, (this.canvasHeight / this.gridSize - point.y - 1) * this.gridSize + this.gridSize / 2);
    }

    /**把局部坐标转化成A*数组位标 */
    GetAStarPointByPosition(pos: Vec2) {
        return v2(Math.floor(pos.x / this.gridSize), this.canvasHeight / this.gridSize - Math.floor(pos.y / this.gridSize) - 1);
        // return v2(Math.floor(pos.x / this.gridSize), Math.floor(pos.y / this.gridSize));
    }

    GetPath(pos: Vec3, node: Node): AStarNode[] {

        v3_1.set(pos.x, pos.y);
        v3_1.set(this.AStarTrans.convertToNodeSpaceAR(v3_1));
        v2_1.set(v3_1.x, v3_1.y);

        if (!this.CanArrive(v2_1)) {
            console.log("目标不可达");
            return;
        }

        v3_1.set(this.AStarTrans.convertToNodeSpaceAR(node.worldPosition.clone()))
        let start = this.GetAStarPointByPosition(v2(v3_1.x, v3_1.y));
        let end = this.GetAStarPointByPosition(v2_1);

        let path = AStarManager.Instance.FindPath2(start, end);
        return path;
    }


    //游戏结束
    GameOver() {
        this.GamePause = true;
        GamePanel.Instance.Lost();

    }
    //游戏胜利
    GameWin() {
        this.GamePause = true;
        GamePanel.Instance.Win();
    }


    //提示
    ShowTip(str: string, Time: number) {
        this.UINode.getChildByName("提示").getComponent(Label).string = str;
        this.UINode.getChildByName("提示").active = true;
        this.scheduleOnce(() => {
            this.UINode.getChildByName("提示").active = false;
        }, Time)
    }

    //开局提示
    StartTip() {
        this.UINode.getChildByName("提示").active = true;
        this.UINode.getChildByName("提示").getComponent(Label).string = "秦始皇还有三秒开始追击";
        this.scheduleOnce(() => {
            this.UINode.getChildByName("提示").getComponent(Label).string = "秦始皇还有二秒开始追击";
        }, 1)
        this.scheduleOnce(() => {
            this.UINode.getChildByName("提示").getComponent(Label).string = "秦始皇还有一秒开始追击";
        }, 2)
        this.scheduleOnce(() => {
            this.UINode.getChildByName("提示").active = false;
        }, 3)
    }


    //骑车秦始皇出现
    RideQinShiHuang() {
        this.UINode.getChildByName("提示").active = true;
        this.UINode.getChildByName("提示").getComponent(Label).string = "秦始皇还有三秒复活";
        this.scheduleOnce(() => {
            this.UINode.getChildByName("提示").getComponent(Label).string = "秦始皇还有二秒复活";
        }, 1)
        this.scheduleOnce(() => {
            this.UINode.getChildByName("提示").getComponent(Label).string = "秦始皇还有一秒复活";
        }, 2)
        this.scheduleOnce(() => {
            this.UINode.getChildByName("提示").getComponent(Label).string = "秦始皇已复活，速度大幅提升！";
            //秦二世出现
            this.GameNode.getChildByPath("Map/Enemy").getComponent(Sprite).spriteFrame = this.QInErShiSprite;
            this.GameNode.getChildByPath("Map/Enemy").active = true;
            this.GameNode.getChildByPath("Map/Enemy").getComponent(TLQSH_Enemy).RestartPos();
            this.GameNode.getChildByPath("Map/Enemy").getComponent(TLQSH_Enemy).Speed = 160;
            this.GameNode.getChildByPath("Map/Enemy").getComponent(TLQSH_Enemy).FindPath();
        }, 3)
        this.scheduleOnce(() => {
            this.UINode.getChildByName("提示").active = false;
        }, 4)
    }

    //播放动画
    PlayAnimation(name: string, time: number) {
        this.UINode.getChildByPath("帧动画/" + name).active = true;
        this.UINode.getChildByPath("帧动画/" + name).getComponent(Animation).play();
        this.scheduleOnce(() => {
            this.UINode.getChildByPath("帧动画/" + name).active = false;
        }, time)
    }


}


