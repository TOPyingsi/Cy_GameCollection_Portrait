import { _decorator, AudioClip, AudioSource, BoxCollider2D, Camera, Component, director, ERigidBody2DType, error, EventTouch, find, Input, instantiate, Label, Node, PostSettingsInfo, Prefab, resources, size, Size, TiledMap, tween, Tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { AStar_Node_Type, AStarManager, AStarNode } from 'db://assets/Scripts/Framework/Algorithm/AStar';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_NpcManager } from './DMM_NpcManager';
import { DMM_PlayerManager } from './DMM_PlayerManager';
import { AudioManager, Audios } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import Banner from '../../../Scripts/Banner';
const { ccclass, property } = _decorator;
const v2_1 = v2();
const v3_1 = v3();
@ccclass('DMM_EnemyRun')
export class DMM_EnemyRun extends Component {

    @property()
    gameMode: string = "重新躲";

    @property(TiledMap)
    tiledMap: TiledMap | null = null;
    @property(AudioClip)
    Jiaobu: AudioClip = null;
    AStarTrans: UITransform | null = null;
    // @property(Prefab)
    // Lable: Prefab = null;
    @property(Node)
    Npc: Node = null;
    @property(AudioClip)
    Music: AudioClip[] = [];
    Player: Node | null = null;
    lastNode: AStarNode = null;
    speed: number = 200;
    gridSize: number = 50;
    canvasHeight: number = 2350;

    redDots: Node[] = [];
    map: Node[] = [];
    obstacleMap: Node[] = [];//标记为障碍物的节点

    endPosition: Vec2 = new Vec2();
    public static Instance: DMM_EnemyRun = null;
    EnemyStartPosition: Vec3 = null;



    start() {
        this.Player = this.node;
        this.EnemyStartPosition = find("Canvas/起始位置").worldPosition;
    }

    update(deltaTime: number) {

    }




    protected onLoad(): void {
        DMM_EnemyRun.Instance = this;
        this.AStarTrans = this.tiledMap.node.getChildByName("AStar").getComponent(UITransform);
        this.InitMap();
    }

    Chasing(node: Node, path: AStarNode[]) {
        if (!path) return;

        let index = path.some(e => e == this.lastNode) ? 1 : 0;
        let StartDistance: number = Vec3.distance(this.EnemyStartPosition, this.Player.worldPosition);

        if (this.node.children.length != 0 && StartDistance < 50 && this.node.children[0].name != "玩家") {

            this.node.children[0].destroy();
            console.error("处决");


            AudioManager.Instance.PlaySFX(this.Music[0]);
            // this.Jiaobu.getComponent(AudioSource).stop();
            // AudioManager.Instance.StopBGM;
            DMM_GameManager.Instance.Win();

            DMM_NpcManager.Instance.NpcReturn();
            DMM_GameManager.Instance.ChoseFix();

            DMM_PlayerManager.Instance.PlayerReturn();

            DMM_GameManager.Instance.startTimer();


        }
        else if (this.node.children.length != 0 && StartDistance < 50 && this.node.children[0].name == "玩家") {
            this.node.children[0].active = false;
            DMM_GameManager.Instance.Lose();
            AudioManager.Instance.PlaySFX(this.Music[0]);

        }
        if (path.length <= 0) {
            Banner.Instance.VibrateShort();
            find("Canvas/BG/Npc").children.forEach(e => {

                let Distance: number = Vec3.distance(e.worldPosition, this.Player.worldPosition);

                if (Distance < 30) {
                    for (let i = 0; i < DMM_NpcManager.Instance.NpcArray.length; i++) {
                        if (e.name == DMM_NpcManager.Instance.NpcArray[i].name) {

                            DMM_NpcManager.Instance.NpcArray.splice(i, 1);
                        }

                    }
                    //  DMM_NpcManager.Instance.NpcArray.splice(e) 
                    this.Player.addChild(e);

                    e.setWorldPosition(this.Player.worldPosition.x - 126, this.Player.worldPosition.y + 126, 0);
                    this.TimeEnd(this.EnemyStartPosition);

                    AudioManager.Instance.PlaySFX(this.Music[1]);

                }

            });
            if (find("Canvas/BG/Player").children.length != 0) {
                if (Vec3.distance(find("Canvas/BG/Player").children[0].worldPosition, this.Player.worldPosition) < 30) {
                    this.Player.addChild(find("Canvas/BG/Player").children[0]);
                    this.Player.children[0].setWorldPosition(this.Player.worldPosition.x - 126, this.Player.worldPosition.y + 126, 0);
                    AudioManager.Instance.PlaySFX(this.Music[1]);
                    this.TimeEnd(this.EnemyStartPosition);
                }
            }
        }
        // 遍历路径点并控制节点移动
        // 该循环用于处理节点沿着A*路径移动的逻辑
        // 主要功能包括：停止当前Tween动画、更新节点位置、计算移动时间和执行移动动画
        for (let i = index; i < path.length; i++) {
            const e = path[i];
            // 停止目标节点的所有Tween动画
            Tween.stopAllByTarget(node);
            // 记录当前路径点为最后访问的节点
            this.lastNode = e;

            // 根据A*网格点获取实际坐标位置
            let position = this.GetPositionByAStarPoint(v2(e.x, e.y));
            // 将坐标转换为世界坐标系下的位置
            let worldPosition = this.AStarTrans.convertToWorldSpaceAR(v3(position.x, position.y));
            // 根据距离和速度计算移动所需时间
            let time = Vec3.distance(node.worldPosition, worldPosition) / this.speed;

            // 创建并启动Tween动画，控制节点移动到目标位置
            tween(node)
                .to(time, { worldPosition: worldPosition })
                // 动画完成后的回调函数
                .call(() => {
                    // 从路径中移除已访问的路径点
                    path.splice(0, path.indexOf(e) + 1)
                    // 递归继续追踪剩余路径
                    this.Chasing(node, path);
                })
                .start();

            // 跳出循环，每次只处理一个路径点
            break;
        }

    }

