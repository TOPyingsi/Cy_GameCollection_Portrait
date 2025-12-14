import { _decorator, AudioClip, Component, math, Node, random, UIOpacity, v3 } from 'cc';
import { BLXXPT_Puzzle } from './BLXXPT_Puzzle';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BLXXPT_GameMgr')
export class BLXXPT_GameMgr extends Component {

    @property({ type: [AudioClip] })
    public clips: AudioClip[] = [];

    @property({ type: [Node] })
    public puzzles: Node[] = [];

    @property({ type: [Node] })
    public touchPuzzles: Node[] = [];

    public puzzleNum: number = 0;

    public puzzleMap: Map<string, any> = new Map();

    public static instance: BLXXPT_GameMgr = null;
    start() {
        BLXXPT_GameMgr.instance = this;

        this.initData();
    }

    initData() {
        for (let i = 0; i < this.puzzles.length; i++) {

            let uiOpacity: UIOpacity = this.puzzles[i].getComponent(UIOpacity);

            let puzzleNode = this.puzzles[i];

            let puzzle = new BLXXPT_PuzzleData(puzzleNode.name, puzzleNode, uiOpacity, i);

            this.puzzleMap.set(puzzleNode.name, puzzle);

        }

        for (let j = 0; j < this.touchPuzzles.length; j++) {
            let puzzleTs = this.touchPuzzles[j].getComponent(BLXXPT_Puzzle);
            puzzleTs.puzzleIndex = j;

            let random = math.randomRangeInt(0, 10);
            if (random % 2 === 0) {
                puzzleTs.flip = true;
                this.touchPuzzles[j].eulerAngles = v3(0, 180, 0);
            }
        }


    }

    getPuzzle() {

        this.puzzleNum++;
        if (this.puzzleNum === 16) {
            GamePanel.Instance.Win();
        }

    }

    playSFX(clipName: string) {
        for (let clip of this.clips) {
            if (clipName === clip.name) {
                AudioManager.Instance.PlaySFX(clip);
            }
        }
    }
}

export class BLXXPT_PuzzleData {
    public name: string;

    public puzzle: Node;

    public uiOpacity: UIOpacity;

    public index: number = 0;

    public isRight: boolean = false;

    constructor(name: string, puzzle: Node, uiOpacity: UIOpacity, index: number) {
        this.name = name;
        this.uiOpacity = uiOpacity;
        this.puzzle = puzzle;
        this.index = index;
    }
}


