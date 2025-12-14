import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
import { JJWXR_EnemyManager } from '../JJWXR_EnemyManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_PicManager')
export class JJWXR_PicManager extends Component {
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

    private static _instance: JJWXR_PicManager;
    public static get instance() {
        return this._instance;
    }

    onLoad() {
        JJWXR_PicManager._instance = this;
    }
    start() {
        // this.curLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
    }

    // 获取图片
    setSpriteFrame(spriteFrame: SpriteFrame) {
        console.log("JJWXR_PicManager setSpriteFrame");
        this.picNode.spriteFrame = spriteFrame;
    }
}