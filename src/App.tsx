import { useEffect, useRef, useState } from 'react'
// import GameScreen from './screens/gameScreens.ts'
import Matter from 'matter-js';

function App() {
  const [count, setCount] = useState(0)
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    // module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    // create an engine
    const engine = Engine.create();
    engineRef.current = engine;
    // create a renderer
    const render = Render.create({
      element: targetRef.current,
      engine: engine
    });
    renderRef.current = render;
    // run te renderer
    Render.run(render);

    // create two boxes and a ground
    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(engine.world, [boxA, boxB, ground]);

    // create runner
    const runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
    return () => {
      Runner.stop(runner);
      Render.stop(render);
    }
  }, [])


  return (
    <div ref={targetRef}></div>
  )
}

export default App
