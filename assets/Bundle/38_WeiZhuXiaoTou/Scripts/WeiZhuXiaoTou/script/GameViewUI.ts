import { _decorator, Component, Animation, Node, Prefab, AudioClip, Vec2, Event, instantiate, JsonAsset, resources, tween, v3, assetManager } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('WZXT_GameViewUI')
export default class WZXT_GameViewUI extends Component {
    private static instance: WZXT_GameViewUI;
    static get Instance() {
        return this.instance;
    }
    @property(Animation)
    xiaotou: Animation;
    @property(Node)
    maps: Node;
    @property(Node)
    WinView: Node;
    @property(Node)
    LoseView: Node;
    @property(Node)
    ExitView: Node;
    @property(Node)
    TipView: Node;
    @property(Prefab)
    image: Prefab;
    @property(Prefab)
    cop: Prefab;
    @property(Prefab)
    answer: Prefab;
    @property(AudioClip)
    buttonSound: AudioClip;
    @property(GamePanel)
    panel: GamePanel;
    @property
    levelNum: number = 0;
    // levedata: levelData = null;
    // roledata: roleData = null;
    oldTImer = 10;
    static item = [];
    static item2 = [];
    static DuoCangPoint = [0, 0, 0, 0, 0, 0];
    static DuoCangPeople: Array<Node> = [null, null, null, null, null, null];
    static MonsterAtkTime = false;
    downPointX = 0;
    player: Node;
    playerSpeed: number = 0;
    //记录玩家躲藏之后 的bg的位置
    oldPlayerPoint = 0;
    isDuoCang = false;
    miGongArray = []
    moveArray = [];
    dir = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1]];
    dir2 = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, -1], [-1, -1]];
    movePathArray = [//155，155 -775 -465
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
        [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
    ]
    /**
     * 墙壁
     */
    notMovePointArray = [];
    startPoint = new Vec2();
    endPoint: Array<Vec2> = [];
    allPath = [];
    isGameOvew = false;
    isMove = false;
    miGongWidth = 0;
    miGongHeight = 0;
    levelData;
    isBaoWei = false;
    isEnd = false;
    protected onLoad(): void {
        WZXT_GameViewUI.instance = this;
        // UIManager.Instance.FadeOutBlackMask();
        // TreasureBox.ShowTreasureBox();
        this.panel.answerPrefab = this.answer;
        this.panel.winStr = "终于抓到你了！";
        this.panel.lostStr = "被逃掉了！";
    }
    in(x: number, y: number): boolean {
        return 0 <= x && x < this.miGongHeight && 0 <= y && y < this.miGongWidth;
    }
    Print_Path()//打印路径
    {
        //起始点
        var x = this.startPoint.x, y = this.startPoint.y;
        var arr = [];
        var arrAll = [];
        while (x != -2 && y != -2) {
            // console.log("(" + x + "," + y + ")");
            var tem = x;
            x = this.movePathArray[x][y].x;
            y = this.movePathArray[tem][y].y;
            arr.push(new Vec2(x, y));

            for (var i = 0; i < this.endPoint.length; i++) {
                if (x == this.endPoint[i].x && y == this.endPoint[i].y) {
                    if (arr.length > 0) {
                        arrAll = arr;
                    }
                    arr = [];
                }
            }
        }
        if (arrAll.length > 0) {
            this.allPath.push(arrAll);
        }
        var t;
        for (var j = 0; j < this.allPath.length; j++) {
            for (var k = 0; k < this.allPath.length; k++) {
                if (this.allPath[j].length < this.allPath[k].length) {
                    t = this.allPath[j];
                    this.allPath[j] = this.allPath[k];
                    this.allPath[k] = t;
                }
            }
        }
    }
    onEnable() {
        // this.levedata = <levelData>DataMgr.Self.getData(DataName.levelData);
        // this.roledata = <roleData>DataMgr.Self.getData(DataName.roleData);
        assetManager.getBundle("38_WeiZhuXiaoTou").load("level", JsonAsset, (err: Error, asset: JsonAsset) => {
            if (err) {
                console.log(err);
                return;
            }
            else {
                this.levelData = asset.json;
                // this.initBtn();
                var arr = this.levelData[this.levelNum]['level_' + (this.levelNum + 1)].split(";");
                for (var i = 0; i < arr.length; i++) {
                    var one = [];
                    var k = arr[i].split(",");
                    for (var j = 0; j < k.length; j++) {
                        one.push(parseInt(k[j]));
                    }
                    this.miGongArray.push(one);
                }
                this.miGongHeight = this.miGongArray.length;
                this.miGongWidth = this.miGongArray[0].length;
                // stage.on(Event.CLICK, this, this.BFS);
                //创建地板
                this.createFloor();
                // this.BFS();
            }
        });
    }
    createFloor() {
        for (var i = 0; i < this.miGongArray.length; i++) {
            for (var j = 0; j < this.miGongArray[0].length; j++) {
                this.createImg(this.image, (j + 1), (i + 1), "cube_" + (i * this.miGongHeight + j), true);

                if (this.miGongArray[i][j] == 1) {
                    this.createImg(this.cop, (j + 1), (i + 1), "zhangai");
                }
                if (this.miGongArray[i][j] == -1) {
                    if ((i + 1) % 2 == 0) {

                        this.xiaotou.node.setPosition(v3(70 * (j + 1) + 35, 60 * (i + 1) + 300));
                    } else {
                        this.xiaotou.node.setPosition(v3(70 * (j + 1) - 34 + 35, 60 * (i + 1) + 300));
                    }
                    this.xiaotou.node.setSiblingIndex(99999);
                    this.xiaotou.node.active = true;
                    // this.xiaotou.play("stand");
                }
            }
        }
        this.xiaotou.node.setSiblingIndex(99999);
    }
    createImg(prefab: Prefab, j: number, i: number, str?: string, isOn?: boolean, pos?: Vec2) {
        var im = instantiate(prefab);
        // im.anchorX = im.anchorY = 0.5;
        // im.scaleX = im.scaleY = 0.5;
        im.setScale(v3(0.5, 0.5, 0.5));
        if (str) {
            im.name = str;
        }
        if (isOn) {
            im.children[0].on(Node.EventType.TOUCH_END, this.onClick, this);
        }
        if (j != -1) {
            if (i % 2 == 0) {
                im.setPosition(v3(70 * j + 35, 60 * i + 300));
            } else {
                im.setPosition(v3(70 * j - 34 + 35, 60 * i + 300));
            }
        } else {
            im.setPosition(v3(pos.x, pos.y));
        }
        this.maps.addChild(im);
    }
    BFS() {
        this.endPoint = [];
        for (var i = 0; i < this.miGongArray.length; i++) {
            for (var j = 0; j < this.miGongArray[i].length; j++) {

                if (this.isBaoWei) {
                    if (this.miGongArray[i][j] == -1) {
                        this.startPoint.x = i;
                        this.startPoint.y = j;
                    } else if (this.miGongArray[i][j] == 0 || this.miGongArray[i][j] == 3) {
                        this.endPoint.push(new Vec2(i, j));
                        this.movePathArray[i][j].x = -2;
                        this.movePathArray[i][j].y = -2;
                    }
                } else {
                    if (this.miGongArray[i][j] == -1) {
                        this.startPoint.x = i;
                        this.startPoint.y = j;
                    } else if (this.miGongArray[i][j] == -2) {
                        this.endPoint.push(new Vec2(i, j));
                        this.movePathArray[i][j].x = -2;
                        this.movePathArray[i][j].y = -2;
                    }
                }
            }
        }
        for (var k = 0; k < this.endPoint.length; k++) {
            this.moveArray.push(new Vec2(this.endPoint[k].x, this.endPoint[k].y));
        }
        console.log(this.moveArray);
        // this.miGongArray[indexI][indexJ] = 2;
        while (this.moveArray.length > 0) {
            var p = this.moveArray[0];
            this.moveArray.shift();
            var x = p.x;
            var y = p.y;
            if (x == 4 && y == 4) {
                console.log(p)
            }
            var isWinArr = [];
            if (!this.isBaoWei) {
                for (var b = 0; b < 6; b++) {

                    //检测是否四周不可行走
                    if (this.startPoint.x % 2 == 0) var d = this.dir2;
                    else var d = this.dir;
                    var tx1 = this.startPoint.x + d[b][0];
                    var ty1 = this.startPoint.y + d[b][1];
                    if (this.in(tx1, ty1)) {
                        if (this.miGongArray[tx1][ty1] == -2 ||
                            this.miGongArray[tx1][ty1] == 1) {
                            isWinArr.push(this.miGongArray[tx1][ty1]);
                        }
                    }
                    if (isWinArr.length >= 6) {
                        setTimeout(() => {
                            // this.WinView.active = true;
                            // Banner.Instance.ShowNativeAd();
                            // if (GameData.currentLevel == GameData.Level) GameData.Level++;
                            // TreasureBox.ShowTreasureBox();
                            if (this.isEnd) return;
                            this.isEnd = true;
                            console.log("游戏胜利");
                            this.panel.Win();
                        }, 500);
                        return;
                    }
                }
            }
            for (var c = 0; c < 6; c++) {
                var point: Vec2 = new Vec2();
                if (x % 2 == 0) var d = this.dir2;
                else var d = this.dir;
                point.x = (x + d[c][0]);
                point.y = (y + d[c][1]);
                var tx = x + d[c][0];
                var ty = y + d[c][1];
                //右左下上
                if (this.in(tx, ty)) {
                    if (this.miGongArray[tx][ty] == -1) {
                        this.movePathArray[tx][ty].x = (x)
                        this.movePathArray[tx][ty].y = (y)
                        this.Print_Path();
                    }
                    if (this.miGongArray[tx][ty] == 0) {
                        if (this.isBaoWei) {
                            this.miGongArray[tx][ty] = 3;
                        } else {
                            this.movePathArray[tx][ty].x = (x)
                            this.movePathArray[tx][ty].y = (y)
                            this.miGongArray[tx][ty] = 2;
                        }
                        this.moveArray.push(point);
                    }
                }
            }
        }
        console.log(this.startPoint, this.allPath);
        if (this.allPath.length <= 0) {
            console.log("被包围了");
            if (!this.isBaoWei) {
                this.isBaoWei = true;
                this.BFS();
            } else {
                this.isGameOvew = true;
                setTimeout(() => {
                    // this.WinView.active = true;
                    // Banner.Instance.ShowNativeAd();
                    // if (GameData.currentLevel == GameData.Level) GameData.Level++;
                    // TreasureBox.ShowTreasureBox();
                    if (this.isEnd) return;
                    this.isEnd = true;
                    console.log("游戏胜利");
                    this.panel.Win();
                }, 500);
            }
            return;
        }
        var str = "cube_" + (this.allPath[0][0].x * this.miGongHeight + this.allPath[0][0].y);
        console.log(str);
        var im = (this.maps.getChildByName(str) as Node);
        // this.xiaotou.play("walk");
        var xx = this.xiaotou.node.position.x;
        if (xx < im.position.x) this.xiaotou.node.setScale(v3(0.6, this.xiaotou.node.scale.y));
        else this.xiaotou.node.setScale(v3(-0.6, this.xiaotou.node.scale.y));
        tween(this.xiaotou.node)
            .to(0.3, { position: im.position })
            .call(() => {
                this.isMove = false;
                // this.xiaotou.play("stand");
            })
            .start();
        if (this.miGongArray[this.allPath[0][0].x][this.allPath[0][0].y] == -2) {
            this.isGameOvew = true;
            setTimeout(() => {
                // this.LoseView.active = true;
                // Banner.Instance.ShowNativeAd();
                // TreasureBox.ShowTreasureBox();
                if (this.isEnd) return;
                this.isEnd = true;
                console.log("游戏失败");
                this.panel.Lost();
            }, 500);
            return;
        } else {
            this.miGongArray[this.startPoint.x][this.startPoint.y] = 0;
            this.miGongArray[this.allPath[0][0].x][this.allPath[0][0].y] = -1;
            this.startPoint.x = this.allPath[0][0].x;
            this.startPoint.x = this.allPath[0][0].y;
            this.allPath = [];
        }
    }
    Step2() {

    }
    onClick(e: Event) {
        if (!this.isGameOvew && !this.isMove) {
            for (var i = 0; i < this.miGongArray.length; i++) {
                for (var j = 0; j < this.miGongArray[0].length; j++) {
                    if (this.miGongArray[i][j] == 2) {
                        this.miGongArray[i][j] = 0;
                    }
                }
            }
            var hang = 0;
            var lie = 0;

            var num = e.target.parent.name.slice(5);
            if (parseInt(num) >= this.miGongWidth) {
                hang = Math.floor(parseInt(num) / this.miGongWidth);
                lie = parseInt(num) % this.miGongHeight;
            } else {
                hang = 0;
                lie = parseInt(num);
            }
            if (this.miGongArray[hang][lie] == -1) {
                return;
            } else {
                this.isMove = true;
                this.miGongArray[hang][lie] = 1;
                this.createImg(this.cop, -1, -1, "zhangai", false, new Vec2(e.target.parent.position.x, e.target.parent.position.y));
                // var jc = instantiate(this.cop);
                // e.target.addChild(jc);
                // jc.setPosition(0, 0);
                this.BFS();
            }
        }
    }
    // initBtn() {
    //     this.exitGame.on(Event.CLICK, this, this.onExitGame);
    //     this.back.on(Event.CLICK, this, this.onBack);
    //     this.back2.on(Event.CLICK, this, this.onBack);
    //     this.back3.on(Event.CLICK, this, this.onBack);
    //     this.next.on(Event.CLICK, this, this.onNextStep);
    //     this.goon.on(Event.CLICK, this, this.onGoOn);
    //     this.goon2.on(Event.CLICK, this, this.onGoOn);
    //     this.rest.on(Event.CLICK, this, this.onReset);
    //     this.tip.on(Event.CLICK, this, this.onVideo);
    // }
    onVideo() {
        Banner.Instance.ShowVideoAd(this.videoEnd);
    }
    videoEnd() {
        WZXT_GameViewUI.Instance.TipView.active = true;
    }
    onNextStep() {
        // GameData.currentLevel++;
        // if (GameData.currentLevel < 20) UIManager.Instance.FadeInBlackMaskBySceceName("WZXT");
        // else UIManager.Instance.FadeInBlackMaskBySceceName("WeiZhuXiaoTou");
    }
    onReset() {
        // UIManager.Instance.FadeInBlackMaskBySceceName("WZXT");
    }
    onExitGame() {
        // audioEngine.playEffect(this.buttonSound, false);
        this.ExitView.active = true;
        // Banner.Instance.ShowNativeAd();
    }
    onBack() {
        // audioEngine.playEffect(this.buttonSound, false);

        this.oldTImer = 10;
        WZXT_GameViewUI.item = [];
        WZXT_GameViewUI.item2 = [];
        WZXT_GameViewUI.DuoCangPoint = [0, 0, 0, 0, 0, 0];
        WZXT_GameViewUI.DuoCangPeople = [null, null, null, null, null, null];
        WZXT_GameViewUI.MonsterAtkTime = false;
        this.downPointX = 0;
        this.playerSpeed = 0;
        this.oldPlayerPoint = 0;
        this.isDuoCang = false;
        // UIManager.Instance.FadeInBlackMaskBySceceName("WeiZhuXiaoTou");
    }
    onGoOn() {
        // audioEngine.playEffect(this.buttonSound, false);
        this.ExitView.active = false;
        this.TipView.active = false;
    }
    // onDown(e: Event) {
    //     // console.log("点击的点", this.downPointX);
    //     if (!this.isDuoCang && !(this.player.getComponent(PlayerScript) as PlayerScript).isDie) {
    //         (this.player.children[0].getComponent(Animation)).source = "animation/People1Move.ani";
    //         (this.player.getChildAt(0) as Animation).play(0, true);
    //     } else {
    //     }
    //     this.downPointX = e.target.mouseX;
    // }
    // onUp(e: Event) {
    //     if (!this.isDuoCang && !(this.player.getComponent(PlayerScript) as PlayerScript).isDie) {
    //         (this.player.getChildAt(0) as Animation).source = "animation/People1Stand.ani";
    //         (this.player.getChildAt(0) as Animation).play(0, true);
    //     }
    //     this.downPointX = 0;
    //     this.playerSpeed = 0;
    // }
    // onMove(e: Event) {
    //     // console.log("点击的点", this.downPointX);
    //     // console.log("移动的点", e.target.mouseX);
    //     if (e.target.mouseX > this.downPointX) {
    //         if (!this.isDuoCang && !(this.player.getComponent(PlayerScript) as PlayerScript).isDie) {
    //             this.player.scaleX = 2;
    //         }
    //         this.playerSpeed = 4;
    //     } else {
    //         if (!this.isDuoCang && !(this.player.getComponent(PlayerScript) as PlayerScript).isDie) {
    //             this.player.scaleX = -2;
    //         }
    //         this.playerSpeed = -4;
    //     }
    // }
    // onDuoCang() {
    //     this.player.visible = false;
    //     this.player.scaleX = 2;
    //     WZXT_GameViewUI.DuoCangPoint[PlayerScript.playerIndex] = 1;
    //     WZXT_GameViewUI.DuoCangPeople[PlayerScript.playerIndex] = this.player;
    //     (WZXT_GameViewUI.item[PlayerScript.playerIndex].getChildAt(0) as Image).visible = false;
    //     console.log(WZXT_GameViewUI.DuoCangPeople);
    //     console.log(WZXT_GameViewUI.DuoCangPoint);
    //     this.oldPlayerPoint = this.bg.x;
    //     (this.player.getChildAt(0) as Animation).visible = false;
    //     if (this.oldTImer <= 0) {
    //         this.rect.off(Event.MOUSE_DOWN, this, this.onDown);
    //         this.rect.off(Event.MOUSE_UP, this, this.onUp);
    //         this.rect.off(Event.MOUSE_MOVE, this, this.onMove);
    //     }
    //     this.isDuoCang = true;
    //     // this.changeView.visible = true;
    // }
    // onSure() {
    //     // this.changeView.on(Event.CLICK, this, this.onChangeView);
    //     // this.exitGame.on(Event.CLICK, this, this.onExitGame);
    //     // this.back.on(Event.CLICK, this, this.onBack);
    //     // this.goon.on(Event.CLICK, this, this.onGoOn);
    //     // this.duoBtn.on(Event.CLICK, this, this.onDuoCang);
    //     this.rect.on(Event.MOUSE_DOWN, this, this.onDown);
    //     this.rect.on(Event.MOUSE_UP, this, this.onUp);
    //     this.rect.on(Event.MOUSE_MOVE, this, this.onMove);
    // }
    // onDaoJiShiLoop() {
    //     if (!WZXT_GameViewUI.MonsterAtkTime) {
    //         if (this.oldTImer <= 0) {
    //             //创建怪物
    //             WZXT_GameViewUI.MonsterAtkTime = true;
    //             if (!this.bg.getChildByName("Monster").getComponent(MonsterScript)) {
    //                 this.bg.getChildByName("Monster").addComponent(MonsterScript);
    //             }
    //             if (this.isDuoCang) {
    //                 if (this.oldTImer <= 0) {
    //                     // this.bg.x = this.Monster.x + stage.width / 2;
    //                 }
    //                 this.rect.off(Event.MOUSE_DOWN, this, this.onDown);
    //                 this.rect.off(Event.MOUSE_UP, this, this.onUp);
    //                 this.rect.off(Event.MOUSE_MOVE, this, this.onMove);
    //             }
    //             // timer.clear(this, this.onDaoJiShiLoop);
    //         } else {
    //             this.oldTImer--;
    //         }
    //     }
    // }
    // nextStep() {
    //     // this.changeView.visible = false;
    //     // this.bg2.visible = false;
    //     for (var i = 0; i < WZXT_GameViewUI.DuoCangPeople.length; i++) {
    //         if (WZXT_GameViewUI.DuoCangPeople[i] != null) {
    //             if (WZXT_GameViewUI.DuoCangPeople[i].name == "1") {
    //                 (WZXT_GameViewUI.DuoCangPeople[i].getChildAt(0) as Animation).visible = true;
    //             }
    //             WZXT_GameViewUI.DuoCangPeople[i].visible = true;
    //             WZXT_GameViewUI.DuoCangPeople[i].active = true;
    //             WZXT_GameViewUI.DuoCangPeople[i] = null;
    //         }
    //     }
    //     WZXT_GameViewUI.DuoCangPoint = [0, 0, 0, 0, 0, 0];
    //     if (this.bg)
    //         for (var i = 0; i < 15; i++) {
    //             if (i < 6) {
    //                 (this.bg.getChildAt(i).getChildByName("tag") as Image).skin = "gameui/scenario/No one.png";
    //             }
    //         }
    //     console.log(WZXT_GameViewUI.DuoCangPeople);
    //     console.log(WZXT_GameViewUI.DuoCangPoint);
    //     WZXT_GameViewUI.MonsterAtkTime = false;
    //     this.oldTImer = 10;
    //     if (this.isDuoCang) {
    //         this.bg.x = this.oldPlayerPoint;
    //     }
    //     this.isDuoCang = false;
    //     this.rect.on(Event.MOUSE_DOWN, this, this.onDown);
    //     this.rect.on(Event.MOUSE_UP, this, this.onUp);
    //     this.rect.on(Event.MOUSE_MOVE, this, this.onMove);
    //     // this.daojishi.visible = true;
    //     console.log(WZXT_GameViewUI.item2);
    //     for (var i = 0; i < WZXT_GameViewUI.item2.length; i++) {
    //         if (WZXT_GameViewUI.item2[i] != null) {
    //             WZXT_GameViewUI.item2[i].active = true;
    //         }
    //         var p = Math.floor(Math.random() * 5 + 1);
    //         (this.bg.getChildAt(7 + i).getChildByName("img") as Image).skin = "gameui/store/" + p + ".png"
    //     }
    // }
}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// const { ccclass, property } = _decorator;
//
// @ccclass
// export default class WZXT_GameViewUI extends Component {
//     private static instance: WZXT_GameViewUI;
//     static get Instance() {
//         return this.instance;
//     }
//
//     @property(Animation)
//     xiaotou: Animation;
//     @property(Node)
//     maps: Node;
//     @property(Node)
//     WinView: Node;
//     @property(Node)
//     LoseView: Node;
//     @property(Node)
//     ExitView: Node;
//     @property(Node)
//     TipView: Node;
//     @property(Prefab)
//     image: Prefab;
//     @property(Prefab)
//     cop: Prefab;
//     @property(AudioClip)
//     buttonSound: AudioClip;
//
//     // levedata: levelData = null;
//     // roledata: roleData = null;
//     oldTImer = 10;
//     static item = [];
//     static item2 = [];
//     static DuoCangPoint = [0, 0, 0, 0, 0, 0];
//     static DuoCangPeople: Array<Node> = [null, null, null, null, null, null];
//     static MonsterAtkTime = false;
//     downPointX = 0;
//     player: Node;
//     playerSpeed: number = 0;
//     //记录玩家躲藏之后 的bg的位置
//     oldPlayerPoint = 0;
//     isDuoCang = false;
//
//
//
//
//     miGongArray = []
//     moveArray = [];
//     dir = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1]];
//     dir2 = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, -1], [-1, -1]];
//     movePathArray = [//155，155 -775 -465
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//         [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0),],
//     ]
//     /**
//      * 墙壁
//      */
//     notMovePointArray = [];
//     startPoint = new Vec2();
//     endPoint: Array<Vec2> = [];
//     allPath = [];
//     isGameOvew = false;
//     isMove = false;
//     miGongWidth = 0;
//     miGongHeight = 0;
//     levelData;
//     isBaoWei = false;
//
//     protected onLoad(): void {
//         WZXT_GameViewUI.instance = this;
//         // UIManager.Instance.FadeOutBlackMask();
//         // TreasureBox.ShowTreasureBox();
//     }
//
//     in(x: number, y: number): boolean {
//         return 0 <= x && x < this.miGongHeight && 0 <= y && y < this.miGongWidth;
//     }
//     Print_Path()//打印路径
//     {
//         //起始点
//         var x = this.startPoint.x, y = this.startPoint.y;
//         var arr = [];
//         var arrAll = [];
//         while (x != -2 && y != -2) {
//             // console.log("(" + x + "," + y + ")");
//             var tem = x;
//             x = this.movePathArray[x][y].x;
//             y = this.movePathArray[tem][y].y;
//             arr.push(new Vec2(x, y));
//
//             for (var i = 0; i < this.endPoint.length; i++) {
//                 if (x == this.endPoint[i].x && y == this.endPoint[i].y) {
//                     if (arr.length > 0) {
//                         arrAll = arr;
//                     }
//                     arr = [];
//                 }
//             }
//         }
//         if (arrAll.length > 0) {
//             this.allPath.push(arrAll);
//         }
//         var t;
//         for (var j = 0; j < this.allPath.length; j++) {
//             for (var k = 0; k < this.allPath.length; k++) {
//                 if (this.allPath[j].length < this.allPath[k].length) {
//                     t = this.allPath[j];
//                     this.allPath[j] = this.allPath[k];
//                     this.allPath[k] = t;
//                 }
//             }
//         }
//     }
//     onEnable() {
//         // this.levedata = <levelData>DataMgr.Self.getData(DataName.levelData);
//         // this.roledata = <roleData>DataMgr.Self.getData(DataName.roleData);
//         resources.load("level", JsonAsset, (err: Error, asset: JsonAsset) => {
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//             else {
//                 this.levelData = asset.json;
//                 // this.initBtn();
//                 var arr = this.levelData[GameData.currentLevel]['level_' + (GameData.currentLevel + 1)].split(";");
//                 for (var i = 0; i < arr.length; i++) {
//                     var one = [];
//                     var k = arr[i].split(",");
//                     for (var j = 0; j < k.length; j++) {
//                         one.push(parseInt(k[j]));
//                     }
//                     this.miGongArray.push(one);
//                 }
//                 this.miGongHeight = this.miGongArray.length;
//                 this.miGongWidth = this.miGongArray[0].length;
//                 // stage.on(Event.CLICK, this, this.BFS);
//                 //创建地板
//                 this.createFloor();
//                 // this.BFS();
//             }
//         });
//     }
//
//     createFloor() {
//         for (var i = 0; i < this.miGongArray.length; i++) {
//             for (var j = 0; j < this.miGongArray[0].length; j++) {
//                 this.createImg(this.image, (j + 1), (i + 1), "cube_" + (i * this.miGongHeight + j), true);
//
//                 if (this.miGongArray[i][j] == 1) {
//                     this.createImg(this.cop, (j + 1), (i + 1), "zhangai");
//                 }
//                 if (this.miGongArray[i][j] == -1) {
//                     if ((i + 1) % 2 == 0) {
//
//                         this.xiaotou.node.x = 70 * (j + 1) + 35;
//                     } else {
//                         this.xiaotou.node.x = 70 * (j + 1) - 34 + 35;
//                     }
//                     this.xiaotou.node.y = 60 * (i + 1) + 300;
//                     this.xiaotou.node.zIndex = 99;
//                     this.xiaotou.node.active = true;
//                     // this.xiaotou.play("stand");
//                 }
//             }
//         }
//     }
//     createImg(prefab: Prefab, j: number, i: number, str?: string, isOn?: boolean, pos?: Vec2) {
//         var im = instantiate(prefab);
//         im.anchorX = im.anchorY = 0.5;
//         im.scaleX = im.scaleY = 0.5;
//         if (str) {
//             im.name = str;
//         }
//         if (isOn) {
//             im.children[0].on(Node.EventType.TOUCH_END, this.onClick, this);
//         }
//         if (j != -1) {
//             if (i % 2 == 0) {
//                 im.x = 70 * j + 35;
//             } else {
//                 im.x = 70 * j - 34 + 35;
//             }
//             im.y = 60 * i + 300;
//         } else {
//             im.x = pos.x;
//             im.y = pos.y;
//         }
//         this.maps.addChild(im);
//     }
//
//     BFS() {
//         this.endPoint = [];
//         for (var i = 0; i < this.miGongArray.length; i++) {
//             for (var j = 0; j < this.miGongArray[i].length; j++) {
//
//                 if (this.isBaoWei) {
//                     if (this.miGongArray[i][j] == -1) {
//                         this.startPoint.x = i;
//                         this.startPoint.y = j;
//                     } else if (this.miGongArray[i][j] == 0 || this.miGongArray[i][j] == 3) {
//                         this.endPoint.push(new Vec2(i, j));
//                         this.movePathArray[i][j].x = -2;
//                         this.movePathArray[i][j].y = -2;
//                     }
//                 } else {
//                     if (this.miGongArray[i][j] == -1) {
//                         this.startPoint.x = i;
//                         this.startPoint.y = j;
//                     } else if (this.miGongArray[i][j] == -2) {
//                         this.endPoint.push(new Vec2(i, j));
//                         this.movePathArray[i][j].x = -2;
//                         this.movePathArray[i][j].y = -2;
//                     }
//                 }
//             }
//         }
//         for (var k = 0; k < this.endPoint.length; k++) {
//             this.moveArray.push(new Vec2(this.endPoint[k].x, this.endPoint[k].y));
//         }
//         console.log(this.moveArray);
//         // this.miGongArray[indexI][indexJ] = 2;
//         while (this.moveArray.length > 0) {
//             var p = this.moveArray[0];
//             this.moveArray.shift();
//             var x = p.x;
//             var y = p.y;
//             if (x == 4 && y == 4) {
//                 console.log(p)
//             }
//             var isWinArr = [];
//             if (!this.isBaoWei) {
//                 for (var b = 0; b < 6; b++) {
//
//                     //检测是否四周不可行走
//                     if (this.startPoint.x % 2 == 0) var d = this.dir2;
//                     else var d = this.dir;
//                     var tx1 = this.startPoint.x + d[b][0];
//                     var ty1 = this.startPoint.y + d[b][1];
//                     if (this.in(tx1, ty1)) {
//                         if (this.miGongArray[tx1][ty1] == -2 ||
//                             this.miGongArray[tx1][ty1] == 1) {
//                             isWinArr.push(this.miGongArray[tx1][ty1]);
//                         }
//                     }
//                     if (isWinArr.length >= 6) {
//                         setTimeout(() => {
//                             this.WinView.active = true;
//                             // Banner.Instance.ShowNativeAd();
//                             // if (GameData.currentLevel == GameData.Level) GameData.Level++;
//                             // TreasureBox.ShowTreasureBox();
//                         }, 500);
//                         console.log("游戏胜利");
//                         return;
//                     }
//                 }
//             }
//             for (var c = 0; c < 6; c++) {
//                 var point: Vec2 = new Vec2();
//                 if (x % 2 == 0) var d = this.dir2;
//                 else var d = this.dir;
//                 point.x = (x + d[c][0]);
//                 point.y = (y + d[c][1]);
//                 var tx = x + d[c][0];
//                 var ty = y + d[c][1];
//                 //右左下上
//                 if (this.in(tx, ty)) {
//                     if (this.miGongArray[tx][ty] == -1) {
//                         this.movePathArray[tx][ty].x = (x)
//                         this.movePathArray[tx][ty].y = (y)
//                         this.Print_Path();
//                     }
//                     if (this.miGongArray[tx][ty] == 0) {
//                         if (this.isBaoWei) {
//                             this.miGongArray[tx][ty] = 3;
//                         } else {
//                             this.movePathArray[tx][ty].x = (x)
//                             this.movePathArray[tx][ty].y = (y)
//                             this.miGongArray[tx][ty] = 2;
//                         }
//                         this.moveArray.push(point);
//                     }
//                 }
//             }
//         }
//         console.log(this.startPoint, this.allPath);
//         if (this.allPath.length <= 0) {
//             console.log("被包围了");
//             if (!this.isBaoWei) {
//                 this.isBaoWei = true;
//                 this.BFS();
//             } else {
//                 this.isGameOvew = true;
//                 setTimeout(() => {
//                     this.WinView.active = true;
//                     // Banner.Instance.ShowNativeAd();
//                     // if (GameData.currentLevel == GameData.Level) GameData.Level++;
//                     // TreasureBox.ShowTreasureBox();
//                 }, 500);
//                 console.log("游戏胜利");
//             }
//             return;
//         }
//         var str = "cube_" + (this.allPath[0][0].x * this.miGongHeight + this.allPath[0][0].y);
//         console.log(str);
//         var im = (this.maps.getChildByName(str) as Node);
//         // this.xiaotou.play("walk");
//         var xx = this.xiaotou.node.x;
//         if (xx < im.x) this.xiaotou.node.scaleX = 0.6;
//         else this.xiaotou.node.scaleX = -0.6;
//         tween(this.xiaotou.node)
//             .to(0.3, { x: im.x, y: im.y })
//             .call(() => {
//                 this.isMove = false;
//                 // this.xiaotou.play("stand");
//             })
//             .start();
//         if (this.miGongArray[this.allPath[0][0].x][this.allPath[0][0].y] == -2) {
//             this.isGameOvew = true;
//             setTimeout(() => {
//                 this.LoseView.active = true;
//                 // Banner.Instance.ShowNativeAd();
//                 // TreasureBox.ShowTreasureBox();
//             }, 500);
//             console.log("游戏失败");
//             return;
//         } else {
//             this.miGongArray[this.startPoint.x][this.startPoint.y] = 0;
//             this.miGongArray[this.allPath[0][0].x][this.allPath[0][0].y] = -1;
//             this.startPoint.x = this.allPath[0][0].x;
//             this.startPoint.x = this.allPath[0][0].y;
//             this.allPath = [];
//         }
//     }
//     Step2() {
//
//     }
//
//     onClick(e: Event) {
//         if (!this.isGameOvew && !this.isMove) {
//             for (var i = 0; i < this.miGongArray.length; i++) {
//                 for (var j = 0; j < this.miGongArray[0].length; j++) {
//                     if (this.miGongArray[i][j] == 2) {
//                         this.miGongArray[i][j] = 0;
//                     }
//                 }
//             }
//             var hang = 0;
//             var lie = 0;
//
//             var num = e.target.parent.name.slice(5);
//             if (parseInt(num) >= this.miGongWidth) {
//                 hang = Math.floor(parseInt(num) / this.miGongWidth);
//                 lie = parseInt(num) % this.miGongHeight;
//             } else {
//                 hang = 0;
//                 lie = parseInt(num);
//             }
//             if (this.miGongArray[hang][lie] == -1) {
//                 return;
//             } else {
//                 this.isMove = true;
//                 this.miGongArray[hang][lie] = 1;
//                 this.createImg(this.cop, -1, -1, "zhangai", false, new Vec2(e.target.parent.x, e.target.parent.y));
//                 // var jc = instantiate(this.cop);
//                 // e.target.addChild(jc);
//                 // jc.setPosition(0, 0);
//                 this.BFS();
//             }
//         }
//     }
//
//
//     // initBtn() {
//     //     this.exitGame.on(Event.CLICK, this, this.onExitGame);
//     //     this.back.on(Event.CLICK, this, this.onBack);
//     //     this.back2.on(Event.CLICK, this, this.onBack);
//     //     this.back3.on(Event.CLICK, this, this.onBack);
//     //     this.next.on(Event.CLICK, this, this.onNextStep);
//     //     this.goon.on(Event.CLICK, this, this.onGoOn);
//     //     this.goon2.on(Event.CLICK, this, this.onGoOn);
//     //     this.rest.on(Event.CLICK, this, this.onReset);
//     //     this.tip.on(Event.CLICK, this, this.onVideo);
//     // }
//     onVideo() {
//         Banner.Instance.ShowVideo(this.videoEnd);
//     }
//     videoEnd() {
//         WZXT_GameViewUI.Instance.TipView.active = true;
//     }
//     onNextStep() {
//         // GameData.currentLevel++;
//         // if (GameData.currentLevel < 20) UIManager.Instance.FadeInBlackMaskBySceceName("WZXT");
//         // else UIManager.Instance.FadeInBlackMaskBySceceName("WeiZhuXiaoTou");
//     }
//     onReset() {
//         // UIManager.Instance.FadeInBlackMaskBySceceName("WZXT");
//     }
//
//     onExitGame() {
//         audioEngine.playEffect(this.buttonSound, false);
//         this.ExitView.active = true;
//         // Banner.Instance.ShowNativeAd();
//     }
//     onBack() {
//         audioEngine.playEffect(this.buttonSound, false);
//
//         this.oldTImer = 10;
//         WZXT_GameViewUI.item = [];
//         WZXT_GameViewUI.item2 = [];
//         WZXT_GameViewUI.DuoCangPoint = [0, 0, 0, 0, 0, 0];
//         WZXT_GameViewUI.DuoCangPeople = [null, null, null, null, null, null];
//         WZXT_GameViewUI.MonsterAtkTime = false;
//         this.downPointX = 0;
//         this.playerSpeed = 0;
//         this.oldPlayerPoint = 0;
//         this.isDuoCang = false;
//         // UIManager.Instance.FadeInBlackMaskBySceceName("WeiZhuXiaoTou");
//     }
//     onGoOn() {
//         audioEngine.playEffect(this.buttonSound, false);
//         this.ExitView.active = false;
//         this.TipView.active = false;
//     }
//     // onDown(e: Event) {
//     //     // console.log("点击的点", this.downPointX);
//     //     if (!this.isDuoCang && !(this.player.getComponent(PlayerScript) as PlayerScript).isDie) {
//     //         (this.player.children[0].getComponent(Animation)).source = "animation/People1Move.ani";
//     //         (this.player.getChildAt(0) as Animation).play(0, true);
//     //     } else {
//
//     //     }
//     //     this.downPointX = e.target.mouseX;
//     // }
//     // onUp(e: Event) {
//     //     if (!this.isDuoCang && !(this.player.getComponent(PlayerScript) as PlayerScript).isDie) {
//     //         (this.player.getChildAt(0) as Animation).source = "animation/People1Stand.ani";
//     //         (this.player.getChildAt(0) as Animation).play(0, true);
//     //     }
//     //     this.downPointX = 0;
//     //     this.playerSpeed = 0;
//     // }
//     // onMove(e: Event) {
//     //     // console.log("点击的点", this.downPointX);
//     //     // console.log("移动的点", e.target.mouseX);
//     //     if (e.target.mouseX > this.downPointX) {
//     //         if (!this.isDuoCang && !(this.player.getComponent(PlayerScript) as PlayerScript).isDie) {
//     //             this.player.scaleX = 2;
//     //         }
//     //         this.playerSpeed = 4;
//     //     } else {
//     //         if (!this.isDuoCang && !(this.player.getComponent(PlayerScript) as PlayerScript).isDie) {
//     //             this.player.scaleX = -2;
//     //         }
//     //         this.playerSpeed = -4;
//     //     }
//     // }
//     // onDuoCang() {
//     //     this.player.visible = false;
//     //     this.player.scaleX = 2;
//     //     WZXT_GameViewUI.DuoCangPoint[PlayerScript.playerIndex] = 1;
//     //     WZXT_GameViewUI.DuoCangPeople[PlayerScript.playerIndex] = this.player;
//     //     (WZXT_GameViewUI.item[PlayerScript.playerIndex].getChildAt(0) as Image).visible = false;
//     //     console.log(WZXT_GameViewUI.DuoCangPeople);
//     //     console.log(WZXT_GameViewUI.DuoCangPoint);
//
//     //     this.oldPlayerPoint = this.bg.x;
//     //     (this.player.getChildAt(0) as Animation).visible = false;
//     //     if (this.oldTImer <= 0) {
//     //         this.rect.off(Event.MOUSE_DOWN, this, this.onDown);
//     //         this.rect.off(Event.MOUSE_UP, this, this.onUp);
//     //         this.rect.off(Event.MOUSE_MOVE, this, this.onMove);
//     //     }
//     //     this.isDuoCang = true;
//     //     // this.changeView.visible = true;
//
//     // }
//     // onSure() {
//     //     // this.changeView.on(Event.CLICK, this, this.onChangeView);
//     //     // this.exitGame.on(Event.CLICK, this, this.onExitGame);
//     //     // this.back.on(Event.CLICK, this, this.onBack);
//     //     // this.goon.on(Event.CLICK, this, this.onGoOn);
//     //     // this.duoBtn.on(Event.CLICK, this, this.onDuoCang);
//     //     this.rect.on(Event.MOUSE_DOWN, this, this.onDown);
//     //     this.rect.on(Event.MOUSE_UP, this, this.onUp);
//     //     this.rect.on(Event.MOUSE_MOVE, this, this.onMove);
//     // }
//
//
//     // onDaoJiShiLoop() {
//     //     if (!WZXT_GameViewUI.MonsterAtkTime) {
//     //         if (this.oldTImer <= 0) {
//     //             //创建怪物
//     //             WZXT_GameViewUI.MonsterAtkTime = true;
//     //             if (!this.bg.getChildByName("Monster").getComponent(MonsterScript)) {
//     //                 this.bg.getChildByName("Monster").addComponent(MonsterScript);
//     //             }
//     //             if (this.isDuoCang) {
//     //                 if (this.oldTImer <= 0) {
//     //                     // this.bg.x = this.Monster.x + stage.width / 2;
//     //                 }
//     //                 this.rect.off(Event.MOUSE_DOWN, this, this.onDown);
//     //                 this.rect.off(Event.MOUSE_UP, this, this.onUp);
//     //                 this.rect.off(Event.MOUSE_MOVE, this, this.onMove);
//     //             }
//     //             // timer.clear(this, this.onDaoJiShiLoop);
//     //         } else {
//     //             this.oldTImer--;
//     //         }
//     //     }
//     // }
//
//     // nextStep() {
//     //     // this.changeView.visible = false;
//     //     // this.bg2.visible = false;
//     //     for (var i = 0; i < WZXT_GameViewUI.DuoCangPeople.length; i++) {
//     //         if (WZXT_GameViewUI.DuoCangPeople[i] != null) {
//     //             if (WZXT_GameViewUI.DuoCangPeople[i].name == "1") {
//     //                 (WZXT_GameViewUI.DuoCangPeople[i].getChildAt(0) as Animation).visible = true;
//     //             }
//     //             WZXT_GameViewUI.DuoCangPeople[i].visible = true;
//     //             WZXT_GameViewUI.DuoCangPeople[i].active = true;
//     //             WZXT_GameViewUI.DuoCangPeople[i] = null;
//     //         }
//     //     }
//     //     WZXT_GameViewUI.DuoCangPoint = [0, 0, 0, 0, 0, 0];
//     //     if (this.bg)
//     //         for (var i = 0; i < 15; i++) {
//     //             if (i < 6) {
//     //                 (this.bg.getChildAt(i).getChildByName("tag") as Image).skin = "gameui/scenario/No one.png";
//     //             }
//     //         }
//     //     console.log(WZXT_GameViewUI.DuoCangPeople);
//     //     console.log(WZXT_GameViewUI.DuoCangPoint);
//     //     WZXT_GameViewUI.MonsterAtkTime = false;
//     //     this.oldTImer = 10;
//     //     if (this.isDuoCang) {
//     //         this.bg.x = this.oldPlayerPoint;
//     //     }
//     //     this.isDuoCang = false;
//     //     this.rect.on(Event.MOUSE_DOWN, this, this.onDown);
//     //     this.rect.on(Event.MOUSE_UP, this, this.onUp);
//     //     this.rect.on(Event.MOUSE_MOVE, this, this.onMove);
//     //     // this.daojishi.visible = true;
//     //     console.log(WZXT_GameViewUI.item2);
//     //     for (var i = 0; i < WZXT_GameViewUI.item2.length; i++) {
//     //         if (WZXT_GameViewUI.item2[i] != null) {
//     //             WZXT_GameViewUI.item2[i].active = true;
//     //         }
//     //         var p = Math.floor(Math.random() * 5 + 1);
//     //         (this.bg.getChildAt(7 + i).getChildByName("img") as Image).skin = "gameui/store/" + p + ".png"
//     //     }
//     // }
// }
