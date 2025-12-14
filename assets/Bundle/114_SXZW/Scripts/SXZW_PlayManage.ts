import { _decorator, Camera, Collider, Component, director, instantiate, isValid, Label, math, Node, NodeEventType, ParticleSystem, PhysicsSystem, Prefab, Quat, randomRange, randomRangeInt, Sprite, sys, tween, Vec2, Vec3 } from 'cc';
import { SXZW_ChooseOpponent } from './SXZW_ChooseOpponent';
import { SXZW_WeaponsManage } from './SXZW_WeaponsManage';
import { SXZW_WaponsItem } from './SXZW_WaponsItem';
import { SXZW_WeaponPrefab } from './SXZW_WeaponPrefab';
import { SXZW_RoundEnum } from './SXZW_RoundEnum';
import { SXZW_LevelSetting } from './SXZW_LevelSetting';
import { SXZW_RoleControl } from './SXZW_RoleControl';
import { SXZW_PlayerControl } from './SXZW_PlayerControl';
import { SXZW_AiControl } from './SXZW_AiControl';
import { SXZW_ThrowManage } from './SXZW_ThrowManage';
import { SXZW_BlastSeek } from './SXZW_BlastSeek';
import { SXZW_NewWeapon } from './SXZW_NewWeapon';
import { SXZW_Victory } from './SXZW_Victory';
import { SXZW_AudioManage } from './SXZW_AudioManage';
import { SXZW_GameManage } from './SXZW_GameManage';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('SXZW_PlayManage')
export class SXZW_PlayManage extends Component {

    private static _instance: SXZW_PlayManage;

    public static get Instance() {
        return this._instance
    }

    @property(Camera)
    camera: Camera = null

    @property(SXZW_ChooseOpponent)
    chooseOpponent: SXZW_ChooseOpponent = null

    @property(Node)
    chooseWeapons: Node

    @property(Node)
    vs: Node

    @property(Sprite)
    chooseSprite_1: Sprite
    @property(Sprite)
    chooseSprite_2: Sprite
    @property(Sprite)
    chooseSprite_3: Sprite

    @property({ type: SXZW_LevelSetting }) // 关卡节点列表
    levels: SXZW_LevelSetting[] = []

    @property({ type: Prefab }) //角色列表
    rolePrefabList: Prefab[] = []

    @property({ type: Prefab })
    aiPrefab: Prefab = null

    @property({ type: Sprite, group: "vs" })
    playerImageSprite: Sprite = null
    @property({ type: Sprite, group: "vs" })
    aiImageSprite: Sprite = null
    @property({ type: Sprite, group: "vs" })
    playerBloodSprite: Sprite = null
    @property({ type: Sprite, group: "vs" })
    aiBloodSprite: Sprite = null
    @property({ type: Label, group: "vs" })
    playerNameLabel: Label = null
    @property({ type: Label, group: "vs" })
    aiNameLabel: Label = null

    @property(Prefab)
    bloodPrefab: Prefab
    @property(Prefab)
    blastPrefab: Prefab
    @property(Prefab)
    hurtTextPrefab: Prefab

    @property(SXZW_ThrowManage)
    throwManage: SXZW_ThrowManage = null
    @property(SXZW_NewWeapon)
    newWeapons: SXZW_NewWeapon

    @property(SXZW_Victory)
    victorView: SXZW_Victory = null;
    @property(Node)
    FailureView: Node = null;

    firstFinishLevel: boolean = false;

    private waitChooseOpponent = false;

    // 当前随机选择的武器
    private weapon_1: SXZW_WaponsItem
    private weapon_2: SXZW_WaponsItem
    private weapon_3: SXZW_WaponsItem

    public playerChooseWeapon: SXZW_WeaponPrefab = null


    private cameraOriginalPos: Vec3 = null;
    private chooseOriginalPos: Vec3 = null;

    public round: SXZW_RoundEnum = SXZW_RoundEnum.None

    private currentLevelIndex: number = 0;
    private _currentLevel: SXZW_LevelSetting
    public get currentLevel(): SXZW_LevelSetting {
        return this._currentLevel
    }
    public get getCurrentLevelIndex(): number {
        return this.currentLevelIndex;
    }

