import { _decorator, Animation, AudioSource, Component, Node, Sprite, Tween, tween, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJXF_FrameEvent')
export class SHJXF_FrameEvent extends Component {

    jiaoShuiStart() {

        this.node.parent.parent.getChildByName("mugun").getChildByName("fill_h").active = true;
        // this.node.parent.parent.getChildByName("notTouch").active = true;

    }
    jiaoShuiEnd() {
        this.scheduleOnce(() => {

            this.node.parent.parent.getChildByName("mugun").getChildByName("fill_q").active = false;
            this.node.active = false;
            // this.node.parent.parent.getChildByName("mugun").getChildByName("fill_h").active = false;
            this.canPlay();
            this.node.parent.parent.getChildByName("zhiyin2").active = true;
        }, 0.3);

    }


    youqiEnd() {
        this.node.parent.getChildByName("qi").getComponent(Animation).play();
    }

    qiEnd() {
        this.scheduleOnce(() => {

            this.node.parent.parent.getChildByName("mugun").getChildByName("fill_h").active = false;
            // this.node.parent.getChildByName("qi").active = false;
            this.node.active = false;
            this.node.parent.getChildByName("2").active = false;
            this.canPlay();
            this.node.parent.parent.getChildByName("zhiyin3").active = true;

        }, 0.3)
    }

    startWar() {
        this.scheduleOnce(() => {
            this.node.active = false;
            this.node.parent.getChildByName("warning").active = true;

        }, 2)

    }
    nextLevel() {
        this.node.parent.active = false;
        this.node.parent.parent.getChildByName("PlayArea_2").active = true;
    }

    //_____________________________________________________________________________________________________


    jiaodaoEnd() {
        this.node.active = false;
        this.canPlay();
    }
    lsd1(){
        this.node.parent.getChildByName("5_all").getChildByName("keng1").active = true;
    }
    lsd2(){
        this.node.parent.getChildByName("5_all").getChildByName("keng2").active = true;
    }
    lsd3(){
        this.node.parent.getChildByName("5_all").getChildByName("keng3").active = true;
    }
    lsd4() {
        this.node.getChildByName("4").active = false;
        this.node.parent.getChildByName("5_all").getChildByName("keng4").active = true;
        this.canPlay();
    }

    xiufuyeEnd() {
        this.node.getChildByName("5").active = false;

        this.canPlay();
    }


    mabuEnd() {
        this.node.getChildByName("6").active = false;
        this.node.parent.parent.getChildByName("notTouch").active = false;
        this.canPlay();
    }

    // damo(){
    //     this.node.parent.parent.getChildByName("mugunren_cry").getComponent(Animation).play("shentibianhui");
    // }
    damo() {
        let mgr: Node = this.node.parent.parent.getChildByName("mugunren_cry");
        mgr.getChildByName("shenti").getComponent(Sprite).grayscale = true;
        mgr.getChildByName("zuoshou").getComponent(Sprite).grayscale = true;
        mgr.getChildByName("youshou").getComponent(Sprite).grayscale = true;
    }

    damoEnd() {
        this.node.active = false;
        this.canPlay();
    }


    zuoyanAppear() {
        this.node.active = false;
        let mgr: Node = this.node.parent.parent.getChildByName("mugunren_cry");
        mgr.getChildByName("zkuang").active = true;
        this.canPlay();
    }


    youyanAppear() {
        this.node.active = false;
        let mgr: Node = this.node.parent.parent.getChildByName("mugunren_cry");
        mgr.getChildByName("ykuang").active = true;
        this.canPlay();
    }


    zuoyanqiu() {
        let mgr: Node = this.node.parent.parent.getChildByName("mugunren_cry");
        mgr.getChildByName("zyan").active = true;

    }


    youyanqiu() {
        let mgr: Node = this.node.parent.parent.getChildByName("mugunren_cry");
        mgr.getChildByName("yyan").active = true;
        this.canPlay();
        this.node.active = false;
    }


    gunziEnd() {

        this.node.parent.parent.getChildByName("cuowu").active = false;
        this.scheduleOnce(() => {
            this.node.active = false;
            this.node.parent.parent.getChildByName("mugunren_cry").active = false;
            this.node.parent.parent.getChildByName("yinying").active = false;
            this.node.parent.parent.getChildByName("mgrJump").active = true;
        }, 1);
    }









    shentishangshen() {
        // this.node.parent.parent.getChildByName("mugunren_cry").setPosition(-6,-17,0);
        let mgr: Node = this.node.parent.parent.getChildByName("mugunren_cry");

        let tweenDuration: number = 0.5;     // 缓动的时长
        tween(mgr).to(                  // 这里直接以 node 作为缓动目标
            tweenDuration,
            { position: new Vec3(0, 1, 0) }  // 创建一个带 position 属性的对象
        ).start();                            // 调用 start 方法，开启缓动
    }

    zuotuichuxian() {

        this.node.parent.parent.getChildByName("mugunren_cry").getChildByName("zuotui").active = true;
        this.canPlay();
    }

    youtuichuxian() {
        this.node.parent.parent.getChildByName("mugunren_cry").getChildByName("youtui").active = true;
        this.canPlay();
    }

    // ranliaoStart(){
    //      this.node.parent.parent.getChildByName("mugunren_cry").getComponent(Animation).play("shentixiufu");
    
    // }

    ranliaoEnd() {
        this.node.active = false;
        let mgr: Node = this.node.parent.parent.getChildByName("mugunren_cry");
        mgr.getChildByName("shenti").getComponent(Sprite).grayscale = false;
        mgr.getChildByName("zuoshou").getComponent(Sprite).grayscale = false;
        mgr.getChildByName("youshou").getComponent(Sprite).grayscale = false;


        this.node.parent.getChildByName("5_all").active = false;
        this.canPlay();
    }


    huxiaolian() {

        this.node.parent.parent.getChildByName("mugunren_cry").getChildByName("xiao").active = true;
        this.node.active = false;
        this.canPlay();

    }



    Gamewin() {
        this.scheduleOnce(() => {
            this.node.destroy();
            GamePanel.Instance.Win();
        },2)
    }


    cwStart(){
        this.node.parent.getComponent(AudioSource).play();
        this.node.parent.parent.getChildByName("notTouch").active = true;
    }



    cwEnd(){
        this.node.parent.parent.getChildByName("notTouch").active = false;

    }





    canPlay() {
        this.node.parent.parent.getChildByName("notTouch").active = false;
    }

}
