import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum YSMNQ_ItemType {
    //将以下实值转成英文
    碰撞型 = "collision",
    透视型 = "perspective",
    擦除型 = "erase",
    涂抹型 = "smudge",
    长按消失型 = "longPressDisappear",
    长按浮现型 = "longPressAppear",
    长按放大型 = "longPressExpand",
    长按缩小型 = "longPressShrink",
    显示选项面板型 = "showOptionsPanel",
    创建二级操作面板型 = "createSecondaryOperationPanel",
}


