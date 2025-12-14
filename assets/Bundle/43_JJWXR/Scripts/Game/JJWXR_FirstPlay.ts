import { _decorator, Component, Node, Animation, Material, SkinnedMeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_FirstPlay')
export class JJWXR_FirstPlay extends Component {

    @property(Node)
    public modelNodeAnim: Node = null;

    @property({ type: Node })
    private enemyOldNode: Node = null;   // 敌人节点材质
    @property({ type: Node })
    private enemyNewNode: Node = null;   // 敌人节点

    start() {
        const isFirstPlay = localStorage.getItem('isFirstPlay');

        this.enemyNewNode.active = false;
        this.enemyOldNode.active = true;
        // 检查是否是第一次运行游戏
        if (isFirstPlay == "true") {
            console.log('第一次运行游戏,播放动画');
            this.node.getComponent(Animation).play();
            // this.enemyOldNode.getComponent(Animation).play('zou');
            // this.scheduleOnce(() => {
            //     this.enemyOldNode.getComponent(Animation).stop();
            // }, 2.5);
            this.scheduleOnce(() => {
                // this.enemyOldNode.active = false;
                // this.enemyNewNode.active = true;
                this.node.parent.active = false;
                this.node.parent.parent.getChildByName("shurenEnemy01").active = true;
            }, 2);
        }
        else {
            console.log('不是第一次运行游戏,不播放动画');
            // this.enemyOldNode.active = false;
            // this.enemyNewNode.active = true;
            this.node.parent.active = false;
            this.node.parent.parent.getChildByName("shurenEnemy01").active = true;
        }
    }





}