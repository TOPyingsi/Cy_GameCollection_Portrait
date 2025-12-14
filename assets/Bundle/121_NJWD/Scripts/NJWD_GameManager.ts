import { _decorator, Animation, Camera, Collider, Component, director, geometry, Label, Node, ParticleSystem, PhysicsSystem, quat, Quat, randomRange, randomRangeInt, RigidBody, Sprite, Tween, tween, v3, Vec3 } from 'cc';
import { NJWD_UI } from './NJWD_UI';
import { NJWD_Walls } from './NJWD_Walls';
import { NJWD_AudioManager } from './NJWD_AudioManager';
import { EasingType } from 'db://assets/Scripts/Framework/Utils/TweenUtil';
const { ccclass, property } = _decorator;

@ccclass('NJWD_GameManager')
export class NJWD_GameManager extends Component {

    private static instance: NJWD_GameManager;
    public static get Instance(): NJWD_GameManager {
        return this.instance;
    }

    @property(Camera)
    UICamera: Camera;

    @property(RigidBody)
    enemyRig: RigidBody;

    @property(ParticleSystem)
    blood: ParticleSystem;

    @property(Node)
    camera: Node;

    @property(Node)
    cameraCenter: Node;

    @property(Node)
    laser: Node;

    @property(Node)
    brokenBricks: Node;

    @property(Node)
    bullet: Node;

    @property(Node)
    ufo: Node;

    @property([Node])
    gamers: Node[] = [];

    @property([Node])
    hps: Node[] = [];

    @property([Node])
    guns: Node[] = [];

    @property([ParticleSystem])
    particles: ParticleSystem[] = [];


    @property([Node])
    cameraPoints: Node[] = [];

    private playerHp = 100;
    public get PlayerHp(): number {
        return this.playerHp;
    }
    public set PlayerHp(value: number) {
        this.playerHp = value;
        if (this.playerHp <= 0) {
            this.playerHp = 0;
            this.FinishBullet(1);
        }
        else this.scheduleOnce(() => { NJWD_UI.Instance.EnemyShootEnd(); }, 1);
        this.hps[0].children[0].getComponent(Sprite).fillRange = this.playerHp / 100;
        this.hps[0].children[2].getComponent(Label).string = this.playerHp.toString();
    }

    private enemyHp = 100;
    public get EnemyHp(): number {
        return this.enemyHp;
    }
    public set EnemyHp(value: number) {
        this.enemyHp = value;
        if (this.enemyHp <= 0) {
            this.enemyHp = 0;
            this.FinishBullet(0);
        }
        else this.scheduleOnce(() => { NJWD_UI.Instance.ShootEnd(); }, 1);
        this.hps[1].children[0].getComponent(Sprite).fillRange = this.enemyHp / 100;
        this.hps[1].children[2].getComponent(Label).string = this.enemyHp.toString();
    }

    enemyTargetPos: Vec3;
    enemyrotateSpeed = 1;
    enemyFound = false;
    enemyMove = false;
    enemyHit = false;
    isUfo = false;
    enemyTargetX = 0;

    protected onLoad(): void {
        NJWD_GameManager.instance = this;
    }

    protected start(): void {
        this.ReadyShoot();
    }

    protected update(dt: number): void {
        this.EnemyMove();
        this.UFOMove();
        // let pos = this.UICamera.worldToScreen(this.cameraCenter.getWorldPosition());
        // let ray = this.camera.getComponent(Camera).screenPointToRay(pos.x, pos.y);
        // if (PhysicsSystem.instance.raycast(ray, 0xffffffff, 100, true)) {
        //     let results = PhysicsSystem.instance.raycastResults;
        //     let str = "";
        //     results.forEach(element => {
        //         str += `${element.collider.node.name}，`
        //     });
        //     console.log(str);
        // }
    }

    ReadyShoot() {
        for (let i = 0; i < this.gamers.length; i++) {
            const element = this.gamers[i];
            element.active = i < 2;
        }
        this.camera.setParent(this.cameraPoints[0], true);
        this.camera.setPosition(Vec3.ZERO);
        this.particles[1].play();
        NJWD_UI.Instance.ReadyShoot();
        this.EnemyHide();
    }

    InShoot() {
        this.camera.setParent(this.cameraPoints[1], true);
        this.camera.setPosition(Vec3.ZERO);
    }

