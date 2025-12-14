import { _decorator, Component, Node } from 'cc';
import { JJWXR_EnemyPic } from './JJWXR_EnemyPic';
import { JJWXR_Events } from '../../Utils/JJWXR_Events';
import { eventCenter } from '../../Utils/JJWXR_EventCenter';
import { JJWXR_Bullet } from '../JJWXR_Bullet';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_RemianUI')
export class JJWXR_RemianUI extends Component {

    private enemyPicNode: Node[] = [];
    private index: number = 0;  // 子节点的索引

    start() {
        console.log(this.node);

        // 获取所有的子节点
        this.enemyPicNode = this.node.children;
        // 获取最后一个子节点
        this.index = this.enemyPicNode.length - 1;
        console.log(this.index);
        // 监听事件
        eventCenter.on(JJWXR_Events.ENEMY_REDUSE, this.remainCountReduse, this);
    }

    onDestroy() {
        // 取消监听事件
        eventCenter.off(JJWXR_Events.ENEMY_REDUSE, this.remainCountReduse, this);
    }

    // 更新剩余敌人数量
    remainCountReduse() {
        // // 遍历子节点
        // for (let i = this.index; i >= 0; i--) {
        //     // 获取子节点的组件
        //     const component = this.enemyPicNode[i].getComponent(JJWXR_EnemyPic);
        //     // 调用组件的函数
        //     component.changeDark();
        // }
        if (this.index >= 0) {
            const component = this.enemyPicNode[this.index].getComponent(JJWXR_EnemyPic);
            component.changeDark();//敌人图标变暗
            this.index--;
            console.log(this.index);
            if (this.index == 0) {
                JJWXR_Bullet.isBulletTime = true; // 开启子弹时间
            }
        }
        else {
            JJWXR_Bullet.isBulletTime = false; // 关闭子弹时间
        }
        if (this.index < 0) {
            this.scheduleOnce(() => {
                console.log("游戏结束");
                eventCenter.emit(JJWXR_Events.GAME_OVER); // 显示失败界面
                eventCenter.emit(JJWXR_Events.SHOW_SUCCEED_UI); // 显示成功界面
                eventCenter.emit(JJWXR_Events.UPDATE_SUCCEED_UI); // 更新成功界面

                JJWXR_Bullet.isBulletTime = false; // 关闭子弹时间
            }, 1.6);
        }
    }
}