import { _decorator, Component, DistanceJoint2D, ERigidBody2DType, EventTouch, Graphics, Node, PhysicsSystem2D, Prefab, RigidBody2D, v3, Vec3 } from 'cc';
import { PhysicsManager } from 'db://assets/Scripts/Framework/Managers/PhysicsManager';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('HXZJZHZ_GameManager')
export class HXZJZHZ_GameManager extends Component {

    @property(Node)
    player: Node;

    @property(Node)
    points: Node;

    @property(Node)
    people: Node;

    @property(Graphics)
    graphics: Graphics;

    @property(Prefab)
    ropePrefab: Prefab;

    distance = 0;
    playTime = 0;
    isPlay = false;
    lastPos: Vec3;

    start() {
        PhysicsSystem2D.instance.debugDrawFlags = 1;
        this.graphics.node.on(Node.EventType.TOUCH_START, this.TouchStart, this);
        this.graphics.node.on(Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.graphics.node.on(Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.graphics.node.on(Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    }

    update(deltaTime: number) {
        this.DrawGame();
    }

    DrawGame() {
        this.graphics.clear();
        for (let i = 0; i < this.points.children.length; i++) {
            const element = this.points.children[i];
            if (i == 0) this.graphics.moveTo(element.position.x, element.position.y);
            else this.graphics.lineTo(element.position.x, element.position.y);
        }
        this.graphics.stroke();
    }

    PlayGame() {
        if (!this.isPlay) return;
        this.playTime++;
        for (let i = 0; i < this.points.children.length; i++) {
            const element = this.points.children[i].getComponent(DistanceJoint2D);
            // element.maxLength = 20 - this.playTime * 2;
            element.maxLength = 0;
            element.apply();
        }
    }

    TouchStart(event: EventTouch) {
        let pos = v3(event.getUILocation().x, event.getUILocation().y);
        let playerPos = this.player.getWorldPosition();
        this.distance += Vec3.distance(pos, playerPos);
        let dir = new Vec3;
        let pos2 = new Vec3;
        Vec3.subtract(pos2, pos, playerPos);
        Vec3.normalize(dir, pos2);
        let num = 0;
        while (this.distance > 20) {
            this.distance -= 20;
            let point: Node = PoolManager.GetNodeByPrefab(this.ropePrefab, this.points);
            Vec3.multiplyScalar(pos2, dir, 20 * num + 1);
            Vec3.add(pos2, playerPos, pos2);
            let pointPos = pos2;
            point.setWorldPosition(pointPos);
            let joint = point.getComponent(DistanceJoint2D);
            if (num == 0) joint.connectedBody = this.player.getComponent(RigidBody2D);
            else joint.connectedBody = this.points.children[num - 1].getComponent(RigidBody2D);
            joint.maxLength = 20;
            joint.apply();
            num++;
            console.log(joint.connectedBody.node.getSiblingIndex());
        }
        if (this.points.children.length > 0) this.lastPos = this.points.children[this.points.children.length - 1].worldPosition;
        else this.lastPos = playerPos;
    }

    TouchMove(event: EventTouch) {
        let pos = v3(event.getUILocation().x, event.getUILocation().y);
        this.distance += Vec3.distance(pos, this.lastPos);
        let dir = new Vec3;
        let pos2 = new Vec3;
        Vec3.subtract(pos2, pos, this.lastPos);
        Vec3.normalize(dir, pos2);
        let num = 0;
        while (this.distance > 20) {
            this.distance -= 20;
            let point: Node = PoolManager.GetNodeByPrefab(this.ropePrefab, this.points);
            Vec3.multiplyScalar(pos2, dir, 20 * (num + 1));
            Vec3.add(pos2, this.lastPos, pos2);
            let pointPos = pos2;
            point.setWorldPosition(pointPos);
            let joint = point.getComponent(DistanceJoint2D);
            if (this.points.children.length == 0) joint.connectedBody = this.player.getComponent(RigidBody2D);
            else joint.connectedBody = this.points.children[this.points.children.length - 2].getComponent(RigidBody2D);
            joint.maxLength = 20;
            joint.apply();
            num++;
            console.log(pointPos);
        }
        if (this.points.children.length > 0) this.lastPos = this.points.children[this.points.children.length - 1].worldPosition;
        else this.lastPos = this.player.getWorldPosition();
    }

    TouchEnd(event: EventTouch) {
        let pos = v3(event.getUILocation().x, event.getUILocation().y);
        let playerPos = this.player.getWorldPosition();
        this.distance += Vec3.distance(playerPos, pos);
        let dir = new Vec3;
        let pos2 = new Vec3;
        Vec3.subtract(pos2, playerPos, pos);
        Vec3.normalize(dir, pos2);
        let num = 0;
        while (this.distance > 20) {
            this.distance -= 20;
            let point: Node = PoolManager.GetNodeByPrefab(this.ropePrefab, this.points);
            Vec3.multiplyScalar(pos2, dir, 20 * num + 1);
            Vec3.add(pos2, this.lastPos, pos2);
            let pointPos = pos2;
            point.setWorldPosition(pointPos);
            let joint = point.getComponent(DistanceJoint2D);
            if (this.points.children.length == 0) joint.connectedBody = this.player.getComponent(RigidBody2D);
            else joint.connectedBody = this.points.children[this.points.children.length - 2].getComponent(RigidBody2D);
            joint.maxLength = 20;
            joint.apply();
            num++;
            console.log(joint.connectedBody.node.getSiblingIndex());
        }
        let joint = this.player.getComponent(DistanceJoint2D);
        joint.connectedBody = this.points.children[this.points.children.length - 1].getComponent(RigidBody2D);
        joint.maxLength = 20;
        joint.apply();
        this.isPlay = true;
        for (let i = 0; i < this.points.children.length; i++) {
            const element = this.points.children[i];
            element.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
        }
        for (let i = 0; i < this.people.children.length; i++) {
            const element = this.people.children[i];
            element.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
        }
        // this.schedule(() => {
        this.PlayGame();
        // }, 1, 9);
    }
}


