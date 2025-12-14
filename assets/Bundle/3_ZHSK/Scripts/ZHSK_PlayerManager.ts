import { _decorator, Collider, Collider2D, Component, Contact2DType, sp, instantiate, IPhysics2DContact, Node, PhysicsSystem2D, Prefab, RigidBody2D, Skeleton, UITransform, Vec3, math, log, JsonAsset, resources, BoxCollider2D, error, find, Camera, tween, director, animation, AnimationClip, Animation, PhysicsSystem, ParticleSystem2D, v3, easing, v4, Button, AudioSource } from 'cc';
import { ZHSK_EnemyManager } from './ZHSK_EnemyManager';
import { ZHSK_GameManager } from './ZHSK_GameManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import Res from 'db://assets/Scripts/Framework/Utils/Res';
import { ZHSK_Player } from './ZHSK_Player';
import { PhysicsMaterial } from '../../../../extensions/plugin-import-2x/creator/components/PhysicsMaterial';
import { ZHSK_JingDu } from './ZHSK_JingDu';
import { CAMERA } from '../../../../extensions/plugin-import-2x/creator/components/Camera';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import Banner from 'db://assets/Scripts/Banner';
//import { Sp_Skeleton } from '../../extensions/plugin-import-2x/creator/components/SpSkeleton';
const { ccclass, property } = _decorator;

@ccclass('ZHSK_PlayerManager')
export class ZHSK_PlayerManager extends Component {
    @property({ type: [Prefab] })
    changeyPrefabs: Prefab[] = []; // 敌人Prefab数组（按层级顺序，从1到10）
    // @property({ type: [sp.Skeleton] })
    // PlayerSke: sp.Skeleton = null; // 玩家动画
    @property({ type: [Node] })
    spawnArea: Node = null; // 跟随区域
    @property({ type: [Prefab] })
    Player: Prefab = null;
    @property
    smoothTime: number = 0.3; // 平滑过渡时间(秒)
    // CameraLimit: Node = null;
    // camera: Camera = null;
    private _enemyQueue: Node[] = []; // 玩家身后的敌人队列
    public static PlayerLevel = 0;
    public i = 0;
    public static j = 0;
    public static k = 0;

    private ZanCun: Node = null;
    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        // this.CameraLimit = find("Canvas/CameraLimit", director.getScene());
        // this.camera = find("Camera", director.getScene()).getComponent(Camera);

