import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZHSK_JingDu')
export class ZHSK_JingDu extends Component {
    @property(Node)
    NowNode: Node = null;
    @property(Node)
    JinDu: Node = null;
    @property(Node)
    player: Node = null;

    public static Instance: ZHSK_JingDu = null;
    protected onLoad(): void {
        ZHSK_JingDu.Instance = this;
    }
    JingduCheck() {

        if (this.player.children[0].name == "Player") {
            this.NowNode.active = false;
            this.NowNode.setWorldPosition(this.NowNode.worldPosition.x + 180, this.NowNode.worldPosition.y, 0);

            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player1") {
            this.NowNode.active = false;
            this.NowNode.setWorldPosition(this.NowNode.worldPosition.x + 180, this.NowNode.worldPosition.y, 0);
            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player2") {
            this.NowNode.active = false;
            this.NowNode.setWorldPosition(this.NowNode.worldPosition.x + 163, this.NowNode.worldPosition.y, 0);
            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player3") {
            this.NowNode.active = false;
            this.JinDu.setWorldPosition(this.JinDu.worldPosition.x - 180, this.JinDu.worldPosition.y, 0);
            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player4") {
            this.NowNode.active = false;
            this.JinDu.setWorldPosition(this.JinDu.worldPosition.x - 180, this.JinDu.worldPosition.y, 0);
            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player5") {
            this.NowNode.active = false;
            this.JinDu.setWorldPosition(this.JinDu.worldPosition.x - 180, this.JinDu.worldPosition.y, 0);
            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player6") {
            this.NowNode.active = false;
            this.JinDu.setWorldPosition(this.JinDu.worldPosition.x - 180, this.JinDu.worldPosition.y, 0);
            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player7") {
            this.NowNode.active = false;
            this.JinDu.setWorldPosition(this.JinDu.worldPosition.x - 180, this.JinDu.worldPosition.y, 0);
            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player8") {
            this.NowNode.active = false;
            this.NowNode.setWorldPosition(this.NowNode.worldPosition.x + 180, this.NowNode.worldPosition.y, 0);
            this.NowNode.active = true;
        }
        if (this.player.children[0].name == "Player9") {
            this.NowNode.active = false;
            this.NowNode.setWorldPosition(this.NowNode.worldPosition.x + 180, this.NowNode.worldPosition.y, 0);
            this.NowNode.active = true;
        }
    }
}


