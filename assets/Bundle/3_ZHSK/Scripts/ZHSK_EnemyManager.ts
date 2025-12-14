import { _decorator, Component, director, find, instantiate, Node, Prefab, Vec3 } from 'cc';
import { ZHSK_PlayerManager } from './ZHSK_PlayerManager';
import { ZHSK_GameManager } from './ZHSK_GameManager';
const { ccclass, property } = _decorator;

@ccclass('ZHSK_EnemyManager')
export class ZHSK_EnemyManager extends Component {
    // @property({ type: Node })
    // spawnArea: Node = null; // 方形预制体节点


    @property({ type: Prefab })
    enemyPrefab_list: Prefab[] = []; // 敌人Prefab

    @property
    minSpawnRadius: number = 1500; // 最小生成半径

    @property
    maxSpawnRadius: number = 4500; // 最大生成半径

    @property
    spawnInterval: number = 0.5; // 生成间隔时间

    @property
    maxEnemies: number = 100; // 最大敌人数量


    private _timer: number = 0;
    public player: Node = null;
    public _enemies: Node[] = [];
    static instance: ZHSK_EnemyManager;
    public playerPos = null;


    protected onLoad(): void {
        ZHSK_EnemyManager.instance = this;

    }
    start() {

    }

    update(deltaTime: number) {
        this._timer += deltaTime;
        this.player = find("Canvas/PlayerManager").children[0];
        // 每隔一定时间生成一个敌人
        if (this._timer >= this.spawnInterval && this._enemies.length < this.maxEnemies && ZHSK_GameManager.Instance._win == null && ZHSK_GameManager.Instance._Puase == false) {
            this._timer = 0;
            this.spawnEnemy();
        }
        else {

        }

        // 清理已经被销毁的敌人
        this.checkEnemies();
    }



    spawnEnemy() {
        function randomInt(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        if (ZHSK_PlayerManager.PlayerLevel == 0) {
            const randomnumber: number = randomInt(0, 0);

            ZHSK_PlayerManager.k = randomnumber;
        }
        else if (ZHSK_PlayerManager.PlayerLevel == 1) {
            const randomnumber: number = randomInt(0, 4);
            ZHSK_PlayerManager.k = randomnumber;
        }
        else if (ZHSK_PlayerManager.PlayerLevel == 2) {
            const randomnumber: number = randomInt(0, 4);
            ZHSK_PlayerManager.k = randomnumber;
        }
        else if (ZHSK_PlayerManager.PlayerLevel == 3) {
            const randomnumber: number = randomInt(2, 5);
            ZHSK_PlayerManager.k = randomnumber;
        }
        else if (ZHSK_PlayerManager.PlayerLevel == 4) {
            const randomnumber: number = randomInt(3, 6);
            ZHSK_PlayerManager.k = randomnumber;
        }
        else if (ZHSK_PlayerManager.PlayerLevel == 5) {
            const randomnumber: number = randomInt(3, 7);
            ZHSK_PlayerManager.k = randomnumber;

        }
        else if (ZHSK_PlayerManager.PlayerLevel == 6) {
            const randomnumber: number = randomInt(4, 7);
            ZHSK_PlayerManager.k = randomnumber;

        }
        else if (ZHSK_PlayerManager.PlayerLevel == 7) {
            const randomnumber: number = randomInt(5, 9);
            ZHSK_PlayerManager.k = randomnumber;

        }
        else if (ZHSK_PlayerManager.PlayerLevel == 8) {
            const randomnumber: number = randomInt(6, 8);
            ZHSK_PlayerManager.k = randomnumber;

        }
        else if (ZHSK_PlayerManager.PlayerLevel == 9) {
            const randomnumber: number = randomInt(6, 9);
            ZHSK_PlayerManager.k = randomnumber;

        }

        if (ZHSK_PlayerManager.PlayerLevel == ZHSK_PlayerManager.k && ZHSK_PlayerManager.PlayerLevel > 3) {
            const randomnumber: number = randomInt(0, 20);
            if (randomnumber < 18) {
                return

            }
            if (ZHSK_PlayerManager.PlayerLevel == ZHSK_PlayerManager.k + 1 && ZHSK_PlayerManager.PlayerLevel > 3) {
                const randomnumber: number = randomInt(0, 9);
                if (randomnumber < 7) {
                    return

                }

            }
        }
        //const uiTransform = this.spawnArea.getComponent(UITransform);//获取组件
        // 随机生成角度和距离
        let angle;
        let getangle = () => {
            angle = Math.random() * Math.PI * 2; // 随机角度
            if (Math.cos(angle) == 0 || Math.sin(angle) == 0) {
                getangle();
            }
        }
        getangle();
        const distance = this.minSpawnRadius + Math.random() * (this.maxSpawnRadius - this.minSpawnRadius); // 随机距离
        // 计算敌人位置
        if (director.getScene().name == "ZHSK_JDMSGame") {
            this.playerPos = this.player.position;
        }
        else {
            this.playerPos = this.player.worldPosition;
        }


        let x = this.playerPos.x + Math.cos(angle) * distance;
        let y = this.playerPos.y + Math.sin(angle) * distance;

        // const spawnAreaWidth = uiTransform.width; // 方形区域的宽度
        // const spawnAreaHeight = uiTransform.height; // 方形区域的高度
        // const spawnAreaPos = this.spawnArea.worldPosition; // 方形区域的位置
        // x = Math.max(spawnAreaPos.x - spawnAreaWidth / 2, Math.min(x, spawnAreaPos.x + spawnAreaWidth / 2));
        // y = Math.max(spawnAreaPos.y - spawnAreaHeight / 2, Math.min(y, spawnAreaPos.y + spawnAreaHeight / 2));
        const enemy = instantiate(this.enemyPrefab_list[ZHSK_PlayerManager.k]);
        enemy.setWorldPosition(new Vec3(x, y, 0));
        if (director.getScene().name == "ZHSK_JDMSGame") {
            enemy.setScale(enemy.scale.x, enemy.scale.y, 1);
        }
        else {
            enemy.setScale(enemy.scale.x * 5, enemy.scale.y * 5, 1);
        }

        this.node.addChild(enemy);
        // if (director.getScene().name == "ZHSK_BFHZGame") {
        //     enemy.setScale(enemy.scale.x, enemy.scale.y, 1);
        // }
        this._enemies.push(enemy);
    }


    checkEnemies() {
        if (!this.player) return;

        // 遍历所有敌人
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            const enemy = this._enemies[i];
            if (!enemy) {
                continue;
            }

            // 计算玩家与敌人的距离
            const playerPos = this.player.worldPosition;
            const enemyPos = enemy.worldPosition;
            const distance = Vec3.distance(playerPos, enemyPos);
            if (ZHSK_GameManager.Instance._win == false) {
                this._enemies.splice(i, 1);
                enemy.destroy();
            }
            // 如果玩家离开敌人超过销毁半径，销毁敌人
            if (distance > this.maxSpawnRadius) {

                this._enemies.splice(i, 1); // 从数组中移除
                enemy.destroy();


            }
        }
    }
    reomeEnemy(OtherEnemy: Node) {
        const index = this._enemies.findIndex(e => e == OtherEnemy);
        if (index != -1) {
            this.scheduleOnce(() => {
                if (this._enemies[index] != null)
                    this._enemies[index].destroy();

                this._enemies.splice(index, 1);
            })
        }
        return;
    }

}
