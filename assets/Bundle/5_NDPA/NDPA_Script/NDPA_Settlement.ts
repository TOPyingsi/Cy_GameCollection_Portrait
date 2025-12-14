import { _decorator, Component, Game, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { NDPA_GAME } from './NDPA_GameConstant';
import { NDPA_GameManager } from './NDPA_GameManager';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_Settlement')
export class NDPA_Settlement extends Component {
    public static Instance: NDPA_Settlement = null;

    @property(Sprite)
    FaceSprite: Sprite = null;

    @property(Node)
    Pass: Node = null;

    @property(Node)
    Restart: Node = null;


    protected onLoad(): void {
        NDPA_Settlement.Instance = this;
    }

    show(Type: NDPA_GAME) {
        BundleManager.LoadSpriteFrame(GameManager.GameData.DefaultBundle, `Bundle/NDPA_Sprites/${Type}`).then((sf: SpriteFrame) => {
            this.FaceSprite.spriteFrame = sf;
        })
        if (Type === NDPA_GAME.PASS) {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Smile);
        } else if (NDPA_GAME.FAIL) {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Cry);
        }
        tween(this.FaceSprite.node)
            .by(1, { scale: v3(1, 1, 1) }, { easing: `quadIn` })
            .delay(1)
            .call(() => {
                this.FaceSprite.node.active = false;
                if (Type === NDPA_GAME.PASS) {
                    this.Pass.active = true;
                } else if (NDPA_GAME.FAIL) {
                    this.Restart.active = true;
                }
                ProjectEventManager.emit(ProjectEvent.游戏结束, "脑洞破案");
            })
            .start();
    }

    next() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        NDPA_GameManager.Instance.next();
        this.node.active = false;
    }

    restart() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.PartClick);
        NDPA_GameManager.Instance.restart();
        this.node.active = false;
    }

    protected onEnable(): void {
        this.FaceSprite.node.active = true;
        this.FaceSprite.node.scale = v3(0);
        this.Pass.active = false;
        this.Restart.active = false;
    }
}


