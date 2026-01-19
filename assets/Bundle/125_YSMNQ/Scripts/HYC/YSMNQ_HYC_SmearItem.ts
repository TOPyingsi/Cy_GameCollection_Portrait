import { _decorator, Component, Graphics, Mask, Node, Rect, rect, UITransform, v3, Vec2, Vec3, EventTouch, Animation, tween, instantiate } from 'cc';
import { EventManager } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { YSMNQ_GameEvent } from '../Common/YSMNQ_GameEvent';
import { YSMNQ_HYC_SecondPanel_0 } from './YSMNQ_HYC_SecondPanel_0';
import { YSMNQ_HYC_PeopleState } from './YSMNQ_HYC_PeopleState';
import { YSMNQ_ItemBase } from '../Common/YSMNQ_ItemBase';
const { ccclass, property } = _decorator;



// 单个涂层节点的独立状态类型
interface ClearMaskItemState {
    node: Node; // 涂层节点
    ticketNode: UITransform; // 涂层绘制节点
    lineWidth: number; // 清除线条宽度
    polygonPointsList: { rect: Rect; isHit: boolean }[]; // 网格列表
    clearPoints: number; // 已清除点数
    clearRate: number; // 清除率
    tempDrawPoints: Vec2[]; // 临时绘制点
    maskIndex: number; // 节点索引
    graphics: Graphics; // 绘制组件
}


/**
 * 多涂层节点清除管理器（单类实现，支持外部传入节点数组）
 */
@ccclass('YSMNQ_HYC_SmearItem')
export default class YSMNQ_HYC_SmearItem extends YSMNQ_ItemBase {

    @property(Boolean)
    isInverted: boolean = false;


    @property(Number)
    lineWidth: number = 40;
        
    @property(Number)
    passRange: number = 0.55;
    
    private _itemId:number = 0;

    public _isCanMove: boolean = false; // 全局锁定开关

    private _startPos: Vec3 = null;
    private _targets: Node = null; //  目标节点

    private _selectedNode: Node = null; // 选中节点
    private _normalNode: Node = null; // 正常节点
    private _collisionNode: Node = null; // 碰撞点节点
    private _tutorialsNode: Node = null; // 提示节点
    private _completedNode: Node = null; // 完成节点
    private _maskPointContainer: Node = null; // 涂层点容器节点
    private _maskPointPrefab: Node = null; // 涂层点预制体节点

        // 核心映射：数组索引 -> 节点独立状态
    private _maskItemStates: ClearMaskItemState[] = [];



    protected onLoad(): void {
        this.onListener();
        this._selectedNode = this.node.getChildByName('selected');
        this._normalNode = this.node.getChildByName('normal');
        this._collisionNode = this.node.getChildByName('collision');
        this._completedNode = this.node.getChildByName('completed');
        this._tutorialsNode = this.node.getChildByName("tutorials");
        this._completedNode.active = false;
        this._normalNode.active = true;
        this._collisionNode.active = true;
        this._selectedNode.active = false;
        this._maskPointPrefab = this.node.getChildByName("maskPoint");
        if(this._tutorialsNode){
            this._tutorialsNode.children.forEach((tutorial) => {
                tutorial.active = false;
            })
        }
    }

    init(itemId:number,operationNode: Node,secondPanel: Node): void {
        this._startPos = this.node.getWorldPosition();
        this._targets = operationNode.getChildByName("targets");
        this._maskPointContainer = operationNode.getChildByName("operationAnims").getChildByName("maskPointContainer");

        this._itemId = itemId;

        this.createMaskItem();

        this.showTutorial();

        // 注册触摸事件
        this.enableTouch();
    }


