import { _decorator, Component, Node, Button, Label, ProgressBar, Animation, director } from 'cc';
import { eventCenter } from '../../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../../Utils/JJWXR_Events';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import Banner from 'db://assets/Scripts/Banner';
import { JJWXR_RamainManager } from './JJWXR_RamainManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_SucceedUI')
export class JJWXR_SucceedUI extends Component {
    private curLevel: number = 0;
    @property(Button)
    private btnComeBack: Button = null;
    @property(Button)
    private btnMoreReward: Button = null;
    @property(Button)
    private btnGetReward: Button = null;

    @property(Node)
    private progressBar: Node = null;
    @property(Label)
    private progressLabel: Label = null;
    @property(Label)
    private remainingTimeLabel: Label = null;
    @property(Label)
    private timeLabel: Label = null;
    @property(Label)
    private enemyLabel: Label = null;
    @property(JJWXR_RamainManager)
    enemyRemainManager: JJWXR_RamainManager = null;

    // 添加进度
    @property(Node)
    private gun1: Node = null;
    @property(Node)
    private gun2: Node = null;

    @property(Node)
    private animNode: Node = null;

    private onceTouch: boolean = false;

    static headShot = 0;
    static hitShot = 0;

    onLoad() {
        this.btnComeBack.node.on(Button.EventType.CLICK, this.onComeBack, this);
        this.btnMoreReward.node.on(Button.EventType.CLICK, this.onMoreReward, this);
        this.btnGetReward.node.on(Button.EventType.CLICK, this.onGetReward, this);
    }

    start() {
        ProjectEventManager.emit(ProjectEvent.游戏结束);
        let currentLevel = (localStorage.getItem('currentLevel'));
        console.log('level:', currentLevel); // 获取当前关卡

        let data = localStorage.getItem('progress');
        let progress = { total: 3, current: 0, gunIndex: 1 };
        if (data != null && data != "") progress = JSON.parse(data);
        localStorage.setItem('progress', JSON.stringify(progress)); // 初始化进度

        // if (progress.gunIndex === 1) {
        //     this.gun1.active = true;
        //     this.gun2.active = false;
        // } else if (progress.gunIndex === 2) {
        //     this.gun1.active = false;
        //     this.gun2.active = true;
        // }
        this.CheckTimeAndEnemy();
        this.updateSucceedUI();
        this.onNextLevel();
    }

    updateSucceedUI() {
        console.log('update succeed ui');
        this.addProgress();
    }

    // 点击返回按钮时触发
    onComeBack() {
        this.onceTouch = true;
        if (this.onceTouch) {
            eventCenter.emit(JJWXR_Events.GET_SUCCEED_MONEY);   // 获取奖励  
        }
        director.loadScene('JJWXR_MenuScene');
    }

    // 点击更多奖励按钮时触发
    onMoreReward() {
        let x = this;
        Banner.Instance.ShowVideoAd(() => {
            if (!x.onceTouch) {
                eventCenter.emit(JJWXR_Events.GET_MORE_REWARD_SCENE, 300);   // 更多奖励
                // eventCenter.emit(JJWXR_Events.STOP_MOVE_BAR);   // 获取奖励
                x.animNode.getComponent(Animation).play(); // 播放动画
                x.onceTouch = true;
            }
            x.scheduleOnce(() => {
                director.loadScene('JJWXR_MenuScene');
            }, 2.5);
        });
    }

    // 点击领取奖励按钮时触发
    onGetReward() {

        if (!this.onceTouch) {
            eventCenter.emit(JJWXR_Events.GET_SUCCEED_MONEY);   // 获取奖励
            this.animNode.getComponent(Animation).play(); // 播放动画
            this.onceTouch = true;
        }
        this.scheduleOnce(() => {
            director.loadScene('JJWXR_MenuScene');
        }, 2);
    }

    // 关卡切换
    onNextLevel() {
        let currentLevel = parseInt(localStorage.getItem('currentLevel'));
        currentLevel++;
        localStorage.setItem('currentLevel', (currentLevel).toString());

        // let shotNumber = (localStorage.getItem('shotNumber'));
        // // let hitShot = (localStorage.getItem('hitShot'));
        // // let headShot = (localStorage.getItem('headShot'));

        // JJWXR_SucceedUI.headShot = 0;
        // JJWXR_SucceedUI.hitShot = 0;
        // // 数据归零
        // localStorage.setItem('shotNumber', shotNumber);
        // localStorage.setItem('hitShot', hitShot);
        // localStorage.setItem('headShot', headShot);

        // if (currentLevel < 6) {
        // let curlevel = JSON.parse(localStorage.getItem('currentLevel'));
        // console.log('level:', curlevel);
        // }
        // else {
        //     currentLevel = 1;
        //     localStorage.setItem('currentLevel', (currentLevel).toString());
        // }
    }

    // 进度条增加
    addProgress() {
        return;
        const progress = JSON.parse(localStorage.getItem('progress'));
        console.log(progress.total + " " + progress.current + " " + progress.gunIndex);
        let cur = progress.current;
        let total = progress.total;
        cur += 1;
        if (cur > total) {
            cur = 0;
        }
        this.progressBar.getComponent(ProgressBar).progress = cur / total;
        // console.log('progress:', cur + " " + total);
        this.progressLabel.string = cur + "/" + total;
        progress.current = cur;
        localStorage.setItem('progress', JSON.stringify(progress));

        if (progress.current >= progress.total && progress.gunIndex == 1) {
            console.log('奖励枪:');
            const gunReward = JSON.parse(localStorage.getItem('gun5'));
            gunReward.isBuy = true;
            localStorage.setItem('gun5', JSON.stringify(gunReward));

            eventCenter.emit(JJWXR_Events.UPDATE_BUTTON_STATE);   // 更多奖励
            const index = progress.gunIndex + 1;
            progress.gunIndex = index;
            localStorage.setItem('progress', JSON.stringify(progress));
        }
        if (progress.current >= progress.total && progress.gunIndex == 2) {
            const gunReward = JSON.parse(localStorage.getItem('gun6'));
            gunReward.isBuy = true;
            localStorage.setItem('gun6', JSON.stringify(gunReward));
            eventCenter.emit(JJWXR_Events.UPDATE_BUTTON_STATE);   // 更多奖励
        }

        // // 重置progress
        if (progress.current == progress.total) {
            progress.current = 0;
            progress.total = 3;
            localStorage.setItem('progress', JSON.stringify(progress));
        }
    }

    CheckTimeAndEnemy() {
        this.timeLabel.string = this.remainingTimeLabel.string;
        this.enemyLabel.string = this.enemyRemainManager.remainUINode[this.enemyRemainManager.remainCountIndex].children.length.toString();
    }

}