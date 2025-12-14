import { _decorator, AnimationComponent, Collider, Color, Component, Material, math, Mesh, Node, randomRangeInt, SkeletalAnimation, SkinnedMeshRenderer, Vec3 } from 'cc';
import { SXZW_FaceManage } from './SXZW_FaceManage';
import { SXZW_GameManage } from './SXZW_GameManage';
const { ccclass, property } = _decorator;

@ccclass('SXZW_RoleControl')
export class SXZW_RoleControl extends Component {

    @property(Node)
    spawnPoint: Node = null;

    @property(SXZW_FaceManage)
    faceManage: SXZW_FaceManage = null

    @property(Node)
    rotateNode: Node = null

    @property(SkinnedMeshRenderer)
    skinnedMeshRenderer: SkinnedMeshRenderer = null

    @property(Collider)
    handCollider: Collider = null
    @property(Collider)
    headCollider: Collider = null

    private anim: SkeletalAnimation

    public bloodChange: (blood: number) => void = null;

    public angle: number = 0

    private blood: number = 100

    public animPlaying = false;
    public homeRole = false;

    public get isDie(): boolean {
        return this.blood <= 0;
    }

    public setHurt(damage: number) {
        this.blood -= damage;
        this.bloodChange?.(this.blood);
    }

    public get getBlood(): number {
        return this.blood;
    }

    protected onLoad(): void {
        this.anim = this.node.getComponent(SkeletalAnimation)
    }

    protected onEnable(): void {
        const clipName = "stand";
        const animState = this.anim.getState(clipName);
        if (animState) {
            animState.time = animState.clip.duration;
            animState.sample();
            this.anim.stop();
        }
    }

    start() {

    }

    update(deltaTime: number) {
        if (!this.animPlaying && !this.homeRole) {
            if (this.angle != this.node.eulerAngles.y) this.node.eulerAngles = new Vec3(0, this.angle, 0);
            const a = this.angle > 0 ? -45 : 45;
            if (this.rotateNode.eulerAngles.x != a) this.rotateNode.eulerAngles = new Vec3(a, 0, 0)
        }
    }

    setColor(color: Color) {
        this.skinnedMeshRenderer.material.setProperty("mainColor", color)
    }

    updateHero() {
        this.skinnedMeshRenderer.mesh = SXZW_GameManage.Instance.heroes.currentItem.mesh;
        this.skinnedMeshRenderer.material =
            SXZW_GameManage.Instance.heroes.isUseColorMaterial ?
                SXZW_GameManage.Instance.heroes.material_1 :
                SXZW_GameManage.Instance.heroes.material_2;
        this.faceManage.meshRenderer.node.active = SXZW_GameManage.Instance.heroes.currentItem.showFace;
        if (SXZW_GameManage.Instance.heroes.currentItem.showFace) {
            this.faceManage.meshRenderer.node.setPosition(SXZW_GameManage.Instance.heroes.currentItem.position);
            this.faceManage.meshRenderer.node.setRotationFromEuler(SXZW_GameManage.Instance.heroes.currentItem.rotation);
        }
    }

    setRorate(z: number) {
        if (z > 180) z -= 360;
        else if (z < -180) z += 360;
        //console.log(z)
        if (z <= 90 && z >= 0) {
            z = math.lerp(0, -50, z / 90);
        } else if (z > 90 && z <= 180) {
            z = math.lerp(-50, 0, (z - 90) / 90)
        } else if (z < 0 && z >= -90) {
            z = math.lerp(0, 50, -z / 90)
        } else if (z < -90 && z >= -180) {
            z = math.lerp(50, 0, (-z - 90) / 90)
        }
        //console.warn(z)
        this.rotateNode.eulerAngles = new Vec3(0, 0, math.clamp(z, -50, 50))
    }

    readyThrow() {
        this.animPlaying = true;
        /* this.handCollider.enabled = false;
        this.headCollider.enabled = false; */
        this.anim.play("readyThrow")
    }

    throw() {
        this.anim.once(AnimationComponent.EventType.FINISHED, () => {
            this.stand()
        }, this);
        this.anim.play("throw")
    }

    stand() {
        this.anim.once(AnimationComponent.EventType.FINISHED, () => {
            this.animPlaying = false;
            /* if (!this.handCollider.enabled) {
                this.handCollider.enabled = true;
                this.headCollider.enabled = true;
            } */
        }, this);
        this.anim.crossFade("stand", 0.2);
    }

    headHurt() {
        if (this.animPlaying) return;
        this.anim.once(AnimationComponent.EventType.FINISHED, () => {
            this.stand()
        }, this);
        this.animPlaying = true;
        this.anim.crossFade("headHurt", 0.2);
        this.faceManage.sad()
    }

    legHurt() {
        if (this.animPlaying) return;
        this.anim.once(AnimationComponent.EventType.FINISHED, () => {
            this.stand()
        }, this);
        this.animPlaying = true;
        this.anim.crossFade("legHurt", 0.2);
        this.faceManage.sad()
    }

    bodyHurt() {
        if (this.animPlaying) return;
        this.anim.once(AnimationComponent.EventType.FINISHED, () => {
            this.stand()
        }, this);
        this.animPlaying = true;
        this.anim.crossFade("bodyHurt", 0.2);
        this.faceManage.sad()
    }

    blastHurt() {
        if (this.animPlaying) return;
        this.anim.once(AnimationComponent.EventType.FINISHED, () => {
            this.stand()
        }, this);
        this.animPlaying = true;
        this.anim.crossFade("blastHurt", 0.2);
        this.faceManage.sad()
    }

    hello() {
        this.anim.crossFade("hello", 0.2);
        this.scheduleOnce(() => {
            this.anim.crossFade("idle")
        }, 2.5);
    }

    victory() {
        this.animPlaying = true;
        this.anim.crossFade("victory" + randomRangeInt(1, 3), 0.2);
        this.faceManage.happly()
        this.faceManage.loop = false;
    }

}


