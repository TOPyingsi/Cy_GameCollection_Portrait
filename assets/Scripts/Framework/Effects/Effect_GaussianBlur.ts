
import { _decorator, Component, Slider, Label, dynamicAtlasManager, find, Node, UIRenderer, Material, Vec2, CCInteger, CCFloat, clamp01 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Effect_GaussianBlur')
export class Effect_GaussianBlur extends Component {

    @property(CCFloat)
    value: number = 0.5;

    private _gsFactor: number = 500; // 调整高斯模糊系数 (建议 50 ~ 5000)

    onLoad() {
        this._updateRenderComponentMaterial({});
    }

    /**
     * 更新渲染组件的材质
     *
     * 1. 获取材质
     * 2. 给材质的 unitform 变量赋值
     * 3. 重新将材质赋值回去
     */
    private _updateRenderComponentMaterial(param: {}) {
        this.node.getComponents(UIRenderer).forEach(renderComponent => {
            let material: Material = renderComponent.getSharedMaterial(0)!;
            this.value = clamp01(this.value);
            let _w = this._gsFactor - (this._gsFactor - 30) * this.value;
            let _h = this._gsFactor - (this._gsFactor - 30) * this.value;
            material.setProperty('textureSize', new Vec2(_w, _h));

            renderComponent.setMaterial(material, 0);
        });
    }
}

