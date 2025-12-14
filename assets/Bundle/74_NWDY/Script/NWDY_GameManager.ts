import { _decorator, AudioClip, Button, Color, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, UIOpacity } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('NWDY_GameManager')
export class NWDY_GameManager extends Component {
    public static Instance: NWDY_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    @property(Prefab) prop: Prefab = null;
    @property(Prefab) Mf: Prefab = null;

    @property(Button) confirm: Button = null;

    @property(Label) label: Label = null;

    @property(Node) props: Node = null;
    @property(Node) mask: Node = null;
    @property(Node) parpar: Node = null;

    @property({ type: SpriteFrame, displayName: "毒苹果图片" }) dpg: SpriteFrame = null;

    @property([SpriteFrame]) sfs: SpriteFrame[] = [];

    @property(AudioClip) ba: AudioClip = null;
    @property(AudioClip) mf: AudioClip = null;

    selectProp: Node = null;
    playerDY: Node = null;  // 玩家初始毒药
    aiDY: Node = null;      // AI初始毒药

    /** 所有节点 */
    allNode: Node[] = [];
    /** 所有已被选择的节点 */
    selectedNodes: Set<Node> = new Set(); // 
    /** AI可选节点 */
    aiCanSelectAllNodes: Node[] = [];

    protected onLoad(): void {
        NWDY_GameManager.Instance = this;
    }

    protected start(): void {
        this.initProps();
    }

    initProps() {
        // 重置所有状态
        this.allNode = [];
        this.selectedNodes.clear();
        this.playerDY = null;
        this.aiDY = null;

        // 初始化25个道具
        for (let i = 1; i <= this.sfs.length; i++) {
            let node = instantiate(this.prop);
            node.getChildByName("Icon").getComponent(Sprite).spriteFrame = this.sfs[i - 1];
            node.parent = this.props;
            node.name = i.toString();
            this.allNode.push(node);
        }
    }

    confirmBtn() {
        if (!this.selectProp) return;

        if (this.aiDY && this.playerDY) {
            this.playerSelect()
        } else {
            // 初始选择阶段
            this.initPlayerDY();
        }
    }

    initPlayerDY() {
        AudioManager.Instance.PlaySFX(this.mf)
        const node = instantiate(this.Mf)
        node.setParent(this.parpar);
        node.setPosition(this.selectProp.position);
        this.scheduleOnce(() => {
            node.destroy()
        }, 0.5)
        this.playerDY = this.selectProp;
        this.changeNodeColor(this.playerDY, this.dpg); // 玩家毒药变红
        console.log("玩家选择毒药", this.playerDY.name);

        this.confirm.node.active = false;
        this.label.string = "等待对手选择";
        this.mask.active = true;
        this.refesh();
        this.initAiDY();
    }

    initAiDY() {
        // AI可选毒药范围（过滤掉玩家已选的）
        const availableNodes = this.allNode.filter(e => e != this.playerDY);
        this.aiDY = availableNodes[Tools.GetRandomInt(0, availableNodes.length - 1)];
        console.log("AI选择", this.aiDY.name);

        // 初始化AI可选节点（过滤掉AI自己的毒药）
        this.aiCanSelectAllNodes = this.allNode.filter(e => e != this.aiDY);

        this.scheduleOnce(() => {
            this.mask.active = false;
            this.label.string = "选择完毕，开始游戏";
        }, 3);
    }

    playerSelect() {// 玩家选择

        if (this.selectProp == this.aiDY) {
            this.selectProp.getChildByName("Icon").getComponent(Sprite).spriteFrame = this.dpg;
            AudioManager.Instance.PlaySFX(this.ba);
            this.scheduleOnce(() => {
                this.scheduleOnce(() => {
                    this.gamePanel.Lost(); // 玩家选到AI的毒药
                }, 0.5)
            }, this.ba.getDuration())
        }

        else {
            AudioManager.Instance.PlaySFX(this.ba);
            this.selectedNodes.add(this.selectProp);

            this.selectProp.getComponent(UIOpacity).opacity = 0;
            this.mask.active = true;
            this.scheduleOnce(() => {
                this.label.string = "请等待对方选择";
                this.refesh();
                this.AISelect();
            }, 1)
        }
    }

    AISelect() {//ai选择
        if (!this.aiCanSelectAllNodes || this.aiCanSelectAllNodes.length === 0) {
            console.warn("没有可选道具了");
            return;
        }

        this.executeAISelectionSequence();
    }

    private async executeAISelectionSequence() {
        const selectAndActivate = async (delay: number) => {
            const node = this.getRandomAINode();
            if (!node) {
                // 检查是否存在理论上应该可选但未被选择的节点（除玩家毒药外）
                if (this.allNode.some(n => !this.selectedNodes.has(n) && n !== this.aiDY)) {
                    console.error("逻辑错误：存在可选节点但未被选择");
                }
                return null;
            }

            // 模拟选择动画：激活->延迟->取消激活
            this.activeSelect(node, true);
            await this.wait(delay);
            this.activeSelect(node, false);
            return node;
        };

        // 第一阶段：AI进行三次选择（前两次有延迟，最后一次快速）
        const firstNode = await selectAndActivate(1);
        if (!firstNode) return;

        const secondNode = await selectAndActivate(1);
        if (!secondNode) return;

        const finalNode = await selectAndActivate(0.5);
        if (!finalNode) return;

        // 处理最终选择结果
        if (finalNode == this.playerDY) {
            AudioManager.Instance.PlaySFX(this.ba);
            finalNode.getChildByName("Icon").getComponent(Sprite).spriteFrame = this.dpg

            AudioManager.Instance.PlaySFX(this.ba);
            this.scheduleOnce(() => {
                this.scheduleOnce(() => {
                    this.gamePanel.Win();
                }, 0.5)
            }, this.ba.getDuration())

        } else {
            // 进入玩家回合
            AudioManager.Instance.PlaySFX(this.ba);

            finalNode.getComponent(UIOpacity).opacity = 0;
            this.mask.active = true;
            this.scheduleOnce(() => {
                this.mask.active = false;
                this.label.string = "请玩家选择";
                this.selectedNodes.add(finalNode);
                this.removeFromAiNodes(finalNode);
            }, 2)
        }
        this.refesh();
    }

    private getRandomAINode() {
        const availableNodes = this.allNode.filter(node =>
            !this.selectedNodes.has(node) &&
            node !== this.aiDY
        );

        if (availableNodes.length === 0) {
            console.warn("AI没有可选道具了");
            return null;
        }

        return availableNodes[Tools.GetRandomInt(0, availableNodes.length - 1)];
    }



    private wait(seconds: number): Promise<void> {
        return new Promise(resolve => {
            this.scheduleOnce(() => resolve(), seconds);
        });
    }

    activeSelect(node: Node, bol: boolean) {
        node.getChildByName("Select").active = bol;
    }

    removeFromAiNodes(node: Node) {
        this.aiCanSelectAllNodes = this.aiCanSelectAllNodes.filter(e => e != node);
    }

    changeNodeColor(node: Node, sf: SpriteFrame) {
        node.getChildByName("Icon").getComponent(Sprite).spriteFrame = sf;
    }

    refesh() {
        this.confirm.node.active = false;
        this.allNode.forEach(node => node.getChildByName("Select").active = false);
    }
}