import { _decorator, Component, Material, Node, randomRangeInt, SpriteFrame } from 'cc';
import { JJWXR_pigeon_Enemy } from './JJWXR_pigeon_Enemy';
import { JJWXR_pigeon_Player } from './JJWXR_pigeon_Player';
import { eventCenter } from '../Utils/JJWXR_pigeon_EventCenter';
import { JJWXR_pigeon_Events } from '../Utils/JJWXR_pigeon_Events';
import { JJWXR_pigeon_PicManager } from './UI/JJWXR_pigeon_PicManager';
import { BundleManager } from 'db://assets/Scripts/Framework/Managers/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_pigeon_EnemyManager')
export class JJWXR_pigeon_EnemyManager extends Component {
    private enemyNode: Node[] = [];

    public enemyPic: SpriteFrame = null;

    materials: Material[] = [];

    photos: SpriteFrame[] = [];

    private static _instance: JJWXR_pigeon_EnemyManager;
    public static get instance() {
        return this._instance;
    }
    onLoad() {
        JJWXR_pigeon_EnemyManager._instance = this;
    }

    start() {
        this.enemyNode = this.node.children;
        let curLevel = parseInt(localStorage.getItem('JJWXR_pigeon_currentLevel')) % 6;
        if (curLevel == 0) curLevel = 6;
        BundleManager.GetBundle("128_JJWXR_pigeon").loadDir(`Materials/Colors/Level${curLevel}`, Material, (err, data) => {
            if (err) return console.error(err);
            this.materials = data;
            for (let i = 0; i < this.enemyNode.length; i++) {
                const element = this.enemyNode[i].getComponent(JJWXR_pigeon_Enemy);
                element.changeColorMaterial(this.materials.find((value, index, obj) => { if (value.name == `${curLevel}-${i + 1}`) return value; }));
            }
        })
        BundleManager.GetBundle("128_JJWXR_pigeon").loadDir(`EnemyPhotos/Level0${curLevel}`, SpriteFrame, (err, data) => {
            if (err) return console.error(err);
            this.photos = data;
            for (let i = 0; i < this.enemyNode.length; i++) {
                const element = this.enemyNode[i].getComponent(JJWXR_pigeon_Enemy);
                element.enemySpriteFrame = this.photos.find((value, index, obj) => { if (value.name == `${i + 1}`) return value; });
            }
        })
        eventCenter.on(JJWXR_pigeon_Events.ENEMY_WORLDPOSITION, this.getEnemyWorldPos, this);
        eventCenter.on(JJWXR_pigeon_Events.ENEMY_PICTURE, this.showEnemyPic, this);
    }

    onDestroy() {
        eventCenter.off(JJWXR_pigeon_Events.ENEMY_WORLDPOSITION, this.getEnemyWorldPos, this);
        eventCenter.off(JJWXR_pigeon_Events.ENEMY_PICTURE, this.showEnemyPic, this);
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
            let enemy = this.enemyNode[i].getComponent(JJWXR_pigeon_Enemy);
            if (!enemy.isDie) {
                console.log("敌人的世界坐标" + enemy.node.worldPosition);
                JJWXR_pigeon_Player.instance.lookAtTargetPosition(enemy.node);
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
            let enemy = this.enemyNode[i].getComponent(JJWXR_pigeon_Enemy);
            if (!enemy.isDie) {
                console.log("更换敌人的角色" + enemy.name);
                this.enemyPic = enemy.getEnemyPhoto();
                console.log("敌人角色图片" + this.enemyPic.name);
                JJWXR_pigeon_PicManager.instance.setSpriteFrame(this.enemyPic);
                break;
            } else {
                continue;
            }
        }
    }
}