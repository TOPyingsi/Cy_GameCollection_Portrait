import { _decorator, Component, Node, Sprite, SpriteFrame, Label, Button, UITransform, Color, EventTouch, instantiate, Vec3, v3, Event, tween, UIOpacity } from 'cc';
import { WQ_ChessType, WQ_Pos, WQ_GoUtil, WQ_LinkType, WQ_ExpressionType } from './WQ_GoUtil';
import { WQ_GoAI } from './WQ_GoAI';
import { WQ_Chess } from './WQ_Chess';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { WQ_AudioManager } from './WQ_AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

export enum WQ_GameMode {
    HUMAN = 'human',
    AI = 'ai'
}

@ccclass('WQ_GameManager')
export class WQ_GameManager extends Component {
    // 原有属性保持不变...
    @property(Node) boardNode: Node = null!;
    @property(Label) infoLabel: Label = null!;
    @property(Label) ruleLabel: Label = null!;
    @property(Label) chessLogLabel: Label = null!;
    // @property(Button) btn5x5: Button = null!;
    // @property(Button) btn6x6: Button = null!;
    // @property(Button) btn7x7: Button = null!;
    // @property(Button) btn8x8: Button = null!;
    // @property(Button) btn9x9: Button = null!;
    // @property(Button) btnHuman: Button = null!;
    // @property(Button) btnAI: Button = null!;
    @property(SpriteFrame) blackChessSF: SpriteFrame = null!;
    @property(SpriteFrame) whiteChessSF: SpriteFrame = null!;
    @property(Node) linePrefab: Node = null!;
    @property(Node) chessPrefab: Node = null!;

    // ===== 新增：3个Pass按钮属性 =====
    @property(Button) btnPass_0: Button = null!;         // AI对战-玩家（黑）Pass
    @property(Button) btnPass_1: Button = null!; // 人人对战-黑方Pass
    @property(Button) btnPass_2: Button = null!; // 人人对战-白方Pass

    // ===== 新增：3个认输按钮属性（核心新增） =====
    @property(Button) btnGiveUp_0: Button = null!;         // AI对战-玩家（黑）认输
    @property(Button) btnGiveUp_1: Button = null!; // 人人对战-黑方认输
    @property(Button) btnGiveUp_2: Button = null!; // 人人对战-白方认输

    @property(Label) lblCount_0: Label = null!;         // AI对战-玩家（黑）Pass
    @property(Label) lblCount_ai: Label = null!; // AI对战-玩家（白）Pass
    @property(Label) lblCount_1: Label = null!; // 人人对战-黑方Pass
    @property(Label) lblCount_2: Label = null!; // 人人对战-白方Pass




    @property(Node) suspensionPrefabWhite: Node = null!; // 白棋悬浮节点
    @property(Node) suspensionPrefabBlack: Node = null!; // 黑棋悬浮节点


  
    @property(Node) info_Player1: Node = null!; // 玩家1信息节点（白方）
    @property(Node) info_Player2: Node = null!; // 玩家2信息节点（黑方）
    @property(Node) info_Player0: Node = null!; // 玩家0信息节点（黑方）
    @property(Node) info_Ai: Node = null!; // AI信息节点（白方）
    @property(Node) nodeAiThinking: Node = null!; // AI思考中节点


    @property(Node) tipPrefab: Node = null!; // 提示节点
    @property(Node) tipContainer: Node = null!; // 提示容器节点

    @property(Node) startPanel: Node = null!; // 开始面板节点
    @property(Node) gameOverPanel: Node = null!; // 游戏结束面板节点
    @property(Node) selectedBoardPanel: Node = null!; // 选棋盘面板节点
    @property(Node) rulePanel: Node = null!; // 规则面板节点

    @property(Node) NoTip: Node = null!; // 禁止提示



    private currentBoardSize = 0;

    // ===== 新增：悬浮节点相关属性 =====
    private suspensionNode: Node | null = null; // 当前显示的悬浮节点
    private lastSuspensionPos: WQ_Pos | null = null; // 上一个悬浮的棋盘坐标（避免重复创建）
    
    // ===== 新增：连续Pass计数器 - 核心游戏结束判定属性 =====
    private continuousPassCount = 0; // 连续Pass次数，达到2则游戏结束

    private lineWidth = 3;
    private lineCount = 0;
    private boardSize = 9;
    private cellSize = 200;
    private gameMode: WQ_GameMode = WQ_GameMode.AI;
    private board: WQ_ChessType[][] = [];
    private currentTurn: WQ_ChessType = WQ_ChessType.BLACK;
    private isGameOver = false;
    private isAIThinking = false;
    private isTimeout = false;
    private aiCallBack: Function = null;
    private lastCapturePos: WQ_Pos | null = null;
    private ai: WQ_GoAI = null;
    private chessNodesMap: Map<string, Node> = new Map();

    onLoad() {
        this.ai = this.node.addComponent(WQ_GoAI);

        // this.btn5x5.node.on(Button.EventType.CLICK, () => this.initGame(5));
        // this.btn6x6.node.on(Button.EventType.CLICK, () => this.initGame(6));
        // this.btn7x7.node.on(Button.EventType.CLICK, () => this.initGame(7));
        // this.btn8x8.node.on(Button.EventType.CLICK, () => this.initGame(8));
        // this.btn9x9.node.on(Button.EventType.CLICK, () => this.initGame(9));
        // this.btnHuman.node.on(Button.EventType.CLICK, () => this.switchMode(WQ_GameMode.HUMAN));
        // this.btnAI.node.on(Button.EventType.CLICK, () => this.switchMode(WQ_GameMode.AI));

        // ===== 新增：Pass按钮点击事件绑定 =====
        this.btnPass_1.node.on(Button.EventType.CLICK, () => this.onPass(WQ_ChessType.BLACK));
        this.btnPass_2.node.on(Button.EventType.CLICK, () => this.onPass(WQ_ChessType.WHITE));
        this.btnPass_0.node.on(Button.EventType.CLICK, () => this.onPass(WQ_ChessType.BLACK));

        // ===== 新增：认输按钮点击事件绑定（核心新增） =====
        this.btnGiveUp_1.node.on(Button.EventType.CLICK, () => this.onGiveUp(WQ_ChessType.BLACK));
        this.btnGiveUp_2.node.on(Button.EventType.CLICK, () => this.onGiveUp(WQ_ChessType.WHITE));
        this.btnGiveUp_0.node.on(Button.EventType.CLICK, () => this.onGiveUp(WQ_ChessType.BLACK));

        this.initRuleText();

        const boardUITrans = this.boardNode.getComponent(UITransform)!;
        boardUITrans.anchorX = 0.5;
        boardUITrans.anchorY = 0.5;

        this.initGame(9);

        // ===== 修改：替换触摸事件，添加完整的触摸生命周期 =====
        this.boardNode.on(Node.EventType.TOUCH_START, this.onBoardTouchStart, this); // 触摸开始
        this.boardNode.on(Node.EventType.TOUCH_MOVE, this.onBoardTouchMove, this); // 触摸移动
        this.boardNode.on(Node.EventType.TOUCH_END, this.onBoardTouchEnd, this); // 触摸结束（在棋盘内）
        this.boardNode.on(Node.EventType.TOUCH_CANCEL, this.onBoardTouchCancel, this); // 触摸取消（超出棋盘/离开屏幕）

        this.startPanel.active = true;
        this.selectedBoardPanel.active = false;
        this.rulePanel.active = false;
        this.gameOverPanel.active = false;

        let showNoTip = Banner.IS_OPPO_MINI_GAME;
        this.NoTip.active = showNoTip;
    }