    Shoot() {
        NJWD_AudioManager.Instance.PlayShoot();
        let pos = this.UICamera.worldToScreen(this.cameraCenter.getWorldPosition());
        let ray = this.camera.getComponent(Camera).screenPointToRay(pos.x, pos.y);
        let isBrick = false;
        let isHuman = false;
        if (PhysicsSystem.instance.raycast(ray, 0xffffffff, 100, true)) {
            let results = PhysicsSystem.instance.raycastResults;
            for (let i = 0; i < results.length; i++) {
                const element = results[i];
                if (element.collider.node.name == "Brick" && element.collider.node.parent.getComponent(NJWD_Walls)) {
                    if (isBrick) continue;
                    isBrick = true;
                    let brick = element.collider.node;
                    brick.parent.getComponent(NJWD_Walls).Hit(brick);
                }
                else if (element.collider.isTrigger) {
                    if (isHuman) continue;
                    isHuman = true;
                    NJWD_UI.Instance.isHit = true;
                    let name = element.collider.node.name;
                    let damage = 100;
                    if (name == "Chest") damage = 30;
                    else if (name == "Limb") damage = 10;
                    this.EnemyHp -= damage;
                    NJWD_UI.Instance.ShowHit(damage);
                    this.enemyHit = true;
                    const hitPoint = element.hitPoint.clone();
                    if (this.EnemyHp > 0) {
                        this.blood.node.setWorldPosition(hitPoint);
                        this.blood.play();
                    }
                    else {
                        this.bullet.setWorldPosition(this.guns[0].getWorldPosition());
                        this.bullet.lookAt(hitPoint, this.bullet.up);
                        this.camera.setParent(this.bullet.children[1]);
                        this.camera.setPosition(Vec3.ZERO);
                        this.camera.setRotationFromEuler(Vec3.ZERO);
                        this.camera.getComponent(Camera).near = 0.1;
                        this.guns[1].active = false;
                        NJWD_UI.Instance.shoot.active = false;
                        tween(this.bullet)
                            .to(3, { worldPosition: hitPoint })
                            .call(() => {
                                this.camera.setParent(director.getScene(), true);
                                this.blood.node.setWorldPosition(hitPoint);
                                this.blood.play();
                                this.gamers[1].getComponent(Animation).play("Die");
                                this.bullet.active = false;
                                NJWD_AudioManager.Instance.PlayHurt();
                            })
                            .start();
                    }
                }
            }
        }
        if (!this.enemyHit) this.scheduleOnce(() => { this.EnemyHide(); }, 1);
    }

    EnemyReadyShoot() {
        for (let i = 0; i < this.gamers.length; i++) {
            const element = this.gamers[i];
            element.active = i > 1;
        }
        this.camera.setParent(this.cameraPoints[2], true);
        this.camera.setPosition(Vec3.ZERO);
        this.camera.setRotationFromEuler(Vec3.ZERO);
        this.particles[0].play();
        NJWD_UI.Instance.EnemyReadyShoot();
        this.UFOCancel();
    }

    EnemyInShoot(ready = false): boolean {
        let pos = this.laser.getWorldPosition();
        let ray = new geometry.Ray;
        let playerHits = this.gamers[2].getComponentsInChildren(Collider);
        let wall: NJWD_Walls;
        for (let i = 0; i < playerHits.length; i++) {
            const element = playerHits[i];
            geometry.Ray.fromPoints(ray, pos, element.node.getWorldPosition());
            if (PhysicsSystem.instance.raycastClosest(ray, 1 << 0 | 1 << 1, 50)) {
                const result = PhysicsSystem.instance.raycastClosestResult;
                const collider = result.collider;
                if (collider.attachedRigidBody.group == 1 << 0) {
                    this.enemyTargetPos = result.hitPoint.clone();
                    if (!ready) this.EnemyRotate();
                    this.enemyFound = true;
                    console.log(collider.node.name);
                    return true;
                }
                if (!wall) {
                    let brick = collider.node;
                    wall = brick.parent.getComponent(NJWD_Walls);
                }
            }
        }
        let bricks: Node[] = [];
        for (let i = 0; i < wall.groups.length; i++) {
            const element = wall.groups[i];
            for (let j = 0; j < element.length; j++) {
                const element2 = element[j];
                if (element2) bricks.push(element2);
            }
        }
        let brick = bricks[randomRangeInt(0, bricks.length)];
        this.enemyTargetPos = brick.getWorldPosition();
        if (!ready) this.EnemyRotate();
        return false;
    }

    EnemyRotate() {
        if (!this.enemyTargetPos) return;

        const currentPos = this.laser.worldPosition;
        const direction = new Vec3();

        Vec3.subtract(direction, this.enemyTargetPos, currentPos);

        if (direction.lengthSqr() > 0.0001) {
            const targetRotation = new Quat();
            Quat.fromViewUp(targetRotation, direction.normalize());

            // 使用 Tween 平滑旋转
            tween(this.laser)
                .to(2, { worldRotation: targetRotation })
                .call(() => {
                    if (!this.enemyFound && this.EnemyInShoot(true)) this.EnemyRotate();
                    else this.EnemyShoot();
                })
                .start();
        }
    }