    public currentPlayer: SXZW_PlayerControl = null;
    public currentAi: SXZW_AiControl = null;

    private waitRoundTime = 0

    public set setWaitRoundTime(t: number) {
        if (t < this.waitRoundTime) this.waitRoundTime = t;
    }

    private useBlastSeek: SXZW_BlastSeek[] = []
    private useHurtTextParticles: Label[] = []
    private playing = false;

    public get getBloodParticle() {

        for (let index = 0; index < this.currentLevel.useBloodParticles.length; index++) {
            const element = this.currentLevel.useBloodParticles[index];
            if (!element.isPlaying && element.getParticleCount() === 0) {
                return element;
            }
        }

        const node = instantiate(this.bloodPrefab)
        node.setParent(this.currentLevel.node, true)
        const ps = node.getComponent(ParticleSystem)
        this.currentLevel.useBloodParticles.push(ps)
        return ps;
    }

    public get getBlastSeek() {
        for (let index = 0; index < this.useBlastSeek.length; index++) {
            const element = this.useBlastSeek[index];
            if (!element.enabled || !element.node.active) {
                element.enabled = true;
                element.node.active = true;
                return element;
            }
        }
        const node = instantiate(this.blastPrefab)
        node.setParent(this.currentLevel.node.parent, true)
        const bs = node.getComponent(SXZW_BlastSeek)
        this.useBlastSeek.push(bs)
        return bs;
    }

    public get getHurtTextLabel() {
        for (let index = 0; index < this.useHurtTextParticles.length; index++) {
            const element = this.useHurtTextParticles[index];
            if (element.node.scale.x === 0 || !element.node.active) {
                element.node.active = true;
                return element;
            }
        }
        const node = instantiate(this.hurtTextPrefab)
        node.setParent(this.currentLevel.node.parent, true)
        const la = node.getComponentInChildren(Label)
        this.useHurtTextParticles.push(la)
        return la;
    }

    onLoad() {
        SXZW_PlayManage._instance = this;
        PhysicsSystem.instance.gravity = new Vec3(0, -70, 0);

        this.node.active = false;
    }

    protected onEnable(): void {
        this.victorView.node.active = false;
        this.FailureView.active = false;
        this.newWeapons.node.active = false;

        SXZW_AudioManage.Instance.playGameMusic();
        this.round = SXZW_RoundEnum.None

        this.playing = true;
        // 选择器触摸
        this.chooseSprite_1.node.parent.on(NodeEventType.TOUCH_END, this.onChooseClick1, this)
        this.chooseSprite_2.node.parent.on(NodeEventType.TOUCH_END, this.onChooseClick2, this)
        this.chooseSprite_3.node.parent.on(NodeEventType.TOUCH_END, this.onChooseClick3, this)

        this.showLevel();

        this.chooseWeapons.active = false;

        if (!this.cameraOriginalPos) {
            this.cameraOriginalPos = this.camera.node.position.clone()
        }
        if (!this.chooseOriginalPos) {
            this.chooseOriginalPos = this.chooseWeapons.position.clone()
        }
        const targetWorldPos = Vec3.add(new Vec3, this.getCollider3DCenterWorldPos(this.currentPlayer.getComponent(Collider)), new Vec3(0, 0, 60))
        this.camera.node.position = this.camera.node.parent.inverseTransformPoint(new Vec3, targetWorldPos);
        this.chooseWeapons.active = false;
        this.vs.active = false;
        this.chooseOpponent.node.active = true;
        tween(this.camera.node).delay(0.5).to(math.randomRange(0.5, 2), { position: this.cameraOriginalPos.clone() }).call(() => {
            this.chooseOpponent.stop();
            this.waitChooseOpponent = true;
        }).start();
        this.chooseWeapon();
    }

    shakeCameraTween(duration = 0.3, magnitude = 2) {
        const originalPos = this.camera.node.position.clone();
        const shakeTimes = 50;
        const interval = duration / shakeTimes;
        let sequence = tween(this.camera.node);

        for (let i = 0; i < shakeTimes; i++) {
            const offset = new Vec3(
                (Math.random() * 2 - 1) * magnitude,
                (Math.random() * 2 - 1) * magnitude,
                0
            );
            sequence = sequence
                .to(interval, { position: originalPos.clone().add(offset) })
                .to(interval, { position: originalPos });
        }

        sequence.start();
    }

