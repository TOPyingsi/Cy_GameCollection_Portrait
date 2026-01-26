import { _decorator, Component, Vec3, Animation, director, Node } from 'cc';
import { WZBPW_MosquitoController } from './WZBPW_MosquitoController';
const { ccclass, property } = _decorator;

/**
 * TNT爆炸道具控制器
 * 舌头击中后爆炸，所有蚊子掉落
 */
@ccclass('WZBPW_TNTController')
export class WZBPW_TNTController extends Component {
    // 爆炸动画组件
    @property(Animation)
    public explosionAnimation: Animation | null = null;

    // 是否已经爆炸
    private _hasExploded: boolean = false;

    onLoad() {
        // 如果没有手动指定动画组件，尝试自动获取
        if (!this.explosionAnimation) {
            this.explosionAnimation = this.getComponentInChildren(Animation);
        }
    }

    /**
     * 被舌头击中时调用
     * @param _frogPosition 青蛙位置（保留参数用于扩展）
     */
    public onTongueHit(_frogPosition: Vec3): void {
        if (this._hasExploded) {
            return; // 已经爆炸过了
        }

        this._hasExploded = true;

        console.log('WZBPW_TNTController: TNT hit by tongue, exploding');

        // 触发爆炸
        this.explode();
    }

    /**
     * 爆炸
     */
    private explode(): void {
        const tntPosition = this.node.getWorldPosition();

        // 播放爆炸动画
        if (this.explosionAnimation) {
            const defaultClip = this.explosionAnimation.defaultClip;
            if (defaultClip) {
                this.explosionAnimation.play(defaultClip.name);
                
                // 动画播放完成后销毁节点
                this.scheduleOnce(() => {
                    if (this.node && this.node.isValid) {
                        this.node.destroy();
                    }
                }, defaultClip.duration);
            } else {
                // 没有动画，直接销毁
                this.node.destroy();
            }
        } else {
            // 没有动画组件，直接销毁
            this.node.destroy();
        }

        // 查找所有蚊子并让它们掉落
        this.findAndDropMosquitoes();

        console.log(`WZBPW_TNTController: Explosion at ${tntPosition}`);
    }

    /**
     * 查找并让所有蚊子掉落
     */
    private findAndDropMosquitoes(): void {
        const scene = director.getScene();
        if (!scene) return;

        // 查找场景中所有蚊子
        const mosquitoes = this.findAllMosquitoes(scene);

        let droppedCount = 0;
        for (const mosquito of mosquitoes) {
            if (mosquito && mosquito.node && mosquito.node.isValid && !mosquito.isCaught) {
                this.dropMosquito(mosquito);
                droppedCount++;
            }
        }

        console.log(`WZBPW_TNTController: Dropped ${droppedCount} mosquitoes`);
    }

    /**
     * 让蚊子掉落（启用重力）
     * @param mosquito 蚊子控制器
     */
    private dropMosquito(mosquito: WZBPW_MosquitoController): void {
        // 启用蚊子的重力
        mosquito.enableGravity();
    }

    /**
     * 递归查找所有蚊子
     */
    private findAllMosquitoes(node: Node): WZBPW_MosquitoController[] {
        const mosquitoes: WZBPW_MosquitoController[] = [];

        const mosquito = node.getComponent(WZBPW_MosquitoController);
        if (mosquito) {
            mosquitoes.push(mosquito);
        }

        for (const child of node.children) {
            mosquitoes.push(...this.findAllMosquitoes(child));
        }

        return mosquitoes;
    }
}
