import { createContext, useContext } from "react";

export const MatterContext = createContext<{
    engine: Matter.Engine | null;
    runner: Matter.Runner | null;
    items:  Matter.Body[];
    togglePause: () => void;
}>({
    engine: null,
    runner: null,
    items: [],
    togglePause: () => {},
});
export const useMatterContext = () => {
    const context = useContext(MatterContext);
    if (!context) {
        throw new Error('useMatterContext must be used within a MatterProvider');
    }
    return context;
};
export default MatterContext;