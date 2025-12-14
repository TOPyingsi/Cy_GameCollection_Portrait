import { _decorator, Animation, Component, director, error, find, instantiate, Node, Prefab, Skeleton, sp, Sprite, tween, UIOpacity, v3 } from 'cc';
import { BNZTL_GameManager } from './BNZTL_GameManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('BNZTL_SenceManager')
export class BNZTL_SenceManager extends Component {
    @property(Prefab)
    public GameSence: Prefab = null;
    @property(Node)
    public Daoju: Node[] = [];
    @property(Node)
    public Role: Node = null;
    @property(Node)
    public Meng: Node = null;
    @property(Node)
    public DuiHua: Node = null;
    // public static Instance: BNZTL_SenceManager = null;

    // protected onLoad(): void {
    //     BNZTL_SenceManager.Instance = this;
    // }
    start() {
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.init, this);
        } else {
            this.init();
        }
    }
    init() {
        if (BNZTL_GameManager.Instance._gameSence == 0) {
            find("Canvas/BG/场景/窗遮罩/反派").getComponent(Animation).play();
            tween(this.node)
                .to(0, { scale: v3(1, 1, 1) })
                .call(() => {
                    BNZTL_GameManager.Instance.Music(1);
                    this.DuiHua.active = true;
                })
                .delay(2)
                .call(() => {
                    this.DuiHua.active = false;
                })
                .start();
        }
    }

    update(deltaTime: number) {

    }
    SenceChange() {
        this.node.active = false;
        if (BNZTL_GameManager.Instance._gameSence <= 6) {
            this.Meng.parent.getComponent(Sprite).enabled = false;
            this.Meng.active = true;
        }

        if (BNZTL_GameManager.Instance._gameSence == 2 && this.Daoju[0].active == true && this.Daoju[1].active == true) {
            const Sence = instantiate(this.GameSence);
            this.RoleAnimation();

            tween(find("Canvas/过渡").getComponent(UIOpacity))
                .delay(0.4)
                .to(0, { opacity: 0 })
                .to(0.5, { opacity: 255 })

                .call(() => {
                    find("Canvas/BG").children[0].destroy();
                    find("Canvas/BG").addChild(Sence);

                })
                .to(0.5, { opacity: 0 })
                .start();
        }
        else if (BNZTL_GameManager.Instance._gameSence == 4 && this.Daoju[0].active == true && this.Daoju[1].active == true) {
            const Sence = instantiate(this.GameSence);
            this.RoleAnimation2();
            tween(find("Canvas/过渡").getComponent(UIOpacity))
                .delay(0.8)
                .to(0, { opacity: 0 })
                .to(0.5, { opacity: 255 })

                .call(() => {

                    find("Canvas/BG").children[0].destroy();
                    find("Canvas/BG").addChild(Sence);

                })
                .to(0.5, { opacity: 0 })
                .start();
        }
        else if (BNZTL_GameManager.Instance._gameSence == 6 && this.Daoju[0].active == true && this.Daoju[1].active == true) {
            const Sence = instantiate(this.GameSence);
            this.RoleAnimation();
            tween(find("Canvas/过渡").getComponent(UIOpacity))
                .delay(0.4)
                .to(0, { opacity: 0 })
                .to(0.5, { opacity: 255 })

                .call(() => {
                    find("Canvas/BG").children[0].destroy();
                    find("Canvas/BG").addChild(Sence);
                })
                .to(0.5, { opacity: 0 })
                .start();
        }
        else if (BNZTL_GameManager.Instance._gameSence == 8 && this.Daoju[0].active == true && this.Daoju[1].active == true) {
            this.RoleAnimation4();
        }
        else {
            this.RoleAnimation1();
        }
    }
    RoleAnimation() {


        this.Role.getComponent(sp.Skeleton).timeScale = 1;
        tween(this.Role)
            .to(0, { worldPosition: v3(this.Role.worldPosition.x, this.Role.worldPosition.y, 0) })
            .to(1, { worldPosition: v3(this.Role.worldPosition.x - 400, this.Role.worldPosition.y, 0) })
            .start();
    }
    RoleAnimation1() {

        this.Role.getComponent(sp.Skeleton).timeScale = 1;
        tween(this.Role)
            .to(0, { worldPosition: v3(this.Role.worldPosition.x, this.Role.worldPosition.y, 0) })
            .to(1, { worldPosition: v3(this.Role.worldPosition.x - 300, this.Role.worldPosition.y, 0) })
            .call(() => {
                BNZTL_GameManager.Instance.Lost();
            })
            .start();
    }
    RoleAnimation2() {
        this.Role.getComponent(sp.Skeleton).timeScale = 1;
        tween(this.Role)
            .to(0, { worldPosition: v3(this.Role.worldPosition.x, this.Role.worldPosition.y, 0) })
            .to(0.2, { worldPosition: v3(this.Role.worldPosition.x - 200, this.Role.worldPosition.y, 0) })
            .call(() => {
                this.Daoju[1].children[0].active = true;
                this.Role.active = false;
                this.Daoju[1].getComponent(Animation).play();
            })
            .start();
    }
    RoleAnimation4() {

        this.Role.getComponent(sp.Skeleton).timeScale = 1;
        tween(this.Role)
            .to(0, { worldPosition: v3(this.Role.worldPosition.x, this.Role.worldPosition.y, 0) })
            .to(1, { worldPosition: v3(this.Role.worldPosition.x - 300, this.Role.worldPosition.y, 0) })
            .call(() => {
                find("Canvas/结算页面").active = true;
                BNZTL_GameManager.Instance.Music(2);
                find("Canvas/结算页面").children[0].getComponent(Animation).play();
            })
            .delay(1)
            .call(() => {
                find("Canvas/结算页面").children[1].active = false;
                find("Canvas/结算页面").children[2].active = false;
            })
            .delay(1)
            .call(() => {
                BNZTL_GameManager.Instance.win();
            })
            .start();
    }
}