import { _decorator, AudioClip, Color, Component, director, EventTouch, Graphics, instantiate, Label, Node, Prefab, Sprite, Tween, tween, UIOpacity, UITransform, v2, v3, Vec3, } from "cc";
import UI_BreatheAni, { BREATHEANI_TYPE } from "db://assets/Scripts/Framework/UI/UI_BreatheAni";
import { Tools } from "db://assets/Scripts/Framework/Utils/Tools";
import { ZCJNZ_TweenController } from "./ZCJNZ_TweenController";
import { AudioManager } from "db://assets/Scripts/Framework/Managers/AudioManager";
import { GamePanel } from "db://assets/Scripts/UI/Panel/GamePanel";
import { ProjectEventManager } from "db://assets/Scripts/Framework/Managers/ProjectEventManager";
import { MyEvent } from "db://assets/Scripts/Framework/Managers/EventManager";
const { ccclass, property } = _decorator;

@ccclass("ZCJNZ_GamePanel")
export class ZCJNZ_GamePanel extends Component {

  tweenController: ZCJNZ_TweenController = ZCJNZ_TweenController._instance;

  //#region 属性
  /**游戏道具 */
  @property([Node])
  props: Node[] = [];

  /**左边的哪吒 */
  @property(Node)
  role1: Node = null;

  @property(Node)
  role1_1: Node = null;

  @property(Node)
  role1_2: Node = null;

  @property(Node)
  role1_3: Node = null;

  @property(Node)
  role1_3_1: Node = null;

  @property(Node)
  role1_4: Node = null;

  @property(Node)
  role1_4_1: Node = null;

  @property(Node)
  role1_5: Node = null;

  @property(Node)
  role1_6: Node = null;

  @property(Node)
  role1_7: Node = null;

  @property(Node)
  role1_7_1: Node = null;

  /**右边的哪吒 */
  @property(Node)
  role2: Node = null;

  @property(Node)
  role2_1: Node = null;

  @property(Node)
  role2_2: Node = null;

  @property(Node)
  role2_3: Node = null;

  @property(Node)
  role2_3_1: Node = null;

  @property(Node)
  role2_4: Node = null;

  @property(Node)
  role2_4_1: Node = null;

  @property(Node)
  role2_5: Node = null;

  @property(Node)
  role2_6: Node = null;

  @property(Node)
  role2_7: Node = null;

  @property(Node)
  role2_7_1: Node = null;

  @property(Node)
  huoba1: Node = null;

  @property(Node)
  LingYeSkeleton: Node = null;

  @property(Node)
  huoyan1: Node = null;

  @property(Node)
  huoyan2: Node = null;

  @property(Node)
  jingzi1: Node = null;

  @property(Node)
  jingzi2: Node = null;

  @property(Node)
  bigHuoYan: Node = null;

  @property(Node)
  qiankunquan1: Node = null;

  @property(Node)
  qiankunquan2: Node = null;

  @property(Node)
  qiankunquan3: Node = null;

  @property(Node)
  qiankunquan4: Node = null;

  @property(Node)
  error1: Node = null;

  @property(Node)
  error2: Node = null;

  @property(Node)
  role2_8: Node = null;

  @property(Node)
  role1_8: Node = null;

  @property(Node)
  role22: Node = null;

  /**申公豹 */
  @property(Node)
  role3: Node = null;

  /**窗户的猪 */
  @property(Node)
  pig: Node = null;

  /**窗户的猪 */
  @property(Node)
  pigSke: Node = null;

  /**进度条 */
  @property(Node)
  Progressbar: Node = null

  /**进度 */
  @property(Label)
  ProgressLabel: Label = null

  /** */
  @property(Node)
  Progress: Node = null

  /**师兄的对话文本 */
  @property(Label)
  shiXiongLabel: Label = null;

  /**师兄文本的背景 */
  @property(Sprite)
  shiXiongLabelBg: Sprite = null;

  /**申公豹的对话文本 */
  @property(Node)
  Role3Label: Node = null;

  @property(Node)
  Role2LabelBg: Node = null;

  @property(Label)
  Role2Label: Label = null;

  @property(Node)
  ouFen1: Node = null;

  @property(Node)
  ouFen2: Node = null;

  @property(Prefab)
  answer: Prefab = null;

  @property(Node)
  of1ske: Node = null;

  @property(Node)
  of2ske: Node = null;

  @property(Node)
  jiaren1: Node = null;