    private initRuleText() {
        this.ruleLabel.string = `⚫⚪ 围棋游戏规则（本游戏执行规则）
1. 【落子唯一性】- 棋盘上的任意一个交叉点，一旦落上棋子（黑/白），本局内不可在该位置再次落子。
2. 【禁入点规则】- 落子后自身棋块无气（无空白相邻点位），且该落子无法提掉对方任何棋子的位置，禁止落子。
3. 【劫争规则】- 对方提掉己方棋子后，己方不能在下一步立即落回该被提子的位置提回对方棋子，需至少隔一步。
4. 【边界规则】- 只能在当前选择的棋盘尺寸范围内落子，超出棋盘边界的位置禁止落子。
5. 【提子规则】- 落子后若对方相邻棋块无气，则立即提掉对方该无气棋块的所有棋子。
6. 【回合规则】- 黑方先行，黑白双方轮流落子，人机模式下黑方为玩家，白方为AI。
7. 【结束规则】- 黑白双方连续选择Pass/任意一方点击认输，本局游戏立即结束！`; // 修改：补充认输结束规则
    }

    initGame(size: number) {
        this.boardSize = size;
        this.cellSize = size == 5 ? 200 : size == 6 ?165: size == 7 ?142 : size == 8 ? 125 :size == 9 ? 110:100;
        this.lineWidth = size == 5 ? 6 : size == 6 ? 5 : size == 7 ? 4 : size == 8 ? 3 : size == 9 ? 3 : 0.5;
        this.board = Array(size).fill(0).map(() => Array(size).fill(WQ_ChessType.NONE));
        this.currentTurn = WQ_ChessType.BLACK;
        this.isGameOver = false;
        this.isAIThinking = false;
        this.continuousPassCount = 0; // 初始化：重置连续Pass计数器

        this.lastCapturePos = null;
        this.chessNodesMap.clear();

        // 新增：初始化棋盘时销毁悬浮节点
        this.destroySuspensionNode();

        // 新增：初始化棋盘时重置棋块数据
        WQ_GoUtil.resetBlockData();
        WQ_GoUtil.resetLastPosData();

        this.boardNode.removeAllChildren();
        this.lineCount = 0;
        this.renderBoard();
        this.updateInfo();
        this.clearChessLog();
        this.updatePassBtnVisible(); // 新增：落子后更新Pass/认输按钮显隐（方法内部已包含认输按钮）

        // ===== 新增：初始化棋子数标签为0 =====
        this.lblCount_0.string = "0";
        this.lblCount_ai.string = "0";
        this.lblCount_1.string = "0";
        this.lblCount_2.string = "0";
    }

    switchMode(mode: WQ_GameMode) {
        this.gameMode = mode;
        // this.btnHuman.node.getComponent(Sprite)!.color = mode === WQ_GameMode.HUMAN ? new Color(100, 50, 30) : new Color(139, 90, 43);
        // this.btnAI.node.getComponent(Sprite)!.color = mode === WQ_GameMode.AI ? new Color(100, 50, 30) : new Color(139, 90, 43);
        this.initGame(this.boardSize);
        this.updatePassBtnVisible(); // 新增：落子后更新Pass/认输按钮显隐

        // ===== 新增：切换模式时重置所有棋子数标签为0 =====
        this.lblCount_0.string = "0";
        this.lblCount_ai.string = "0";
        this.lblCount_1.string = "0";
        this.lblCount_2.string = "0";
    }

     /**
     * 处理玩家Pass逻辑
     * @param passColor 发起Pass的玩家颜色
     */
     private onPass(passColor: WQ_ChessType) {
        // 校验Pass合法性：游戏未结束、非AI思考中、当前正是该玩家回合
        if (this.isGameOver || this.isAIThinking || this.currentTurn !== passColor) {
            const tip = passColor === WQ_ChessType.BLACK ? "黑方暂未到回合，无法跳过" : "白方暂未到回合，无法跳过";
            this.infoLabel.string = `❌ ${tip}`;
            this.showTip(tip);
            this.scheduleOnce(() => this.updateInfo(), 2);
            return;
        }

        // 记录Pass日志
        const passColorText = passColor === WQ_ChessType.BLACK ? "黑棋" : "白棋";
        const logMsg = `${passColorText}选择跳过，跳过当前回合`;
        this.addChessLog(logMsg);
        this.infoLabel.string = logMsg;
        this.showTip(logMsg);

        // 核心修改：连续Pass计数+1
        this.continuousPassCount++;
         // ✅ 新增：Pass回合，重置劫争点（打破劫争即时提回限制）
        this.lastCapturePos = null;
        // 判断是否连续2次Pass，是则游戏结束
        if (this.continuousPassCount >= 2) {
            this.gameOver();
            return;
        }

        // 切换回合
        this.currentTurn = this.currentTurn === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK;
        this.updatePassBtnVisible(); // 更新Pass/认输按钮显隐
        this.updateInfo();

        // 暂停下一回合等待动画
        this.isTimeout = true;
        this.scheduleOnce(() => {
            this.isTimeout = false;
            this.aiCallBack && this.aiCallBack();
            this.aiCallBack = null;
        }, 1);


        // AI模式下，玩家Pass后立即触发AI思考（白方AI回合）
        if (this.gameMode === WQ_GameMode.AI && this.currentTurn === WQ_ChessType.WHITE && !this.isGameOver) {
            this.isAIThinking = true;
            this.updateInfo();
            
            const latestBoard = WQ_GoUtil.copyBoard(this.board);
            const latestCapturePos = this.lastCapturePos;

            this.ai.getBestMove(
                latestBoard,  // 改用提子后的最新棋盘副本
                WQ_ChessType.WHITE, 
                latestCapturePos,
                (aiPos) => {
                    if (aiPos) {
                        // 确保AI落子前状态正确
                        this.isAIThinking = false;
                        if(!this.isTimeout){
                            this.doMove(aiPos.x, aiPos.y);
                            this.aiCallBack = null;
                        }
                        else{
                            this.aiCallBack = ()=>{
                                this.doMove(aiPos.x, aiPos.y);
                            }
                        }
                    } else {
                        // 核心修改：AI无合法落子，执行AIPass逻辑
                        this.onAIPass();
                    }
                }
            );
        } else {
            this.isAIThinking = false;
        }
    }

