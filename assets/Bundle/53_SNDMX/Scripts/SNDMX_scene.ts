import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, EPhysics2DDrawFlags, IPhysics2DContact, log, Node, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SNDMX_scene')
export class SNDMX_scene extends Component {
    public CanCollion: boolean = false;

    private box: BoxCollider2D = null;

    protected onLoad(): void {

    }


}


