import { create } from "zustand";

interface RouletteItemStore {
    itemList: string[];
    setItemList: (itemList: string[]) => void;
    getItemListString: () => string;
    setItemListString: (itemListString: string) => void;
}

export const useRouletteItemStore = create<RouletteItemStore>((set, get) => ({
    itemList: ['짱아', '짱아', '짱구', '짱구'],
    setItemList: (itemList) => set({ itemList }),
    getItemListString: () => {
        type FindItem = {
            name: string;
            count: number;
        };
        return get().itemList.reduce((arr, name) => {
            const findItem = arr.find((item) => item.name === name);
            if (findItem) {
                findItem.count++;
            } else {
                arr.push({ name, count: 1 });
            }
            return arr;
        }, [] as FindItem[])
        .map((item) => item.count === 1 ? `${item.name}` : `${item.name}*${item.count}`).join(', ');
    },
    setItemListString: (itemListString) => {
        const itemList = itemListString.split(', ').map((item) => {
            const [name, count] = item.split('*');
            return { name, count: count ? parseInt(count) : 1 };
        }).reduce((arr, item) => {
            for (let i = 0; i < item.count; i++) {
                arr.push(item.name);
            }
            return arr;
        }, [] as string[]);
        set({ itemList });
    }
}));

interface RouletteStore {
    isRunning: boolean;    
    setIsRunning: (isRunning: boolean) => void;
}

const useRouletteStore = create<RouletteStore>((set) => ({
    isRunning: false,
    setIsRunning: (isRunning) => set({ isRunning }),
}));

export default useRouletteStore;