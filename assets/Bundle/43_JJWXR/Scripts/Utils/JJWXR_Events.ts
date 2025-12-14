// interface UseData {
//     level: number;
//     energy: number;
//     money: number;
// }
// // 导出UseData
// export type { UseData };

export class JJWXR_Events {
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // menu
    public static SHOW_ADD_ENERGY_UI: string = 'showAddEnergyUI';// 显示加能量界面
    public static HIDE_ADD_ENERGY_UI: string = 'hideAddEnergyUI';// 隐藏加能量界面
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // armory
    public static UPDATE_MONEY: string = 'updateMoney'; // 装备更新
    public static UPDATE_BUTTON_STATE: string = 'updateButtonState'; // 更新按钮状态

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // MenuCountdownTime
    public static STOP_COUNTDOWN: string = 'stopCountdown'; //倒计时时间
    public static ENERGY_FULL: string = 'energyFull'; //能量满
    public static ENERGY_NOT_FULL: string = 'energyNotFull'; //能量不满

    // GameCountdownTime
    public static GAME_START: string = 'gameStart'; //游戏开始
    public static GAME_STOP: string = 'gameStop'; //游戏暂停
    public static GAME_RESUME: string = 'gameStart'; //游戏开始
    public static GAME_OVER: string = 'gameOver'; //游戏结束
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // energy
    public static GET_ENERGYNUM: string = 'getEnergyNum'; //获取能量数量
    public static UPDATE_ENERGY: string = 'updateEnergy'; //更新能量
    public static GET_ENERGY: string = 'getEnergy'; //获取能量
    public static GET_MORE_ENERGY: string = 'getMoreEnergy'; //获取更多能量
    public static USE_ENERGY: string = 'useEnergy'; //使用能量

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // money
    public static GET_MORE_REWARD_SCENE: string = 'getMoreRewardScene'; //获取更多奖励场景
    public static GET_SUCCEED_MONEY: string = 'getSucceedMoney'; //获取成功金币
    public static GET_MORE_MONEY: string = 'getMoreMoney'; //获取更多金币
    public static SUB_MONEY: string = 'subMoney'; //扣除金币

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // GameManager
    public static LOAD_MENU_SCENE: string = 'loadMenuScene'; //加载菜单场景
    public static RESTART_GAME: string = 'restartGame'; //重新开始游戏

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // player
    public static ON_TOUCH_EVENT_START: string = 'onTouchEventStart'; //触摸事件开始
    public static ON_TOUCH_EVENT_END: string = 'onTouchEventEnd'; //触摸事件结束
    public static CHANGE_CAMERA_FOV: string = 'changeCameraFov';    //改变相机视角
    public static CHANGE_CAMERA_FOV_BACK: string = 'changeCameraFovBack';// 改变相机视角返回
    public static CHANGE_CAMERA_FOV_SPEED: string = 'changeCameraFovSpeed';// 改变相机视角速度
    public static CHANGE_CAMERA_FOV_SPEED_BACK: string = 'changeCameraFovSpeedBack';// 改变相机视角速度返回
    public static SAVE_CAMERA_ROTATION: string = 'keepCameraRotation';  // 保存相机旋转
    public static ON_FIRE: string = 'onFire';    // 开火

    public static GUN_FIRED: string = 'gunFired'; //枪发射

    public static ON_SPAWN_RING: string = 'onSpawnRing'; //生成光环
    public static ON_REMOVE_RING: string = 'onRemoveRing'; //移除光环
    public static LOOKAT_TARGET_POSITION: string = 'lookAtTargetPosition'; //看向目标位置

    public static MOVE_TO_ORIGIN_POSITION: string = 'moveToOriginPosition'; //移动到原点位置
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // battleUI
    public static ONTOUCHSTART_BATTLEUI: string = 'onTouchStartBattleUI'; //点击战斗UI
    public static ONTOUCHMOVE_BATTLEUI: string = 'onTouchMoveBattleUI'; //移动战斗UI
    public static ONTOUCHEND_BATTLEUI: string = 'onTouchEndBattleUI'; //结束战斗UI

    public static SHOWPRECISEHIT: string = 'showPreciseHit'; //显示精准打击

    public static ON_RETURN_BATTLEUI: string = 'onReturnBattleUI'; //返回战斗UI

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // bullet
    public static SET_BULLET_DIRECTION: string = 'setBulletDirection'; //设置子弹方向
    public static BULLET_HIT: string = 'bulletHit'; //子弹击中

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // gun
    public static GUN_RELOAD: string = 'gunReload'; //枪重新装弹
    public static GUN_CHANGE: string = 'gunChange'; //枪更换
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // enemy
    public static ENEMY_DESTROY: string = 'enemyDestroy'; //敌人死亡
    public static ENEMY_REDUSE: string = 'enemyReduse'; //敌人受伤
    public static ENEMY_WORLDPOSITION: string = 'enemyWorldPosition'; //敌人世界坐标
    public static ENEMY_PICTURE: string = 'enemyPicture'; //敌人图片

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // GameUI
    public static HIDE_ENEMY_UI: string = 'hideEnemyUI'; //隐藏敌人UI
    public static HIDE_RETICLE_UI: string = 'showReticleUI'; //显示准星UI

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // UIManager
    public static SHOW_GAME_UI: string = 'showGameUI'; //显示游戏UI
    public static HIDE_GAME_UI: string = 'hideGameUI'; //隐藏游戏UI
    public static SHOW_BATTLE_UI: string = 'showBattleUI'; //显示战斗UI
    public static HIDE_BATTLE_UI: string = 'hideBattleUI'; //隐藏战斗UI
    public static SHOW_SUCCEED_UI: string = 'showSucceedUI'; //显示成功UI
    public static SHOW_FAILED_UI: string = 'showFailedUI'; //显示失败UI
    public static SHOW_ENCOURAGE_UI: string = 'showEncourageUI'; //显示鼓励UI

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // SucceedUI
    public static UPDATE_SUCCEED_UI: string = 'updateSucceedUI'; //显示成功UI

    public static STOP_MOVE_BAR: string = 'stopMoveBar'; //停止移动进度条

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // FailedUI
    public static SHOW_WARNING_UI: string = 'showWarningUI'; //显示警告UI
}