    update(deltaTime: number) {
        if (!this.playing) {

            return;
        }
        if (this.waitChooseOpponent && this.chooseOpponent.isStop) {
            this.waitChooseOpponent = false;
            tween(this).delay(0.5).call(() => {
                this.chooseOpponentFinish()
            }).start()
            this.currentAi.role.setColor(this.chooseOpponent.currentColor)
            this.aiImageSprite.spriteFrame = this.chooseOpponent.currentSpriteFrame
            this.currentAi.node.active = true;

            this.aiNameLabel.string = this.chooseOpponent.currentName;
            this.currentAi.aiWisdom = this.chooseOpponent.currentRating;
        } else if (this.currentPlayer.role.isDie) {
            this.gameEnd(this.currentAi.role)
        } else if (this.currentAi.role.isDie) {
            this.gameEnd(this.currentPlayer.role)
        } else {
            switch (this.round) {
                case SXZW_RoundEnum.PlayerFinish: {
                    this.round = SXZW_RoundEnum.WaitPlayerRoundEnd
                    this.waitRoundTime = 7;
                    break
                }
                case SXZW_RoundEnum.WaitPlayerRoundEnd: {
                    if (this.waitRoundTime > 0) {
                        this.waitRoundTime -= deltaTime;
                    } else {
                        this.round = SXZW_RoundEnum.Enemy
                    }
                    break
                }
                case SXZW_RoundEnum.EnemyFinish: {
                    this.round = SXZW_RoundEnum.WaitEnemyRoundEnd
                    this.waitRoundTime = 7;
                    break
                }
                case SXZW_RoundEnum.WaitEnemyRoundEnd: {
                    if (this.waitRoundTime > 0) {
                        this.waitRoundTime -= deltaTime;
                    } else if (!this.currentPlayer.role.animPlaying) {
                        this.chooseWeapon();
                        this.showChooseWeapon()
                    }
                    break
                }
            }
        }
    }

    // 游戏结束
    private gameEnd(role: SXZW_RoleControl) {
        this.playing = false;
        role.victory();
        let targetWorldPos = Vec3.add(new Vec3, this.getCollider3DCenterWorldPos(role.getComponent(Collider)), new Vec3(0, 0, 60))
        targetWorldPos = this.camera.node.parent.inverseTransformPoint(new Vec3, targetWorldPos);
        this.vs.active = false;
        tween(this.camera.node).to(2, { position: targetWorldPos }).call(() => {
            this.gameEndSettlement(role);
        }).start();
        this.chooseWeapons.active = false;
    }

    private gameEndSettlement(role: SXZW_RoleControl) {
        if (role === this.currentPlayer.role) {
            if (this.newWeapons.isUnlock()) {
                this.newWeapons.node.once(Node.EventType.TOUCH_END, () => {
                    this.newWeapons.node.active = false;
                    this.gameVictory(role);
                }, this)
            } else {
                this.gameVictory(role);
            }
            sys.localStorage.setItem("sxzw_currentLevelIndex", this.currentLevelIndex + 1 < this.levels.length ? this.currentLevelIndex + 1 : 0)
        } else {
            this.gameFailure(role);
        }
        ProjectEventManager.emit(ProjectEvent.游戏结束, "谁先阵亡")
    }

    private gameVictory(role: SXZW_RoleControl) {
        SXZW_AudioManage.Instance.playWinEffect();
        this.victorView.victory(this.currentLevelIndex, this.firstFinishLevel, this.currentPlayer.role.getBlood);
    }

    private gameFailure(role) {
        this.FailureView.active = true;
        this.FailureView.once(Node.EventType.TOUCH_END, () => {
            SXZW_GameManage.Instance.endGame();
        }, this)
    }

