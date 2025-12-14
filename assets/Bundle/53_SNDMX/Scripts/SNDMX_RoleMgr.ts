import { _decorator, AnimationClip, AudioClip, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoleMgr')
export class RoleMgr extends Component {
    //木棍人动画：1.踢门 2.静止 3 走动  4.挥棍
    //忍者动画：1.静止  2 被踹飞  3 挥刀
    //女主：1 静止
    @property([AnimationClip])
    private AnimationGroup: AnimationClip[] = [];

    //根据不同的音频播放不同的动画



}


