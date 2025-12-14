import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { MSTT_EnemyMove } from './MSTT_EnemyMove';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MSTT_GameManager')
export class MSTT_GameManager extends Component {
    @property(Node)
    private WinNode: Node | null = null;

    @property(Node)
    private LoseNode: Node | null = null;

    @property(GamePanel)
    panel: GamePanel | null = null;

    @property([Node])
    spines: Node[] = [];

    protected onLoad(): void {
        let collider = this.WinNode.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.gameWin, this);
        }
        let collider2 = this.LoseNode.getComponent(Collider2D);
        if (collider2) {
            collider2.on(Contact2DType.BEGIN_CONTACT, this.gameLose, this);
        }
        // this.panel.answerPrefab = prefab;
        this.panel.winStr = "多亏了你，我才能顺利逃出来！";
        this.panel.lostStr = "运气不好罢了，让我们再试试吧！";
    }
    start() {

    }
    gameWin(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log('游戏胜利');
        this.node.children[2].getChildByName("Enemy").getComponent(MSTT_EnemyMove).moveStop();
        this.LoseNode.getComponent(Collider2D).enabled = false;
        this.WinNode.getComponent(Collider2D).enabled = false;
        this.node.children[2].getChildByName("GameOver").active = true;
        this.panel.Win();
    }
    gameLose(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log('游戏失败');
        this.node.children[2].getChildByName("Enemy").getComponent(MSTT_EnemyMove).moveStop();
        this.WinNode.getComponent(Collider2D).enabled = false;
        this.LoseNode.getComponent(Collider2D).enabled = false;
        this.node.children[2].getChildByName("GameOver").active = true;

        this.panel.Lost();
    }

    update(deltaTime: number) {

    }

    protected onDisable(): void {
        for (let i = 0; i < this.spines.length; i++) {
            const element = this.spines[i];
            element.destroy();
        }
    }
}