  @property(Node)
  jiaren2: Node = null;

  /**吹喇叭 */
  @property(Node)
  chuiLaBa: Node = null;

  /**抓捕按钮 */
  @property(Node)
  captureButton: Node = null;

  /**左边的仙翁 */
  @property(Node)
  xianwen1: Node = null;

  /**右边的仙翁 */
  @property(Node)
  xianwen2: Node = null;

  /**被抓捕角色的背景 */
  @property(Node)
  TheCapturedRoleBG: Node = null;

  /**仙翁预制体 */
  @property(Prefab)
  xianWengPrefab: Prefab = null;

  /**哪吒预制体 */
  @property(Prefab)
  neZhaPrefab: Prefab = null;

  @property
  speed: number = 1;

  @property
  scaleGap: number = 0.05;

  @property(GamePanel)
  gamePanel: GamePanel = null;

  private count: number = 0;

  private oriScale: Vec3 = v3();

  /**记录当前点击道具 */
  private currentProp: Node = null;

  /**记录道具初始位置 */
  private propInitialPos: Vec3 = null;

  /**能否进行触摸事件 */
  private isTouch: boolean = false;

  /**是否有道具正在进行动画 */
  private isButton: boolean = false;

  private isPigClicked: boolean = false;

  /**标志音箱能否点击 */
  private isButtonYinXiang: boolean = false;

  @property([AudioClip])
  audioClips: AudioClip[] = [];

  x: boolean = false;
  //#endregion

  protected onLoad(): void {
    this.gamePanel.answerPrefab = this.answer;
    this.gamePanel.time = 240;
    this.props.forEach((prop) => {
      if (prop != null && prop.name == "YinXiang") {
        prop.getComponent(UI_BreatheAni).Stop();
      }
    });
  }


  start() {
    console.log(this.audioClips);
    this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
    this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);

