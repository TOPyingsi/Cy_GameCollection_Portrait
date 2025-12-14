import { _decorator, Component, Label, math, Node, PageView, ScrollView, Sprite, SpriteFrame, UITransform } from 'cc';
import { ZHSHJ_GameNode } from './ZHSHJ_GameNode';
import { ZHSHJ_GameManager } from './ZHSHJ_GameManager';
import { WIDGET } from '../../../../extensions/plugin-import-2x/creator/components/Widget';
const { ccclass, property } = _decorator;

@ccclass('ZHSHJ_TouchMonitor')
export class ZHSHJ_TouchMonitor extends Component {

    @property({ type: [SpriteFrame] })
    prpoSpriteFrame: SpriteFrame[] = [];

    private _propNodes: Node[] = Array<Node>();
    private _propsTs: ZHSHJ_GameNode[] = Array<ZHSHJ_GameNode>();

    private _propNames: Label[] = [];
    private _propNameStr: string[] = [
        "木棍",
        "运动鞋",
        "轰炸机",
        "树",
        "仙人掌",
        "鱼",
        "香蕉",
        "土星",
        "轮胎",
        "飞机"
    ]

    start() {
        let propsView = ZHSHJ_GameManager.Instance.propsView;
        let content = propsView.content;
        for (let i = 0; i < content.children.length; i++) {
            //获取道具节点
            let propNode = content.children[i].children[0];
            //为节点添加脚本组件
            let propTs = propNode.addComponent(ZHSHJ_GameNode);
            this._propsTs.push(propTs);
            this._propNodes.push(propNode);

            //获取道具名字节点
            let propNameNode = content.children[i].children[1];
            let label = propNameNode.getComponent(Label);
            this._propNames.push(label);
        }
        this._initPropId();
    }

    update(deltaTime: number) {

    }

    _initPropId() {
        let propSpriteArr: SpriteFrame[] = Array.from(this.prpoSpriteFrame);

        for (let i = 0; propSpriteArr.length > 0; i++) {
            //打乱道具顺序
            let ramdomIndex = math.randomRangeInt(0, propSpriteArr.length);
            //设置道具精灵帧图片
            let sprite = this._propNodes[i].getComponentInChildren(Sprite);
            let spriteFrame = propSpriteArr[ramdomIndex];
            let width = spriteFrame.width;
            let height = spriteFrame.height;
            let spriteUITransform = sprite.getComponent(UITransform);
            spriteUITransform.width = width;
            spriteUITransform.height = height;
            sprite.spriteFrame = spriteFrame;

            //设置道具id和名称
            let id = this.prpoSpriteFrame.indexOf(spriteFrame);
            this._propsTs[i].PropId = id;
            this._propNames[i].string = this._propNameStr[id];
            ZHSHJ_GameManager.Instance.changeTsArr[i].targetID = i;

            propSpriteArr.splice(ramdomIndex, 1);
            //console.log("第" + i + "个的道具索引是" + id);
        }
    }
}