      /**
     * 创建涂层节点状态
     * @param maskNodes 外部传入的涂层节点数组
     * @param lineWidths 可选：每个节点的线条宽度（不传则默认80/40）
     */
    private createMaskItem( lineWidths?: number[]) {
        
        // 清空旧状态
        this._maskItemStates = [];

        // 遍历传入的节点，为每个节点创建独立状态
        this._targets.children.forEach((target, index) => {
            let maskNode = target.getChildByName("mask");
            let idx = Number(target.name.split("_")[1]);
            // 获取/创建Mask组件（继承自Mask）
            let maskComp = maskNode.getComponent(Mask);
            if (!maskComp) {
                maskComp = maskNode.addComponent(Mask);
            }

            // 获取绘制组件
            let graphics = maskNode.getComponent(Graphics);
            if (!graphics) {
                graphics = maskNode.addComponent(Graphics);
            }

            // 获取ticketNode（节点的第一个子节点，兼容原有逻辑）
            let ticketNode = maskNode.children[0]?.getComponent(UITransform);
            if (!ticketNode) {
                // 兜底：使用节点自身的UITransform
                ticketNode = maskNode.getComponent(UITransform);
                if (!ticketNode) {
                    ticketNode = maskNode.addComponent(UITransform);
                }
                console.warn(`涂层节点${index}无自节点，使用自身UITransform`);
            }

            // 初始化线条宽度（兼容原有maskIndex逻辑）
            const lineWidth = this.lineWidth;

            // 创建该节点的独立状态对象
            const itemState: ClearMaskItemState= {
                node: maskNode,
                ticketNode: ticketNode,
                lineWidth: lineWidth,
                polygonPointsList: [],
                clearPoints: 0,
                clearRate: 0,
                tempDrawPoints: [],
                maskIndex: idx,
                graphics: graphics
            };

            // 初始化网格（独立网格，不共享）
            this.resetItemState(itemState);

            // 加入状态数组，建立索引映射
            this._maskItemStates.push(itemState);
        });

        this._maskItemStates.sort((a, b) => a.maskIndex - b.maskIndex);

        console.log(`多涂层节点初始化完成，共${this._maskItemStates.length}个节点`);
    }

    /**
     * 重置单个节点的状态（独立重置）
     */
    private resetItemState(itemState: ClearMaskItemState) {
        itemState.polygonPointsList = [];
        itemState.clearPoints = 0;
        itemState.clearRate = 0;
        itemState.tempDrawPoints = [];
        if(itemState.node.getComponent(Mask).inverted){
            itemState.graphics.clear(); // 清空绘制
        }
        

        // 生成该节点专属的网格（独立统计）
        const { ticketNode, lineWidth } = itemState;
        let rectWidth = lineWidth ;
        for (let x = 0; x < ticketNode.width; x += rectWidth) {
            for (let y = 0; y < ticketNode.height; y += rectWidth) {
                itemState.polygonPointsList.push({
                    rect: rect(
                        x - ticketNode.width / 2,
                        y - ticketNode.height / 2,
                        rectWidth,
                        rectWidth
                    ),
                    isHit: false
                });
            }
        }
    }


    
    showTutorial(): void {
        // if(!this._tutorialsNode)return;
        switch(this._itemId){
            case 0:
                this._tutorialsNode.children[0].active = true;
                this._tutorialsNode.children[0].getComponent(Animation).play();
                this._tutorialsNode.active = true;
                break;
            default:
                break;
        }
    }

    hideTutorial(): void {
        if(this._tutorialsNode){
            this._tutorialsNode.children.forEach((tutorial) => {
                tutorial.active = false;
            })
            this._tutorialsNode.active = false;
        }
    }
    
    showTargets(): void {
        this._targets.active = true;
        this._targets.children.forEach((target) => {
            if(target.active){
                let circleNode = target.getChildByName("circle");
                circleNode.active = true;
                circleNode.getComponent(Animation).play();
            }
        })
    }

    hideTargets(): void {
        this._targets.children.forEach((target) => {
            let circleNode = target.getChildByName("circle");
            circleNode.active = false;
        })
        this._targets.active = false;
    }

    handleTargetMask(targetId:number): void {
         this._targets.getChildByName("target_"+targetId).getChildByName("mask").active = false;
    }

        
    showPeopleReact(targetId:number): void {
        switch(this._itemId){
            case 0:
                YSMNQ_HYC_SecondPanel_0.Instance.showPeopleReact(YSMNQ_HYC_PeopleState.迷糊);
                break;
            default:
                break;
        }
    }

    showOperationSpTip(): void {
        YSMNQ_HYC_SecondPanel_0.Instance.showOperationSpTip(this._itemId);
    }

    hideOperationSpTip(): void {
        YSMNQ_HYC_SecondPanel_0.Instance.hideOperationSpTip();
    }

    showNormalTip(): void {
        YSMNQ_HYC_SecondPanel_0.Instance.showTip("治疗病人");
    }