    /**
     * 核心新增：处理玩家认输逻辑
     * @param giveUpColor 发起认输的玩家颜色
     */
    private onGiveUp(giveUpColor: WQ_ChessType) {
        // 校验认输合法性：游戏未结束、非AI思考中（认输无回合限制，任意时刻可认输）
        if (this.isGameOver || this.isAIThinking) {
            const tip = this.isGameOver ? "游戏已结束，无法认输" : "AI思考中，暂无法认输";
            this.infoLabel.string = `❌ ${tip}`;
            this.showTip(tip);
            this.scheduleOnce(() => this.updateInfo(), 2);
            return;
        }

        // 定义认输方和胜利方文本
        const giveUpColorText = giveUpColor === WQ_ChessType.BLACK ? "黑棋" : "白棋";
        const winColorText = giveUpColor === WQ_ChessType.BLACK ? "白棋" : "黑棋";
        // 人机模式下补充角色说明
        const roleTip = this.gameMode === WQ_GameMode.AI 
            ? (giveUpColor === WQ_ChessType.BLACK ? "(玩家)" : "(AI)") 
            : "";
        const winRoleTip = this.gameMode === WQ_GameMode.AI 
            ? (winColorText === "白棋" ? "(AI)" : "(玩家)") 
            : "";

        // 记录认输日志
        const logMsg = `${giveUpColorText}${roleTip}选择认输，本局游戏结束`;
        this.addChessLog(logMsg);
        this.infoLabel.string = logMsg;
        // this.showTip(logMsg);

        // 直接标记游戏结束并进入结算（强制结束，无需判断连续Pass）
        this.gameOver(giveUpColor);
    }

    /**
     * 新增：AI无合法落子时的Pass逻辑
     * 逻辑：记录Pass、弹窗提示、切换回合、判断连续Pass、转交玩家
     */
    private onAIPass() {
        const passMsg = "AI选择跳过本回合，回合转交玩家！";
        this.infoLabel.string = passMsg;
        this.showTip(passMsg);
        this.addChessLog(`⏭️ 白棋(AI)${passMsg.replace('⚠️ ', '').replace('，回合转交玩家！', '')}`);
        this.isAIThinking = false;
        this.continuousPassCount++; // AI Pass，连续计数+1
        // ✅ 新增：AI Pass回合，重置劫争点（打破劫争即时提回限制）
        this.lastCapturePos = null;

        // 判断是否连续2次Pass（玩家+AI 或 AI+玩家），是则游戏结束
        if (this.continuousPassCount >= 2) {
            this.gameOver();
            return;
        }

        // 切换回合回玩家（黑方），更新界面状态
        this.currentTurn = WQ_ChessType.BLACK;
        this.updatePassBtnVisible();
        this.updateInfo();
    }

    // ===== 新增：更新Pass/认输按钮显隐状态（修改：加入认输按钮控制） =====
    /**
     * 根据当前游戏模式和回合，自动控制3个Pass按钮+3个认输按钮的显隐
     * 规则：
     * 1. 人人对战：仅显示当前回合玩家的Pass/认输按钮（黑回合显黑按钮，白回合显白按钮）
     * 2. AI对战：仅显示玩家（黑方）的Pass/认输按钮，白方AI无任何按钮（AI只Pass不认输）
     * 3. AI思考中/游戏结束：隐藏所有Pass/认输按钮
     */
    private updatePassBtnVisible() {
        this.nodeAiThinking.active = this.isAIThinking
        if (this.isGameOver || this.isAIThinking) {
            // 游戏结束/AI思考中，隐藏所有Pass+认输按钮
            this.btnPass_1.node.active = false;
            this.btnPass_2.node.active = false;
            this.btnPass_0.node.active = false;
            this.btnGiveUp_1.node.active = false;
            this.btnGiveUp_2.node.active = false;
            this.btnGiveUp_0.node.active = false;
            return;
        }

        if (this.gameMode === WQ_GameMode.HUMAN) {
            this.info_Ai.active = false;
            this.info_Player0.active = false;
            this.info_Player1.active = true;
            this.info_Player2.active = true;

            this.info_Player2.getChildByName("selected").active = this.currentTurn === WQ_ChessType.WHITE;
            this.info_Player1.getChildByName("selected").active = this.currentTurn === WQ_ChessType.BLACK;

            // 人人对战：显隐当前回合的Pass+认输按钮
            this.btnPass_0.node.active = false;
            this.btnGiveUp_0.node.active = false;
            this.btnPass_1.node.active = this.currentTurn === WQ_ChessType.BLACK;
            this.btnPass_2.node.active = this.currentTurn === WQ_ChessType.WHITE;
            this.btnGiveUp_1.node.active = this.currentTurn === WQ_ChessType.BLACK;
            this.btnGiveUp_2.node.active = this.currentTurn === WQ_ChessType.WHITE;
            // this.btnPass_1.node.active = false;
            // this.btnPass_2.node.active = false;
            // this.btnPass_0.node.active = false;
            // this.btnGiveUp_1.node.active = false;
            // this.btnGiveUp_2.node.active = false;
            // this.btnGiveUp_0.node.active = false;
        } else {
            this.info_Ai.active = true;
            this.info_Player0.active = true;
            this.info_Player1.active = false;
            this.info_Player2.active = false;

            this.info_Ai.getChildByName("selected").active = this.currentTurn === WQ_ChessType.WHITE;
            this.info_Player0.getChildByName("selected").active = this.currentTurn === WQ_ChessType.BLACK;


            // AI对战：仅显示玩家（黑方）Pass+认输按钮，AI无按钮
            this.btnPass_1.node.active = false;
            this.btnPass_2.node.active = false;
            this.btnGiveUp_1.node.active = false;
            this.btnGiveUp_2.node.active = false;
            this.btnPass_0.node.active = this.currentTurn === WQ_ChessType.BLACK;
            this.btnGiveUp_0.node.active = this.currentTurn === WQ_ChessType.BLACK;
            // this.btnPass_1.node.active = false;
            // this.btnPass_2.node.active = false;
            // this.btnPass_0.node.active = false;
            // this.btnGiveUp_1.node.active = false;
            // this.btnGiveUp_2.node.active = false;
            // this.btnGiveUp_0.node.active = false;
        }
    }

