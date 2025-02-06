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
    const engine = Engine.create({
      gravity: {
        x: 0,
        y: 1
      }
    });
    engineRef.current = engine;

    const width = 2880;
    const height = 9000;

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
    const boxA = Bodies.rectangle(1000, 200, 80, 80);
    const boxB = Bodies.rectangle(1250, 50, 80, 80);
    // 수직 벽의 높이와 위치 계산
    const wallHeight = height / 4;
    const wallY = height / 4 - 60;
    const leftX = width / 2 - 800;
    const rightX = width / 2 + 800;

    // 수직 벽
    const ground = Bodies.rectangle(leftX, wallY, 64, wallHeight, { isStatic: true });
    const ground2 = Bodies.rectangle(rightX, wallY, 64, wallHeight, { isStatic: true });
    
    // 45도 기울어진 벽 - 수직 벽의 정확한 끝점에서 시작
    const ground3 = Bodies.rectangle(
      leftX - (wallHeight/2) * Math.sin(Math.PI/4),  // x: 왼쪽 벽 끝점에서 시작
      wallY + (wallHeight / 2) + (wallHeight/2) * Math.cos(Math.PI/4),  // y: 왼쪽 벽 끝점에서 시작
        64,
        wallHeight,
        { isStatic: true, angle: Math.PI / 4 }
    );
    
    const ground4 = Bodies.rectangle(
        rightX - (wallHeight/2) * Math.sin(Math.PI/4),                    // 오른쪽 벽과 같은 x 위치
        wallY + (wallHeight/2) + (wallHeight/2) * Math.cos(Math.PI/4),       // 오른쪽 벽의 정확한 끝점 y 위치
        64,
        wallHeight,
        { isStatic: true, angle: Math.PI / 4 }
    );


    // 수직 벽
    const ground5 = Bodies.rectangle(leftX - (wallHeight) * Math.sin(Math.PI/4), wallY + (wallHeight) + (wallHeight) * Math.cos(Math.PI/4), 64, wallHeight, { isStatic: true });
    const ground6 = Bodies.rectangle(rightX - (wallHeight) * Math.sin(Math.PI/4),  wallY + (wallHeight) + (wallHeight) * Math.cos(Math.PI/4), 64, wallHeight, { isStatic: true });
    
    // 수직 벽
    const ground7 = Bodies.rectangle(leftX - (wallHeight) * Math.sin(Math.PI/4), wallY + (wallHeight) + (wallHeight) * Math.cos(Math.PI/4), 64, wallHeight, { isStatic: true });
    const ground8 = Bodies.rectangle(rightX - (wallHeight) * Math.sin(Math.PI/4),  wallY + (wallHeight) + (wallHeight) * Math.cos(Math.PI/4), 64, wallHeight, { isStatic: true });
    

    const floor = Bodies.rectangle(
        width/2,      // x: 사각형의 중심점 x좌표
        height - 30,  // y: 사각형의 중심점 y좌표
        width,        // width: 사각형의 전체 너비
        60,          // height: 사각형의 전체 높이
        { 
            isStatic: true 
        }
    );
    

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
    Composite.add(world, [boxA, boxB, ground, ground2, ground3, ground4, ground5, ground6, ground7, ground8, floor, mouseConstraint]);

    // create runner
    const runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    // 카메라 따라가기
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (!boxB.position) return;
      Render.lookAt(render, boxB, {
        x: width / 2, // window.innerWidth,
        y: width / 2, // window.innerHeight
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
