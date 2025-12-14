import { _decorator, AudioClip, Component, Event, Label, Node, Prefab, randomRangeInt, Sprite, SpriteFrame, tween, UITransform, v3, Vec3 } from 'cc';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { MHLX_TutorialPanel } from './MHLX_TutorialPanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MHLX_GameManager')
export class MHLX_GameManager extends Component {

    private static instance: MHLX_GameManager;
    public static get Instance(): MHLX_GameManager {
        return this.instance;
    }

    @property(SpriteFrame)
    emptySf: SpriteFrame;

    @property(SpriteFrame)
    firstSf: SpriteFrame;

    @property(Prefab)
    X: Prefab;

    @property(GamePanel)
    gamePanel: GamePanel;

    @property(Node)
    compass: Node;

    @property(Node)
    firstNode: Node;

    @property(Node)
    Nodes: Node;

    @property(Node)
    hand: Node;

    @property(Node)
    win: Node;

    @property(Node)
    fail: Node;

    @property(MHLX_TutorialPanel)
    tutorial: MHLX_TutorialPanel;

    @property([AudioClip])
    clips: AudioClip[] = [];

    @property([SpriteFrame])
    groupSfs1: SpriteFrame[] = [];

    @property([SpriteFrame])
    groupSfs2: SpriteFrame[] = [];

    @property([Node])
    groupNodes: Node[] = [];

    isPlayerRound = false;
    level = 0;
    tutorialStep = 0;
    playerGroups: number[][][] = [];
    showGroups: number[];
    groups: Node[][][];
    allSfs: SpriteFrame[];

    start() {
        MHLX_GameManager.instance = this;
        this._Play();
        AudioManager.Instance.PlayBGM(this.clips[4]);
    }

    update(deltaTime: number) {

    }

    _Play() {
        this.allSfs = [];
        this.firstNode.setPosition(v3(0, 2000));
        this.firstNode.getComponent(Sprite).spriteFrame = this.firstSf;
        this.groups = [[[], [], [], []], [[], [], [], []]];
        let round = this.level == 0 ? true : randomRangeInt(0, 2) == 0;
        this.compass.position = Vec3.ZERO;
        this.compass.angle = 0;
        tween(this.compass)
            .to(1, { angle: 720 })
            .by(round ? 0.25 : 0.5, { angle: round ? 180 : 360 })
            .delay(1)
            .by(0.5, { position: v3(-1000, 0) })
            .call(() => {
                tween(this.firstNode)
                    .to(0.5, { position: Vec3.ZERO })
                    .call(() => {
                        if (this.tutorialStep == 0) this.tutorial.Show();
                        if (this.compass.angle % 360 == 180) this.isPlayerRound = true;
                        else this._EnemyRound();
                    })
                    .start();
            })
            .start();
        let field: number[][];
        switch (this.level) {
            case 0:
                field = [[-2, -2], [-2, -2]];
                this.playerGroups = [[[-2, -2], [-2, -2]], [[-2, -2], [-2, -2]]];
                this.showGroups = [2, 2];
                break;
            case 1:
                field = [[-2, -2, -2], [-2, -2, -2]];
                this.playerGroups = [[[-2, -2, -2], [-2, -2, -2]], [[-2, -2, -2], [-2, -2, -2]]];
                this.showGroups = [3, 3];
                break;
            case 2:
                field = [[-2, -2], [-2, -2], [-2, -2]];
                this.playerGroups = [[[-2, -2], [-2, -2], [-2, -2]], [[-2, -2], [-2, -2], [-2, -2]]];
                this.showGroups = [2, 2, 2];
                break;
            case 3:
                field = [[-2, -2, -2], [-2, -2, -2], [-2, -2, -2]];
                this.playerGroups = [[[-2, -2, -2], [-2, -2, -2], [-2, -2, -2]], [[-2, -2, -2], [-2, -2, -2], [-2, -2, -2]]];
                this.showGroups = [3, 3, 3];
                break;
            case 4:
                field = [[-2, -2, -2, -2], [-2, -2, -2, -2], [-2, -2, -2, -2]];
                this.playerGroups = [[[-2, -2, -2, -2], [-2, -2, -2, -2], [-2, -2, -2, -2]], [[-2, -2, -2, -2], [-2, -2, -2, -2], [-2, -2, -2, -2]]];
                this.showGroups = [4, 4, 4];
                break;
        }
        for (let i = 0; i < this.showGroups.length; i++) {
            const element = this.showGroups[i];
            for (let j = 0; j < element; j++) {
                this.allSfs.push(this.groupSfs1[i], this.groupSfs2[i]);
            }
        }
        for (let i = 0; i < this.groupNodes.length; i++) {
            const element = this.groupNodes[i];
            for (let j = 0; j < element.children.length; j++) {
                const element2 = element.children[j];
                element2.setRotationFromEuler(i == 0 ? Vec3.ZERO : v3(0, 180));
                if (Math.floor(j / field.length) >= field[0].length) {
                    element2.active = false;
                    continue;
                }
                element2.active = true;
                element2.getComponent(Sprite).spriteFrame = this.emptySf;
                let x = Math.floor(j / field[0].length);
                let y = -j % field[0].length;
                element2.setPosition(v3(x * 97, y * 98));
                this.groups[i][x].push(element2);
            }
        }
    }

