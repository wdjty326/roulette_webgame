import { useEffect, useState } from "react";
import useRouletteStore from "../stores/store";
import { StyledApplyButton, StyledItemInput, StyledTextarea } from "./ItemInput.css";


const ItemInput = () => {
    const [value, setValue] = useState<string>(useRouletteStore.getState().getItemListString());

    useEffect(() => {
        const handleApply = () => {
            useRouletteStore.getState().setItemListString(value);
        };
        handleApply();
    }, [value]);


    return <div className={StyledItemInput}>
        <textarea className={StyledTextarea} value={value} onChange={(e) => setValue(e.target.value)}></textarea>
        <button className={StyledApplyButton}>적용</button>
    </div>;
};

export default ItemInput;