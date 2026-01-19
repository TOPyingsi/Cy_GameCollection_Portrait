import { _decorator, Component, Node } from 'cc';
import { JJWXR_pigeon_EnemyPic } from './JJWXR_pigeon_EnemyPic';
import { JJWXR_pigeon_Events } from '../../Utils/JJWXR_pigeon_Events';
import { eventCenter } from '../../Utils/JJWXR_pigeon_EventCenter';
import { JJWXR_pigeon_Bullet } from '../JJWXR_pigeon_Bullet';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_pigeon_RemianUI')
export class JJWXR_pigeon_RemianUI extends Component {

    private enemyPicNode: Node[] = [];
    private index: number = 0;  // 子节点的索引

    start() {
        console.log(this.node);

        // 获取所有的子节点
        this.enemyPicNode = this.node.children;
        // 获取最后一个子节点
        this.index = this.enemyPicNode.length - 1;
        console.log(this.index);
        // // 监听事件
        // eventCenter.on(JJWXR_pigeon_Events.ENEMY_REDUSE, this.remainCountReduse, this);
    }

    // onDestroy() {
    //     // 取消监听事件
    //     eventCenter.off(JJWXR_pigeon_Events.ENEMY_REDUSE, this.remainCountReduse, this);
    // }

    // 更新剩余敌人数量
    remainCountReduse() {
        // // 遍历子节点
        // for (let i = this.index; i >= 0; i--) {
        //     // 获取子节点的组件
        //     const component = this.enemyPicNode[i].getComponent(JJWXR_pigeon_EnemyPic);
        //     // 调用组件的函数
        //     component.changeDark();
        // }
        if (this.index >= 0) {
            const component = this.enemyPicNode[this.index].getComponent(JJWXR_pigeon_EnemyPic);
            component.changeDark();//敌人图标变暗
            this.index--;
            console.log(this.index);
            if (this.index == 0) {
                JJWXR_pigeon_Bullet.isBulletTime = true; // 开启子弹时间
            }
        }
        else {
            JJWXR_pigeon_Bullet.isBulletTime = false; // 关闭子弹时间
        }
        if (this.index < 0) {
            this.scheduleOnce(() => {
                console.log("游戏结束");
                eventCenter.emit(JJWXR_pigeon_Events.GAME_OVER); // 显示失败界面
                eventCenter.emit(JJWXR_pigeon_Events.SHOW_SUCCEED_UI); // 显示成功界面
                eventCenter.emit(JJWXR_pigeon_Events.UPDATE_SUCCEED_UI); // 更新成功界面

                JJWXR_pigeon_Bullet.isBulletTime = false; // 关闭子弹时间
            }, 1.6);
        }
    }
}