import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SoundplayManager')

export class SoundplayManager extends Component {

    static instance : SoundplayManager = null;

    @property([AudioClip])
    soundList : AudioClip[] = [];
    sounds : Map<string, AudioSource> = new Map<string, AudioSource>();
    
    protected onLoad(): void {
        SoundplayManager.instance = this;
        for (let i = 0; i < this.soundList.length; i++){
            let as = new AudioSource(this.soundList[i].name);
            as.clip = this.soundList[i];
            this.sounds.set(as.name, as);
        }
        this.init();
    }

    init(){
        this.setLoop("背景乐", true);
        this.sounds.get("背景乐").volume /= 4;
        this.playBGM("背景乐");
        // AudioManager.Instance.initSSLBgmMap("背景音乐", this.sounds.get("背景乐"), 0.25);
        // AudioManager.Instance.initSSLBgmMap("彩票按住", this.sounds.get("彩票按住"), 1);
        // AudioManager.Instance.playSSLBgm("背景音乐");
    }

    setLoop(name : string, bool : boolean){
        this.sounds.get(name).loop = bool;
    }
    playBGM(name : string, scaleV : number = 1){
        // if (this.sounds.get(name).playing){
        //     return;
        // }
        // this.sounds.get(name).volume *= scaleV;
        // this.sounds.get(name).play();
        
        // AudioManager.Instance.SetBGMVolume(scaleV);
        if (!AudioManager.IsMusicOn) return;

        this.playSSLBgm(name);
    }
    playOnce(name : string, scaleV : number = 1){
        if (!AudioManager.IsSoundOn) return;

        AudioManager.Instance.PlaySFX(this.sounds.get(name).clip);
        // this.sounds.get(name).playOneShot(this.sounds.get(name).clip, scaleV);  
    }
    stopBGM(name : string){
        // this.sounds.get(name).stop();
        this.stopSSLBgm(name);
    }

    initSSLBgmMap(name : string, audio : AudioSource, volume : number){
        this.sounds.set(name, audio);
        this.sounds.get(name).loop = true;    
        this.sounds.get(name).volume = volume;
    }


    playSSLBgm(name : string){
        this.sounds.get(name).play();
    }
    stopSSLBgm(name : string){
        this.sounds.get(name).stop();
    }

}


