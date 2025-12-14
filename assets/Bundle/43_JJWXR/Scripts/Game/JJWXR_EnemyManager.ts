import { _decorator, Component, Material, Node, randomRangeInt, SpriteFrame } from 'cc';
import { JJWXR_Enemy } from './JJWXR_Enemy';
import { JJWXR_Player } from './JJWXR_Player';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
import { JJWXR_PicManager } from './UI/JJWXR_PicManager';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_EnemyManager')
export class JJWXR_EnemyManager extends Component {
    private enemyNode: Node[] = [];

    public enemyPic: SpriteFrame = null;

    materials: Material[] = [];

    photos: SpriteFrame[] = [];

    private static _instance: JJWXR_EnemyManager;
    public static get instance() {
        return this._instance;
    }
    onLoad() {
        JJWXR_EnemyManager._instance = this;
    }

    start() {
        this.enemyNode = this.node.children;
        let curLevel = parseInt(localStorage.getItem('currentLevel')) % 6;
        if (curLevel == 0) curLevel = 6;
        BundleManager.GetBundle("43_JJWXR").loadDir(`Materials/Colors/Level${curLevel}`, Material, (err, data) => {
            if (err) return console.error(err);
            this.materials = data;
            for (let i = 0; i < this.enemyNode.length; i++) {
                const element = this.enemyNode[i].getComponent(JJWXR_Enemy);
                element.changeColorMaterial(this.materials.find((value, index, obj) => { if (value.name == `${curLevel}-${i + 1}`) return value; }));
            }
        })
        BundleManager.GetBundle("43_JJWXR").loadDir(`EnemyPhotos/Level0${curLevel}`, SpriteFrame, (err, data) => {
            if (err) return console.error(err);
            this.photos = data;
            for (let i = 0; i < this.enemyNode.length; i++) {
                const element = this.enemyNode[i].getComponent(JJWXR_Enemy);
                element.enemySpriteFrame = this.photos.find((value, index, obj) => { if (value.name == `${i + 1}`) return value; });
            }
        })
        eventCenter.on(JJWXR_Events.ENEMY_WORLDPOSITION, this.getEnemyWorldPos, this);
        eventCenter.on(JJWXR_Events.ENEMY_PICTURE, this.showEnemyPic, this);
    }

    onDestroy() {
        eventCenter.off(JJWXR_Events.ENEMY_WORLDPOSITION, this.getEnemyWorldPos, this);
        eventCenter.off(JJWXR_Events.ENEMY_PICTURE, this.showEnemyPic, this);
    }

    // 改变敌人的材质
    getEnemyWorldPos() {
        for (let i = 0; this.enemyNode.length; i++) {
            if (i == this.enemyNode.length) {
                //没有可显示的敌人
                console.log("没有可显示的敌人");
                i--;
                break;
            }
            let enemy = this.enemyNode[i].getComponent(JJWXR_Enemy);
            if (!enemy.isDie) {
                console.log("敌人的世界坐标" + enemy.node.worldPosition);
                JJWXR_Player.instance.lookAtTargetPosition(enemy.node);
                break;
            } else {
                continue;
            }
        }
    }

    // 更换敌人的角色
    showEnemyPic() {
        for (let i = 0; this.enemyNode.length; i++) {
            if (i == this.enemyNode.length) {
                //没有可显示的敌人
                console.log("没有可显示的敌人");
                i--;
                break;
            }
            let enemy = this.enemyNode[i].getComponent(JJWXR_Enemy);
            if (!enemy.isDie) {
                console.log("更换敌人的角色" + enemy.name);
                this.enemyPic = enemy.getEnemyPhoto();
                console.log("敌人角色图片" + this.enemyPic.name);
                JJWXR_PicManager.instance.setSpriteFrame(this.enemyPic);
                break;
            } else {
                continue;
            }
        }
    }
}