import ItemInput from "../components/ItemInput";
import { useMatterContext } from "../matter";
import StyledMainScreen from "./MainScreen.css";

const MainScreen = () => {
  const { runner, togglePause } = useMatterContext();
  return <div className={StyledMainScreen}>
    <button onClick={togglePause}>{runner?.enabled ? '일시정지' : '재개'}</button>
    <ItemInput />
  </div>;
};

export default MainScreen;