    if (ProjectEventManager.GameStartIsShowTreasureBox) {
      director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
    } else {
      this.Init();
    }

  }

  Init() {
    this.shenGongBaoMove();

    this.scheduleOnce(() => {
      this.Role3Label.active = false;
    }, 10);


    this.scheduleOnce(() => {
      this.reShenGongBaoPos();

      this.scheduleOnce(() => {
        this.shiXiongLabelBg.node.active = true;
        this.shiXiongLabel.node.active = true;
        this.playAudio("我一定好好鉴别");
        this.scheduleOnce(() => {
          this.shiXiongLabel.node.active = false;
          this.shiXiongLabelBg.node.active = false;
        }, 4);
      }, 2);
    }, 11);

    this.scheduleOnce(() => {
      this.neZhaMove();
      this.isTouch = true;
    }, 17);
  }

  touchStart(event: EventTouch) {
    this.playAudio("点击");
    if (!this.isTouch || this.isButton) return;

    // 获取触摸位置
    const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));

    // 获取触摸道具
    this.props.forEach((prop) => {
      if (prop != null && prop.active) {

        const isContains = prop.getComponent(UITransform).getBoundingBox().contains(v2(touchPos.x, touchPos.y));
        if (isContains) {

          this.currentProp = prop;
          this.propInitialPos = prop.position.clone();

          if (this.currentProp.name == "YinXiang") {
            if (this.isButtonYinXiang) return;
            this.isButtonYinXiang = true;
            this.isButton = true;
            const ui = this.currentProp.getComponent(UI_BreatheAni);
            ui.Set(BREATHEANI_TYPE.Center);
            const yinFu = this.currentProp.getChildByName("YinFu");
            yinFu.active = true;
            this.openShiXiongLabel("天雷滚滚我好怕，劈的我浑身掉渣渣");
            this.playAudio("天雷");

            this.scheduleOnce(() => {
              ui.Stop();
              this.offShiXiongLabel();
              this.role1.active = false
              this.role2.getChildByName("ShrugOff").active = true;
              this.reNeZhaPos();

              this.chuiLaBa.active = true;
              this.role22.active = true;
              this.bottom(this.role22)


              const bg1 = this.getLabelBG(this.chuiLaBa, "突破天劫我笑哈哈\n逆天改命我吹喇叭\n嘀嗒嘀嗒嘀嘀哒");
              this.playAudio("突破天劫笑哈哈");

              this.scheduleOnce(() => {
                bg1.active = false;
                const bg2 = this.getLabelBG(this.role22, "什么玩意，我没听过");
                // this.Role2LabelBg.active = true;
                // this.Role2Label.getComponent(Label).string = "什么玩意，我没听过";
                this.playAudio("没听过");

                this.scheduleOnce(() => {
                  bg2.active = false
                  this.captureButton.active = true;
                }, 3)
              }, 3)
            }, 3);

          } else if (this.currentProp.name == "ChuangHu") {
            if (this.isPigClicked) return;
            this.isPigClicked = true;


            let ChuangHuOpacity = this.currentProp.getComponent(UIOpacity);
            ChuangHuOpacity.opacity = 255;
            tween(ChuangHuOpacity)
              .to(0.5, { opacity: 0 })
              .call(() => { prop.active = false; })
              .start();

            let pigOpacity = this.pig.getComponent(UIOpacity)
            pigOpacity.opacity = 0;
            tween(pigOpacity)
              .to(0.5, { opacity: 255 })
              .call(() => { this.pig.active = true; })
              .start();


          } else if (this.currentProp.name == "Pig") {
            // if (this.isPigClicked) return;
            // this.isPigClicked = true;
            // this.isButton = true;

            this.pig.active = false;
            this.pigSke.active = true;

            // this.scheduleOnce(() => {
            //   this.isButton = false;
            // }, 3)

          } else if (this.currentProp.name == "QianKunQuan1" || this.currentProp.name == "QianKunQuan2") {

            this.props.forEach((prop) => {
              if (prop != null && prop.name == "QianKunQuan1" || prop.name == "QianKunQuan2") {
                this.isButton = true;
                prop.active = false;
                this.openShiXiongLabel("听说乾坤圈能镇压魔力")
                this.playAudio("乾坤圈");
                this.reNeZhaPos();
                this.qiankunquan3.active = true;
                this.qiankunquan4.active = true;

                tween(this.qiankunquan3)
                  .to(1, { position: new Vec3(-219.604, 200, 0) })
                  .call(() => {
                    this.qiankunquan3.active = false;
                  })
                  .start();
                tween(this.qiankunquan4)
                  .to(1, { position: new Vec3(198.868, 200, 0) })
                  .call(() => {
                    this.qiankunquan4.active = false;
                  })
                  .start();
                this.role1_7.active = true;
                this.role2_7.active = true;
                this.bottom(this.role2_7)
                this.bottom(this.role1_7)

                this.scheduleOnce(() => {
                  this.offShiXiongLabel();
                  const bg1 = this.getLabelBG(this.role1_7, "我快控制不住了");
                  this.playAudio("我快控制不住了");

                  this.scheduleOnce(() => {
                    bg1.active = false;
                    this.role1_7.active = false;
                    this.role1_7_1.active = true;
                    // this.bottom(this.role1_7_1)
                    this.bigHuoYan.active = true;
                    const bg2 = this.getLabelBG(this.role2_7, "快还给我");
                    this.playAudio("快还给我");

                    this.scheduleOnce(() => {
                      bg2.active = false;
                      this.captureButton.active = true;
                    }, 3)
                  }, 3)
                }, 3)
              }
            });
          } else if (this.currentProp.name == "Dao") {
            // if (this.x) return;
            // this.x = true;
            this.pig.active = true;
            this.pigSke.active = false;
            let dao = this.currentProp.getComponent(UIOpacity);
            dao.opacity = 255;
          } else if (this.currentProp.name == "Pig") {

          } else if (this.currentProp.name == "PigSke") {

          }
        }
      }
    });
  }

  /*/ 音箱和窗户不需要移动/*/
  touchMove(event: EventTouch) {
    if (this.currentProp) {
      switch (this.currentProp.name) {
        case "YinXiang":
          break;
        case "ChuangHu":
          break;
        case "Pig":
          break;
        case "PigSke":
          break;
        default:
          const touchPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
          this.currentProp.setPosition(touchPos);
          break;
      }
    }
  }

  touchEnd(event: EventTouch) {
    if (this.currentProp) {
      const endPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
      const isRole1 = this.role1.getComponent(UITransform).getBoundingBox().contains(v2(endPos.x, endPos.y));
      const isRole2 = this.role2.getComponent(UITransform).getBoundingBox().contains(v2(endPos.x, endPos.y));
      if (isRole1 || isRole2) {
        switch (this.currentProp.name) {
          case "JianZi":
            this.props.forEach((prop) => {
              if (prop != null && prop.name == "JianZi") {
                prop.active = false;
                this.isButton = true;
                this.openShiXiongLabel("不知道哪来的毽子，送给你们");
                this.playAudio("毽子");
                this.reNeZhaPos();
                this.role1_1.active = true;
                this.role2_1.active = true;
                this.bottom(this.role1_1);
                this.bottom(this.role2_1);

                this.scheduleOnce(() => {
                  this.offShiXiongLabel();
                  const bg1 = this.getLabelBG(this.role1_1, "小孩子才喜欢毽子");
                  this.playAudio("小孩子才喜欢");

                  this.scheduleOnce(() => {
                    bg1.active = false;
                    const bg2 = this.getLabelBG(this.role2_1, "我最喜欢毽子了");
                    this.playAudio("最喜欢毽子了");

                    this.scheduleOnce(() => {
                      bg2.active = false;
                      this.captureButton.active = true;
                    }, 3)
                  }, 3)
                }, 3)
              }
            });
            break;

          case "JingZi":
            this.props.forEach((prop) => {
              if (prop != null && prop.name == "JingZi") {
                this.isButton = true;
                prop.active = false;
                this.openShiXiongLabel("这个镜子你们照一下");
                this.playAudio("镜子");
                this.jingzi1.active = true;
                this.jingzi2.active = true;
                this.scheduleOnce(() => {
                  this.reNeZhaPos();
                  this.offShiXiongLabel();
                  this.role1_6.active = true;
                  this.role2_6.active = true;
                  this.bottom(this.role1_6);

                  this.scheduleOnce(() => {
                    const bg1 = this.getLabelBG(this.role1_6, "这镜子有什么用");
                    this.playAudio("这镜子有什么用");

                    this.scheduleOnce(() => {
                      bg1.active = false;
                      const bg2 = this.getLabelBG(this.role2_6, "不好是照妖镜");
                      this.playAudio("不好是照妖镜");

                      this.scheduleOnce(() => {
                        bg2.active = false;
                        this.captureButton.active = true;
                      }, 3)
                    }, 3)
                  }, 2)
                }, 3);
              }
            });
            break;

          case "HuoBa":
            this.props.forEach((prop) => {
              if (prop != null && prop.name == "HuoBa") {
                this.isButton = true;
                prop.active = false;
                this.huoba1.active = true;
                this.openShiXiongLabel("这三昧真火你们试试温度")
                this.playAudio("三昧真火试温度");
                this.huoyan1.active = true;
                this.huoyan2.active = true;

                this.scheduleOnce(() => {
                  this.offShiXiongLabel();
                  this.huoyan1.active = false;
                  this.huoyan2.active = false;
                  this.reNeZhaPos();
                  this.role1_5.active = true
                  this.role2_5.active = true;
                  this.bottom(this.role1_5);
                  this.bottom(this.role2_5);

                  this.scheduleOnce(() => {
                    const bg1 = this.getLabelBG(this.role1_5, "三昧真火果然厉害\n差点要我的老命");
                    this.playAudio("果然厉害");

                    this.scheduleOnce(() => {
                      bg1.active = false;
                      const bg2 = this.getLabelBG(this.role2_5, "一点感觉都没有");
                      this.playAudio("一点感觉都没有");

                      this.scheduleOnce(() => {
                        bg2.active = false;
                        this.captureButton.active = true;
                      }, 3)
                    }, 3)
                  }, 3)
                }, 3)
              }
            });
            break;

          case "LingZhu":
            this.props.forEach((prop) => {
              if (prop != null && prop.name == "LingZhu") {
                this.isButton = true;
                prop.active = false;
                this.openShiXiongLabel("这有颗灵珠你们拿着看一下")
                this.playAudio("看一下灵珠");
                this.reNeZhaPos();
                this.role1_2.active = true;
                this.role2_2.active = true
                this.bottom(this.role1_2);
                this.bottom(this.role2_2);

                this.scheduleOnce(() => {
                  this.offShiXiongLabel();
                  const bg1 = this.getLabelBG(this.role1_2, "我感受到了它很亲近我");
                  this.playAudio("它很亲近我");

                  this.scheduleOnce(() => {
                    bg1.active = false;
                    const bg2 = this.getLabelBG(this.role2_2, "这就是灵珠吗果然神奇");
                    this.playAudio("这就是灵珠吗");

                    this.scheduleOnce(() => {
                      bg2.active = false;
                      this.captureButton.active = true;
                    }, 3)
                  }, 3)
                }, 3)
              }
            });
            break;

          case "LingYe":
            this.props.forEach((prop) => {
              if (prop != null && prop.name == "LingYe") {
                this.isButton = true;
                prop.active = false;
                this.LingYeSkeleton.active = true;

                this.scheduleOnce(() => {
                  this.LingYeSkeleton.active = false
                  this.openShiXiongLabel("这昆仑甘露半年才一盆，你们尝尝吧")
                  this.playAudio("昆仑甘露");
                  this.reNeZhaPos();
                  this.role1_4.active = true;
                  this.role2_4.active = true;
                  this.bottom(this.role1_4);
                  this.bottom(this.role2_4);

                  this.scheduleOnce(() => {
                    this.offShiXiongLabel();
                    this.role1_4.active = false;
                    this.role2_4.active = false;
                    this.role1_4_1.active = true;
                    this.role2_4_1.active = true;
                    this.bottom(this.role1_4_1);
                    this.bottom(this.role2_4_1);
                    const bg1 = this.getLabelBG(this.role1_4_1, "甘露的味道非常浓郁");
                    this.playAudio("浓郁");

                    this.scheduleOnce(() => {
                      bg1.active = false;
                      const bg2 = this.getLabelBG(this.role2_4_1, "这甘露怎么一股尿味");
                      this.playAudio("尿味");

                      this.scheduleOnce(() => {
                        bg2.active = false;
                        this.captureButton.active = true;
                      }, 3)
                    }, 3)
                  }, 3)
                }, 2)
              }
            });
            break;

          case "ReShui":
            this.props.forEach((prop) => {
              if (prop != null && prop.name == "ReShui") {
                this.isButton = true;
                prop.active = false;
                this.openShiXiongLabel("都渴了吧，喝杯水")
                this.playAudio("水");
                this.reNeZhaPos();
                this.role1_3.active = true;
                this.role2_3.active = true
                this.bottom(this.role1_3);
                this.bottom(this.role2_3);

                this.scheduleOnce(() => {
                  this.offShiXiongLabel();
                  this.role1_3.active = false;
                  this.role2_3.active = false;
                  this.role1_3_1.active = true;
                  this.role2_3_1.active = true;
                  this.bottom(this.role1_3_1);
                  this.bottom(this.role2_3_1);
                  const bg1 = this.getLabelBG(this.role1_3_1, "温度刚刚好");
                  this.playAudio("温度刚刚好");

                  this.scheduleOnce(() => {
                    bg1.active = false;
                    const bg2 = this.getLabelBG(this.role2_3_1, "你想烫死我吗");
                    this.playAudio("你想烫死我吗");

                    this.scheduleOnce(() => {
                      bg2.active = false;
                      this.captureButton.active = true;
                    }, 3);
                  }, 3);
                }, 3);
              };
            });
            break;

          case "Dao":
            this.props.forEach((prop) => {
              if (prop != null && prop.name == "Dao") {
                if (this.x) return;
                this.x = true;
                this.isButton = true;
                prop.active = false;
                this.openShiXiongLabel("这有两坨藕粉，你们雕刻一下自己的样子")
                this.playAudio("两坨藕粉");
                let ouFen1 = this.ouFen1.getComponent(UIOpacity);
                ouFen1.opacity = 0;
                tween(ouFen1)
                  .to(0.5, { opacity: 255 })
                  .call(() => { this.ouFen1.active = true; })
                  .start();

                let ouFen2 = this.ouFen2.getComponent(UIOpacity);
                ouFen1.opacity = 0;
                tween(ouFen2)
                  .to(0.5, { opacity: 255 })
                  .call(() => { this.ouFen2.active = true; })
                  .start();

                this.scheduleOnce(() => {
                  this.offShiXiongLabel();
                  this.ouFen1.active = false;
                  this.ouFen2.active = false;
                  this.of1ske.active = true;
                  this.of2ske.active = true;
                  this.reNeZhaPos()
                  this.role1_8.active = true;
                  this.role2_8.active = true;
                  this.bottom(this.role1_8);

                  this.bottom(this.role2_8);


                  this.scheduleOnce(() => {
                    this.of1ske.active = false;
                    this.of2ske.active = false;
                    this.jiaren1.active = true;
                    this.jiaren2.active = true;
                    const bg1 = this.getLabelBG(this.role1_8, "这点小儿科洒洒水");
                    this.playAudio("洒洒水");

                    this.scheduleOnce(() => {
                      bg1.active = false;
                      const bg2 = this.getLabelBG(this.role2_8, "小爷我是真帅");
                      this.playAudio("爷真帅");

                      this.scheduleOnce(() => {
                        bg2.active = false;
                        this.captureButton.active = true;
                      }, 3)
                    }, 3)
                  }, 2)
                }, 3)
              }
            });
            break;
        }
      } else {
        tween(this.currentProp)
          .to(0.1, { position: this.propInitialPos })
          .start();
      }
    }
  }

  onButtonClick(event: EventTouch) {
    this.captureButton.active = false;
    switch (event.target.name) {
      case "Capture1":
        this.capture1();
        this.reNeZhaPos();
        break;
      case "Capture2":
        this.capture2();
        this.reNeZhaPos();
        break;
    }
  }

  /**抓捕左边的 */
  capture1() {

    if (this.currentProp == null) return;
    this.count++;

    switch (this.currentProp.name) {
      case "YinXiang":

        this.error1.active = true;
        this.playAudio("抓错了");
        this.role2.getChildByName("ShrugOff").active = false;

        this.chuiLaBa.active = false;
        this.bottom(this.error1)
        this.scheduleOnce(() => {
          this.error1.active = false;
          this.move2(this.role22)
          this.captureError();
        }, 3)
        break;

      case "JianZi":
        this.role1_1.active = false
        this.xianwen1.active = true;
        this.playAudio("被发现了");
        this.bottom(this.xianwen1);
        this.scheduleOnce(() => {
          this.xianwen1.active = false;
          tween(this.role2_1)
            .to(1, { position: new Vec3(1000, -425, 0) })
            .start();
          this.captureSuccess();
        }, 3);
        break;

      case "Dao":
        // this.pig.active = false;
        this.pigSke.active = false;
        this.role1_8.active = false;
        this.xianwen1.active = true;
        this.playAudio("被发现了");
        this.move1(this.jiaren1)
        this.move2(this.jiaren2)
        this.bottom(this.xianwen1);

        this.scheduleOnce(() => {
          this.xianwen1.active = false;
          this.move2(this.role2_8);
          this.captureSuccess();
        }, 3);
        break;

      case "JingZi":
        this.jingzi1.active = false;
        this.jingzi2.active = false;
        this.role1_6.active = false
        this.error1.active = true;
        this.playAudio("抓错了");
        this.bottom(this.error1)

        this.scheduleOnce(() => {
          this.move2(this.role2_6)
          this.error1.active = false;
          this.captureError();
        }, 3)
        break;

      case "LingZhu":
        this.role1_2.active = false
        this.error1.active = true;
        this.playAudio("抓错了");
        this.bottom(this.error1)

        this.scheduleOnce(() => {
          this.error1.active = false;
          this.move2(this.role2_2)
          this.captureError();
        }, 3)
        break;

      case "LingYe":
        this.role1_4_1.active = false;
        this.xianwen1.active = true;
        this.playAudio("被发现了");
        this.bottom(this.xianwen1);

        this.scheduleOnce(() => {
          this.xianwen1.active = false;
          this.move2(this.role2_4_1);
          this.captureSuccess();
        }, 3);
        break;

      case "ReShui":
        this.role1_3_1.active = false;
        // this.role2_3_1.active = true;
        this.error1.active = true;
        this.playAudio("抓错了");
        this.bottom(this.error1)

        this.scheduleOnce(() => {
          this.error1.active = false;
          this.move2(this.role2_3_1)
          this.captureError();
        }, 3)
        break;

      case "HuoBa":
        this.role1_5.active = false;
        this.xianwen1.active = true;
        this.playAudio("被发现了");
        this.bottom(this.xianwen1);

        this.scheduleOnce(() => {
          this.xianwen1.active = false;
          this.move2(this.role2_5)
          this.captureSuccess();
        }, 3);
        break;

      case "QianKunQuan1":
      case "QianKunQuan2":
        this.role1_7_1.active = false
        this.role1_7.active = false
        this.bigHuoYan.active = false
        this.error1.active = true;
        this.playAudio("抓错了");
        this.bottom(this.error1)

        this.scheduleOnce(() => {
          this.move2(this.role2_7)
          this.move2(this.role2_7_1)
          this.error1.active = false;
          this.captureError();
        }, 3)
        break;

    }
  }

  /**抓捕右边的 */
  capture2() {

    if (this.currentProp == null) return;
    this.count++;

    switch (this.currentProp.name) {
      case "YinXiang":
        this.role2.getChildByName("ShrugOff").active = false;

        this.role22.active = false;
        this.xianwen2.active = true;
        this.playAudio("被发现了");
        this.bottom(this.xianwen2);

        this.scheduleOnce(() => {
          this.xianwen2.active = false;
          this.move1(this.chuiLaBa);
          this.captureSuccess();
        }, 3);
        break;

      case "JianZi":
        this.role2_1.active = false;
        this.error2.active = true;
        this.playAudio("抓错了");
        this.bottom(this.error2)

        this.scheduleOnce(() => {
          this.error2.active = false;
          this.move1(this.role1_1);
          this.captureError();
        }, 3)
        break;

      case "Dao":
        // this.pig.active = false;
        this.pigSke.active = false;
        this.error2.active = true;
        this.role2_8.active = false;
        this.playAudio("抓错了");

        this.scheduleOnce(() => {
          this.move1(this.jiaren1)
          this.move1(this.role1_8);
          this.move2(this.jiaren2)
          this.error2.active = false;
          this.captureError();
        }, 3)
        break;

      case "JingZi":
        this.role2_6.active = false;
        this.xianwen2.active = true;
        this.jingzi1.active = false;
        this.jingzi2.active = false;
        this.playAudio("被发现了");
        this.bottom(this.xianwen2);

        this.scheduleOnce(() => {
          this.move1(this.role1_6);
          this.xianwen2.active = false;
          this.captureSuccess();
        }, 3);
        break;

      case "LingZhu":
        this.role2_2.active = false;
        this.xianwen2.active = true;
        this.playAudio("被发现了");
        this.bottom(this.xianwen2);

        this.scheduleOnce(() => {
          this.move1(this.role1_2)
          this.xianwen2.active = false;
          this.captureSuccess();
        }, 3);
        break;

      case "LingYe":
        this.role2_4_1.active = false;
        this.error2.active = true;
        this.playAudio("抓错了");

        this.bottom(this.error2)
        this.scheduleOnce(() => {
          this.move1(this.role1_4_1)
          this.error2.active = false;
          this.captureError();
        }, 3)
        break;

      case "ReShui":
        this.role2_3_1.active = false;
        this.xianwen2.active = true;
        this.playAudio("被发现了");
        this.bottom(this.xianwen2);

        this.scheduleOnce(() => {
          this.move1(this.role1_3_1);
          this.xianwen2.active = false;
          this.captureSuccess();
        }, 3);
        break;

      case "HuoBa":
        this.role2_5.active = false;
        this.error2.active = true;
        this.playAudio("抓错了");

        this.bottom(this.error2)
        this.scheduleOnce(() => {
          this.move1(this.role1_5)
          this.error2.active = false;
          this.captureError();
        }, 3)
        break;

      case "QianKunQuan1":
      case "QianKunQuan2":
        this.role2_7_1.active = false;
        this.role2_7.active = false;
        this.xianwen2.active = true;
        this.playAudio("被发现了");
        this.bottom(this.xianwen2);

        this.scheduleOnce(() => {
          this.move1(this.role1_7_1);
          this.move1(this.bigHuoYan);
          this.bigHuoYan.active = false
          this.xianwen2.active = false;
          this.captureSuccess();
        }, 3);
        break;
    }
  }

  /**播放音效 */
  private playAudio(name: string) {
    const audioClip = this.audioClips.find(item => item.name === name);
    if (audioClip) {
      AudioManager.Instance.PlaySFX(audioClip);
    }
  }

  //
  private win() {
    if (this.count == 9) {
      let nodes: Node[] = [];
      const childrens = this.TheCapturedRoleBG.children;
      for (let i = 0; i < childrens.length; i++) {
        if (childrens[i].name == "NeZhaPrefab") {
          Tween.stopAll();
          this.gamePanel.Lost();

          return;
        }
      }
      Tween.stopAll();
      this.gamePanel.Win();


    }
  }

  /**抓捕成功 */
  private captureSuccess() {
    this.progress();
    this.currentProp = null;
    const xianWengInstance = instantiate(this.xianWengPrefab);
    this.TheCapturedRoleBG.addChild(xianWengInstance);
    this.scheduleOnce(() => {
      this.neZhaMove();
      this.isButton = false;

    }, 2)
    this.win();
  }

  /**抓捕失败 */
  private captureError() {
    this.progress();
    this.currentProp = null;
    const neZhaPrefabInstance = instantiate(this.neZhaPrefab);
    this.TheCapturedRoleBG.addChild(neZhaPrefabInstance);
    this.scheduleOnce(() => {
      this.neZhaMove();
      this.isButton = false;

    }, 2)
    this.win();
  }
  private progress() {
    const fillRange = this.Progress.getComponent(Sprite).fillRange += 0.111;
    this.ProgressLabel.getComponent(Label).string = this.count + "/9";
  }
  /**显示对话文本 */
  private getLabelBG(node: Node, str: string): Node {
    const BG = node.getChildByName("LabelBG")
    BG.active = true;
    BG.getChildByName("Label").getComponent(Label).string = str;
    return BG;
  }


  /**哪吒移动 */
  neZhaMove() {
    this.role1.active = true;
    this.role2.active = true;
    this.qiankunquan1.active = true;
    this.qiankunquan2.active = true;

    tween(this.qiankunquan1)
      .to(1, { position: new Vec3(-220.489, -59.713, 0) })
      .start();
    tween(this.qiankunquan2)
      .to(1, { position: new Vec3(200.573, -59.166, 0) })
      .start();

    tween(this.role1)
      .to(1, { position: new Vec3(-210, -425, 0) })
      .call(() => { this.bottom(this.role1); })
      .start();
    tween(this.role2)
      .to(1, { position: new Vec3(210, -425, 0) })
      .call(() => { this.bottom(this.role2); })
      .start();
    tween(this.Role2LabelBg)
      .to(1, { position: new Vec3(55, 260, 0) })
      .start();
  }

  /**哪吒复位 */
  reNeZhaPos() {
    this.role1.active = false;
    this.role2.active = false;
    this.qiankunquan1.active = false;
    this.qiankunquan2.active = false;

    tween(this.qiankunquan1)
      .to(1, { position: new Vec3(-1000, -59.713, 0) })
      .start();
    tween(this.qiankunquan2)
      .to(1, { position: new Vec3(1000, -59.166, 0) })
      .start();

    tween(this.role1)
      .to(1, { position: new Vec3(-1000, -425, 0) })
      .start();
    tween(this.role2)
      .to(1, { position: new Vec3(1000, -425, 0) })
      .start();
    tween(this.Role2LabelBg)
      .to(1, { position: new Vec3(1000, -260, 0) })
      .start();
  }

  /**申公豹移动 */
  shenGongBaoMove() {
    tween(this.role3)
      .to(2, { position: new Vec3(200, -550, 0) })
      .call(() => { this.bottom(this.role3); })
      .start();

    tween(this.Role3Label)
      .to(2, { position: new Vec3(-150, 400, 0) })
      .call(() => { this.Role3Label.active = true; })
      .call(() => {
        this.playAudio("无量仙翁诡计多端");
      })
      .start();
  }

  /**申公豹复位 */
  reShenGongBaoPos() {
    tween(this.role3)
      .to(2, { position: new Vec3(1000, -550, 0) })
      .start();

    tween(this.Role3Label)
      .to(2, { position: new Vec3(1000, 400, 0) })
      .start();
  }

  /**传入一个节点向左移动 */
  move1(node: Node) {
    tween(node)
      .to(1, { position: new Vec3(-1000, -425, 0) })
      .start();
  }

  /**传入一个节点向右移动 */
  move2(node: Node) {
    tween(node)
      .to(1, { position: new Vec3(1000, -425, 0) })
      .start();
  }

  bottom(node: Node) {
    Tween.stopAllByTarget(node);
    this.oriScale.set(node.getScale());

    tween(node)
      .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y + this.scaleGap) })
      .to(1 / this.speed, { scale: this.oriScale })
      .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y - this.scaleGap) })
      .to(1 / this.speed, { scale: this.oriScale })
      .union().repeatForever().start();
  }

  openShiXiongLabel(str: string) {
    this.shiXiongLabel.getComponent(Label).string = str;
    this.shiXiongLabelBg.node.active = true;
    this.shiXiongLabel.node.active = true;
  }

  offShiXiongLabel() {
    this.shiXiongLabelBg.node.active = false;
    this.shiXiongLabel.node.active = false;
  }
}