    // 显示关卡
    showLevel() {
        if (this.levels.length < 1) {
            console.error("没有关卡")
            return;
        }
        this.currentLevelIndex = Number(sys.localStorage.getItem("sxzw_currentLevelIndex")) || 0
        if (this.currentLevelIndex >= this.levels.length) {
            this.currentLevelIndex = 0;
            sys.localStorage.setItem("sxzw_currentLevelIndex", 0)
        }
        if (isValid(this._currentLevel, true)) {
            this._currentLevel.node.destroy()
        }
        const lv = instantiate(this.levels[this.currentLevelIndex].node)
        lv.setParent(this.levels[this.currentLevelIndex].node.parent)
        lv.name = "temp";
        lv.active = true;
        this._currentLevel = lv.getComponent(SXZW_LevelSetting)

        for (let index = 0; index < this.levels.length; index++) {
            this.levels[index].node.active = false;//index == this.currentLevelIndex;
        }

        // 显示角色
        console.log("生成角色")
        if (isValid(this.currentPlayer, true)) {
            this.currentPlayer.destroy()
        }
        const roleIndex = 0;
        const role = instantiate(this.rolePrefabList[roleIndex])
        role.parent = this.currentLevel.node
        role.position = this.currentLevel.playerPosition.position.clone()
        this.currentPlayer = role.addComponent(SXZW_PlayerControl)
        this.currentPlayer.role.bloodChange = (number) => this.bloodChanage(number, true);
        role.getComponent(SXZW_RoleControl).updateHero();

        // 显示Ai
        if (isValid(this.currentAi, true)) {
            this.currentAi.destroy()
        }
        const ai = instantiate(this.rolePrefabList[roleIndex]);// 使用和角色一样的预制体 this.aiPrefab)
        ai.parent = this.currentLevel.node
        ai.position = this.currentLevel.aiPosition.position.clone()
        ai.active = false;
        this.currentAi = ai.addComponent(SXZW_AiControl)
        this.currentAi.role.bloodChange = (number) => this.bloodChanage(number, false);

        this.bloodChanage(100, true);
        this.bloodChanage(100, false);
    }

    bloodChanage(blood: number, isPlayer: boolean) {
        if (isPlayer) {
            this.playerBloodSprite.fillRange = blood / 100;
        } else {
            this.aiBloodSprite.fillRange = blood / 100;
        }
    }

    chooseOpponentFinish() {
        this.chooseOpponent.node.active = false;
        this.vs.active = true;
        this.showChooseWeapon();
    }

    chooseWeapon() {
        const list: number[] = []
        for (let index = 0; index < SXZW_WeaponsManage.Instance.equipWaponNodeList.length; index++) {
            list.push(index)
        }
        let randomIndex = randomRangeInt(0, list.length);
        //randomIndex = 1;
        this.weapon_1 = SXZW_WeaponsManage.Instance.equipWaponNodeList[list.splice(randomIndex, 1)[0]]
        randomIndex = randomRangeInt(0, list.length);
        //randomIndex = 4
        this.weapon_2 = SXZW_WeaponsManage.Instance.equipWaponNodeList[list.splice(randomIndex, 1)[0]]
        randomIndex = randomRangeInt(0, list.length);
        //randomIndex = 4
        this.weapon_3 = SXZW_WeaponsManage.Instance.equipWaponNodeList[list.splice(randomIndex, 1)[0]]
        this.chooseSprite_1.spriteFrame = this.weapon_1.itemImage
        this.chooseSprite_2.spriteFrame = this.weapon_2.itemImage
        this.chooseSprite_3.spriteFrame = this.weapon_3.itemImage
    }

    showChooseWeapon() {
        this.round = SXZW_RoundEnum.PlayerChoose
        this.chooseWeapons.active = true;
        /* this.chooseWeapons.position = this.chooseWeapons.position.add(new Vec3(0, -100, 0)) */
        /* tween(this.chooseWeapons).to(1, { position: this.chooseOriginalPos.clone() }).start() */
    }
    hideChooseWeapon() {
        /* tween(this.chooseWeapons).to(1, { position: this.chooseWeapons.position.add(new Vec3(0, -100, 0)) })
            .call(() => { */
        this.chooseWeapons.active = false;
        this.round = SXZW_RoundEnum.Player
        /*  }).start() */
    }

    private getCollider3DCenterWorldPos(collider: Collider): Vec3 {
        const localCenter = collider.center;
        const worldCenter = new Vec3();
        Vec3.transformMat4(worldCenter, localCenter, collider.node.getWorldMatrix());

        return worldCenter;
    }

