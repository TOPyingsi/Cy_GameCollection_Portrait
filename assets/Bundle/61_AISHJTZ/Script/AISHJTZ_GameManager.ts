import { _decorator, Component, director, instantiate, Node, Prefab, ScrollView, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

export enum RoleType {
    SHARK = 1,
    WOODENMAN = 2,
    SHUREN = 3,
    NINJA = 4
}

@ccclass('AISHJTZ_GameManager')
export class AISHJTZ_GameManager extends Component {

    public static Instance: AISHJTZ_GameManager = null;

    @property([Node]) props: Node[] = [];
    @property(Prefab) role: Prefab = null
    @property(Node) gameArea: Node = null;
    @property([SpriteFrame]) roleSprite: SpriteFrame[] = [];
    @property([SpriteFrame]) tipSprite: SpriteFrame[] = [];
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Node) submitButton: Node = null;
    @property(Node) e: Node = null;
    @property(Node) r: Node = null;
    @property(ScrollView) scrollView: ScrollView = null;
    @property(Node) a: Node = null;

    level: number = 0;
    nodes: Node[] = [];
    private currentRole: Node = null;

    protected onLoad(): void {
        AISHJTZ_GameManager.Instance = this;
        director.getScene().on("ok", this.ok, this)
        director.getScene().on("error", this.error666, this)
    }

    protected onDisable(): void {
        director.getScene().off("ok", this.ok, this)
        director.getScene().off("error", this.error666, this)
    }

    error666() {
        this.e.active = true;
        this.scheduleOnce(() => {
            this.e.active = false;
        }, 1);
    }

    r666() {
        this.r.active = true;
        this.scheduleOnce(() => {
            this.r.active = false;
        }, 1);
    }

    activtNode(node: Node) {
        this.props.forEach(element => {
            if (element.name == node.name) element.active = true;
        });
    }


    ok() {
        if ((this.level == 0 && this.nodes.length == 5) || (this.level == 1 && this.nodes.length == 5) || (this.level == 2 && this.nodes.length == 3) || (this.level == 3 && this.nodes.length == 4)) {
            console.log("ok", this.level, this.nodes.length, this.nodes);
            this.submitButton.active = true;
            this.submitButton.setSiblingIndex(999)
            tween(this.submitButton)
                .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .union()
                .repeatForever()
                .start()
        } else {
            this.submitButton.active = false;
        }
    }

    propTween(role: RoleType) {
        this[`role${role}`].forEach(element => {
            tween(element)
                .to(0.2, { position: v3(element.position.x, element.position.y + 30, 0) })
                .to(0.3, { position: v3(this.xx(element)) })
                .call(() => {
                    element.active = false;
                    this.activtNode(element);
                }).union()
                .start();
        });
    }

    xx(node: Node): Vec3 {
        let pos: Vec3 = null;
        this.props.forEach(element => {
            if (element.name == node.name) {
                pos = element.position.clone()
            }
        })
        return pos;
    }

    loadRole() {
        this.currentRole = instantiate(this.role)
        this.currentRole.name = this.roleSprite[this.level].name;
        this.currentRole.getChildByName("RoleNode").getComponent(Sprite).spriteFrame = this.roleSprite[this.level]
        this.currentRole.getChildByName("Tip").getComponent(Sprite).spriteFrame = this.tipSprite[this.level]
        this.currentRole.setParent(this.gameArea)
        this.currentRole.setPosition(-1000, 50)
        tween(this.currentRole)
            .to(1, { position: v3(0, 0) })
            .call(() => {
                director.getScene().emit("role", this.currentRole)
            })
            .start()
    }

    submit() {
        this.level++;
        this.r666();
        this.submitButton.active = false

        if (this.level >= 4) {
            this.scheduleOnce(() => {
                this.gamePanel.Win()
            }, 0.1)
        } else {
            this.scheduleOnce(() => {
                this.a.setPosition(this.a.position.x, -500)
                this.scrollView.node.setPosition(this.scrollView.node.position.x, -500)
                director.emit("clear")
                this.gameArea.destroyAllChildren()
                this.nodes.forEach(node => node.destroy())
                this.nodes = []
                this.loadRole()
            }, 1)
        }
    }
}


