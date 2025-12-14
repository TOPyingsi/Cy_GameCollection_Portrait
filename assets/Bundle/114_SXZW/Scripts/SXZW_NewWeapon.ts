import { _decorator, Component, math, Node, Sprite, SpriteFrame, sys } from 'cc';
import { SXZW_PlayManage } from './SXZW_PlayManage';
import { SXZW_WaponsItem } from './SXZW_WaponsItem';
const { ccclass, property } = _decorator;

@ccclass('SXZW_NewWeapon')
export class SXZW_NewWeapon extends Component {

    @property(Sprite)
    sprite: Sprite = null
    @property(Sprite)
    bgSprite: Sprite = null

    @property(SXZW_WaponsItem)
    levelUnlockWeaponsList: SXZW_WaponsItem[] = []

    private spriteRotateCircleTime = 2;
    private spriteRotateTime = 0;

    start() {

    }

    update(deltaTime: number) {
        const t = this.spriteRotateTime / this.spriteRotateCircleTime;
        this.bgSprite.node.angle = math.lerp(0, 360, t)
        if (t >= 1) {
            this.spriteRotateTime = 0;
        } else {
            this.spriteRotateTime += deltaTime;
        }
    }

    isUnlock(): boolean {
        const finishLevelIndex = sys.localStorage.getItem("sxzw_finishLevelIndex") || -1;
        const currentLevelIndex = sys.localStorage.getItem("sxzw_currentLevelIndex") || 0;
        SXZW_PlayManage.Instance.firstFinishLevel = false;
        if (currentLevelIndex > finishLevelIndex && finishLevelIndex < SXZW_PlayManage.Instance.levels.length) {
            sys.localStorage.setItem("sxzw_finishLevelIndex", currentLevelIndex)
            SXZW_PlayManage.Instance.firstFinishLevel = true;
            if (currentLevelIndex < this.levelUnlockWeaponsList.length) {
                const wi = this.levelUnlockWeaponsList[currentLevelIndex];
                if (wi && wi.itemLevel === 0) {
                    this.sprite.spriteFrame = wi.itemImage;
                    this.node.active = true;
                    wi.upgrade();
                    return true;
                }
            }
        }
        return false;
    }
}