    EnemyShoot() {
        NJWD_AudioManager.Instance.PlayShoot();
        this.enemyFound = false;
        let ray = new geometry.Ray;
        ray.o = this.laser.getWorldPosition()
        ray.d = this.laser.forward.clone().negative();
        let isBrick = false;
        let isHuman = false;
        if (PhysicsSystem.instance.raycast(ray, 0xffffffff, 100, true)) {
            let results = PhysicsSystem.instance.raycastResults;
            for (let i = 0; i < results.length; i++) {
                const element = results[i];
                if (element.collider.node.name == "Brick") {
                    if (isBrick) continue;
                    isBrick = true;
                    let brick = element.collider.node;
                    brick.parent.getComponent(NJWD_Walls).Hit(brick);
                }
                else if (element.collider.isTrigger) {
                    if (isHuman) continue;
                    isHuman = true;
                    NJWD_UI.Instance.isHit = true;
                    let name = element.collider.node.name;
                    let damage = 100;
                    if (name == "Chest") damage = 30;
                    else if (name == "Limb") damage = 10;
                    this.PlayerHp -= damage;
                    NJWD_UI.Instance.ShowHit(damage);
                    const hitPoint = element.hitPoint.clone();
                    if (this.PlayerHp > 0) {
                        this.blood.node.setWorldPosition(hitPoint);
                        this.blood.play();
                    }
                    else {
                        this.bullet.setWorldPosition(this.guns[1].getWorldPosition());
                        this.bullet.lookAt(hitPoint, this.bullet.up);
                        this.camera.setParent(this.bullet.children[1]);
                        this.camera.setPosition(Vec3.ZERO);
                        this.camera.setRotationFromEuler(Vec3.ZERO);
                        this.camera.getComponent(Camera).near = 0.1;
                        NJWD_UI.Instance.shoot.active = false;
                        tween(this.bullet)
                            .to(3, { worldPosition: hitPoint })
                            .call(() => {
                                this.camera.setParent(director.getScene(), true);
                                this.blood.node.setWorldPosition(hitPoint);
                                this.blood.play();
                                this.gamers[2].getComponent(Animation).play("Die");
                                this.bullet.active = false;
                                NJWD_AudioManager.Instance.PlayHurt();
                            })
                            .start();
                    }
                }
            }
        }
        NJWD_UI.Instance.EnemyShoot();
    }

    EnemyHide() {
        let pos = v3();
        let ray = new geometry.Ray;
        ray.o = pos;
        ray.d = Vec3.UNIT_Z;
        let playerHits = this.gamers[1].getComponentsInChildren(Collider);
        let isHide = true;
        for (let i = 0; i < playerHits.length; i++) {
            const element = playerHits[i];
            element.node.getWorldPosition(pos);
            if (!PhysicsSystem.instance.raycastClosest(ray, 0xffffffff, 2)) {
                isHide = false;
                break;
            }
        }
        if (!isHide || this.enemyHit) {
            this.enemyHit = false;
            let x = randomRange(1, 7);
            let n = randomRangeInt(0, 2);
            if (n == 0) x *= -1;
            this.enemyTargetX = x;
            this.enemyMove = true;
            let ani = this.enemyRig.getComponent(Animation);
            ani.play(ani.clips[randomRangeInt(2, 8)].name);
        }
    }

    EnemyMove() {
        if (this.enemyHit) return this.enemyRig.setLinearVelocity(Vec3.ZERO);
        if (this.enemyRig.node.active && this.enemyMove) {
            let dis = Math.abs(this.enemyTargetX - this.enemyRig.node.x);
            if (dis < 0.1) {
                this.enemyMove = false;
                this.enemyRig.setLinearVelocity(Vec3.ZERO);
                this.scheduleOnce(() => { this.EnemyHide(); }, 1);
            }
            else {
                let moveX = 1;
                if (this.enemyTargetX < this.enemyRig.node.x) moveX = -1;
                this.enemyRig.setLinearVelocity(v3(moveX, 0));
            }
        }
        else this.enemyRig.setLinearVelocity(Vec3.ZERO);
    }

    FinishBullet(num: number) {
        this.scheduleOnce(() => {
            if (num == 0) NJWD_UI.Instance.Win();
            else NJWD_UI.Instance.Fail();
        }, 5);
    }

    UFOFind() {
        this.isUfo = true;
        this.ufo.children[1].active = false;
        Tween.stopAllByTarget(this.ufo);
        tween(this.ufo)
            .to(1.5, { x: this.enemyRig.node.x }, { easing: EasingType.backOut })
            .call(() => { this.ufo.children[1].active = true; })
            .delay(5)
            .call(() => {
                this.ufo.children[1].active = false;
                this.isUfo = false;
            })
            .to(1.5, { x: -45 }, { easing: EasingType.backIn })
            .start();
    }

    UFOMove() {
        if (this.ufo.children[1].active) {
            let pos = this.ufo.getWorldPosition();
            pos.x = this.enemyRig.node.x;
            this.ufo.setWorldPosition(pos);
        }
    }

    UFOCancel() {
        this.isUfo = false;
        this.ufo.children[1].active = false;
        Tween.stopAllByTarget(this.ufo);
        let pos = this.ufo.getWorldPosition();
        pos.x = -45;
        this.ufo.setWorldPosition(pos);
    }

}