    /**
     * 根据当前游戏模式，更新对应棋子数标签显示
     * @param black 黑棋总数
     * @param white 白棋总数
     */
    private updateLblCount(black: number, white: number) {
        if (this.gameMode === WQ_GameMode.AI) {
            // AI对战模式：黑方（玩家）→ lblCount_0，白方（AI）→ lblCount_ai
            this.lblCount_0.string = black.toString();
            this.lblCount_ai.string = white.toString();
        } else {
            // 人人对战模式：黑方 → lblCount_1，白方 → lblCount_2
            this.lblCount_1.string = black.toString();
            this.lblCount_2.string = white.toString();
        }
    }

    private renderBoard() {
        const boardWH = (this.boardSize - 1) * this.cellSize;
        const boardUITrans = this.boardNode.getComponent(UITransform)!;
        boardUITrans.setContentSize(boardWH, boardWH);
        this.drawBoardLines();
    }


    private drawBoardLines() {
        const halfSize = (this.boardSize - 1) * this.cellSize / 2;

        for (let i = 0; i < this.boardSize; i++) {
            const lineNode = instantiate(this.linePrefab);
            lineNode.name = `h_line_${i}`;
            const lineSprite = lineNode.getComponent(Sprite)!;
            lineSprite.color = new Color(92, 58, 33);
            lineNode.parent = this.boardNode;
            this.lineCount++;
            
            const lineUITrans = lineNode.getComponent(UITransform)!;
            lineUITrans.setContentSize((this.boardSize - 1) * this.cellSize, this.lineWidth);
            const yPos = halfSize - i * this.cellSize;
            lineNode.setPosition(0, yPos, 0);
        }

        for (let i = 0; i < this.boardSize; i++) {
            const lineNode = instantiate(this.linePrefab);
            lineNode.name = `v_line_${i}`;
            const lineSprite = lineNode.getComponent(Sprite)!;
            lineSprite.color = new Color(92, 58, 33);
            lineNode.parent = this.boardNode;
            this.lineCount++;
            
            const lineUITrans = lineNode.getComponent(UITransform)!;
            lineUITrans.setContentSize(this.lineWidth, (this.boardSize - 1) * this.cellSize);
            const xPos = -halfSize + i * this.cellSize;
            lineNode.setPosition(xPos, 0, 0);
        }
    }
    // ===== 新增：触摸坐标转棋盘索引核心方法（抽离复用） =====
    /**
     * 将触摸的屏幕坐标转换为棋盘的x/y索引
     * @param event 触摸事件
     * @returns 棋盘坐标{x,y}，超出范围则返回null
     */
    private touchToBoardPos(event: EventTouch): WQ_Pos | null {
        const boardUITrans = this.boardNode.getComponent(UITransform)!;
        const touchWorldPos = event.getUILocation();
        let localPos = new Vec3();
        boardUITrans.convertToNodeSpaceAR(v3(touchWorldPos.x, touchWorldPos.y, 0), localPos);

        const halfSize = (this.boardSize - 1) * this.cellSize / 2;
        const x = Math.round((localPos.x + halfSize) / this.cellSize);
        const y = Math.round((halfSize - localPos.y) / this.cellSize);

        // 校验是否在棋盘范围内
        if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) {
            return null;
        }
        return new WQ_Pos(x,y);
    }

    // ===== 新增：触摸开始事件 =====
    private onBoardTouchStart(event: EventTouch) {
        this.updateSuspensionNode(event);
    }

    // ===== 新增：触摸移动事件（核心，实时更新悬浮节点） =====
    private onBoardTouchMove(event: EventTouch) {
        this.updateSuspensionNode(event);
    }

    // ===== 新增：触摸结束事件（落子逻辑，复用原有onBoardClick） =====
    private onBoardTouchEnd(event: EventTouch) {
        const boardPos = this.touchToBoardPos(event);
        // 销毁悬浮节点
        this.destroySuspensionNode();
        this.lastSuspensionPos = null;
        // 有合法棋盘坐标则执行落子
        if (boardPos) {
            this.onBoardClickReal(boardPos.x, boardPos.y);
        }
    }

    // ===== 新增：触摸取消事件（超出棋盘/离开屏幕，销毁悬浮节点） =====
    private onBoardTouchCancel() {
        this.destroySuspensionNode();
        this.lastSuspensionPos = null;
    }

    // ===== 新增：更新悬浮节点核心方法 =====
    private updateSuspensionNode(event: EventTouch) {
        // 合法性校验：游戏未结束+非AI思考+玩家回合+无超时
        const isPlayerTurn = this.gameMode === WQ_GameMode.AI 
            ? this.currentTurn === WQ_ChessType.BLACK 
            : true; // 人人对战双方都是玩家
        if (this.isGameOver || this.isAIThinking || !isPlayerTurn || this.isTimeout) {
            this.destroySuspensionNode();
            this.lastSuspensionPos = null;
            return;
        }

        const boardPos = this.touchToBoardPos(event);
        // 超出棋盘范围，销毁悬浮节点
        if (!boardPos) {
            this.destroySuspensionNode();
            this.lastSuspensionPos = null;
            return;
        }

        // 同一位置，无需重复创建
        if (this.lastSuspensionPos && this.lastSuspensionPos.x === boardPos.x && this.lastSuspensionPos.y === boardPos.y) {
            return;
        }

        // 校验该位置是否可落子（无棋子+非禁入点+非劫争）
        const violation = this.checkRule(boardPos.x, boardPos.y);
        if (violation) {
            this.destroySuspensionNode();
            this.lastSuspensionPos = null;
            return;
        }

        // 创建/更新悬浮节点
        this.createSuspensionNode(boardPos.x, boardPos.y);
        this.lastSuspensionPos = boardPos;
    }

    // ===== 新增：创建悬浮节点 =====
    private createSuspensionNode(x: number, y: number) {
        // 先销毁原有悬浮节点
        this.destroySuspensionNode();
        // 根据当前回合选择悬浮预制体
        const prefab = this.currentTurn === WQ_ChessType.BLACK 
            ? this.suspensionPrefabBlack 
            : this.suspensionPrefabWhite;
        if (!prefab) return;

        // 实例化悬浮节点
        this.suspensionNode = instantiate(prefab);
        this.suspensionNode.name = `suspension_${x}_${y}`;
        this.suspensionNode.parent = this.boardNode;
        this.suspensionNode.active = true;

        // 计算悬浮节点位置（与落子位置一致）
        const halfSize = (this.boardSize - 1) * this.cellSize / 2;
        const susX = -halfSize + x * this.cellSize;
        const susY = halfSize - y * this.cellSize;
        this.suspensionNode.setPosition(susX, susY, 0);

        // 缩放悬浮节点（与实际棋子一致）
        const chessUITrans = this.chessPrefab.getComponent(UITransform)!;
        const scale = this.cellSize / chessUITrans.contentSize.width;
        this.suspensionNode.setScale(scale, scale, 1);
    }

    // ===== 新增：销毁悬浮节点 =====
    private destroySuspensionNode() {
        if (this.suspensionNode && this.suspensionNode.isValid) {
            this.suspensionNode.destroy();
        }
        this.suspensionNode = null;
    }

    // ===== 修改：原有onBoardClick抽离为实际落子方法 =====
    private onBoardClickReal(x: number, y: number) {
        if (this.isGameOver || this.isAIThinking || (this.gameMode === WQ_GameMode.AI && this.currentTurn === WQ_ChessType.WHITE)) {
            return;
        }

        if(this.isTimeout || this.isAIThinking ){
            return;
        }

        console.log(`【落子调试】棋盘索引：(${x}, ${y})`);

        const violation = this.checkRule(x, y);
        if (violation) {
            this.infoLabel.string = `❌ ${violation}`;
            this.showTip(`${violation}`);
            this.addChessLog(`❌ [${x},${y}]：${violation}`);
            this.scheduleOnce(() => this.updateInfo(), 2);
            return;
        }

        this.doMove(x, y);
    }

    private checkRule(x: number, y: number): string {
        if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) {
            return "落子失败：超出棋盘边界";
        }
        if (this.board[x][y] !== WQ_ChessType.NONE) {
            return "落子失败：该位置已有棋子";
        }
        if (WQ_GoUtil.isForbidden(this.board, x, y, this.currentTurn)) {
            return "落子失败：禁入点（无气且无法提子）";
        }
        if (this.lastCapturePos && x === this.lastCapturePos.x && y === this.lastCapturePos.y) {
            return "规则3：不能马上落回被吃掉的位置，至少需要间隔一回合";
        }
        return "";
    }

    // 核心修改：重构doMove方法，确保提子完成后再启动AI思考
    private doMove(x: number, y: number) {
        // 核心修改：落子成功，重置连续Pass计数器（只要有落子，连续Pass状态中断）
        this.continuousPassCount = 0;

        const chessColor = this.currentTurn === WQ_ChessType.BLACK ? "黑棋" : "白棋";
        // 1. 落子
        this.board[x][y] = this.currentTurn;
          
        // 新增：落子时更新棋块信息
        WQ_GoUtil.updateBlockOnMove(this.board, x, y, this.currentTurn);

        // 2. 绘制棋子
        this.drawChess(x, y, this.currentTurn);
        WQ_AudioManager.getInstance().playSound("xiaqi");

        // 3. 执行提子（更新棋盘数据）
        this.lastCapturePos = WQ_GoUtil.captureStones(this.board, x, y);
        console.log("提子位置：", this.lastCapturePos);
        // 4. 立即移除被提的棋子（同步操作，确保视觉和数据一致）
        const captureCount = this.removeCapturedChess();
        
        // ===== 新增：统计并更新棋子数（提子完毕后立即执行）=====
        const { black, white } = this.countChessPieces();
        this.updateLblCount(black, white);
        // =======================================================



        // 新增：获取所有棋子的总连接信息
        const allChessLinks = WQ_GoUtil.getAllChessTotalLinks(this.board);
        console.log("所有棋子的总连接信息：", allChessLinks);
        allChessLinks.forEach((chessLinks, posKey) => {
            const chessNode = this.chessNodesMap.get(posKey);
            if (chessNode) {
                const chessComponent = chessNode.getComponent(WQ_Chess);
                if (chessComponent) {
                    chessComponent.setTotalLinks(this.chessNodesMap,this.board,chessLinks);
                }
            }
        });

        //更新表情
        let haveExpressionIds = [];
        let blockIds = [];
        //获取所有只剩一气的棋块及其可围杀的棋块列表
        const singleLinkBlocks = WQ_GoUtil.getKillableBlocks(this.board);
        console.log("所有只剩一气的棋块及其可围杀的棋块列表：", singleLinkBlocks);
        blockIds = Array.from(singleLinkBlocks.keys());
        singleLinkBlocks.forEach((blocks,key) => {
            haveExpressionIds.push(key);
            let targetBlockInfo = WQ_GoUtil.getBlockInfoById(key);

            targetBlockInfo.stones.forEach((pos) => {
                const posKey = `${pos.x},${pos.y}`;
                const chessNode = this.chessNodesMap.get(posKey);
                if (chessNode) {
                    const chessComponent = chessNode.getComponent(WQ_Chess);
                    if(chessComponent){
                        chessComponent.setExpression(targetBlockInfo.latestPos,WQ_ExpressionType.惊吓);
                    }
                }
            })

            blocks.forEach((blockid) => {
                if(blockIds.includes(blockid)){
                   return;
                }
                haveExpressionIds.push(blockid);
                const blockInfo = WQ_GoUtil.getBlockInfoById(blockid);
                const closestTargetPos = WQ_GoUtil.getNearestStoneInBlock(blockInfo.latestPos,key);
                const closestTargetPosKey = `${closestTargetPos.x},${closestTargetPos.y}`;
                const closestTargetNode = this.chessNodesMap.get(closestTargetPosKey);
                
                if(blockInfo){
                    blockInfo.stones.forEach((pos) => {
                        const posKey = `${pos.x},${pos.y}`;
                        const chessNode = this.chessNodesMap.get(posKey);
                        if (chessNode) {
                            const chessComponent = chessNode.getComponent(WQ_Chess);
                            if(chessComponent){
                                chessComponent.setExpression(blockInfo.latestPos,WQ_ExpressionType.严肃,closestTargetNode);
                            }
                        }
                    })
                }
            })
        });

        let allBlockIds = WQ_GoUtil.getAllBlockIds(true) as number[];
        allBlockIds.forEach((blockid) => {
            if(!haveExpressionIds.includes(blockid)){
                const blockInfo = WQ_GoUtil.getBlockInfoById(blockid);
                
                if(blockInfo){
                    blockInfo.stones.forEach((pos) => {
                        const posKey = `${pos.x},${pos.y}`;
                        const chessNode = this.chessNodesMap.get(posKey);
                        if (chessNode) {
                            const chessComponent = chessNode.getComponent(WQ_Chess);
                            if(chessComponent){
                                chessComponent.setExpression(blockInfo.latestPos,WQ_ExpressionType.笑脸);
                            }
                        }
                    })
                }
            }
        })

        // 记录日志
        let logMsg = `✅ ${chessColor}落子 [${x},${y}]`;
        if (captureCount > 0) {
            logMsg += ` | 提子${captureCount}颗`;
        }
        this.addChessLog(logMsg);
        this.logFullChessBoard();

        // 5. 切换回合（必须在提子完成后）
        this.currentTurn = this.currentTurn === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK;
        this.updatePassBtnVisible(); // 新增：落子后更新Pass/认输按钮显隐
        this.updateInfo();

        // 暂停下一回合等待动画
        this.isTimeout = true;
        this.scheduleOnce(() => {
            this.isTimeout = false;
            this.aiCallBack && this.aiCallBack();
            this.aiCallBack = null;
        }, 1);

        // 6. AI思考（关键：传入提子后的最新棋盘副本）
        if (this.gameMode === WQ_GameMode.AI && this.currentTurn === WQ_ChessType.WHITE && !this.isGameOver) {
            this.isAIThinking = true;
            this.updateInfo();
            
            // 关键修改：传入棋盘的深拷贝，确保AI拿到提子后的最新状态
            const latestBoard = WQ_GoUtil.copyBoard(this.board);
            const latestCapturePos = this.lastCapturePos;
            
            this.ai.getBestMove(
                latestBoard,  // 改用提子后的最新棋盘副本
                WQ_ChessType.WHITE, 
                latestCapturePos,
                (aiPos) => {
                    if (aiPos) {
                        // 确保AI落子前状态正确
                        this.isAIThinking = false;
                        if(!this.isTimeout){
                            this.doMove(aiPos.x, aiPos.y);
                            this.aiCallBack = null;
                        }
                        else{
                            this.aiCallBack = ()=>{
                                this.doMove(aiPos.x, aiPos.y);
                            }
                        }
                    } else {
                        // 核心修改：AI无合法落子，执行AIPass逻辑
                        this.onAIPass();
                    }
                }
            );
        } else {
            // 非AI回合，重置思考状态
            this.isAIThinking = false;
        }
    }

    aiDoMove(){
        
    }

    private drawChess(x: number, y: number, color: WQ_ChessType) {
        const chessNode = instantiate(this.chessPrefab);
        
        chessNode.name = `chess_${x}_${y}`;
        chessNode.parent = this.boardNode;
        chessNode.active = true;

        const chessSprite = chessNode.getComponent(Sprite)!;
        chessSprite.spriteFrame = color === WQ_ChessType.BLACK ? this.blackChessSF : this.whiteChessSF;
        chessSprite.type = Sprite.Type.SLICED;

        const chessSize = this.cellSize;
        const chessUITrans = chessNode.getComponent(UITransform)!;
        let scale = chessSize/chessUITrans.contentSize.width;
        chessNode.setScale(scale, scale, 1);

        const halfSize = (this.boardSize - 1) * this.cellSize / 2;
        const chessX = -halfSize + x * this.cellSize;
        const chessY = halfSize - y * this.cellSize;
        chessNode.setPosition(chessX, chessY, 0);

        chessNode.getComponent(WQ_Chess).init(new WQ_Pos(x, y),color);

        const key = `${x},${y}`;
        this.chessNodesMap.set(key, chessNode);
    }

    // 优化：确保同步移除被提棋子，无异步延迟
    private removeCapturedChess(): number {
        let captureCount = 0;
        const keysToDelete: string[] = [];
        
        // 先收集所有需要删除的棋子
        this.chessNodesMap.forEach((node, key) => {
            const [xStr, yStr] = key.split(',');
            const x = parseInt(xStr);
            const y = parseInt(yStr);
            
            if (this.board[x][y] === WQ_ChessType.NONE) {
                keysToDelete.push(key);
                captureCount++;
            }
        });

        // 批量删除节点和映射（同步操作）
        keysToDelete.forEach(key => {
            const node = this.chessNodesMap.get(key);
            if (node && node.isValid) {
                node.setSiblingIndex(this.lineCount);
                node.getComponent(WQ_Chess).destoryChess();
            }
            this.chessNodesMap.delete(key);
        });
        
        return captureCount;
    }

    private updateInfo() {
        if (this.isGameOver) {
            return; // 游戏结束后不在此更新，由gameOver方法统一处理
        }
        const modeText = this.gameMode === WQ_GameMode.HUMAN ? '人人对战' : '人机对战';
        const turnText = this.isAIThinking 
            ? 'AI思考中 (白)' 
            : (this.currentTurn === WQ_ChessType.BLACK ? '黑方落子' : '白方落子');
        const roleText = this.gameMode === WQ_GameMode.AI 
            ? (this.currentTurn === WQ_ChessType.BLACK ? '(玩家)' : '(AI)') 
            : '';

        this.infoLabel.string = `当前：${this.boardSize}×${this.boardSize}交叉线 | ${modeText} | ${turnText} ${roleText}`;
    }

    private clearChessLog() {
        if (this.chessLogLabel) {
            this.chessLogLabel.string = "📜 棋局日志：\n";
        }
        console.log("===== 新棋局开始 =====");
    }

    private addChessLog(msg: string) {
        const timeStr = new Date().toLocaleTimeString();
        const logLine = `[${timeStr}] ${msg}`;
        
        console.log(logLine);
        
        if (this.chessLogLabel) {
            this.chessLogLabel.string += `${logLine}\n`;
            const lines = this.chessLogLabel.string.split('\n');
            if (lines.length > 20) {
                this.chessLogLabel.string = lines.slice(0, 1).concat(lines.slice(-19)).join('\n');
            }
        }
    }

    private logFullChessBoard() {
        console.log("===== 当前棋局 =====");
        let boardStr = "   ";
        for (let x = 0; x < this.boardSize; x++) {
            boardStr += `${x.toString().padStart(2)} `;
        }
        boardStr += '\n';

        for (let y = 0; y < this.boardSize; y++) {
            boardStr += `${y.toString().padStart(2)} `;
            for (let x = 0; x < this.boardSize; x++) {
                const chess = this.board[x][y];
                if (chess === WQ_ChessType.BLACK) {
                    boardStr += "●  ";
                } else if (chess === WQ_ChessType.WHITE) {
                    boardStr += "○  ";
                } else {
                    boardStr += "·  ";
                }
            }
            boardStr += '\n';
        }
        console.log(boardStr);
    }


    // ===== 新增：统计棋盘上黑白双方的棋子数量 =====
    /**
     * 统计当前棋盘上黑白双方的棋子数量
     * @returns {black: number, white: number} 黑白棋子数
     */
    private countChessPieces(): { black: number, white: number } {
        let blackCount = 0;
        let whiteCount = 0;
        // 遍历整个棋盘统计棋子数
        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                if (this.board[x][y] === WQ_ChessType.BLACK) {
                    blackCount++;
                } else if (this.board[x][y] === WQ_ChessType.WHITE) {
                    whiteCount++;
                }
            }
        }
        return { black: blackCount, white: whiteCount };
    }

    // 核心修改：完善gameOver方法，支持认输场景的结算（新增giveUpColor参数）
    /**
     * 游戏结束核心方法
     * @param giveUpColor 可选，认输方颜色，不传则为连续Pass结束
     */
    private gameOver(giveUpColor?: WQ_ChessType){
        console.log(giveUpColor ? `【游戏结束】${giveUpColor === WQ_ChessType.BLACK ? '黑方' : '白方'}认输，触发游戏结束判定` : "【游戏结束】双方连续Pass，触发游戏结束判定");
        this.isGameOver = true;
        this.isAIThinking = false;
        this.updatePassBtnVisible(); // 隐藏所有Pass/认输按钮
        this.addChessLog(giveUpColor ? `🎮 游戏结束！${giveUpColor === WQ_ChessType.BLACK ? '黑方' : '白方'}认输` : "🎮 游戏结束！双方连续选择Pass，本局棋局终止");
        
        // 1. 统计双方棋子数量
        const { black, white } = this.countChessPieces();
        // 2. 判定胜负（认输场景直接判定认输方负，否则按棋子数判定）
        let winner = "";
        let winnerDesc = "";
        if (giveUpColor) {
            // 认输场景：直接判定对方胜利
            winner = giveUpColor === WQ_ChessType.BLACK ? "白方胜" : "黑方胜";
            winnerDesc = giveUpColor === WQ_ChessType.BLACK 
                ? (this.gameMode === WQ_GameMode.AI ? "白方(AI)胜（黑方玩家认输）" : "白方胜（黑方认输）")
                : (this.gameMode === WQ_GameMode.AI ? "黑方(玩家)胜（白方AI无此场景）" : "黑方胜（白方认输）");
        } else {
            // 连续Pass场景：按棋子数判定
            if (black > white) {
                winner = "黑方胜";
            } else if (white > black) {
                winner = "白方胜";
            } else {
                winner = "双方平局"; // 扩展平局逻辑
            }
            winnerDesc = winner;
        }
        // 3. 构造游戏结束信息
        const gameOverInfo = `🎮 游戏结束 | ${this.boardSize}×${this.boardSize} | 黑棋：${black}颗 | 白棋：${white}颗 | ✨ ${winnerDesc} ✨`;
        // 4. 更新信息标签（主界面展示）
        this.infoLabel.string = gameOverInfo;
        // this.showTip(gameOverInfo);
        // 5. 添加到棋局日志（带时间戳）
        this.addChessLog(`🎯 棋局终止：${winnerDesc}（黑${black} - 白${white}）`);

        // this.scheduleOnce(()=>{
             this.gameOverPanel.getChildByName("winner").children.forEach((node)=>{
                node.active = false;
            })
            if(winner === "双方平局"){
                this.gameOverPanel.getChildByName("winner").children[0].active = true;
            }else if(winner === "黑方胜"){
                this.gameOverPanel.getChildByName("winner").children[1].active = true;
            }else if(winner === "白方胜"){
                this.gameOverPanel.getChildByName("winner").children[2].active = true;
            }
            this.gameOverPanel.active = true;

            ProjectEventManager.emit(ProjectEvent.游戏结束, "围棋");    
            this.gameOverPanel.setScale(v3(0,0,0));
            tween(this.gameOverPanel)
                .to(0.3, { scale: v3(1,1,1) })
                .start();
        // }, 2);
       
    }




    showTip(msg: string){
        let tipNode = instantiate(this.tipPrefab);
        tipNode.parent = this.tipContainer;
        tipNode.setPosition(v3(0,0,0));
        let tipLabel = tipNode.getChildByName("lblTip").getComponent(Label);
        tipLabel.string = msg;
        tipNode.active = true;
        tween(tipNode)
            .delay(1)
            .to(0.5, { position: v3(0,300,1) })
            .call(()=>{
                tipNode.destroy();
            })
            .start();

        tipNode.getComponent(UIOpacity).opacity = 255;
         tween(tipNode.getComponent(UIOpacity))
            .delay(1)
            .to(0.5, { opacity: 0 })
            .start();
    }




    
    
    OnButtonClick(event: Event) {
        let nodeBoards = null;
        let pos0 = null;
        let pos1 = null;
        switch (event.target.name) {
            case "btnBackToMain":
                UIManager.ShowPanel(Panel.ReturnPanel);
                break;
            case "btnBackToStart":
                ProjectEventManager.emit(ProjectEvent.弹出窗口, "围棋");
                this.gameOverPanel.active = false;
                this.selectedBoardPanel.active = false;
                this.rulePanel.active = false;
                this.startPanel.active = true;
                break;
            case "btnBackToStart":
                this.startPanel.active = true;
                break;
            case "btnRule":
                ProjectEventManager.emit(ProjectEvent.弹出窗口, "围棋");
                this.rulePanel.active = true;
                this.rulePanel.setScale(v3(0,0,0));
                tween(this.rulePanel)
                    .to(0.3, { scale: v3(1,1,1) })
                    .start();
                break;

            case "btnCloseRule":
                this.rulePanel.setScale(v3(1,1,1));
                tween(this.rulePanel)
                    .to(0.3, { scale: v3(0,0,0) })
                    .start();
                break;
            case "btnHuman":
                ProjectEventManager.emit(ProjectEvent.弹出窗口, "围棋");
                this.switchMode(WQ_GameMode.HUMAN);
                this.selectedBoardPanel.active = true;
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                pos0 = this.selectedBoardPanel.getChildByName("pos_0").worldPosition;
                pos1 = this.selectedBoardPanel.getChildByName("pos_1").worldPosition;
                nodeBoards.setWorldPosition(pos0);
                nodeBoards.children.forEach((node) => {
                    if(node.name === "5x5"){
                        node.getChildByName("selected").active = true;
                        return;
                    }
                    if(node.getChildByName("selected")){
                        node.getChildByName("selected").active = false;
                    }
                });
                this.selectedBoardPanel.getChildByName("btnSelectedBoard").getComponentInChildren(Label).string = "棋盘    5x5";
                this.initGame(5);
                this.currentBoardSize = 5;
                this.startPanel.active = false;
                break;
            case "btnAI":
                ProjectEventManager.emit(ProjectEvent.弹出窗口, "围棋");
                this.switchMode(WQ_GameMode.AI);
                this.selectedBoardPanel.active = true;
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                pos0 = this.selectedBoardPanel.getChildByName("pos_0").worldPosition;
                pos1 = this.selectedBoardPanel.getChildByName("pos_1").worldPosition;
                nodeBoards.setWorldPosition(pos0);
                nodeBoards.children.forEach((node) => {
                    if(node.name === "5x5"){
                        node.getChildByName("selected").active = true;
                        return;
                    }
                    if(node.getChildByName("selected")){
                        node.getChildByName("selected").active = false;
                    }
                });
                this.selectedBoardPanel.getChildByName("btnSelectedBoard").getComponentInChildren(Label).string = "棋盘    5x5";
                this.initGame(5);
                this.currentBoardSize = 5;
                this.startPanel.active = false;
                break;
            case "btnSelectedBoard":
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                pos0 = this.selectedBoardPanel.getChildByName("pos_0").worldPosition;
                pos1 = this.selectedBoardPanel.getChildByName("pos_1").worldPosition;
                nodeBoards.setWorldPosition(pos0);
                tween(nodeBoards)
                    .to(0.3, { worldPosition: pos1 })
                    .start()
                this.selectedBoardPanel.getChildByName("btnArrowDown") .active = false;
                break;
            case "btnArrowDown":
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                pos0 = this.selectedBoardPanel.getChildByName("pos_0").worldPosition;
                pos1 = this.selectedBoardPanel.getChildByName("pos_1").worldPosition;
                nodeBoards.setWorldPosition(pos0);
                tween(nodeBoards)
                    .to(0.3, { worldPosition: pos1 })
                    .start()
                this.selectedBoardPanel.getChildByName("btnArrowDown") .active = false;
                break;
            case "btnArrowUp":
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                pos0 = this.selectedBoardPanel.getChildByName("pos_0").worldPosition;
                pos1 = this.selectedBoardPanel.getChildByName("pos_1").worldPosition;
                nodeBoards.setWorldPosition(pos1);
                tween(nodeBoards)
                    .to(0.3, { worldPosition: pos0 })
                    .call(() => {
                        this.selectedBoardPanel.getChildByName("btnArrowDown") .active = true;
                    })
                    .start()
                break;
            case "5x5":
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                nodeBoards.children.forEach((node) => {
                    if(node.name === "5x5"){
                        node.getChildByName("selected").active = true;
                        return;
                    }
                    if(node.getChildByName("selected")){
                        node.getChildByName("selected").active = false;
                    }
                });
                this.selectedBoardPanel.getChildByName("btnSelectedBoard").getComponentInChildren(Label).string = "棋盘    5x5";
                this.initGame(5);
                this.currentBoardSize = 5;
                break;
            case "6x6":
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                nodeBoards.children.forEach((node) => {
                    if(node.name === "6x6"){
                        node.getChildByName("selected").active = true;
                        return;
                    }
                    if(node.getChildByName("selected")){
                        node.getChildByName("selected").active = false;
                    }
                });
                this.selectedBoardPanel.getChildByName("btnSelectedBoard").getComponentInChildren(Label).string = "棋盘    6x6";
                this.initGame(6);
                this.currentBoardSize = 6;
                break;
            case "7x7":
                                    nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                nodeBoards.children.forEach((node) => {
                    if(node.name === "7x7"){
                        node.getChildByName("selected").active = true;
                        return;
                    }
                    if(node.getChildByName("selected")){
                        node.getChildByName("selected").active = false;
                    }
                });
                this.selectedBoardPanel.getChildByName("btnSelectedBoard").getComponentInChildren(Label).string = "棋盘    7x7";
                this.initGame(7);
                this.currentBoardSize = 7;
                break;
            case "8x8":
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                nodeBoards.children.forEach((node) => {
                    if(node.name === "8x8"){
                        node.getChildByName("selected").active = true;
                        return;
                    }
                    if(node.getChildByName("selected")){
                        node.getChildByName("selected").active = false;
                    }
                });
                this.selectedBoardPanel.getChildByName("btnSelectedBoard").getComponentInChildren(Label).string = "棋盘    8x8";
                this.initGame(8);
                this.currentBoardSize = 8;
                break;
            case "9x9":
                nodeBoards = this.selectedBoardPanel.getChildByName("Mask").getChildByName("boards");
                nodeBoards.children.forEach((node) => {
                    if(node.name === "9x9"){
                        node.getChildByName("selected").active = true;
                        return;
                    }
                    if(node.getChildByName("selected")){
                        node.getChildByName("selected").active = false;
                    }
                });
                this.selectedBoardPanel.getChildByName("btnSelectedBoard").getComponentInChildren(Label).string = "棋盘    9x9";
                this.initGame(9);
                this.currentBoardSize = 9;
                break;
            case "btnStartGame":
                this.selectedBoardPanel.active = false;
                ProjectEventManager.emit(ProjectEvent.游戏开始, "围棋");
                break;
            case "btnAngin":
                this.gameOverPanel.active = false;
                this.initGame(this.currentBoardSize);
                break;
        }
    }
    















    // 新增：组件销毁时清理悬浮节点，防止内存泄漏
    onDestroy() {
        this.destroySuspensionNode();
    }
}