    InitMap() {
        console.log(this.tiledMap);

        AStarManager.Instance.InitMapInfo(this.tiledMap.getLayer(`Map`).getLayerSize().width, this.tiledMap.getLayer(`Map`).getLayerSize().height);

        //Astar 寻路层 - 用于寻路
        let layer = this.tiledMap.getLayer(`AStar`);
        console.log(layer);

        for (let i = 0; i < layer.getLayerSize().width; i++) {
            for (let j = 0; j < layer.getLayerSize().height; j++) {
                console.log(i, j);

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
    startEnd() {
        const randomnumber: number = Tools.GetRandomInt(0, this.Npc.children.length + 1);
        // if (find("Canvas/BG/Player").children[0].worldPosition == find("Canvas/BG/Player").worldPosition) {
        //     const position = find("Canvas/BG/Player").children[0].getWorldPosition();
        //     this.TimeEnd(position);
        // }
        if (DMM_PlayerManager.Instance.PlayerMove == false) {
            const position = find("Canvas/BG/Player").children[0].getWorldPosition();
            this.TimeEnd(position);
        }
        else {
            if (randomnumber == this.Npc.children.length && find("Canvas/BG/Npc").children.length < 5 && find("Canvas/BG/Player").children[0].worldPosition != find("Canvas/BG/Player").worldPosition) {
                const position = find("Canvas/BG/Player").children[0].getWorldPosition();
                this.TimeEnd(position);
            }
            else if (randomnumber == this.Npc.children.length && find("Canvas/BG/Npc").children.length > 5 && find("Canvas/BG/Player").children[0].worldPosition != find("Canvas/BG/Player").worldPosition) {
                const position = this.Npc.children[randomnumber - 1].getWorldPosition();
                this.TimeEnd(position);
            }
            else {
                if (this.Npc.children[randomnumber] != null) {
                    const position = this.Npc.children[randomnumber].getWorldPosition();
                    this.TimeEnd(position);
                }
                else {
                    const position = find("Canvas/BG/Player").children[0].getWorldPosition();
                    this.TimeEnd(position);
                    console.error("突发事件你发出了声音");
                }

            }
        }
    }


    TimeEnd(pos: Vec3) {
        AudioManager.Instance.PlaySFX(this.Jiaobu);
        // this.Jiaobu.getComponent(AudioSource).play();
        DMM_GameManager.Instance.ChoseClose();
        v3_1.set(pos.x, pos.y);
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

