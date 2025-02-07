import { useEffect, useRef } from 'react'
// import GameScreen from './screens/gameScreens.ts'
import Matter from 'matter-js';
import ZIGZAG_VALLEY_CONFIG from './maps/ZizzagValley';


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
    const height = 12800;

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
    const boxA = Bodies.circle(1000, 200, 40, {
      restitution: 0.8,  // 탄성 (0~1)
      friction: 0.01,    // 마찰 (낮을수록 잘 미끄러짐)
      density: 0.001,    // 밀도 (가벼울수록 잘 튕김)
      render: {
        fillStyle: '#F35e66'
      }
    });

    const boxB = Bodies.circle(1250, 50, 40, {
      restitution: 0.8,
      friction: 0.01,
      density: 0.001,
      render: {
        fillStyle: '#63C132'
      }
    });

    const walls = ZIGZAG_VALLEY_CONFIG.walls.map(wall => {
      const ground = Bodies.rectangle(wall.x, wall.y, wall.width, wall.height, { 
        isStatic: true, 
        angle: wall.angle,
        restitution: 0.8,  // 벽도 탄성 추가
        chamfer: { radius: 20 },
        friction: 0.01,
        render: {
          fillStyle: '#FFFFFF',
        } 
      });
      Matter.Body.setCentre(ground, { x: 0, y: 0 }, true);
      return ground;
    });

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
    Composite.add(world, [boxA, boxB, ...walls, floor, mouseConstraint]);

    // create runner
    const runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    // 카메라 따라가기
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (!boxB.position) return;
      Render.lookAt(render, boxB, {
        // x: width / 2,
        // y: height / 2
        x: window.innerWidth,
        y: window.innerHeight
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
