import useRouletteStore from "../stores/store";
import { StyledStartButton } from "./StartButton.css";

const StartButton = () => {
    const isRunning = useRouletteStore((state) => state.isRunning);
    return <button className={StyledStartButton} onClick={() => {
        useRouletteStore.setState({ isRunning: !isRunning });
    }}>{isRunning ? '초기화' : '시작'}</button>;
};

export default StartButton;