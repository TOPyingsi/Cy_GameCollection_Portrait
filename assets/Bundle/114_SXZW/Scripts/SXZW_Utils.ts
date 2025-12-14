import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export class SXZW_Utils {

    static getComponentInParent<T extends Component>(node: Node, componentType: new (...args: any[]) => T): T {
        let parent = node.parent;

        while (parent) {
            const comp = parent.getComponent(componentType);
            if (comp) {
                return comp
            }
            parent = parent.parent;
        }
        return null
    }

    static JsonTryParse(str: string, defaultValue: any = null) {
        if (!str) return defaultValue;
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
        }
    }

}


