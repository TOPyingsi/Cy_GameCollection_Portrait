import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NJWD_Match')
export class NJWD_Match extends Component {

    @property(Node)
    playBtn: Node;

    @property(Node)
    matchLabel: Node;

    @property(Node)
    enemyHide: Node;

    @property(Node)
    enemySearch: Node;

    @property(Sprite)
    enemySprite: Sprite;

    @property(Label)
    enemyLabel: Label;

    @property([SpriteFrame])
    enemySfs: SpriteFrame[] = [];

    enemyNum = 0;
    matchTime = 30;
    currentTime = 0;

    enemyNames = ["马猴烧酒", "呆呆兽", "旅行者", "凯恩", "查丹科", "小骑士", "雷诺", "先知", "赛可", "岁月静好", "风轻云淡", "小黄人", "大白", "莱拉克", "木兰花", "莉莉", "百合花", "大黄蜂", "奥尔加", "佐西亚"];

    start() {
        ProjectEventManager.emit(ProjectEvent.弹出窗口, "狙击外星人-你狙我躲");
    }

    update(deltaTime: number) {

    }

    Match() {
        this.playBtn.active = false;
        this.matchLabel.active = true;
        this.enemyHide.active = false;
        this.enemySearch.active = true;
        this.schedule(this.MatchEnemy, 0.1, this.matchTime - 1);
    }

    MatchEnemy() {
        this.currentTime++;
        this.enemyNum = Math.floor(Math.random() * this.enemySfs.length);
        this.enemySprite.spriteFrame = this.enemySfs[this.enemyNum];
        this.enemyLabel.string = this.enemyNames[Math.floor(Math.random() * this.enemyNames.length)];
        if (this.currentTime == this.matchTime) {
            this.enemySearch.active = false;
            this.matchLabel.active = false;
            this.MatchEnd();
        }
    }

    MatchEnd() {
        this.scheduleOnce(() => {
            UIManager.ShowLoadingPanel("NJWD_ShootAndHide", GameManager.GameData.Bundles);
        }, 2);
    }

}


