import { _decorator, Component, director, game, Material, MeshRenderer, Node, randomRange, randomRangeInt, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SXZW_FaceManage')
export class SXZW_FaceManage extends Component {

    @property({ type: [SpriteFrame] })
    faceList: SpriteFrame[] = [];

    @property({ type: MeshRenderer })
    meshRenderer: MeshRenderer = null;

    private lastUpdateFaceTime = 0;
    public loop = true;

    start() {
        this.updataFace(FaceName.调皮);
    }

    update(deltaTime: number) {
        if (this.loop && game.totalTime - this.lastUpdateFaceTime > 10000) {
            this.happly();
        }
    }

    sad() {
        switch (randomRangeInt(0, 2)) {
            case 0:
                this.updataFace(FaceName.难过)
                break;
            case 1:
                this.updataFace(FaceName.伤心)
                break;
        }
    }

    happly() {
        switch (randomRangeInt(0, 3)) {
            case 0:
                this.updataFace(FaceName.笑)
                break;
            case 1:
                this.updataFace(FaceName.开心)
                break;
            case 2:
                this.updataFace(FaceName.调皮)
                break;
        }
    }

    frown() {
        switch (randomRangeInt(0, 2)) {
            case 0:
                this.updataFace(FaceName.皱眉)
                break;
            case 1:
                this.updataFace(FaceName.皱眉大眼)
                break;
        }
    }

    updataFace(faceIndex: number) {
        this.lastUpdateFaceTime = game.totalTime
        if (this.meshRenderer && this.faceList.length > faceIndex) {
            const spriteFrame = this.faceList[faceIndex];
            if (spriteFrame) {
                this.meshRenderer.materials[0].setProperty('albedoMap', spriteFrame.texture);
            }
        } else {
            console.warn(`Face index ${faceIndex} is out of bounds or material is not set.`);
        }
    }
}

enum FaceName {
    笑, 难过, 皱眉, 开心, 伤心, 皱眉大眼, 调皮
}