    showOperationTip(): void {
        switch(this._itemId){
            case 0:
                YSMNQ_HYC_SecondPanel_0.Instance.showTip("用棉球给口腔消毒");
                break;
            case 1:
                YSMNQ_HYC_SecondPanel_0.Instance.showTip("清洗牙结石");
                break;
            case 2:
                YSMNQ_HYC_SecondPanel_0.Instance.showTip("挑破口疮");
                break;
            case 3:
                YSMNQ_HYC_SecondPanel_0.Instance.showTip("伤口上药");
                break;
            case 4:
                YSMNQ_HYC_SecondPanel_0.Instance.showTip("摘除坏牙");
                break;
            case 5:
                YSMNQ_HYC_SecondPanel_0.Instance.showTip("换上好牙");
                break
            case 6:
                YSMNQ_HYC_SecondPanel_0.Instance.showTip("换上好牙");
                break;
            case 7:
            YSMNQ_HYC_SecondPanel_0.Instance.showTip("刮掉舌苔");
                break;
            default:
                break;
        }
    }


    /**
     * 全局触摸开始：遍历所有节点，处理命中的节点
     */
    private onTouchStart(event: EventTouch) {
        this._isCanMove = true;

        const touchPos = event.getUILocation(); // 触摸点世界坐标
        this.node.setWorldPosition(v3(touchPos.x, touchPos.y, 0));
        this._selectedNode.active = true;
        this._normalNode.active = false;
        this.showTargets();
        this.hideTutorial();
        this.showOperationTip();
        this.showOperationSpTip();
        EventManager.Scene.emit(YSMNQ_GameEvent.CancelTutorial);
        

        let pos = v3(event.getUILocation().x+this._collisionNode.position.x, event.getUILocation().y+this._collisionNode.position.y, 0)
        this.handleTouch(pos);
    }

    /**
     * 全局触摸移动：遍历所有节点，处理命中的节点
     */
    private onTouchMove(event: EventTouch) {
        if (!this._isCanMove) return;
        const touchPos = event.getUILocation();
        this.node.setWorldPosition(v3(touchPos.x, touchPos.y, 0));

        let pos = v3(event.getUILocation().x+this._collisionNode.position.x, event.getUILocation().y+this._collisionNode.position.y, 0)
        this.handleTouch(pos);
    }


    onTouchEnd(event: EventTouch) {
        if (!this._isCanMove) return;
        if(this._maskItemStates.length){
            this.node.setWorldPosition(this._startPos);
            this._selectedNode.active = false;
            this._normalNode.active = true;
            this.hideTargets();
            this.showNormalTip();
            this.hideOperationSpTip();
        }
    }

    /**
     * 核心触摸处理逻辑：遍历所有涂层节点，判断命中并更新状态
     */
    private handleTouch(touchWorldPos: Vec3) {

        // 遍历所有涂层节点的独立状态
        this._maskItemStates.forEach((itemState, index) => {
            const { node, ticketNode } = itemState;

            // 步骤1：判断触摸点是否在当前涂层节点范围内
            // 转换触摸坐标到当前节点的本地空间
            const localPos = ticketNode.convertToNodeSpaceAR(touchWorldPos);
            // 检查是否在节点矩形范围内（简单命中检测）
            const isInNodeArea = (
                localPos.x >= -ticketNode.width / 2 &&
                localPos.x <= ticketNode.width / 2 &&
                localPos.y >= -ticketNode.height / 2 &&
                localPos.y <= ticketNode.height / 2
            );

            // 未命中则跳过当前节点
            if (!isInNodeArea) return;

            // 步骤2：命中则清除该节点的涂层（圆形清除）
            this.clearMaskItem(itemState, localPos,touchWorldPos);

            // 步骤3：独立计算该节点的清除进度
            this.calculateItemClearRate(itemState, index);
        });

        this.checkTargetAllClear();
    }

    /**
     * 清除单个涂层节点的涂层（仅圆形清除，独立绘制）
     */
    private clearMaskItem(itemState:ClearMaskItemState, localPos: Vec3,touchPos: Vec3) {
        const { graphics, lineWidth, polygonPointsList, tempDrawPoints } = itemState;
        const pos = new Vec2(localPos.x, localPos.y);

        // tempDrawPoints.push(pos);

        this.createMaskPoint(touchPos);


        // // 圆形清除逻辑（独立绘制到当前节点的Graphics）
        // graphics.circle(pos.x, pos.y, lineWidth);
        // graphics.fill();

        // 标记该节点的命中网格（独立统计）
        polygonPointsList.forEach((item) => {
            if (item.isHit) return;
            const xFlag = pos.x > item.rect.x && pos.x < item.rect.x + item.rect.width;
            const yFlag = pos.y > item.rect.y && pos.y < item.rect.y + item.rect.height;
            if (xFlag && yFlag) item.isHit = true;
        });
    }


