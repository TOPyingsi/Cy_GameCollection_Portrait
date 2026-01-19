import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
import { JJWXR_pigeon_EnemyManager } from '../JJWXR_pigeon_EnemyManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_pigeon_PicManager')
export class JJWXR_pigeon_PicManager extends Component {
    // @property(SpriteFrame)
    // public picLevel01: SpriteFrame[] = [];
    // @property(SpriteFrame)
    // public picLevel02: SpriteFrame[] = [];
    // @property(SpriteFrame)
    // public picLevel03: SpriteFrame[] = [];
    // @property(SpriteFrame)
    // public picLevel04: SpriteFrame[] = [];
    // @property(SpriteFrame)
    // public picLevel05: SpriteFrame[] = [];
    // @property(SpriteFrame)
    // public picLevel06: SpriteFrame[] = [];

    @property(Sprite)
    public picNode: Sprite = null;

    // private curLevel = 1;

    private static _instance: JJWXR_pigeon_PicManager;
    public static get instance() {
        return this._instance;
    }

    onLoad() {
        JJWXR_pigeon_PicManager._instance = this;
    }
    start() {
        // this.curLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
    }

    // 获取图片
    setSpriteFrame(spriteFrame: SpriteFrame) {
        console.log("JJWXR_pigeon_PicManager setSpriteFrame");
        this.picNode.spriteFrame = spriteFrame;
    }
}