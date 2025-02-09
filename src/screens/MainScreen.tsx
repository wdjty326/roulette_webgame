import { useMatterContext } from "../matter";
import StyledMainScreen from "./MainScreen.css";

const MainScreen = () => {
  const { runner, togglePause } = useMatterContext();
  return <div className={StyledMainScreen}>
    <button onClick={togglePause}>{runner?.enabled ? '일시정지' : '재개'}</button>
  </div>;
};

export default MainScreen;
