import { _decorator, CCInteger, Component, instantiate, Node, Prefab } from 'cc';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('BigBanana_GameManager')
export class BigBanana_GameManager extends Component {

    public static instance: BigBanana_GameManager;

    @property(CCInteger) bananaNumber: number = 0;
    @property(Node) gameArea: Node = null;
    @property(Prefab) item: Prefab = null;
    @property(Prefab) level_item: Prefab = null;
    @property(Node) rightTip: Node = null;
    @property(Node) failTip: Node = null;
    @property(GamePanel) gamePanel: GamePanel = null;

    count: number = 0;
    bananas: Node[] = [];

    protected onLoad(): void {
        BigBanana_GameManager.instance = this;
        this.load();
    }

    load() {
        for (let i = 0; i < this.bananaNumber - 1; i++) {
            const newNode = instantiate(this.item);
            this.bananas.push(newNode);
        }

        const newNode = instantiate(this.level_item);
        this.bananas.push(newNode);

        this.bananas = Tools.Shuffle(this.bananas);
        this.bananas.forEach(element => {
            this.gameArea.addChild(element);
        });
    }

    reGame() {
        if (this.count >= 3) return;
        this.gameArea.removeAllChildren();
        this.bananas = [];
        this.load();
    }

}