    Click(event: Event) {
        AudioManager.Instance.PlaySFX(this.clips[3]);
        if (!this.isPlayerRound) return;
        let target: Node = event.target;
        if (target == this.firstNode) return;
        let posX = 0;
        for (let i = 0; i < this.groups[0].length; i++) {
            const element = this.groups[0][i];
            if (element.indexOf(target) != -1) {
                posX = i;
                break;
            }
        }
        let firstSprite = this.firstNode.getComponent(Sprite);
        let group = this.groups[0][posX];
        let num = this.groupSfs1.indexOf(firstSprite.spriteFrame);
        let num2 = this.playerGroups[0][posX][0];
        if (num != -1 && num2 != -1 && num2 != -2 && num != num2) return this._ShowX(posX);
        let bool = false;
        for (let i = 0; i < this.playerGroups[0].length; i++) {
            if (i == posX) continue;
            const element = this.playerGroups[0][i][0];
            if (element == num) {
                bool = true;
                break;
            }
        }
        if (bool && num2 == -1) return this._ShowX(posX);
        this.isPlayerRound = false;
        let pos = group[0].getWorldPosition();
        this.firstNode.setParent(this.groupNodes[0], true);
        this.firstNode.setSiblingIndex(0);
        tween(this.firstNode)
            .to(0.25, { worldPosition: v3(pos.x, this.firstNode.getWorldPosition().y) })
            .to(0.25, { worldPosition: v3(pos.x, pos.y + 98) })
            .call(() => {
                AudioManager.Instance.PlaySFX(this.clips[0]);
                for (let i = 0; i < group.length; i++) {
                    const element = group[i];
                    console.log(element.worldPosition)
                    tween(element)
                        .by(0.25, { worldPosition: v3(0, -98) })
                        .start();
                }
            })
            .by(0.25, { worldPosition: v3(0, -98) })
            .call(() => {
                console.log(this.playerGroups[0]);
                for (let i = this.playerGroups[0][posX].length - 1; i > -1; i--) {
                    if (i > 0) this.playerGroups[0][posX][i] = this.playerGroups[0][posX][i - 1];
                    else {
                        let num = this.groupSfs1.indexOf(firstSprite.spriteFrame);
                        this.playerGroups[0][posX][i] = num;
                    }
                }
                group.splice(0, 0, this.firstNode);
                this.firstNode = group.pop();
                firstSprite = this.firstNode.getComponent(Sprite);
                this.groups[0][posX] = group;
                this.firstNode.setParent(this.Nodes, true);
                if (firstSprite.spriteFrame == this.emptySf)
                    tween(this.firstNode)
                        .to(0.25, { eulerAngles: v3(0, 90, 0) })
                        .call(() => {
                            let num = randomRangeInt(0, this.allSfs.length);
                            if (this.tutorialStep == 1) {
                                num = 0;
                                this.tutorial.Show();
                            }
                            let sf = this.allSfs.splice(num, 1)[0];
                            if (this.tutorialStep == 2 && this.groupSfs1.indexOf(sf) == -1) this.tutorial.Show();
                            firstSprite.spriteFrame = sf;
                        })
                        .to(0.25, { eulerAngles: Vec3.ZERO })
                        .to(0.25, { position: Vec3.ZERO })
                        .call(() => {
                            let bool = true;
                            for (let i = 0; i < this.playerGroups[0][posX].length; i++) {
                                const element = this.playerGroups[0][posX][i];
                                if (i > 0 && element != this.playerGroups[0][posX][i - 1]) {
                                    bool = false;
                                    break;
                                }
                            }
                            if (bool) {
                                AudioManager.Instance.PlaySFX(this.clips[1]);
                                for (let i = 0; i < this.groups[0][posX].length; i++) {
                                    console.log(this.groups[0][posX][i]);
                                    tween(this.groups[0][posX][i])
                                        .by(0.1 * (i + 1), { position: v3(0, -50) })
                                        .by(0.1 * (i + 1), { position: v3(0, 50) })
                                        .start();
                                }
                                for (let i = 0; i < this.playerGroups[0].length; i++) {
                                    const element = this.playerGroups[0][i];
                                    for (let j = 0; j < element.length; j++) {
                                        const element2 = element[j];
                                        if (j > 0 && element2 != element[j - 1] || element2 == -2) {
                                            bool = false;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (bool) this._Win();
                            else {
                                let num = this.groupSfs1.indexOf(firstSprite.spriteFrame);
                                if (num == -1 && firstSprite.spriteFrame != this.firstSf) this._EnemyRound();
                                else this.isPlayerRound = true;
                            }
                        })
                        .start();
                else tween(this.firstNode)
                    .to(0.25, { position: Vec3.ZERO })
                    .call(() => {
                        let bool = true;
                        for (let i = 0; i < this.playerGroups[0][posX].length; i++) {
                            const element = this.playerGroups[0][posX][i];
                            if (i > 0 && element != this.playerGroups[0][posX][i - 1]) {
                                bool = false;
                                break;
                            }
                        }
                        if (bool) {
                            AudioManager.Instance.PlaySFX(this.clips[1]);
                            for (let i = 0; i < this.groups[0][posX].length; i++) {
                                tween(this.groups[0][posX][i])
                                    .by(0.1 * (i + 1), { position: v3(0, -50) })
                                    .by(0.1 * (i + 1), { position: v3(0, 50) })
                                    .start();
                            }
                            for (let i = 0; i < this.playerGroups[0].length; i++) {
                                const element = this.playerGroups[0][i];
                                for (let j = 0; j < element.length; j++) {
                                    const element2 = element[j];
                                    console.log(j, element, element2, element[j - 1]);
                                    if (j > 0 && element2 != element[j - 1] || element2 == -2) {
                                        bool = false;
                                        break;
                                    }
                                }
                            }
                        }
                        if (bool) this._Win();
                        else {
                            let num = this.groupSfs1.indexOf(firstSprite.spriteFrame);
                            if (num == -1 && firstSprite.spriteFrame != this.firstSf) this._EnemyRound();
                            else this.isPlayerRound = true;
                        }
                    })
                    .start();
            })
            .start();
    }

    _ShowX(posX: number) {
        let node: Node = PoolManager.GetNodeByPrefab(this.X, this.Nodes);
        node.setWorldPosition(this.groups[0][posX][0].getWorldPosition());
    }

    _EnemyRound() {
        let firstSprite = this.firstNode.getComponent(Sprite);
        let num = this.groupSfs2.indexOf(firstSprite.spriteFrame);
        let posX = 0;
        if (num == -1) {
            for (let i = 0; i < this.playerGroups[1].length; i++) {
                const element = this.playerGroups[1][i];
                for (let j = 0; j < element.length; j++) {
                    const element2 = element[j];
                    if (element2 == -2) {
                        posX = i;
                        break;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this.playerGroups[1].length; i++) {
                const element = this.playerGroups[1][i];
                if (element[element.length - 1] == -1 || element[element.length - 1] == -2 || num == element[element.length - 1]) {
                    posX = i;
                    break;
                }
            }
        }
        let group = this.groups[1][posX];
        let pos = group[group.length - 1].getWorldPosition();
        tween(this.hand)
            .to(0.25, { worldPosition: pos })
            .to(0.25, { scale: v3(0.9, 0.9, 0.9) })
            .call(() => {
                AudioManager.Instance.PlaySFX(this.clips[3]);
                this.firstNode.setParent(this.groupNodes[1], true);
                this.firstNode.setSiblingIndex(9999);
                tween(this.firstNode)
                    .to(0.25, { worldPosition: v3(pos.x, this.firstNode.getWorldPosition().y) })
                    .to(0.25, { worldPosition: v3(pos.x, pos.y - 98) })
                    .call(() => {
                        AudioManager.Instance.PlaySFX(this.clips[0]);
                        for (let i = 0; i < group.length; i++) {
                            const element = group[i];
                            console.log(element.worldPosition)
                            tween(element)
                                .by(0.25, { worldPosition: v3(0, 98) })
                                .start();
                        }
                    })
                    .by(0.25, { worldPosition: v3(0, 98) })
                    .call(() => {
                        console.log(this.playerGroups[1]);
                        for (let i = 0; i < this.playerGroups[1][posX].length; i++) {
                            if (i < this.playerGroups[1][posX].length - 1) this.playerGroups[1][posX][i] = this.playerGroups[1][posX][i + 1];
                            else {
                                let num = this.groupSfs2.indexOf(firstSprite.spriteFrame);
                                this.playerGroups[1][posX][i] = num;
                            }
                        }
                        group.push(this.firstNode);
                        this.firstNode = group.splice(0, 1)[0];
                        firstSprite = this.firstNode.getComponent(Sprite);
                        this.groups[1][posX] = group;
                        if (firstSprite.spriteFrame == this.emptySf) tween(this.firstNode)
                            .to(0.25, { eulerAngles: v3(0, 90, 0) })
                            .call(() => {
                                let num = randomRangeInt(0, this.allSfs.length);
                                let sf = this.allSfs.splice(num, 1)[0];
                                firstSprite.spriteFrame = sf;
                            })
                            .to(0.25, { eulerAngles: v3(0, 180, 0) })
                            .call(() => { this.firstNode.setParent(this.Nodes, true); })
                            .to(0.25, { position: Vec3.ZERO })
                            .call(() => {
                                let bool = true;
                                for (let i = 0; i < this.playerGroups[1][posX].length; i++) {
                                    const element = this.playerGroups[1][posX][i];
                                    if (i > 0 && element != this.playerGroups[1][posX][i - 1]) {
                                        bool = false;
                                        break;
                                    }
                                }
                                if (bool) {
                                    AudioManager.Instance.PlaySFX(this.clips[1]);
                                    for (let i = 0; i < this.groups[1][posX].length; i++) {
                                        tween(this.groups[1][posX][i])
                                            .by(0.1 * (i + 1), { position: v3(0, -50) })
                                            .by(0.1 * (i + 1), { position: v3(0, 50) })
                                            .start();
                                    }
                                    for (let i = 0; i < this.playerGroups[1].length; i++) {
                                        const element = this.playerGroups[1][i];
                                        for (let j = 0; j < element.length; j++) {
                                            const element2 = element[j];
                                            if (j > 0 && element2 != element[j - 1] || element2 == -2) {
                                                bool = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (bool) this._Fail();
                                else {
                                    let num = this.groupSfs2.indexOf(firstSprite.spriteFrame);
                                    if (num != -1 || firstSprite.spriteFrame == this.firstSf) this._EnemyRound();
                                    else this.isPlayerRound = true;
                                }
                            })
                            .start();
                        else tween(this.firstNode)
                            .call(() => { this.firstNode.setParent(this.Nodes, true); })
                            .to(0.25, { position: Vec3.ZERO })
                            .call(() => {
                                let bool = true;
                                for (let i = 0; i < this.playerGroups[1][posX].length; i++) {
                                    const element = this.playerGroups[1][posX][i];
                                    if (i > 0 && element != this.playerGroups[1][posX][i - 1]) {
                                        bool = false;
                                        break;
                                    }
                                }
                                if (bool) {
                                    AudioManager.Instance.PlaySFX(this.clips[1]);
                                    for (let i = 0; i < this.groups[1][posX].length; i++) {
                                        tween(this.groups[1][posX][i])
                                            .by(0.1 * (i + 1), { position: v3(0, -50) })
                                            .by(0.1 * (i + 1), { position: v3(0, 50) })
                                            .start();
                                    }
                                    for (let i = 0; i < this.playerGroups[1].length; i++) {
                                        const element = this.playerGroups[1][i];
                                        for (let j = 0; j < element.length; j++) {
                                            const element2 = element[j];
                                            if (j > 0 && element2 != element[j - 1] || element2 == -2) {
                                                bool = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (bool) this._Fail();
                                else {
                                    let num = this.groupSfs2.indexOf(firstSprite.spriteFrame);
                                    if (num != -1 || firstSprite.spriteFrame == this.firstSf) this._EnemyRound();
                                    else this.isPlayerRound = true;
                                }
                            })
                            .start();
                    })
                    .start();
            })
            .to(0.25, { scale: Vec3.ONE })
            .to(0.25, { position: v3(-1000, 500) })
            .start();
    }

    _Win() {
        this.scheduleOnce(() => {
            if (this.level < 4) {
                AudioManager.Instance.PlaySFX(this.clips[2]);
                this.win.active = true;
            }
            else this.gamePanel.Win();
        }, 0.5);
    }

    _Fail() {
        this.scheduleOnce(() => { this.fail.active = true; }, 0.5);
    }

    _Next() {
        this.win.active = false;
        this.level++;
        this._Play();
    }

}


