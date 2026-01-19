import { _decorator, Color, Component, Event, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QBT_Shop')
export class QBT_Shop extends Component {

    @property(Sprite)
    private tabHeadSprite: Sprite;
    @property(Sprite)
    private tabBowSprite: Sprite;
    @property(Sprite)
    private tabArrowSprite: Sprite;

    start() {

    }

    update(deltaTime: number) {

    }

    changeTab(event: Event, num: string) {
        const c1 = new Color(128, 128, 128);
        const c2 = new Color(0, 128, 196);
        this.tabHeadSprite.color = num === '0' ? c2 : c1;
        this.tabBowSprite.color = num === '1' ? c2 : c1;
        this.tabArrowSprite.color = num === '2' ? c2 : c1;
    }


}