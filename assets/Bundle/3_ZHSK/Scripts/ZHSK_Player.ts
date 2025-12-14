import { _decorator, Component, Node, Vec2, Vec3, Camera, v3, quat, RigidBody2D, v2, EventTouch, find, tween, AudioSource, director, UITransform, math, ParticleSystem2D, CameraComponent, view, error } from "cc";
const { ccclass, property } = _decorator;

const MinX: number[] = []

@ccclass('ZHSK_Player')
export class ZHSK_Player extends Component {
    @property(Camera)
    camera: Camera = null;

    @property(Number)
    speed: number = 0;

    @property(Node)
    map: Node = null;

    @property(RigidBody2D)
    rigidBody = null;

    @property(Node)
    Player = null;
    @property(Node)
    LiZi = null;
    @property(Node)
    CameraLimit = null;
    startPoint: Vec2 = new Vec2();
    public moveDir: Vec2 = new Vec2();//移动方向
    UIDIstance: Vec3 = new Vec3();

    start() {
        this.map.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.map.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.map.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.moveDir = new Vec2(-60, 80);
    }

    onTouchStart(event: EventTouch) {
        const startPoint1 = new Vec2(this.node.children[0].worldPosition.x, this.node.children[0].worldPosition.y)

        this.startPoint = event.getUILocation();
        // console.error(this.startPoint);

        const pos = event.getUILocation();
        this.LiZi.worldPosition = pos;
        this.LiZi.active = true;
        find("Canvas").getComponent(AudioSource).play();
        // this.moveDir = startPoint1.clone().subtract(v2(pos.x, pos.y));
        // this.moveDir.normalize().multiplyScalar(200);
    }
    onTouchMove(event: EventTouch) {

        const pos = event.getUILocation();
        this.LiZi.setWorldPosition(pos.x, pos.y, 0);




        // const playerWorldPos = this.camera.screenToWorld(this.node.children[0].getPosition().clone())
        // this.startPoint = this.node.children[0].getWorldPosition().clone();

        //const worldPos = this.camera.screenToWorld(v3(pos.x, pos.y));


        let Point: Vec2 = this.startPoint;
        // let _worldpos = this.node.children[0].getWorldPosition().clone();
        // let UIpos = _worldpos.subtract(this.camera.node.getWorldPosition().clone()).add(v3(view.getVisibleSize().x / 2, view.getVisibleSize().y / 2));
        // this.UIDIstance = UIpos;
        // let Point2: Vec2 = v2(UIpos.x, UIpos.y);
        let Point2: Vec2 = event.getUILocation();


        // console.log(playerWorldPos, worldPos);

        // this.moveDir = Point.clone().subtract(v2(Point2.x, Point2.y));
        this.moveDir = Point2.clone().subtract(v2(Point.x + 1, Point.y + 1));

        this.moveDir.normalize().multiplyScalar(200);

    }

    onTouchEnd(event: EventTouch) {
        this.LiZi.getComponent(ParticleSystem2D).resetSystem();
        this.LiZi.active = false;

    }

