import { _decorator, Color, Component, Label, math, Node, randomRange, randomRangeInt, Sprite, SpriteFrame, Vec3 } from 'cc';
import { SXZW_PlayManage } from './SXZW_PlayManage';
const { ccclass, property } = _decorator;

@ccclass('SXZW_ChooseOpponent')
export class SXZW_ChooseOpponent extends Component {

    @property(Node)
    cards: Node[] = []

    @property(Sprite)
    cardSprites: Sprite[] = []

    @property(SpriteFrame) // 敌方贴图
    sprites: SpriteFrame[] = []

    @property(Color) // 敌方颜色
    colors: Color[] = []


    private cardsPos: Vec3[]
    private cardsSca: Vec3[]
    private cardsName: string[]
    private cardsRating: number[]

    @property(Number)
    chanageTime: number = 0

    private _chanageTime: number = 0
    private runChanageTime: number = 0
    private indexIncrement: number = 0
    private firstColorIndex: number = 0
    private waitStop: boolean = false
    private run: boolean = false

    private waitRandomTime = math.randomRange(2.5, 3.5)

    private static names = ["猎手凯", "术士梅拉", "守卫托尔", "刺客莲", "法师斯诺", "斧手格伦", "使者维莎", "萨满卡拉", "游侠莱奥", "巫师莫迪", "勇士布鲁", "法师艾拉", "刺客泽恩", "圣骑艾琳", "机械泰克", "德鲁林恩", "狂徒巴克", "行者艾瑞", "女巫摩根", "龙语者亚"]

    public get currentColor(): Color {
        return this.colors[(this.firstColorIndex + 2) % (this.colors.length)];
    }
    public get currentSpriteFrame(): SpriteFrame {
        return this.sprites[(this.firstColorIndex + 2) % (this.sprites.length)];
    }
    public get currentName(): string {
        const index = (2 - this.indexIncrement);
        return this.cardsName[index < 0 ? this.cardsName.length + index : index]
    }
    public get currentRating(): number {
        const index = (2 - this.indexIncrement);
        return this.cardsRating[index < 0 ? this.cardsRating.length + index : index]
    }

    public get isStop() {
        return !this.run;
    }

    start() {
        this.cardsPos = [];
        this.cardsSca = [];
        for (let index = 0; index < this.cards.length; index++) {
            this.cardsPos.push(this.cards[index].position.clone());
            this.cardsSca.push(this.cards[index].scale.clone());
            this.cardSprites[index].spriteFrame = this.sprites[index]
        }
        this.firstColorIndex = 0;
    }

    protected onEnable(): void {
        this.cardsName = [];
        this.cardsRating = [];
        const names = [...SXZW_ChooseOpponent.names].sort(() => Math.random() - 0.5);
        const cli = SXZW_PlayManage.Instance.getCurrentLevelIndex;
        for (let index = 0; index < this.cards.length; index++) {
            const name = names[index];
            this.cardsName.push(name)
            this.cards[(index + this.indexIncrement) % this.cards.length].getChildByName("Name").getComponent(Label).string = name;
            const rating = Math.max(((cli + 1) * 5) + randomRangeInt(-10, 10) + 10, 5);
            this.cardsRating.push(rating)
            this.cards[(index + this.indexIncrement) % this.cards.length].getChildByName("Rating").getComponent(Label).string = rating.toString();
        }
        this._chanageTime = this.chanageTime;
        this.run = true;
    }

    update(deltaTime: number) {
        if (this.cards.length === 0 || !this.run) return;
        if (this.runChanageTime <= this._chanageTime) {
            for (let index = 0; index < this.cards.length; index++) {
                const card = this.cards[index];
                const ii = (index + this.indexIncrement) % this.cards.length;
                card.setPosition(Vec3.lerp(new Vec3,
                    this.cardsPos[ii],
                    this.cardsPos[ii + 1 === this.cards.length ? 0 : ii + 1],
                    this.runChanageTime / this._chanageTime
                ));
                card.setScale(Vec3.lerp(new Vec3,
                    this.cardsSca[ii],
                    this.cardsSca[ii + 1 === this.cards.length ? 0 : ii + 1],
                    this.runChanageTime / this._chanageTime
                ))
            }
            this.runChanageTime += deltaTime;
        } else {

            this.indexIncrement = (this.indexIncrement + 1) % this.cards.length;
            this.runChanageTime = 0;

            this.firstColorIndex = this.firstColorIndex === 0 ? this.colors.length - 1 : this.firstColorIndex - 1;
            this.cardSprites[(this.cards.length - this.indexIncrement) % this.cards.length].spriteFrame = this.sprites[this.firstColorIndex]

            if (this.waitStop && this._chanageTime >= this.chanageTime * this.waitRandomTime) {
                this.run = false;
                this.waitStop = false;
            } else if (this.waitStop) {
                this._chanageTime += this.chanageTime;
            }

        }
    }

    public stop() {
        this.waitStop = true;
    }

}


