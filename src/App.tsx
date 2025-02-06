import { useEffect, useRef, useState } from 'react'
// import GameScreen from './screens/gameScreens.ts'
import Matter from 'matter-js';

function App() {
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
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    // create an engine
    const engine = Engine.create();
    engineRef.current = engine;

    const world = engine.world;
    // create a renderer
    const render = Render.create({
      element: targetRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        hasBounds: true
      }
    });
    renderRef.current = render;
    // run te renderer
    Render.run(render);
    // create two boxes and a ground
    const boxA = Bodies.rectangle(400, 200, 80, 80);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
      }
    });

    // 마우스 위치를 뷰포트에 맞게 조정
    Matter.Events.on(engine, 'beforeUpdate', () => {
      const bounds = render.bounds;
      const offset = {
        x: bounds.min.x,
        y: bounds.min.y
      };
      
      // 마우스 위치 업데이트
      mouse.absolute.x = mouse.position.x + offset.x;
      mouse.absolute.y = mouse.position.y + offset.y;
    });

    // world(mouseConstraint);
    // add all of the bodies to the world
    Composite.add(world, [boxA, boxB, ground, mouseConstraint]);

    // create runner
    const runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    // 카메라 따라가기
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (!boxB.position) return;
      Render.lookAt(render, boxB, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    });

    return () => {
      // 이벤트 리스너 제거
      Matter.Events.off(engine, 'beforeUpdate');
      Matter.Events.off(engine, 'afterUpdate');

      // 러너 정지
      Runner.stop(runner);

      // 렌더러 정지 및 캔버스 제거
      Render.stop(render);
      render.canvas.remove();
      
      // 엔진 초기화
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);

      // 참조 제거
      engineRef.current = null;
      renderRef.current = null;
    }
  }, [])


  return (
    <div ref={targetRef}></div>
  )
}

export default App
