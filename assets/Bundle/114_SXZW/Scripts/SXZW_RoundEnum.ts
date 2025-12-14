import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum SXZW_RoundEnum {
    None,
    PlayerChoose, // 玩家选择武器
    Player, // 玩家操控
    PlayerFinish, // 玩家结束操控
    WaitPlayerRoundEnd, //等待玩家回合结束
    Enemy,
    EnemyFinish,
    WaitEnemyRoundEnd,
}


