// import { v4 } from "uuid";
import { create } from "zustand";
// import { ITEM_LABEL_PREFIX } from "../consts";

interface RouletteStore {
    isRunning: boolean;
    itemList: string[];
    
    setIsRunning: (isRunning: boolean) => void;
    setItemList: (itemList: string[]) => void;
    getItemListString: () => string;
}

const useRouletteStore = create<RouletteStore>((set,get) => ({
    isRunning: false,
    itemList: ['짱아', '짱아', '짱구', '짱구'],
    setIsRunning: (isRunning) => set({ isRunning }),
    setItemList: (itemList) => set({ itemList }),
    getItemListString: () => {
        // return get().itemList.reduce((item, arr) => {


        // }, []).map(item => item.name).join(', ');
        return '';
    }
}));

export default useRouletteStore;