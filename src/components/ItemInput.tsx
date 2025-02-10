import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import useRouletteStore from "../stores/store";
import { StyledApplyButton, StyledItemInput, StyledTextarea } from "./ItemInput.css";


const ItemInput = () => {
    const [value, setValue] = useState<string>('');
    const itemList = useRouletteStore((state) => state.itemList);

    useEffect(() => {
        const handleApply = () => {
            useRouletteStore.getState().setItemList([...itemList, { name: value, uuid: uuidv4() }]);
        };
        handleApply();
    }, [value]);


    return <div className={StyledItemInput}>
        <textarea className={StyledTextarea} value={value} onChange={(e) => setValue(e.target.value)}></textarea>
        <button className={StyledApplyButton}>적용</button>
    </div>;
};

export default ItemInput;