import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { DMM_PrefsManager } from './DMM_PrefsManager';
import { DMM_GENDER } from './DMM_Constant';
import { DMM_AudioManager, DMM_Audios } from './DMM_AudioManager';
import { DMM_EventManager, DMM_MyEvent } from './DMM_EventManager';
const { ccclass, property } = _decorator;

@ccclass('DMM_Shop')
export class DMM_Shop extends Component {
    @property(Sprite)
    GenderSprite: Sprite = null;

    @property(SpriteFrame)
    GenderSF: SpriteFrame[] = [];

    protected start(): void {
        this.showGender();
    }

    showGender() {
        const gender: DMM_GENDER = DMM_PrefsManager.Instance.userData.Gender;
        if (gender == DMM_GENDER.男) {
            this.GenderSprite.spriteFrame = this.GenderSF[0];
        } else if (gender == DMM_GENDER.女) {
            this.GenderSprite.spriteFrame = this.GenderSF[1];
        }
    }

    genderBtn() {
        DMM_AudioManager.PlaySound(DMM_Audios.Click);
        DMM_PrefsManager.Instance.userData.Gender = this.getAdjacentEnumCirculation(DMM_GENDER, DMM_PrefsManager.Instance.userData.Gender);
        DMM_PrefsManager.Instance.saveData();
        this.showGender();
        //切换性别
        DMM_EventManager.Scene.emit(DMM_MyEvent.DMM_SHOWITEM);
    }

    /**
 *  获取枚举的临近属性 --- 可以从最后一个到第一个 
 * @param enumObject 
 * @param current 
 * @param next true向后 false向前
 * @param isBack 是否回溯
 * @returns 
 */
    public getAdjacentEnumCirculation<T>(
        enumObject: T,
        current: T[keyof T],
        next: boolean = true,
        isBack: boolean = true
    ): T[keyof T] {
        const enumKeys = Object.keys(enumObject).filter(k => isNaN(Number(k)));
        const currentKey = enumKeys.find(k => enumObject[k] === current);

        if (!currentKey) {
            throw new Error('Current value not found in enum');
        }

        const index = enumKeys.indexOf(currentKey);
        const adjacentIndex = (index + (next ? 1 : -1) + enumKeys.length) % enumKeys.length;
        const adjacentKey = enumKeys[adjacentIndex];

        return enumObject[adjacentKey] as T[keyof T];
    }


}


