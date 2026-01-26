import { _decorator, Component, Node, Sprite, SpriteFrame, sys, director } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

// 本地存储键名
const SKIN_STORAGE_KEY = "WZBPW_FROG_SKIN";
const SKIN_UNLOCK_KEY = "WZBPW_SKIN_UNLOCKED"; // 存储已解锁的皮肤


/**
 * 换肤管理器
 * 管理青蛙皮肤的选择、解锁和应用
 */
@ccclass('WZBPW_SkinManager')
export class WZBPW_SkinManager extends Component {
    // 单例实例
    private static _instance: WZBPW_SkinManager | null = null;

    // 换肤面板节点（整个换肤界面）
    @property(Node)
    public skinPanelNode: Node | null = null;

    // 皮肤按钮容器节点（包含所有皮肤按钮的父节点，比如"选择"节点）
    @property(Node)
    public skinButtonContainer: Node | null = null;

    // 预览青蛙节点（Frog/1 的 Sprite 组件，用于显示当前选择的皮肤）
    @property(Sprite)
    public previewFrogSprite: Sprite | null = null;

    // 选择节点数组（每个皮肤按钮下的"选择"节点）
    @property([Node])
    public selectionNodes: Node[] = [];

    // 解锁遮罩节点数组（从第2个皮肤开始，索引0对应皮肤2的解锁遮罩）
    @property([Node])
    public unlockMaskNodes: Node[] = [];

    // 胜利界面中青蛙的 Sprite 组件引用
    @property(Sprite)
    public victoryFrogSprite: Sprite | null = null;

    // 皮肤数量
    @property
    public skinCount: number = 12;

    // 当前选择的皮肤索引（1-12）
    private _currentSkinIndex: number = 1;

    // 已解锁的皮肤集合
    private _unlockedSkins: Set<number> = new Set();

    // 皮肤节点数组（缓存每个皮肤的节点，用于获取图片）
    private _skinNodes: Node[] = [];

    /**
     * 获取单例实例
     */
    public static get instance(): WZBPW_SkinManager | null {
        return WZBPW_SkinManager._instance;
    }

    /**
     * 获取当前皮肤索引
     */
    public get currentSkinIndex(): number {
        return this._currentSkinIndex;
    }

    onLoad() {
        // 单例模式
        if (WZBPW_SkinManager._instance === null) {
            WZBPW_SkinManager._instance = this;
        } else if (WZBPW_SkinManager._instance !== this) {
            this.destroy();
            return;
        }

        // 加载已解锁的皮肤
        this.loadUnlockedSkins();

        // 加载保存的皮肤选择
        this.loadSkinSelection();

        // 初始化时隐藏换肤面板
        if (this.skinPanelNode) {
            this.skinPanelNode.active = false;
        }

        // 自动查找并绑定皮肤按钮
        this.autoBindSkinButtons();

        // 初始化解锁遮罩状态
        this.updateUnlockMasks();

        // 初始化选择状态
        this.updateSelectionNodes();
    }

    onDestroy() {
        if (WZBPW_SkinManager._instance === this) {
            WZBPW_SkinManager._instance = null;
        }
    }

    /**
     * 打开换肤面板
     */
    public openSkinPanel(): void {
        if (this.skinPanelNode) {
            this.skinPanelNode.active = true;
            // 更新UI状态
            this.updateUnlockMasks();
            this.updateSelectionNodes();
            console.log('WZBPW_SkinManager: Skin panel opened');
        }
    }

    /**
     * 关闭换肤面板
     */
    public closeSkinPanel(): void {
        if (this.skinPanelNode) {
            this.skinPanelNode.active = false;
            console.log('WZBPW_SkinManager: Skin panel closed');
        }
    }