        // 注册碰撞事件
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }



    PlayerChange() {
        if (ZHSK_PlayerManager.PlayerLevel == 1) {

            const playskeleton = this.node.getComponent(sp.Skeleton);
            // playskeleton.skeletonData = 
        }
    }


    start() {
        this.ZanCun = find("Canvas/暂存");

    }
    // 碰撞检测回调
    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 如果碰撞到敌人

        if (otherCollider.group == 1 << 0) {
            if (otherCollider.node.name == "Enemy") {
                if (ZHSK_PlayerManager.PlayerLevel >= 0) {
                    ZHSK_PlayerManager.j = 0;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();
                }


            }
            if (otherCollider.node.name == "Enemy1") {
                if (ZHSK_PlayerManager.PlayerLevel >= 1) {
                    ZHSK_PlayerManager.j = 1;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();
                }
            }
            if (otherCollider.node.name == "Enemy2") {
                if (ZHSK_PlayerManager.PlayerLevel >= 2) {
                    ZHSK_PlayerManager.j = 2;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();
                }
            }
            if (otherCollider.node.name == "Enemy3") {
                if (ZHSK_PlayerManager.PlayerLevel >= 3) {
                    ZHSK_PlayerManager.j = 3;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();
                }
            }
            if (otherCollider.node.name == "Enemy4") {
                if (ZHSK_PlayerManager.PlayerLevel >= 4) {
                    ZHSK_PlayerManager.j = 4;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();
                }
            }
            if (otherCollider.node.name == "Enemy5") {

                if (ZHSK_PlayerManager.PlayerLevel >= 5) {
                    ZHSK_PlayerManager.j = 5;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();
                }
            }
            if (otherCollider.node.name == "Enemy6") {
                if (ZHSK_PlayerManager.PlayerLevel >= 6) {
                    ZHSK_PlayerManager.j = 6;

                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();
                }
            }
            if (otherCollider.node.name == "Enemy7") {
                if (ZHSK_PlayerManager.PlayerLevel >= 7) {
                    ZHSK_PlayerManager.j = 7;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();
                }

            }
            if (otherCollider.node.name == "Enemy8") {
                if (ZHSK_PlayerManager.PlayerLevel >= 8) {
                    ZHSK_PlayerManager.j = 8;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {
                    this.CtorCheck();

                }
            } if (otherCollider.node.name == "Enemy9") {
                if (ZHSK_PlayerManager.PlayerLevel >= 9) {
                    ZHSK_PlayerManager.j = 9;
                    GameManager.Instance.scheduleOnce(() => {
                        this.collectEnemy(otherCollider.node);
                    })
                }
                else {

                    this.CtorCheck();


                }
            }

        }
    }
    CtorCheck() {

        // find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0;
        find("Canvas/角色升级").active = false;
        find("Canvas/冰冻").active = false;


        tween(this.node)
            .to(0, { eulerAngles: v3(0, 0, this.node.eulerAngles.z) })
            .to(0.1, { eulerAngles: v3(0, 0, this.node.eulerAngles.z + 360) })
            .call(() => {
                ZHSK_GameManager.Instance._win = false;
                this.node.active = false;
                ZHSK_GameManager.Instance.WinorLose();
                console.error(11111);

                ZHSK_GameManager.Instance.Anation = 1;
            })
            .start();
        this.node.getComponent(RigidBody2D).enabled = true;
    }
    update(deltaTime: number) {
        find("Canvas/暂存").setWorldPosition(this.node.worldPosition);

        this.scheduleOnce(() => {
            this.combineEnemies();
        })

    }


    // 收集敌人
    collectEnemy(enemy: Node) {
        GameManager.Instance.scheduleOnce(() => {
            find("ZHSK_GameManager").getComponent(AudioSource).play();
            Banner.Instance.VibrateShort();
            // 将敌人添加到玩家身后的队列中
            this._enemyQueue?.push(enemy);
            // 更新敌人队列的位置
            this.updateEnemyQueuePosition();
        })
        // 销毁敌人
        GameManager.Instance.scheduleOnce(() => {
            ZHSK_EnemyManager.instance._enemies.splice(ZHSK_EnemyManager.instance._enemies.indexOf(enemy), 1);
            enemy?.destroy();

        });
    }
    Shengji() {
        tween(find("Canvas/升级"))
            .call(() => {
                find("Canvas/升级").active = true;
                find("Canvas/升级").getComponent(Animation).play();
            })
            .delay(0.5)
            .call(() => {
                find("Canvas/升级").active = false;
            })
            .start();
    }
    public NpcPos = 0;
    updateEnemyQueuePosition() {

        // const uiTransform = this.spawnArea.getComponent(UITransform);//获取组件
        // const spawnAreaWidth = uiTransform.width; // 方形区域的宽度
        // const spawnAreaHeight = uiTransform.height; // 方形区域的高度
        // const spawnAreaPos = this.spawnArea.getWorldPosition().clone(); // 方形区域的位置
        // let x = Math.random() * ((spawnAreaPos.x + spawnAreaWidth / 2) - (spawnAreaPos.x - spawnAreaWidth / 2)) + spawnAreaPos.x - spawnAreaWidth / 2;
        // let y = Math.random() * ((spawnAreaPos.y + spawnAreaHeight / 2) - (spawnAreaPos.y - spawnAreaHeight / 2)) + spawnAreaPos.y - spawnAreaHeight / 2;
        if (this.changeyPrefabs != null) {
            const npc = instantiate(this.changeyPrefabs[ZHSK_PlayerManager.j])


            this.ZanCun.addChild(npc);
            // GameManager.Instance.scheduleOnce(() => {

            if (npc != null && this.spawnArea.children[this.NpcPos] != null) {
                console.log(this.spawnArea.children[this.NpcPos].worldPosition);
                npc.setWorldPosition(this.spawnArea.children[this.NpcPos].worldPosition?.x, this.spawnArea.children[this.NpcPos].worldPosition?.y, 0);
                npc.setRotation(this.node.rotation);

            }
            this.NpcPos += 1;
            if (this.NpcPos > 7) {
                this.NpcPos = 0;
            }

            // });


        }


    }
    //简单三合一逻辑
    combineEnemies() {
        find("Canvas/升级").setWorldPosition(this.node.worldPosition.clone().x, this.node.worldPosition.clone().y, 0)
        const enemyNodes = this.findEnemyNodes(this.ZanCun);
        const enemyNodes1 = this.findEnemyNodes1(this.ZanCun);
        const enemyNodes2 = this.findEnemyNodes2(this.ZanCun);
        const enemyNodes3 = this.findEnemyNodes3(this.ZanCun);
        const enemyNodes4 = this.findEnemyNodes4(this.ZanCun);
        const enemyNodes5 = this.findEnemyNodes5(this.ZanCun);
        const enemyNodes6 = this.findEnemyNodes6(this.ZanCun);
        const enemyNodes7 = this.findEnemyNodes7(this.ZanCun);
        const enemyNodes8 = this.findEnemyNodes8(this.ZanCun);
        const enemyNodes9 = this.findEnemyNodes9(this.ZanCun);
        if (enemyNodes.length == 2 && ZHSK_PlayerManager.PlayerLevel == 0) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 1;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);

            this.Shengji();
            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.node.destroy();

            if (director.getScene().name == "ZHSK_BFHZGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1170 })
                    .to(2, { orthoHeight: 1400 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1400;
                ZHSK_JingDu.Instance.JingduCheck();
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                //    this.Check();
                tween(find("Camera").getComponent(Camera))

                    .to(0, { orthoHeight: 500 })
                    .to(2, { orthoHeight: 600 })
                    .start();
            }
            else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 500 })
                    .to(2, { orthoHeight: 600 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 700;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 1700;
            }
            else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 500 })
                    .to(2, { orthoHeight: 700 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 800;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 2000;
            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 500 })
                    .to(2, { orthoHeight: 600 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 800;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 2000;
                ZHSK_JingDu.Instance.JingduCheck();
            } else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 500 })
                    .to(2, { orthoHeight: 700 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 800;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 2000;
                ZHSK_JingDu.Instance.JingduCheck();
            }
        }
        else if (enemyNodes.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes.slice(0, 3));
            this.i = 1;
            // 生成一个新的子节点

            this.spawnNewNode();

        }


        if (enemyNodes1.length == 2 && ZHSK_PlayerManager.PlayerLevel == 1) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes1.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 2;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);
            this.Shengji();
            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.OpenQiyuPanel();
            this.node.destroy();
            if (director.getScene().name != "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.05;
            }
            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1400 })
                    .to(2, { orthoHeight: 1600 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1800;
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 600 })
                    .to(2, { orthoHeight: 700 })
                    .start();
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 600 })
                    .to(2, { orthoHeight: 800 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 2000;
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 700 })
                    .to(2, { orthoHeight: 800 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 2000;
            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 600 })
                    .to(2, { orthoHeight: 1000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1200;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 3000;
                ZHSK_JingDu.Instance.JingduCheck();
            } else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 700 })
                    .to(2, { orthoHeight: 1100 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1200;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 3000;
                ZHSK_JingDu.Instance.JingduCheck();
            }
        }
        else if (enemyNodes1.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes1.slice(0, 3));
            this.i = 2;
            // 生成一个新的子节点

            this.spawnNewNode();

        }


        if (enemyNodes2.length == 2 && ZHSK_PlayerManager.PlayerLevel == 2) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes2.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 3;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);

            this.Shengji();
            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.node.destroy();


            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1600 })
                    .to(2, { orthoHeight: 2000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2000;
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 700 })
                    .to(2, { orthoHeight: 900 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1500;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 4000;
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 800 })
                    .to(2, { orthoHeight: 900 })
                    .start();

                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 2000;
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 800 })
                    .to(2, { orthoHeight: 1200 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1900;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 3500;
            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1000 })
                    .to(2, { orthoHeight: 1400 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1500;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 3500;
                ZHSK_JingDu.Instance.JingduCheck();
            } else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1100 })
                    .to(2, { orthoHeight: 1600 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 1600;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 3500;
                ZHSK_JingDu.Instance.JingduCheck();
            }


        }
        else if (enemyNodes2.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes2.slice(0, 3));
            this.i = 3;
            // 生成一个新的子节点

            this.spawnNewNode();

        }


        if (enemyNodes3.length == 2 && ZHSK_PlayerManager.PlayerLevel == 3) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes3.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 4;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);

            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.node.destroy();
            if (director.getScene().name != "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.08;
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
            }

            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2000 })
                    .to(2, { orthoHeight: 2400 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2400;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 900 })
                    .to(2, { orthoHeight: 1100 })
                    .start();
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 900 })
                    .to(2, { orthoHeight: 1500 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 4000;
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1200 })
                    .to(2, { orthoHeight: 1800 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 5000;
            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1400 })
                    .to(2, { orthoHeight: 1800 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 4000;
                ZHSK_JingDu.Instance.JingduCheck();
            } else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1600 })
                    .to(2, { orthoHeight: 2000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2200;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 5000;
                ZHSK_JingDu.Instance.JingduCheck();
            }

        }
        else if (enemyNodes3.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes3.slice(0, 3));
            this.i = 4;
            // 生成一个新的子节点

            this.spawnNewNode();

        }

        if (enemyNodes4.length == 2 && ZHSK_PlayerManager.PlayerLevel == 4) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes4.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 5;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);

            this.Shengji();
            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.OpenQiyuPanel();
            this.node.destroy();
            if (director.getScene().name != "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.1;
            } else if (director.getScene().name == "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
            }
            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2400 })
                    .to(2, { orthoHeight: 2800 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2800;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
                // find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).spawnInterval = 0.1;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxEnemies = 50;

            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1100 })
                    .to(2, { orthoHeight: 1300 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 5000;
            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1800 })
                    .to(2, { orthoHeight: 2400 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 3000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1500 })
                    .to(2, { orthoHeight: 2000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2500;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1800 })
                    .to(2, { orthoHeight: 2400 })
                    .start();

                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2500;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
            } else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2000 })
                    .to(2, { orthoHeight: 2500 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 3000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
                ZHSK_JingDu.Instance.JingduCheck();
            }

            console.error("主角变成黄金鲨鱼");

        }
        else if (enemyNodes4.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes4.slice(0, 3));
            this.i = 5;
            // 生成一个新的子节点

            this.spawnNewNode();

        }


        if (enemyNodes5.length == 2 && ZHSK_PlayerManager.PlayerLevel == 5) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes5.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 6;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);

            this.Shengji();
            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.node.destroy();//6鲸鲨
            if (director.getScene().name != "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.12;
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
            }
            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2800 })
                    .to(2, { orthoHeight: 3000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;

            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1300 })
                    .to(2, { orthoHeight: 1500 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 2200;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 5000;
                // find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).spawnInterval = 0.1;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxEnemies = 100;
            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2400 })
                    .to(2, { orthoHeight: 2800 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 3000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
                // find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).spawnInterval = 0.1;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxEnemies = 30;
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2000 })
                    .to(2, { orthoHeight: 2800 })
                    .start();

                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 3000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
                // find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).spawnInterval = 0.1;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxEnemies = 20;
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2400 })
                    .to(2, { orthoHeight: 3000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 3000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
            }
            else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2500 })
                    .to(2, { orthoHeight: 2900 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 3000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxEnemies = 30;
                ZHSK_JingDu.Instance.JingduCheck();
            }



            this.Shengji();
            console.error("变成鲸鲨");
        }
        else if (enemyNodes5.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes5.slice(0, 3));
            this.i = 6;
            // 生成一个新的子节点

            this.spawnNewNode();

        }
        if (enemyNodes6.length == 2 && ZHSK_PlayerManager.PlayerLevel == 6) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes6.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 7;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);

            this.Shengji();
            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.node.destroy();//7鲲

            if (director.getScene().name != "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.13;
            } else if (director.getScene().name == "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.07;
            }
            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3000 })
                    .to(2, { orthoHeight: 3400 })
                    .start();
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1500 })
                    .to(2, { orthoHeight: 1700 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 3000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2800 })
                    .to(2, { orthoHeight: 3200 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2800 })
                    .to(2, { orthoHeight: 3000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 3200;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3000 })
                    .to(2, { orthoHeight: 3600 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6500;
            }
            else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2900 })
                    .to(2, { orthoHeight: 3300 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
                ZHSK_JingDu.Instance.JingduCheck();
            }


            console.error("变成鲲");

        }
        else if (enemyNodes6.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes6.slice(0, 3));
            this.i = 7;
            // 生成一个新的子节点

            this.spawnNewNode();

        }
        if (enemyNodes7.length == 2 && ZHSK_PlayerManager.PlayerLevel == 7) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes7.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 8;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);

            this.Shengji();

            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.OpenQiyuPanel();
            this.node.destroy();//8美人鱼

            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3400 })
                    .to(2, { orthoHeight: 3800 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4400;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
                // find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).spawnInterval = 0.1;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxEnemies = 50;

            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 1700 })
                    .to(2, { orthoHeight: 2100 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
            }
            else if (director.getScene().name == "ZHSK_BBLYGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 5000;
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3200 })
                    .to(2, { orthoHeight: 3400 })
                    .start();
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3200 })
                    .to(2, { orthoHeight: 3400 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 6000;
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3600 })
                    .to(2, { orthoHeight: 4000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4200;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
            }
            else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3300 })
                    .to(2, { orthoHeight: 3600 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
                ZHSK_JingDu.Instance.JingduCheck();
            }

            console.error("变成美人鱼");
        }
        else if (enemyNodes7.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes7.slice(0, 3));
            this.i = 8;
            // 生成一个新的子节点


            this.spawnNewNode();

        }

        if (enemyNodes8.length == 2 && ZHSK_PlayerManager.PlayerLevel == 8) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes8.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 9;
            const Player = instantiate(this.Player)

            this.node.parent.addChild(Player);

            this.Shengji();
            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.node.destroy();
            if (director.getScene().name != "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.15;
            } else if (director.getScene().name == "ZHSK_JDMSGame") {
                find("Canvas/PlayerManager").getComponent(ZHSK_Player).speed = 0.08;
            }
            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3800 })
                    .to(2, { orthoHeight: 4000 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4400;
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2100 })
                    .to(2, { orthoHeight: 2500 })
                    .start();
            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3400 })
                    .to(2, { orthoHeight: 3600 })
                    .start();
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3500 })
                    .to(2, { orthoHeight: 3800 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 4200 })
                    .to(2, { orthoHeight: 4200 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4500;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7500;
                // find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).spawnInterval = 0.1;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxEnemies = 50;
            } else if (director.getScene().name == "ZHSK_AISHJGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3600 })
                    .to(2, { orthoHeight: 3400 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4000;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7000;
                ZHSK_JingDu.Instance.JingduCheck();
            }

            this.Shengji();
        }
        else if (enemyNodes8.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes8.slice(0, 3));
            this.i = 9;
            // 生成一个新的子节点

            this.spawnNewNode();

        }

        if (enemyNodes9.length == 2 && ZHSK_PlayerManager.PlayerLevel == 9) {
            // 销毁这2个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes9.slice(0, 2));
            ZHSK_PlayerManager.PlayerLevel = 9;
            const Player = instantiate(this.Player);

            this.node.parent.addChild(Player);

            Player.worldPosition = this.node.worldPosition;
            this.node.parent.getComponent(ZHSK_Player).rigidBody = Player.getComponent(RigidBody2D);
            this.node.parent.getComponent(ZHSK_Player).Player = Player;
            this.node.destroy();
            find("Canvas/角色升级").active = false;
            find("Canvas/冰冻").active = false;
            this.Shengji();
            if (director.getScene().name == "ZHSK_BFHZGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 4000 })
                    .to(2, { orthoHeight: 2400 })
                    .start();
            }
            else if (director.getScene().name == "ZHSK_JDMSGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 2500 })
                    .to(2, { orthoHeight: 2900 })
                    .start();
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).minSpawnRadius = 4500;
                find("Canvas/EnemyManager").getComponent(ZHSK_EnemyManager).maxSpawnRadius = 7500;
            } else if (director.getScene().name == "ZHSK_ZZJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3500 })
                    .to(2, { orthoHeight: 4200 })
                    .start();
            } else if (director.getScene().name == "ZHSK_WKJHGame") {
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 4200 })
                    .to(2, { orthoHeight: 4400 })
                    .start();

            } else if (director.getScene().name == "ZHSK_BBLYGame") {
                ZHSK_JingDu.Instance.JingduCheck();
                tween(find("Camera").getComponent(Camera))
                    .to(0, { orthoHeight: 3600 })
                    .to(2, { orthoHeight: 3800 })
                    .start();
            }

            ZHSK_GameManager.Instance._win = true;
            ZHSK_GameManager.Instance.WinorLose();
        }
        else if (enemyNodes9.length >= 3) {
            // 销毁这3个 enemy 子节点
            this.destroyEnemyNodes(enemyNodes9.slice(0, 3));
            this.i = 10;
            // 生成一个新的子节点
            this.spawnNewNode();


        }
    }

    //查找Enemy子节点
    findEnemyNodes(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(0)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }
    findEnemyNodes1(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(1)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }
    findEnemyNodes2(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(2)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }
    findEnemyNodes3(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(3)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }

    findEnemyNodes4(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(4)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }


    findEnemyNodes5(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(5)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }

    findEnemyNodes6(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(6)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }
    findEnemyNodes7(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(7)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }
    findEnemyNodes8(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(8)') {
                enemyNodes.push(child);
            }
        });

        return enemyNodes;
    }
    findEnemyNodes9(node: Node): Node[] {
        const enemyNodes: Node[] = [];
        node.children.forEach(child => {
            if (child.name === 'Enemy(9)') {
                enemyNodes.push(child);
            }
        });
        return enemyNodes;
    }

    destroyEnemyNodes(enemyNodes: Node[]) {
        enemyNodes.forEach(enemy => {
            enemy.destroy();
        });
    }

    // 生成新的子节点
    spawnNewNode() {
        if (this.changeyPrefabs[this.i]) {
            const uiTransform = this.spawnArea.getComponent(UITransform);//获取组件
            const spawnAreaWidth = uiTransform.width; // 方形区域的宽度
            const spawnAreaHeight = uiTransform.height; // 方形区域的高度
            const spawnAreaPos = this.spawnArea.getWorldPosition().clone(); // 方形区域的位置
            let x = Math.random() * ((spawnAreaPos.x + spawnAreaWidth / 2) - (spawnAreaPos.x - spawnAreaWidth / 2)) + spawnAreaPos.x - spawnAreaWidth / 2;
            let y = Math.random() * ((spawnAreaPos.y + spawnAreaHeight / 2) - (spawnAreaPos.y - spawnAreaHeight / 2)) + spawnAreaPos.y - spawnAreaHeight / 2;
            const npc = instantiate(this.changeyPrefabs[this.i]);

            this.ZanCun.addChild(npc);
            npc.setWorldPosition(new Vec3(x, y, 0));
            npc.setRotation(this.node.rotation);

            //     GameManager.Instance.scheduleOnce(() => {
            //     console.error(npc);

            //     console.error(this.spawnArea.children[this.NpcPos].worldPosition);
            //     console.error(this.NpcPos);


            //     npc.setWorldPosition(this.spawnArea.children[this.NpcPos].worldPosition);

            // });

            // this.NpcPos += 1;
            // if (this.NpcPos > 8) {
            //     this.NpcPos = 0;
            // }
        }
    }

    OpenQiyuPanel() {
        find("Canvas/奇遇面板").active = true;
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "召唤神鲲");
        // find("Canvas/奇遇面板").getComponent(Animation).play();
        // director.pause();
    }


}


