import { _decorator, Component, Node, SkeletalAnimation, SkinnedMeshRenderer, Color, AudioClip, RigidBody, Material, SpriteFrame, tween, v3, Vec3, Tween } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
import { AudioManager } from '../Utils/JJWXR_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_Enemy')
export class JJWXR_Enemy extends Component {
    @property(AudioClip)
    private beHitSource: AudioClip = null;   // 音效组件

    @property({ type: Node })
    private enemyMaterialNode: Node = null;   // 敌人材质节点

    @property({ type: Material })
    private enemyDefaultMaterial: Material = null;   // 敌人默认材质
    @property({ type: Node })
    private oldEnemy: Node = null;   // 敌人角色节点
    // @property({ type: Node })
    // public newEnemy: Node = null;   // 敌人节点

    enemySpriteFrame: SpriteFrame = null;   // 敌人精灵帧

    public isDie: Boolean = false;

    oScale: Vec3;

    // 开始游戏
    start() {
        this.oScale = this.node.getScale().clone();
        tween(this.node)
            .to(0.5, { scale: this.oScale.clone().multiplyScalar(1.2) })
            .to(0.5, { scale: this.oScale })
            .union().repeatForever().start();
        this.disableGravity(); // 禁用重力
        eventCenter.on(JJWXR_Events.ENEMY_DESTROY, this.destroyEnemy, this);
        // eventCenter.on(JJWXR_Events.ENEMY_CHANGE_MATERIAL, this.changeMaterial, this);
        // eventCenter.on(JJWXR_Events.ENEMY_CHANGE_ROLE, this.changeRole, this);
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.ENEMY_DESTROY, this.destroyEnemy, this);
        // eventCenter.off(JJWXR_Events.ENEMY_CHANGE_MATERIAL, this.changeMaterial, this);
        // eventCenter.off(JJWXR_Events.ENEMY_CHANGE_ROLE, this.changeRole, this);
    }

    // 禁用重力
    public disableGravity() {
        let children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            let childNode = children[i].getComponent(RigidBody); // 获取子节点刚体组件
            childNode && (childNode.useGravity = false); // 禁用重力
        }
    }

    // 启用重力
    public enableGravity() {
        let children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            let childNode = children[i].getComponent(RigidBody); // 获取子节点刚体组件
            childNode.useGravity = true; // 启用重力
        }
    }

    // 播放动画
    public playAnimation() {
        // 获取子节点动画组件
        const animation = this.oldEnemy.getComponent(SkeletalAnimation);
        console.log(animation);
        // 播放动画
        animation.play("Take 001");
    }

    // 改变子节点颜色
    public changeColor() {
        // 获取所有子节点
        // let childOne = this.node.getChildByName('juese_11_DZ');
        // let childTwo = childOne.getChildByName('pCone8');
        let childOne = this.node.children[1];
        let childTwo = childOne.children[0];

        const skinnedMeshRenderer = childTwo.getComponent(SkinnedMeshRenderer);
        const material = skinnedMeshRenderer.materials[0];
        const emissiveColor = new Color(255, 0, 0, 255); // 红色
        material.setProperty('emissive', emissiveColor);
    }

    // 改变材质
    public changeMaterial() {
        console.log("改变材质");
        // this.oldEnemy.active = true; // 旧角色
        // 获取子节点材质
        let renderer = this.enemyMaterialNode.getComponent(SkinnedMeshRenderer);
        // 设置材质
        renderer.material = this.enemyDefaultMaterial; // 默认材质
    }

    // 改变材质
    public changeColorMaterial(material: Material) {
        // this.oldEnemy.active = true; // 旧角色
        // 获取子节点材质
        let renderer = this.enemyMaterialNode.getComponent(SkinnedMeshRenderer);
        // 设置材质
        renderer.material = material; // 默认材质
    }

    // 角色
    public getEnemyPhoto() {
        // this.newEnemy.active = true; // 显示新角色
        // this.oldEnemy.active = false; // 隐藏旧角色
        // 获取子节点材质
        return this.enemySpriteFrame;
    }

    // 改变角色回退
    public changeRoleBack() {
        // 将新敌人的激活状态设为false
        // this.newEnemy.active = false;
    }

    // 销毁敌人
    public destroyEnemy(hitNode?: Node) {

        // 判断是否击中自己
        if (hitNode == this.node) {
            Tween.stopAllByTarget(this.node);
            this.changeRoleBack();
            console.log("敌人被消灭");
            if (!this.isDie) {
                // 数量减少
                eventCenter.emit(JJWXR_Events.ENEMY_REDUSE);
                this.isDie = true;
            }

            let isFirstPlay = localStorage.getItem('isFirstPlay');
            if (isFirstPlay === 'true') {
                eventCenter.emit(JJWXR_Events.SHOW_ENCOURAGE_UI); // 显示鼓励UI
                localStorage.setItem('isFirstPlay', "false"); // 存储为字符串
            }

            eventCenter.emit(JJWXR_Events.HIDE_ENEMY_UI, this.node);
            eventCenter.emit(JJWXR_Events.ON_REMOVE_RING, this.node);
            const child = this.node.parent.children;
            // 播放音效
            AudioManager.instance.playOneShot(this.beHitSource);
            // 播放动画
            this.playAnimation();
            // 改变子节点颜色
            this.changeColor();
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 2);
        }
    }
}