    /**
     * 自动查找并绑定皮肤按钮
     */
    private autoBindSkinButtons(): void {
        if (!this.skinButtonContainer) {
            console.warn('WZBPW_SkinManager: skinButtonContainer not set, skipping auto-bind');
            return;
        }

        // 清空现有数组
        this.selectionNodes = [];
        this.unlockMaskNodes = [];
        this._skinNodes = [];

        // 遍历容器的子节点（假设子节点命名为 1, 2, 3...）
        for (let i = 1; i <= this.skinCount; i++) {
            const skinNode = this.skinButtonContainer.getChildByName(i.toString());
            if (!skinNode) {
                console.warn(`WZBPW_SkinManager: Skin node ${i} not found`);
                continue;
            }

            // 缓存皮肤节点
            this._skinNodes.push(skinNode);

            // 查找"皮肤框"节点（按钮）
            const buttonNode = skinNode.getChildByName('皮肤框');
            if (buttonNode) {
                // 添加点击事件
                buttonNode.on(Node.EventType.TOUCH_END, () => {
                    this.onSkinButtonClick(null as any, i.toString());
                }, this);
                console.log(`WZBPW_SkinManager: Bound click event to skin ${i}`);
            }

            // 查找"选择"节点
            const selectionNode = skinNode.getChildByName('选择');
            if (selectionNode) {
                this.selectionNodes.push(selectionNode);
            } else {
                console.warn(`WZBPW_SkinManager: Selection node not found for skin ${i}`);
            }

            // 查找"解锁遮罩"节点（第一个皮肤没有）
            if (i > 1) {
                const unlockMaskNode = skinNode.getChildByName('解锁遮罩');
                if (unlockMaskNode) {
                    this.unlockMaskNodes.push(unlockMaskNode);
                } else {
                    console.warn(`WZBPW_SkinManager: Unlock mask node not found for skin ${i}`);
                }
            }
        }

        console.log(`WZBPW_SkinManager: Auto-bind complete. Found ${this.selectionNodes.length} selection nodes, ${this.unlockMaskNodes.length} unlock mask nodes`);
    }


    /**
     * 皮肤按钮点击事件（由按钮调用）
     * @param _event 点击事件
     * @param skinIndexStr 皮肤索引字符串（"1" - "12"）
     */
    public onSkinButtonClick(_event: Event, skinIndexStr: string): void {
        const skinIndex = parseInt(skinIndexStr);
        console.log(`WZBPW_SkinManager: Skin button ${skinIndexStr} clicked`);

        if (isNaN(skinIndex) || skinIndex < 1 || skinIndex > this.skinCount) {
            console.error(`WZBPW_SkinManager: Invalid skin index ${skinIndexStr}`);
            return;
        }

        // 检查是否已解锁
        const isUnlocked = this.isSkinUnlocked(skinIndex);
        console.log(`WZBPW_SkinManager: Skin ${skinIndex} is ${isUnlocked ? 'unlocked' : 'locked'}`);

        if (isUnlocked) {
            // 已解锁，直接选择该皮肤
            this.selectSkin(skinIndex);
        } else {
            // 未解锁，触发广告
            this.showAdToUnlock(skinIndex);
        }
    }

    /**
     * 检查皮肤是否已解锁
     */
    public isSkinUnlocked(skinIndex: number): boolean {
        // 第一个皮肤默认解锁
        if (skinIndex === 1) return true;
        return this._unlockedSkins.has(skinIndex);
    }

    /**
     * 显示广告解锁皮肤
     */
    private showAdToUnlock(skinIndex: number): void {
        console.log(`WZBPW_SkinManager: Showing ad to unlock skin ${skinIndex}`);

        try {
            // 调用广告SDK
            Banner.Instance.ShowVideoAd(() => {
                // 广告看完，解锁皮肤
                this.unlockSkin(skinIndex);
            });
        } catch (e) {
            console.warn('WZBPW_SkinManager: Ad SDK not available, unlocking directly');
            // 如果广告SDK不可用，直接解锁（开发测试用）
            this.unlockSkin(skinIndex);
        }
    }

    /**
     * 解锁皮肤
     */
    public unlockSkin(skinIndex: number): void {
        if (skinIndex < 1 || skinIndex > this.skinCount) return;

        this._unlockedSkins.add(skinIndex);
        this.saveUnlockedSkins();

        // 隐藏该皮肤的解锁遮罩（第一个皮肤没有遮罩，所以索引要-2）
        // unlockMaskNodes[0] 对应皮肤2，unlockMaskNodes[1] 对应皮肤3，以此类推
        const maskIndex = skinIndex - 2;
        if (maskIndex >= 0 && maskIndex < this.unlockMaskNodes.length && this.unlockMaskNodes[maskIndex]) {
            this.unlockMaskNodes[maskIndex].active = false;
        }

        console.log(`WZBPW_SkinManager: Skin ${skinIndex} unlocked`);
    }

