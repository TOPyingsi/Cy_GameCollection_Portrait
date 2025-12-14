export enum XCJZ_SELECT {
    MAIN,
    SHOP,
}

export enum XCJZ_MUSIC {
    MUSIC1,
    MUSIC2,
    MUSIC3,
    MUSIC4,
    MUSIC5,
    MUSIC6,
    MUSIC7,
    MUSIC8,
    MUSIC9,
    MUSIC10,
    MUSIC11,
    MUSIC12,
    MUSIC13,
    MUSIC14,
    MUSIC15,
    MUSIC16,
    MUSIC17,
    MUSIC18,
    MUSIC19,
    MUSIC20,
    MUSIC21,
    MUSIC22,
    MUSIC23,
    MUSIC24,
    MUSIC25,
    MUSIC26,
    MUSIC27,
    MUSIC28,
    MUSIC29,
}

export class XCJZ_MUSIC_CLASS {
    MusicName: string = "";
    SigerName: string = "";

    constructor(musicName: string, singerName: string) {
        this.MusicName = musicName;
        this.SigerName = singerName;
    }
}

export const XCJZ_MUSIC_CONFIG: Map<XCJZ_MUSIC, XCJZ_MUSIC_CLASS> = new Map([
    [XCJZ_MUSIC.MUSIC1, new XCJZ_MUSIC_CLASS("刀马刀马", "DreamSky ")],
    [XCJZ_MUSIC.MUSIC2, new XCJZ_MUSIC_CLASS("库里库里", "Qo Vorlag")],
    [XCJZ_MUSIC.MUSIC3, new XCJZ_MUSIC_CLASS("阿迷嘎蒂朵喵喵", "曼波")],
    [XCJZ_MUSIC.MUSIC4, new XCJZ_MUSIC_CLASS("We Cant Stop", "Miley Cyrus")],

    [XCJZ_MUSIC.MUSIC5, new XCJZ_MUSIC_CLASS("On My Way", "Alan Walker")],
    [XCJZ_MUSIC.MUSIC6, new XCJZ_MUSIC_CLASS("Faded", "Alan Walker ")],
    [XCJZ_MUSIC.MUSIC7, new XCJZ_MUSIC_CLASS("Billie Jean", "Michael Jackson")],
    [XCJZ_MUSIC.MUSIC8, new XCJZ_MUSIC_CLASS("7 Years", "Lukas Graham")],
    [XCJZ_MUSIC.MUSIC9, new XCJZ_MUSIC_CLASS("Victory", "Two Steps From Hell")],
    [XCJZ_MUSIC.MUSIC10, new XCJZ_MUSIC_CLASS("Lost Control", "Alan Walker")],

    [XCJZ_MUSIC.MUSIC11, new XCJZ_MUSIC_CLASS("Unity", "TheFatRat")],
    [XCJZ_MUSIC.MUSIC12, new XCJZ_MUSIC_CLASS("The way I still love you", "Reynard Silva")],
    [XCJZ_MUSIC.MUSIC13, new XCJZ_MUSIC_CLASS("Stay With Me", "松原みき")],
    [XCJZ_MUSIC.MUSIC14, new XCJZ_MUSIC_CLASS("Moves Like Jagger", "Maroon 5")],
    [XCJZ_MUSIC.MUSIC15, new XCJZ_MUSIC_CLASS("MONTAGEM XONADA", "MXZI")],
    [XCJZ_MUSIC.MUSIC16, new XCJZ_MUSIC_CLASS("Melodic Minor", "VZEUS")],
    [XCJZ_MUSIC.MUSIC17, new XCJZ_MUSIC_CLASS("make me feel", "Janelle Monae")],
    [XCJZ_MUSIC.MUSIC18, new XCJZ_MUSIC_CLASS("Love Yourself", "Justin Bieber")],
    [XCJZ_MUSIC.MUSIC19, new XCJZ_MUSIC_CLASS("let me down slowly", "Alec Benjamin")],
    [XCJZ_MUSIC.MUSIC20, new XCJZ_MUSIC_CLASS("Infinity", "Jaymes Young")],
    [XCJZ_MUSIC.MUSIC21, new XCJZ_MUSIC_CLASS("Bones", "Imagine Dragons")],
    [XCJZ_MUSIC.MUSIC22, new XCJZ_MUSIC_CLASS("Black Soul", "Smoke")],
    [XCJZ_MUSIC.MUSIC23, new XCJZ_MUSIC_CLASS("MANGATA", "GTR7")],
    [XCJZ_MUSIC.MUSIC24, new XCJZ_MUSIC_CLASS("埃及摇", "鲨鱼")],
    [XCJZ_MUSIC.MUSIC25, new XCJZ_MUSIC_CLASS("music25", "singer25")],
    [XCJZ_MUSIC.MUSIC26, new XCJZ_MUSIC_CLASS("music26", "singer26")],
    [XCJZ_MUSIC.MUSIC27, new XCJZ_MUSIC_CLASS("music27", "singer27")],
    [XCJZ_MUSIC.MUSIC28, new XCJZ_MUSIC_CLASS("music28", "singer28")],
    [XCJZ_MUSIC.MUSIC29, new XCJZ_MUSIC_CLASS("music29", "singer29")],
]);

export enum XCJZ_MUSIC_TITLE {
    HOT,
    NEW,
    NONE,
}

export enum XCJZ_MUSIC_ITEM_TYPE {
    今日礼物,
    困难关卡,
    当前热门,
    猜你喜欢,
}

export enum XCJZ_SHOP_ITEM {
    每日钻石,
    炫彩球球,
    幻影球球,
    美少女,
    哪吒,
    可爱精灵,
    电音潮人,
    鬼马少女,
    潮酷男孩,
    刺头男孩,
    橄榄球手,
    哈吉米,
}

export const XCJZ_AWARD_CONFIG: number[] = [200, 150, 120];

export enum XCJZ_SET {
    音乐,
    音效,
    震动,
}

export enum XCJZ_ANI {
    Idle = "Idle",
    Dance = "Dance",
    Jump_Normal = "Jump_Normal",
    Jump_Rotate = "Jump_Rotate",
    Jump_Swim = "Jump_Swim",
}

export enum XCJZ_BLOCK {
    BLUE,
    YELLOW,
    PURPLE,
}

export enum XCJZ_GROUP {
    DEFAULT = 1 << 0,//梯子--方块
    A = 1 << 1,//触摸屏
    B = 1 << 2,//失败
}