import { _decorator, CCInteger, Component, Event, instantiate, Label, Material, Node, Prefab, resources, SpriteFrame } from 'cc';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { WGPYP_CardItem } from './WGPYP_CardItem';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('WGPYP_GameManager')
export class WGPYP_GameManager extends Component {

    public static Instance: WGPYP_GameManager = null;

    @property(Node)
    Cards: Node = null;

    @property(Material)
    Flash: Material = null;

    @property(CCInteger)
    cardCount: number = 9;

    @property(GamePanel)
    gamePanel: GamePanel = null;

    cards: WGPYP_CardItem[] = [];

    lastCard: WGPYP_CardItem = null;

    allCardType: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    time: number = 180;

    curCards: WGPYP_CardItem[] = [];

    @property(Node)
    T: Node = null;

    @property(Node)
    F: Node = null;

    protected onLoad(): void {
        WGPYP_GameManager.Instance = this;
        this.InitCards();
    }

    InitCards() {
        const loadDone = () => {
            this.cards = Tools.Shuffle(this.cards);
            for (let i = 0; i < this.cards.length; i++) {
                this.Cards.addChild(this.cards[i].node);
            }
        }

        let allCardType = Tools.Shuffle(this.allCardType);
        let needCardType = [];
        let loadCount = 0;

        for (let i = 0; i < Math.floor(this.cardCount / 2); i++) {
            for (let j = 0; j < 2; j++) {
                needCardType.push(allCardType[i]);
            }
        }

        if (this.cardCount % 2 == 1) {
            needCardType.push(12);
        }

        console.log(needCardType);

        let scale = 1;
        if (this.cardCount == 16) scale = 0.75;
        if (this.cardCount == 20) scale = 0.65;

        for (let i = 0; i < this.cardCount; i++) {
            BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Res/Prefabs/CardItem").then((prefab: Prefab) => {
                const newNode = instantiate(prefab);
                let item = newNode.getComponent(WGPYP_CardItem);
                item.Init(needCardType[i], this.OnCardCallback.bind(this, item));
                item.node.setScale(scale, scale, scale);
                this.cards.push(item);

                loadCount++;
                if (loadCount == this.cardCount) {
                    loadDone();
                }
            });
        }
    }

    ClearCard(card: WGPYP_CardItem) {
        if (this.curCards.findIndex(e => e == card) !== -1) {
            this.curCards = this.curCards.filter(e => e != card);
        }
    }

    OnCardCallback(card: WGPYP_CardItem) {
        if (this.lastCard == card) {
            this.lastCard = null;
        } else {
            if (this.lastCard != null) {
                if (this.lastCard.getFrontImageName() == card.getFrontImageName()) {
                    console.log("匹配成功");
                    this.T.active = true;
                    this.scheduleOnce(() => {
                        this.T.active = false;
                    }, 0.5);
                    card.Success(this.Flash);
                    this.lastCard.Success(this.Flash);
                    this.lastCard = null;
                    this.onAllCardsMatched();
                } else {
                    console.log("匹配失败");
                    this.F.active = true;
                    this.scheduleOnce(() => {
                        this.F.active = false;
                    }, 0.5);
                    this.lastCard.flipBack();
                    card.flipBack();
                    this.lastCard = null;
                }
            } else {
                if (card.getFrontImageName() == "12") {
                    card.Success(this.Flash);
                    this.onAllCardsMatched();
                } else {
                    this.lastCard = card;
                }
            }
        }

        return;
    }

    private onAllCardsMatched() {
        let cards = this.cards.filter(e => e.Button.enabled);
        if (cards.length == 0) {
            this.gamePanel.Win();
            console.log("所有卡片匹配成功，胜利！");
        }
    }
}


