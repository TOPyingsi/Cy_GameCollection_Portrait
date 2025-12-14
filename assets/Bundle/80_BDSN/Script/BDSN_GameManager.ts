import { _decorator, AudioClip, BoxCollider2D, Component, find, instantiate, Label, Node, Prefab, tween, UITransform, v2, Vec2, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { BDSN_Box } from './BDSN_Box';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BDSN_GameManager')
export class BDSN_GameManager extends Component {
    public static instance: BDSN_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) gameArea: Node = null;

    @property({ type: Prefab, displayName: "便当" }) bd: Prefab = null;
    @property({ type: Prefab, displayName: "便当虾" }) bdx: Prefab = null;

    @property(Node) grids: Node = null;
    @property([Node]) knifes: Node[] = [];
    @property([Node]) chs: Node[] = [];
    @property(Node) nextBtn: Node = null;
    @property(Node) mask: Node = null;

    @property(AudioClip) cutAuido: AudioClip = null;
    @property(Prefab) answer: Prefab = null;

    private cuttrntKnife: Node = null;

    bds: Node[] = [];
    gridNodes: Node[][] = [
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null]
    ]; // 二维数组存储节点

    /** 0代表无 1代表便当 2代表便当虾  */
    private list1: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

        ];
    private list2: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

        ];
    private list3: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 2, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
    private list4: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 2, 0, 0, 0, 0, 0, 0,
            0, 2, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
    private list5: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 2, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];

    private winList1: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]

    private winList2: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

        ];
    private winList3: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 2, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
    private winList4: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 2, 2, 1, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
    private winList5: number[] =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 2, 0,
            0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 2, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];

    winlist: number[] = [];
    level = 1;

    protected onLoad(): void {
        BDSN_GameManager.instance = this;
        this.showKnife(this.knifes[this.level - 1]);
        this.showCH(this.chs[this.level - 1]);
        // this.scheduleOnce(() => {
        //     this.cuttrntKnife.getChildByName("Y").getComponent(BoxCollider2D).enabled = false;
        // }, 0)
    }

    protected start(): void {
        this.init();
        this.btnTween()
        this.gamePanel.answerPrefab = this.answer;
    }

    btnTween() {
        tween(this.nextBtn)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .union().repeatForever().start()
    }

    init() {
        if (this.level % 5 == 1) this.loadBD(this.list1, this.winList1);
        if (this.level % 5 == 2) this.loadBD(this.list2, this.winList2);
        if (this.level % 5 == 3) this.loadBD(this.list3, this.winList3);
        if (this.level % 5 == 4) this.loadBD(this.list4, this.winList4);
        if (this.level % 5 == 0) this.loadBD(this.list5, this.winList5);
    }

    nummber: number = 0;

    loadBD(list: number[], winList: number[]) {
        this.gridNodes = Array.from({ length: 9 }, () => Array(10).fill(null));
        this.showKnife(this.knifes[this.level - 1]);
        this.showCH(this.chs[this.level - 1]);
        this.winlist = winList;

        list.forEach((item, index) => {
            // 获取当前行列
            const row = Math.floor(index / 10);
            const col = index % 10;

            this.grids.children[index].getChildByName("Label").getComponent(Label).string = `(${row}_${col})`;
            if (item == 1 || item == 2) {
                const prefab = item == 1 ? this.bd : this.bdx;
                const instance = instantiate(prefab);

                console.log(`当前行列: ${row}, ${col}`);

                // 检查四个方向是否有相邻对象
                const hasTop = row > 0 && list[index - 10] > 0;
                const hasBottom = row < 8 && list[index + 10] > 0;
                const hasLeft = col > 0 && list[index - 1] > 0;
                const hasRight = col < 9 && list[index + 1] > 0;

                if (item == 1) {
                    const boxCom = instance.getComponent(BDSN_Box);
                    boxCom.init(hasTop, hasBottom, hasLeft, hasRight, row, col, 1);
                }
                if (item == 2) {
                    const boxCom = instance.getComponent(BDSN_Box);
                    boxCom.init(hasTop, hasBottom, hasLeft, hasRight, row, col, 2);
                }

                instance.setParent(this.gameArea);
                const worldPos = this.grids.children[index].getWorldPosition();
                const localPos = this.gameArea.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
                instance.setPosition(localPos.x, localPos.y - 1000);
                instance.setSiblingIndex(find("Canvas/GameArea/Refesh").getSiblingIndex() + 1)
                // instance.name = `${row}_${col}`;

                tween(instance)
                    .to(0.5, { position: localPos })
                    .start();

                this.bds.push(instance)
                this.gridNodes[row][col] = instance;
            }
        })
    }

    private isCut: boolean = false;
    cut() {
        AudioManager.Instance.PlaySFX(this.cutAuido)
        if (this.level == 5) {
            this.scheduleOnce(() => {
                this.knifes[this.level - 1].getChildByName("Y").getComponent(BoxCollider2D).enabled = true;
                this.knifes[this.level].getChildByName("Y").getComponent(BoxCollider2D).enabled = true;
            }, 0)
            this.isCut = !this.isCut;
            const kinfe1 = this.knifes[this.level - 1]
            const kinfe2 = this.knifes[this.level]
            const node1 = kinfe1.getChildByName("Y")
            const node2 = kinfe2.getChildByName("Y")
            const height1 = kinfe1.getComponent(UITransform).height
            const height2 = kinfe2.getComponent(UITransform).height
            if (this.isCut) {
                tween(node1)
                    .to(0.1, { position: new Vec3(0, (height1 / 2), 0) })
                    .call(() => {
                        this.scheduleOnce(() => {
                            node1.getComponent(BoxCollider2D).enabled = false;
                        }, 0)
                    })
                    .start()
                tween(node2)
                    .to(0.1, { position: new Vec3(0, (height2 / 2), 0) })
                    .call(() => {
                        this.scheduleOnce(() => {
                            node2.getComponent(BoxCollider2D).enabled = false;
                        }, 0)
                    })
                    .start()
            } else {
                tween(node1)
                    .to(0.1, { position: new Vec3(0, -(height1 / 2), 0) })
                    .call(() => {
                        this.scheduleOnce(() => {
                            node1.getComponent(BoxCollider2D).enabled = false;
                        }, 0)
                    })
                    .start()
                tween(node2)
                    .to(0.1, { position: new Vec3(0, -(height2 / 2), 0) })
                    .call(() => {
                        this.scheduleOnce(() => {
                            node2.getComponent(BoxCollider2D).enabled = false;
                        }, 0)
                    })
                    .start()
            }
        } else {
            this.isCut = !this.isCut;
            const kinfe = this.knifes[this.level - 1]
            const node = kinfe.getChildByName("Y")
            const height = kinfe.getComponent(UITransform).height
            const collider = node.getComponent(BoxCollider2D)
            this.scheduleOnce(() => {
                collider.enabled = true;
            }, 0)

            if (this.isCut) {
                tween(node)
                    .to(0.1, { position: new Vec3(0, (height / 2), 0) })
                    .call(() => {
                        this.scheduleOnce(() => {
                            collider.enabled = false;
                        }, 0)
                    })
                    .start()
            } else {
                tween(node)
                    .to(0.1, { position: new Vec3(0, -(height / 2), 0) })
                    .call(() => {
                        this.scheduleOnce(() => {
                            collider.enabled = false;
                        }, 0)
                    })
                    .start()
            }
        }

    }

    showKnife(node: Node) {
        // this.cuttrntKnife = node;
        // this.cuttrntKnife.getChildByName("Y").getComponent(BoxCollider2D).enabled = false;
        // this.knifes[0].active = this.knifes[0] == node;
        // this.knifes[1].active = this.knifes[1] == node;
        // this.knifes[2].active = this.knifes[2] == node;
        // this.knifes[3].active = this.knifes[3] == node;
        // this.knifes[4].active = this.knifes[4] == node;

        switch (this.level) {
            case 1:
                this.knifes[0].active = true;
                this.knifes[1].active = false;
                this.knifes[2].active = false;
                this.knifes[3].active = false;
                this.knifes[4].active = false;
                this.knifes[5].active = false;

                this.knifes[0].getChildByName("Y").getComponent(BoxCollider2D).enabled = false;
                break;
            case 2:
                this.knifes[0].active = false;
                this.knifes[1].active = true;
                this.knifes[2].active = false;
                this.knifes[3].active = false;
                this.knifes[4].active = false;
                this.knifes[5].active = false;

                this.knifes[1].getChildByName("Y").getComponent(BoxCollider2D).enabled = false;
                break;
            case 3:
                this.knifes[0].active = false;
                this.knifes[1].active = false;
                this.knifes[2].active = true;
                this.knifes[3].active = false;
                this.knifes[4].active = false;
                this.knifes[5].active = false;

                this.knifes[2].getChildByName("Y").getComponent(BoxCollider2D).enabled = false;

                break;
            case 4:
                this.knifes[0].active = false;
                this.knifes[1].active = false;
                this.knifes[2].active = false;
                this.knifes[3].active = true;
                this.knifes[4].active = false;
                this.knifes[5].active = false;

                this.knifes[3].getChildByName("Y").getComponent(BoxCollider2D).enabled = false;

                break;
            case 5:
                this.knifes[0].active = false;
                this.knifes[1].active = false;
                this.knifes[2].active = false;
                this.knifes[3].active = false;
                this.knifes[4].active = true;
                this.knifes[5].active = true;

                this.knifes[4].getChildByName("Y").getComponent(BoxCollider2D).enabled = false;
                this.knifes[5].getChildByName("Y").getComponent(BoxCollider2D).enabled = false;
                break;
        }
    }

    currentCh: Node = null;

    showCH(node: Node) {
        this.currentCh = node;
        this.chs[0].active = this.chs[0] == node;
        this.chs[1].active = this.chs[1] == node;
        this.chs[2].active = this.chs[2] == node;
        this.chs[3].active = this.chs[3] == node;
        this.chs[4].active = this.chs[4] == node;
    }

    checkWinCondition(): boolean {
        console.log("checkWinCondition", this.winlist);
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 10; col++) {
                const expectedType = this.winlist[row * 10 + col];
                const actualNode = this.gridNodes[row][col];
                const actualType = actualNode ? actualNode.getComponent(BDSN_Box)?.type : 0;

                // 如果winlist要求这个位置有食物
                if (expectedType > 0) {
                    if (!actualNode || actualType !== expectedType) {
                        console.log(`没有节点或类型不匹配 (${row},${col}): expected ${expectedType}, got ${actualType}`);
                        return false;
                    }
                }
                // 如果winlist要求这个位置没有食物
                else if (expectedType === 0) {
                    // 但实际上有节点
                    if (actualNode) {
                        console.log(`这个位置没有食物 (${row},${col}): expected empty, got node`);
                        return false;
                    }
                }
            }
        }
        console.warn("Win condition met!");
        return true;
    }


    refesh() {
        this.bds.forEach(e => {
            e.destroy()
        })
        this.bds = []
        this.init();
    }

    next() {
        this.bds.forEach(e => {
            e.destroy()
        })
        this.bds = []
        this.level++;
        this.init();
        this.nextBtn.active = false;
        this.mask.active = false
    }
}