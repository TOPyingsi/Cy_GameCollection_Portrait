import { _decorator, Component, ICollisionEvent, MeshRenderer, Node } from 'cc';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_Clickable } from './NDPA_Clickable';
const { ccclass, property } = _decorator;

@ccclass('Box')
export class Box extends NDPA_Clickable {

    MeshRenderer: MeshRenderer = null;

    isMute: boolean = false;

    protected onLoad(): void {
        super.onLoad();
        this.MeshRenderer = this.getComponent(MeshRenderer);
        this.Collider.forEach(e => {
            e.on("onCollisionStay", this.onCollisionStay, this);
        })
    }

    click(): void {
        if (!this.IsClick) return;
        if (this.IsExist) return;
        super.click();
        this.changeTransparency();
    }

    changeTransparency() {
        this.MeshRenderer.material = this.MeshRenderer.materials[1];
    }

    onCollisionStay(event: ICollisionEvent) {
        if (!this.isMute) {
            this.isMute = true;
            NDPA_AudioManager.PlaySound(NDPA_Audios.BallFall);
        }
    }


}