    private createMaskPoint(touchPos: Vec3) {
        const maskPoint = instantiate(this._maskPointPrefab);
        maskPoint.parent = this._maskPointContainer;
        maskPoint.active = true;
        let sourcePos = maskPoint.getChildByName('sp');
        sourcePos.setParent(this._maskPointContainer);
        sourcePos.setPosition(v3(0, 0, 0));
        maskPoint.setWorldPosition(v3(touchPos.x, touchPos.y, 0));
        let sourceWorldPos = sourcePos.getWorldPosition();
        sourcePos.setParent(maskPoint);
        sourcePos.setWorldPosition(v3(sourceWorldPos.x, sourceWorldPos.y, 0));
    }


    /**
     * 独立计算单个节点的清除进度
     */
    private calculateItemClearRate(itemState:ClearMaskItemState, index: number) {
        const { polygonPointsList } = itemState;
        if (polygonPointsList.length === 0) return;

        // 重置该节点的清除点数（独立统计）
        itemState.clearPoints = 0;
        polygonPointsList.forEach((item) => {
            if (item.isHit) itemState.clearPoints++;
        });

        // 计算该节点的清除率（独立计算）
        itemState.clearRate = itemState.clearPoints / polygonPointsList.length;

        // 输出带索引的清除比例，区分不同节点
        console.log(`涂层节点${index} - 清除点数: ${itemState.clearPoints}`);
        console.log(`涂层节点${index} - 总网格数: ${polygonPointsList.length}`);
        console.log(`涂层节点${index} - 刮开比例: ${(itemState.clearRate * 100).toFixed(1)}%`);
    }

    checkTargetAllClear(){
        let clearIdxs:number[] = [];
        this._maskItemStates.forEach((itemState, index) => {
            if(itemState.clearRate > this.passRange){
                clearIdxs.push(index);
            }
        })

        //移除已达标的涂层状态
        clearIdxs.sort((a, b) => b - a);
        clearIdxs.forEach((idx) => {
            let targetId = this._maskItemStates[idx].maskIndex;
            this._maskItemStates.splice(idx, 1);
            this.handleTargetMask(targetId);
            if(this._maskItemStates.length === 0){
                this.node.active = true;
                this._selectedNode.active = false;
                this._normalNode.active = true;
                this._isCanMove = false;
                this.hideTargets();
                this.cancelTouch();
                tween(this.node)
                    .to(0.5, { worldPosition: this._startPos })
                    .call(()=>{
                        this.passTarget(targetId);
                    })
                    .start();
            }
            else{
                this.passTarget(targetId);
            }
        })    
    }

    
    // 完成目标点
    passTarget(targetId: number): void {
        this._targets.getChildByName("target_"+targetId).active = false;
        let isHave = false;
        this._targets.children.forEach((target)=>{
            if(target.active){
                isHave = true;
            }
        })
        if(!isHave){
            this._completedNode.active = true;
            YSMNQ_HYC_SecondPanel_0.Instance.passItem(this._itemId);
            this.showNormalTip();
            this.hideOperationSpTip();

            if(!this.isInverted){
                 this._targets.getChildByName("target_"+targetId).active = true;
            }
        }
        else{
            this.enableTouch();
        }
    }



    /**
     * 外部调用：重置所有涂层节点的状态
     */
    public resetAllItems() {
        this._maskItemStates.forEach(itemState => this.resetItemState(itemState));
    }

    /**
     * 外部调用：重置指定索引的涂层节点
     */
    public resetItemByIndex(index: number) {
        const itemState = this._maskItemStates[index];
        if (itemState) this.resetItemState(itemState);
    }

    /**
     * 外部调用：获取指定索引节点的清除率
     */
    public getClearRateByIndex(index: number): number {
        return this._maskItemStates[index]?.clearRate ?? 0;
    }

   enableTouch(){

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    cancelTouch(){
        this.node.off(Node.EventType.TOUCH_START);
        this.node.off(Node.EventType.TOUCH_MOVE);
        this.node.off(Node.EventType.TOUCH_END);
        this.node.off(Node.EventType.TOUCH_CANCEL);
    }
        
    onListener(){
        EventManager.on(YSMNQ_GameEvent.CancelTutorial, this.hideTutorial, this);
    }

    removeListener(){
        EventManager.off(YSMNQ_GameEvent.CancelTutorial);
    }

    

    onDestroy() {
        // 清空状态
        this._maskItemStates = [];
        this.removeListener();
    }
}