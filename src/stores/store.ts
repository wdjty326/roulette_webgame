import { v4 } from "uuid";
import { create } from "zustand";

interface RouletteStore {
    isRunning: boolean;
    itemList: Item[];
    
    setIsRunning: (isRunning: boolean) => void;
    setItemList: (itemList: Item[]) => void;
}

const useRouletteStore = create<RouletteStore>((set) => ({
    isRunning: false,
    itemList: [{ name: '짱아', uuid: v4() }, { name: '짱아', uuid: v4() }, { name: '짱구', uuid: v4() }],
    setIsRunning: (isRunning) => set({ isRunning }),
    setItemList: (itemList) => set({ itemList }),
}));

export default useRouletteStore;