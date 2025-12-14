import { _decorator, Color, Component, Material, MeshRenderer, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NDPA_MZ')
export class NDPA_MZ extends Component {

    @property
    Number: number = 0;

    MeshRenderer: MeshRenderer = null;
    protected onLoad(): void {
        this.MeshRenderer = this.getComponent(MeshRenderer);
    }

    protected start(): void {
    }

    click() {
        let sharedMaterials = this.MeshRenderer.sharedMaterials;  // 获取共享材质
        for (let i = 0; i < this.Number; i++) {
            this.MeshRenderer.setSharedMaterial(sharedMaterials[i + this.Number], i);
        }

    }

}


