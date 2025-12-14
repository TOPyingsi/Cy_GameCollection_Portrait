import { _decorator, Component, sys } from 'cc';
import { sharesData } from '../SSL_sharesData';
const { ccclass, property } = _decorator;

export class PrefsManager {
    public static ClearData() {
        sys.localStorage.clear();
    }
    public static GetItem(key: string) {
        if (!sys.localStorage.getItem(key)) return null;
        return sys.localStorage.getItem(key);
    }
    public static GetShares(key: string) {
        if (!sys.localStorage.getItem(key)) return null;
        return (sys.localStorage.getItem(key));
    }

    public static SetString(key: string, value: string) {
        sys.localStorage.setItem(key, value);
    }

    public static GetString(key: string, defaultValue: string = "") {
        if (PrefsManager.GetItem(key)) {
            return sys.localStorage.getItem(key).toString();
        }
        return defaultValue;
    }

    public static GetBool(key: string, defaultValue: boolean = false) {
        if (sys.localStorage.getItem(key) == null || isNaN(Number(sys.localStorage.getItem(key)))) return defaultValue;
        return Boolean(Number(sys.localStorage.getItem(`${key}`)));
    }

    public static SetBool(key: string, value: boolean) {
        sys.localStorage.setItem(key, Number(value).toString());
    }
    public static SetShares(key: string, value: sharesData) {
        sys.localStorage.setItem(key, JSON.stringify(value));
    }

    public static SetNumber(key: string, value: any) {
        sys.localStorage.setItem(key, value.toString());
    }

    public static GetNumber(key: string, defaultValue: number = 0) {
        if (!sys.localStorage.getItem(key)) return defaultValue;
        return Number(sys.localStorage.getItem(key));
    }
}