    update() {
        const uiTransform = this.CameraLimit.getComponent(UITransform)
        const spawnAreaWidth = uiTransform.width; // 方形区域的宽度
        const spawnAreaHeight = uiTransform.height; // 方形区域的高度
        const spawnAreaPos = this.CameraLimit.getWorldPosition().clone(); // 方形区域的位置
        const MaxX = spawnAreaPos.x + spawnAreaWidth / 2;
        const MinX = spawnAreaPos.x - spawnAreaWidth / 2;
        const MaxY = spawnAreaPos.y + spawnAreaHeight / 2;
        const MinY = spawnAreaPos.y - spawnAreaHeight / 2;

        let dis: Vec3 = new Vec3;
        let pos: Vec3 = new Vec3;
        pos.set(this.moveDir.x, this.moveDir.y, 0);//将moveDir转Vec3
        dis.set(this.node.position.clone().add(pos.normalize().multiplyScalar(this.speed)));//下一次朝moveDir方向移动的距离
        //const targtePos = this.node.getWorldPosition().clone();
        //this.camera.node.setPosition(v3(targtePos.x, targtePos.y, 0));//摄像机跟随
        // this.camera.node.setPosition(this.node.worldPosition.x, this.node.worldPosition.y);//摄像机跟随
        // this.node.setPosition(dis);//移动
        this.rigidBody.linearVelocity = v2(this.moveDir.x * this.speed, this.moveDir.y * this.speed);
        const targtePos = this.Player.getWorldPosition().clone();
        const CameraMaxX = this.camera.node.worldPosition.x + this.camera.getComponent(Camera).orthoHeight / 2340 * 1080;
        const CameraMinX = this.camera.node.worldPosition.x - this.camera.getComponent(Camera).orthoHeight / 2340 * 1080;
        const CameraMaxY = this.camera.node.worldPosition.y + this.camera.getComponent(Camera).orthoHeight;
        const CameraMinY = this.camera.node.worldPosition.y - this.camera.getComponent(Camera).orthoHeight;
        const CameraMaxX1 = targtePos.x + this.camera.getComponent(Camera).orthoHeight / 2340 * 1080;
        const CameraMinX1 = targtePos.x - this.camera.getComponent(Camera).orthoHeight / 2340 * 1080;
        const CameraMaxY1 = targtePos.y + this.camera.getComponent(Camera).orthoHeight;
        const CameraMinY1 = targtePos.y - this.camera.getComponent(Camera).orthoHeight;
        // if (director.getScene.name == "ZHSK_JDMSGame") {

        // }


        if (CameraMaxX1 < MaxX && CameraMaxY1 < MaxY && CameraMinX1 > MinX && CameraMinY1 > MinY) {
            this.camera.node.setWorldPosition(v3(targtePos.x, targtePos.y, 0));//摄像机跟随
        }
        else if (CameraMaxX1 >= MaxX || CameraMinX1 <= MinX && CameraMaxY1 < MaxY && CameraMinY1 > MinY) {
            this.camera.node.setWorldPosition(v3(this.camera.node.worldPosition.x, targtePos.y, 0));

        }
        else if (CameraMaxY1 >= MaxY || CameraMinY1 <= MinY && CameraMaxX1 < MaxX && CameraMinX1 > MinX) {
            this.camera.node.setWorldPosition(v3(targtePos.x, this.camera.node.worldPosition.y, 0));

        }

        if (CameraMaxY > MaxY) {
            let y = this.camera.node.worldPosition.y;
            y = y - 5;
            this.camera.node.setWorldPosition(this.camera.node.worldPosition.x, y, 0);
        }
        if (CameraMinY < MinY) {
            let y = this.camera.node.worldPosition.y;
            y = y + 5;
            this.camera.node.setWorldPosition(this.camera.node.worldPosition.x, y, 0);
        }
        if (CameraMaxX > MaxX) {
            let x = this.camera.node.worldPosition.x;
            x = x - 5;
            this.camera.node.setWorldPosition(x, this.camera.node.worldPosition.y, 0);
        }
        if (CameraMinX < MinX) {
            let x = this.camera.node.worldPosition.x;
            x = x + 5;
            this.camera.node.setWorldPosition(x, this.camera.node.worldPosition.y, 0)
        }
        //玩家面朝方向
        let angle;
        angle = this.moveDir.signAngle(new Vec2(0, this.node.worldPosition.y)) * 180 / Math.PI;//当前Player移动的方向
        this.node.children[0].angle = -angle;//上半身朝向移动方向
        director.getScene().emit("ZHSK_Move", -angle);

        // this.scheduleOnce(() => {
        //     for (let i = 0; i < find("Canvas/暂存").children.length; i++) {
        //         find("Canvas/暂存").children[i].angle = angle;

        //     }


        // }, 0.1);//间隔一秒执行一次
    }
    NpcAngleChange(Angle) {
        for (let j = 0; j < find("Canvas/PlayerManager").children[0].children.length - 2; j++) {
            tween(find("Canvas/PlayerManager").children[0].children[j + 2])
                .to(0, { angle: Angle })
                .to(0.2, { angle: 0 })
                .start();
        }
    }


}


