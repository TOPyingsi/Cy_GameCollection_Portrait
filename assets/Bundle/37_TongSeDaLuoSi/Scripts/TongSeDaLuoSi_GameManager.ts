import { _decorator, Component, director, Event, Label, Node, PhysicsSystem2D, Prefab, randomRangeInt, RigidBody2D, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { TongSeDaLuoSi_GameUI } from './TongSeDaLuoSi_GameUI';
import { TongSeDaLuoSi_Nail } from './TongSeDaLuoSi_Nail';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { TongSeDaLuoSi_Box } from './TongSeDaLuoSi_Box';
import Banner from 'db://assets/Scripts/Banner';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('TongSeDaLuoSi_GameManager')
export class TongSeDaLuoSi_GameManager extends Component {

    private static instance: TongSeDaLuoSi_GameManager;
    static get Instance(): TongSeDaLuoSi_GameManager {
        return this.instance;
    }

    @property(Node)
    Levels: Node;
    @property(Node)
    boxes: Node;
    @property(Node)
    videoBoxes: Node;
    @property(Node)
    holes: Node;
    @property(Node)
    revivePanel: Node;
    @property(Prefab)
    boxPrefab: Prefab;
    @property(Prefab)
    nailPrefab: Prefab;
    @property([SpriteFrame])
    nailSfs: SpriteFrame[] = [];
    @property([SpriteFrame])
    boxSfs: SpriteFrame[] = [];
    @property([SpriteFrame])
    nailBottomSfs: SpriteFrame[] = [];

    woodArr: Node[] = [];
    nailArr: TongSeDaLuoSi_Nail[] = [];
    colorArr: number[] = [0, 0, 0, 0];
    currentBox: TongSeDaLuoSi_Box[] = [];
    nailPos: Vec3[][] = [[v3(0, 115), v3(0, 60)], [v3(-50, 35), v3(-50, -20)], [v3(50, 35), v3(50, -20)]]
    holeColor: number[] = [-1, -1, -1, -1, -1];
    maxBox: number = 2;
    realNails = 0;

    levelNum = 0;
    currentNail: Node;
    lock: Node;
    isEnd = false;

    protected onLoad(): void {
        TongSeDaLuoSi_GameManager.instance = this;
        console.log(PhysicsSystem2D.instance.gravity)
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
        else this.Init();
    }

    Init() {
        this.InitNails();
        this.InitBox();
    }

    start() {
    }

    update(deltaTime: number) {

    }

    InitNails() {
        for (let i = 0; i < this.Levels.children.length; i++) {
            const element = this.Levels.children[i];
            this.woodArr.push(element);
            for (let j = 0; j < element.children.length; j++) {
                const element2 = element.children[j].getComponent(TongSeDaLuoSi_Nail);
                this.nailArr.push(element2);
            }
        }
        let nailGroups = this.nailArr.length / 3;
        for (let i = 0; i < nailGroups; i++) {
            const element = randomRangeInt(0, 4);
            this.colorArr[element]++;
        }
        let arr = [...this.nailArr];
        for (let i = 0; i < this.colorArr.length; i++) {
            const element = this.colorArr[i];
            for (let j = 0; j < element; j++) {
                for (let k = 0; k < 3; k++) {
                    let num = randomRangeInt(0, arr.length);
                    let nail = arr[num];
                    nail.Init(i, this.nailSfs[i]);
                    arr.splice(num, 1);
                }
            }
        }
    }

    InitBox() {
        for (let i = 0; i < this.maxBox; i++) {
            if (this.currentBox[i] && this.currentBox[i].realNailNum < 3) {
                let node = this.currentBox[i].node;
                if (node.position.x != -375 + (1 - i + this.maxBox) * 250)
                    tween(node)
                        .to(0.5, { position: v3(-375 + (1 - i + this.maxBox) * 250, 0) })
                        .start();
            }
            else {
                // let colors: number[] = [0, 0, 0, 0];
                // for (let j = 0; j < this.nailArr.length; j++) {
                //     const element2 = this.nailArr[j];
                //     if (element2.contacts.length == 0) colors[element2.type]++;
                // }
                // let color = -1;
                // for (let j = 0; j < colors.length; j++) {
                //     const element2 = colors[j];
                //     if (color == -1 && element2 > 0 || element2 > colors[color]) color = j;
                // }
                // if (color == -1) return;
                let colors: number[] = [];
                for (let j = 0; j < this.colorArr.length; j++) {
                    const element = this.colorArr[j];
                    if (element > 0) colors.push(j);
                }
                if (colors.length == 0) return;
                let color = colors[randomRangeInt(0, colors.length)];
                this.colorArr[color]--;
                const element: Node = PoolManager.GetNodeByPrefab(this.boxPrefab, this.boxes);
                element.setPosition(v3(-1000, 0));
                element.getComponent(TongSeDaLuoSi_Box).Init(color, this.boxSfs[color]);
                this.currentBox.push(element.getComponent(TongSeDaLuoSi_Box));
                tween(element)
                    .to(0.5, { position: v3(-375 + (1 - i + this.maxBox) * 250, 0) })
                    .call(() => {
                        this.CheckNail();
                    })
                    .start();
            }
        }
    }

    CheckNail() {
        for (let i = 0; i < this.holeColor.length; i++) {
            const element = this.holeColor[i];
            if (element == -1) continue;
            for (let j = 0; j < this.currentBox.length; j++) {
                const element2 = this.currentBox[j];
                if (element2.type == element && element2.nailNum < 3) {
                    this.realNails--;
                    this.holeColor[i] = -1;
                    element2.nailNum++;
                    let nail = this.holes.children[i].children[0];
                    let nailHead = nail.children[1];
                    let nailBottom = nail.children[0].children[0];
                    nailBottom.position = Vec3.ZERO;
                    nailHead.angle = 0;
                    tween(nail)
                        .to(0.4, { worldPosition: element2.node.worldPosition })
                        .call(() => {
                            nail.setParent(element2.node, true);
                        })
                        .to(0.1, { position: this.nailPos[element2.nailNum - 1][0] })
                        .to(0.5, { position: this.nailPos[element2.nailNum - 1][1] })
                        .call(() => {
                            element2.CheckFull();
                        })
                        .start();
                    tween(nailBottom)
                        .delay(0.5)
                        .to(0.5, { position: v3(0, 50) })
                        .start();
                    tween(nailHead)
                        .delay(0.5)
                        .to(0.5, { angle: 360 })
                        .start();
                    break;
                }
            }
        }
    }

    UnlockBox(event: Event) {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            x.videoBoxes.children[x.maxBox - 2].active = false;
            x.maxBox++;
            this.InitBox();
        })
    }

    //115 60
    RemoveNail(target: Node) {
        let type = target.getComponent(TongSeDaLuoSi_Nail).type;
        let num = -1;
        for (let i = 0; i < this.currentBox.length; i++) {
            const element = this.currentBox[i];
            if (element.type == type && element.nailNum < 3) {
                num = i;
                break;
            }
        }
        if (num == -1 && this.realNails == 5) return;
        target.active = false;
        let nail: Node = PoolManager.GetNodeByPrefab(this.nailPrefab, this.Levels);
        let nailHead = nail.children[1];
        let nailBottom = nail.children[0].children[0];
        nail.setWorldPosition(target.getWorldPosition());
        nailBottom.position = Vec3.ZERO;
        nailHead.angle = 0;
        nailHead.getComponent(Sprite).spriteFrame = this.nailSfs[type];
        nailBottom.getComponent(Sprite).spriteFrame = this.nailBottomSfs[type];
        if (num != -1) {
            let box = this.currentBox[num];
            box.nailNum++;
            tween(nail)
                .to(0.4, { worldPosition: box.node.worldPosition })
                .call(() => {
                    nail.setParent(box.node, true);
                })
                .to(0.1, { position: this.nailPos[box.nailNum - 1][0] })
                .to(0.5, { position: this.nailPos[box.nailNum - 1][1] })
                .call(() => {
                    box.CheckFull();
                })
                .start();
            tween(nailBottom)
                .delay(0.5)
                .to(0.5, { position: v3(0, 50) })
                .start();
            tween(nailHead)
                .delay(0.5)
                .to(0.5, { angle: 360 })
                .start();
        }
        else {
            this.realNails++;
            for (let i = 0; i < this.holeColor.length; i++) {
                const element = this.holeColor[i];
                if (element == -1) {
                    num = i;
                    break;
                }
            }
            this.holeColor[num] = type;
            let hole = this.holes.children[num];
            tween(nail)
                .to(0.4, { worldPosition: hole.worldPosition })
                .call(() => {
                    nail.setParent(hole, true);
                })
                .to(0.1, { position: v3(0, 60) })
                .to(0.5, { position: Vec3.ZERO })
                .call(() => {
                    this.CheckHole();
                })
                .start();
            tween(nailBottom)
                .delay(0.5)
                .to(0.5, { position: v3(0, 50) })
                .start();
            tween(nailHead)
                .delay(0.5)
                .to(0.5, { angle: 360 })
                .start();
        }
    }

    CheckHole() {
        for (let i = 0; i < this.holeColor.length; i++) {
            const element = this.holeColor[i];
            if (element == -1) return;
        }
        // this.revivePanel.active = true;
        //失败
        if (this.isEnd) return;
        this.isEnd = true;
        TongSeDaLuoSi_GameUI.Instance.Fail();
    }

    RemoveBox(box: TongSeDaLuoSi_Box) {
        let lid = box.node.children.find((value, index, obj) => { if (value.name == "盒盖") return value; });
        lid.setSiblingIndex(box.node.children.length - 1);
        lid.setPosition(v3(0, 500));
        lid.active = true;
        tween(lid)
            .to(0.5, { position: Vec3.ZERO })
            .call(() => {
                tween(box.node)
                    .by(0.5, { position: v3(0, 1000) })
                    .call(() => {
                        this.currentBox.splice(this.currentBox.indexOf(box), 1);
                        this.InitBox();
                    })
                    .start();
            })
            .start();
    }

    SpliceWoodArr(start: number, delectCount: number) {
        this.woodArr.splice(start, delectCount);
        console.log(this.woodArr);
        if (this.woodArr.length == 0) {
            if (this.isEnd) return;
            this.isEnd = true;
            TongSeDaLuoSi_GameUI.Instance.Victory();
        }
    }
}
