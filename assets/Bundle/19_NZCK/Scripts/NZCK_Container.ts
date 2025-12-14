import { _decorator, Component, find, Node, tween, v3, Vec3 } from 'cc';
import { NZCK_LVController } from './NZCK_LVController';
import { NZCK_SoundController, NZCK_Sounds } from './NZCK_SoundController';
const { ccclass, property } = _decorator;

@ccclass('NZCK_Container')
export class NZCK_Container extends Component {
    CardParent: Node = null;
    NextWorld: Vec3 = new Vec3();

    Cards: Node[] = [];

    protected onLoad(): void {
        this.CardParent = find("卡片", this.node);
        this.NextWorld = this.CardParent.getWorldPosition().clone();
    }

    addCard(card: Node) {
        this.Cards.push(card);
        const cardPos = card.getWorldPosition().clone();
        card.parent = this.CardParent;
        card.setWorldPosition(cardPos);
        tween(card)
            .to(1, { scale: v3(1.4, 1.4, 1.4) }, { easing: `sineOut` })
            .parallel(tween(card).to(1, { scale: v3(0.75, 0.75, 0.75) }, { easing: `sineOut` }),
                tween(card).to(1, { worldPosition: this.NextWorld }, { easing: `sineOut` }))
            .call(() => {
                NZCK_SoundController.Instance.PlaySound(NZCK_Sounds.Get);
                NZCK_LVController.Instance.IsClick = true;
                this.NextWorld.add3f(10, 0, 0);
                if (NZCK_LVController.Instance.HandCardNum <= 0) {
                    NZCK_LVController.Instance.next();
                }
            })
            .start();
    }

    addCards(cards: Node[]) {
        cards.forEach(e => {
            e.parent = this.CardParent;
            e.scale = v3(0.75, 0.75, 0.75);
            e.setWorldPosition(this.NextWorld);
            this.NextWorld.add3f(10, 0, 0);
        })
    }

}