    onChooseClick1() {
        this.chooseClick(this.weapon_1);
    }
    onChooseClick2() {
        this.chooseClick(this.weapon_2);
    }
    onChooseClick3() {
        this.chooseClick(this.weapon_3);
    }

    chooseClick(waponsItem: SXZW_WaponsItem) {
        this.currentPlayer.role.readyThrow();

        const node = instantiate(waponsItem.weaponPrefab)
        this.playerChooseWeapon = node.getComponent(SXZW_WeaponPrefab)
        this.playerChooseWeapon.data = waponsItem;
        this.chooseWeaponEquip(this.playerChooseWeapon, this.currentPlayer.role)

        this.hideChooseWeapon()
    }

    aiChoose(): SXZW_WeaponPrefab {
        let item: SXZW_WaponsItem = null;
        if (randomRange(0, 1) < 0.5 && randomRange(0, 130) < math.clamp(this.currentAi.aiWisdom, 0, 100)) {
            let ld: SXZW_WaponsItem = null;
            const list = SXZW_WeaponsManage.Instance.equipWaponNodeList.forEach((a) => {
                if (ld) {
                    if (a.levelData.damageRange > ld.levelData.damageRange) {
                        ld = a;
                    } else if (a.levelData.damageRange === ld.levelData.damageRange) {
                        if (a.levelData.damage > ld.levelData.damage) {
                            ld = a;
                        } else if (a.levelData.damage === ld.levelData.damage) {
                            if (a.levelData.pushForce > ld.levelData.pushForce) {
                                ld = a
                            }
                        }
                    }
                } else {
                    ld = a;
                }
            });
            item = ld;
        } else {
            let randomIndex = randomRangeInt(0, SXZW_WeaponsManage.Instance.equipWaponNodeList.length);
            //randomIndex = 6;
            item = SXZW_WeaponsManage.Instance.equipWaponNodeList[randomIndex];
        }
        const prefab = item.weaponPrefab;
        const node = instantiate(prefab)
        const weaponPrefab = node.getComponent(SXZW_WeaponPrefab)
        weaponPrefab.data = item;
        this.chooseWeaponEquip(weaponPrefab, this.currentAi.role)
        return weaponPrefab;
    }

    chooseWeaponEquip(weapon: SXZW_WeaponPrefab, role: SXZW_RoleControl) {
        const scale = weapon.node.getWorldScale()
        weapon.node.setParent(role.spawnPoint, true);
        weapon.node.setPosition(Vec3.ZERO)

        if (weapon.handlePoint) {
            this.scheduleOnce(() => {
                const newPos = new Vec3();
                const quat = new Quat()
                Quat.fromEuler(quat, 0, role.node.eulerAngles.y > 0 ? 0 : 180, 0)
                weapon.node.setWorldRotation(quat);
                role.spawnPoint.inverseTransformPoint(newPos, weapon.handlePoint.worldPosition)
                weapon.node.setPosition(newPos.negative())
            }, 0);
        }

        const pwr = role.node.worldRotation;
        const euler = new Vec3();
        Quat.toEuler(euler, pwr);
        euler.y -= 90;
        const newQuat = new Quat();
        Quat.fromEuler(newQuat, euler.x, euler.y, euler.z);
        weapon.node.setWorldRotation(newQuat)
        weapon.node.setWorldScale(scale);

        weapon.rigBody.useGravity = false;
        weapon.rigBody.enabled = false;
    }

    protected onDisable(): void {
        this.chooseSprite_1.node.parent.off(NodeEventType.TOUCH_END, this.onChooseClick1, this)
        this.chooseSprite_2.node.parent.off(NodeEventType.TOUCH_END, this.onChooseClick2, this)
        this.chooseSprite_3.node.parent.off(NodeEventType.TOUCH_END, this.onChooseClick3, this)

        if (this.currentPlayer) {
            this.currentPlayer.destroy()
        }
        if (this.currentAi) {
            this.currentAi.destroy()
        }

        for (let index = 0; index < this.useBlastSeek.length; index++) {
            this.useBlastSeek[index].enabled = false;
            this.useBlastSeek[index].node.active = false;
        }
        for (let index = 0; index < this.useHurtTextParticles.length; index++) {
            this.useHurtTextParticles[index].node.active = false;
        }
    }
}