    /**
     * 选择指定索引的皮肤
     * @param skinIndex 皮肤索引（1-12）
     */
    public selectSkin(skinIndex: number): void {
        if (skinIndex < 1 || skinIndex > this.skinCount) {
            console.error(`WZBPW_SkinManager: Skin index ${skinIndex} out of range`);
            return;
        }

        // 检查是否已解锁
        if (!this.isSkinUnlocked(skinIndex)) {
            console.warn(`WZBPW_SkinManager: Skin ${skinIndex} is not unlocked`);
            return;
        }

        this._currentSkinIndex = skinIndex;

        // 保存选择
        this.saveSkinSelection();

        // 更新选择节点显示
        this.updateSelectionNodes();

        // 应用皮肤到所有青蛙
        this.applySkinToAllFrogs();

        console.log(`WZBPW_SkinManager: Skin ${skinIndex} selected`);
    }

    /**
     * 更新选择节点显示（只显示当前选择的皮肤的选择节点）
     */
    private updateSelectionNodes(): void {
        console.log(`WZBPW_SkinManager: Updating selection nodes, current skin: ${this._currentSkinIndex}`);
        for (let i = 0; i < this.selectionNodes.length; i++) {
            const node = this.selectionNodes[i];
            if (node) {
                // 索引+1 对应皮肤编号
                const shouldBeActive = (i + 1) === this._currentSkinIndex;
                node.active = shouldBeActive;
                console.log(`WZBPW_SkinManager: Selection node ${i} (skin ${i + 1}): ${shouldBeActive ? 'active' : 'inactive'}`);
            } else {
                console.warn(`WZBPW_SkinManager: Selection node ${i} is null`);
            }
        }
    }

    /**
     * 更新解锁遮罩显示
     */
    private updateUnlockMasks(): void {
        // unlockMaskNodes[0] 对应皮肤2，unlockMaskNodes[1] 对应皮肤3，以此类推
        for (let i = 0; i < this.unlockMaskNodes.length; i++) {
            const node = this.unlockMaskNodes[i];
            if (node) {
                // 索引+2 对应皮肤编号（因为第一个皮肤没有遮罩）
                const skinIndex = i + 2;
                node.active = !this.isSkinUnlocked(skinIndex);
            }
        }
    }

    /**
     * 应用皮肤到所有青蛙
     */
    public applySkinToAllFrogs(): void {
        // 获取当前皮肤节点（索引从0开始，所以要-1）
        const skinNodeIndex = this._currentSkinIndex - 1;
        if (skinNodeIndex < 0 || skinNodeIndex >= this._skinNodes.length) {
            console.error(`WZBPW_SkinManager: Skin index ${this._currentSkinIndex} out of range for skin nodes array`);
            return;
        }

        const skinNode = this._skinNodes[skinNodeIndex];
        if (!skinNode) {
            console.error(`WZBPW_SkinManager: Skin node ${this._currentSkinIndex} is null`);
            return;
        }

        // 查找"皮肤框"下的"1"节点
        const skinFrameNode = skinNode.getChildByName('皮肤框');
        if (!skinFrameNode) {
            console.error(`WZBPW_SkinManager: Skin frame node not found for skin ${this._currentSkinIndex}`);
            return;
        }

        const skinImageNode = skinFrameNode.getChildByName('1');
        if (!skinImageNode) {
            console.error(`WZBPW_SkinManager: Skin image node "1" not found for skin ${this._currentSkinIndex}`);
            return;
        }

        // 获取该节点的 Sprite 组件
        const skinSprite = skinImageNode.getComponent(Sprite);
        if (!skinSprite || !skinSprite.spriteFrame) {
            console.error(`WZBPW_SkinManager: Sprite or SpriteFrame not found on skin image node for skin ${this._currentSkinIndex}`);
            return;
        }

        // 应用该 SpriteFrame
        this.applyLoadedSkin(skinSprite.spriteFrame);
    }

