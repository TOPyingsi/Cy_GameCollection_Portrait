import { _decorator, Button, Component, director, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MSTT_BlockSet')
export class MSTT_BlockSet extends Component {
    @property([SpriteFrame])
    private blockSprites: SpriteFrame[] = [];
    private blockId: number = 0;
    private static lastTwoIds: number[] = [];
    static isMoving = false;

    protected onLoad(): void {
        MSTT_BlockSet.isMoving = false;
        const button = this.node.getComponent(Button) || this.node.addComponent(Button);
        button.node.on(Button.EventType.CLICK, this.onBlockClick, this);
        //this.blockId = Math.floor(Math.random() * 4);
        let newId: number;
        do {
            newId = Math.floor(Math.random() * 4);
        } while (this.isThirdConsecutive(newId));

        this.blockId = newId;
        this.updateHistory(newId);

    }
    private isThirdConsecutive(newId: number): boolean {
        return MSTT_BlockSet.lastTwoIds.length >= 2 &&
            MSTT_BlockSet.lastTwoIds[0] === newId &&
            MSTT_BlockSet.lastTwoIds[1] === newId;
    }
    private updateHistory(newId: number): void {
        MSTT_BlockSet.lastTwoIds.push(newId);
        if (MSTT_BlockSet.lastTwoIds.length > 2) {
            MSTT_BlockSet.lastTwoIds.shift();
        }
    }
    start() {
        this.node.getComponent(Sprite)!.spriteFrame = this.blockSprites[this.blockId];
    }
    onDisable() {
        const button = this.node.getComponent(Button);
        if (button) {
            button.node.off(Button.EventType.CLICK, this.onBlockClick, this);
        }
    }

    update(deltaTime: number) {

    }
    public getBlockId(): number {
        return this.blockId;
    }

    public getPositionIndex(gridSize: number): number {
        return this.node.position.y * gridSize + this.node.position.x;
    }
    private onBlockClick() {
        if (MSTT_BlockSet.isMoving) return;
        this.node.getChildByName("选中框").active = true;
        director.emit('BLOCK_SELECTED', {
            id: this.blockId,
            pos: this.node.worldPosition,
            node: this.node
        });
    }
}