    /**
     * 应用已加载的皮肤
     */
    private applyLoadedSkin(spriteFrame: SpriteFrame): void {
        // 应用到预览青蛙（Frog/1 节点的 Sprite）
        if (this.previewFrogSprite) {
            console.log(`WZBPW_SkinManager: Applying skin to preview frog. Node: ${this.previewFrogSprite.node.name}`);
            this.previewFrogSprite.spriteFrame = spriteFrame;
        } else {
            console.warn('WZBPW_SkinManager: previewFrogSprite is not set');
        }

        // 应用到关卡中的青蛙
        this.applyToLevelFrog(spriteFrame);

        // 应用到胜利界面的青蛙
        if (this.victoryFrogSprite) {
            console.log(`WZBPW_SkinManager: Applying skin to victory frog. Node: ${this.victoryFrogSprite.node.name}`);
            this.victoryFrogSprite.spriteFrame = spriteFrame;
        }

        console.log(`WZBPW_SkinManager: Skin applied to all frogs`);
    }

    /**
     * 应用皮肤到关卡中的青蛙
     */
    private applyToLevelFrog(spriteFrame: SpriteFrame): void {
        // 动态查找关卡中的青蛙
        const frogSprite = this.findFrogSpriteInScene();
        if (frogSprite) {
            frogSprite.spriteFrame = spriteFrame;
        }
    }

    /**
     * 在场景中查找青蛙的 FrogSprite
     */
    private findFrogSpriteInScene(): Sprite | null {
        const scene = director.getScene();
        if (!scene) return null;

        // 递归查找名为 "FrogSprite" 的节点
        const frogSpriteNode = this.findNodeByName(scene, 'FrogSprite');
        if (frogSpriteNode) {
            return frogSpriteNode.getComponent(Sprite);
        }

        // 如果找不到 FrogSprite，尝试查找 Frog 节点下的 Sprite
        const frogNode = this.findNodeByName(scene, 'Frog');
        if (frogNode) {
            // 查找子节点中的 FrogSprite
            const spriteNode = frogNode.getChildByName('FrogSprite');
            if (spriteNode) {
                return spriteNode.getComponent(Sprite);
            }
            // 或者直接获取 Frog 节点上的 Sprite
            return frogNode.getComponent(Sprite);
        }

        return null;
    }

    /**
     * 递归查找指定名称的节点
     */
    private findNodeByName(node: Node, name: string): Node | null {
        if (node.name === name) {
            return node;
        }
        for (const child of node.children) {
            const found = this.findNodeByName(child, name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    /**
     * 保存皮肤选择到本地存储
     */
    private saveSkinSelection(): void {
        sys.localStorage.setItem(SKIN_STORAGE_KEY, this._currentSkinIndex.toString());
    }

    /**
     * 从本地存储加载皮肤选择
     */
    private loadSkinSelection(): void {
        try {
            const savedIndex = sys.localStorage.getItem(SKIN_STORAGE_KEY);
            if (savedIndex !== null) {
                const index = parseInt(savedIndex);
                if (!isNaN(index) && index >= 1 && index <= this.skinCount) {
                    this._currentSkinIndex = index;
                    console.log(`WZBPW_SkinManager: Loaded saved skin index ${index}`);
                }
            }
        } catch (e) {
            console.warn('WZBPW_SkinManager: Failed to load skin selection');
        }
    }

    /**
     * 保存已解锁的皮肤到本地存储
     */
    private saveUnlockedSkins(): void {
        const unlockedArray = Array.from(this._unlockedSkins);
        sys.localStorage.setItem(SKIN_UNLOCK_KEY, JSON.stringify(unlockedArray));
    }

    /**
     * 从本地存储加载已解锁的皮肤
     */
    private loadUnlockedSkins(): void {
        try {
            const savedData = sys.localStorage.getItem(SKIN_UNLOCK_KEY);
            if (savedData !== null) {
                const unlockedArray = JSON.parse(savedData) as number[];
                this._unlockedSkins = new Set(unlockedArray);
                console.log(`WZBPW_SkinManager: Loaded unlocked skins: ${unlockedArray}`);
            }
        } catch (e) {
            console.warn('WZBPW_SkinManager: Failed to load unlocked skins');
        }
        // 确保第一个皮肤始终解锁
        this._unlockedSkins.add(1);
    }
}
