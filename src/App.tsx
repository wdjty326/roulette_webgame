import { useCallback, useEffect, useRef } from 'react'
// import GameScreen from './screens/gameScreens.ts'
import Matter from 'matter-js';
import ZIGZAG_VALLEY_CONFIG from './maps/ZizzagValley';
import MatterContext from './matter';
import MainScreen from './screens/MainScreen';


function App() {
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<{
    body: Matter.Body;
    name: string;
  }[]>([]);

  // 엔진 상태 관리를 위한 ref 추가
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  // 일시정지/재개 함수
  const togglePause = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const runner = runnerRef.current;
    if (!runner) return;
    if (runner.enabled) {
      // 일시정지
      Matter.Runner.stop(runner);
    } else {
      // 재개
      Matter.Runner.start(runner, engine);
    }
  }, []);

  useEffect(() => {
    if (!targetRef.current) return;

    // module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    // create an engine
    const engine = Engine.create({
      gravity: {
        x: 0,
        y: 1
      }
    });
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
      // TODO:: Bodies.fromVertices 로 바꿔야 함
      const ground = Bodies.rectangle(wall.x, wall.y, wall.width, wall.height, { 
        isStatic: true, 
        angle: wall.angle,
        restitution: 0.8,  // 벽도 탄성 추가
        chamfer: { radius: 0 },
        friction: 0.01,
        render: {
          fillStyle: '#00F2FF',
        } 
      });
      Matter.Body.setCentre(ground, { x: 0, y: 0 }, true);
      return ground;
    });

    // const floor = Bodies.rectangle(
    //     width/2,      // x: 사각형의 중심점 x좌표
    //     height - 30,  // y: 사각형의 중심점 y좌표
    //     width,        // width: 사각형의 전체 너비
    //     60,          // height: 사각형의 전체 높이
    //     { 
    //         isStatic: true 
    //     }
    // );
    

    // const mouse = Mouse.create(render.canvas);
    // const mouseConstraint = MouseConstraint.create(engine, {
    //   mouse: mouse,
    //   constraint: {
    //     stiffness: 0.2,
    //   }
    // });

    // 마우스 위치를 뷰포트에 맞게 조정
    Matter.Events.on(engine, 'beforeUpdate', () => {
      // const bounds = render.bounds;
      // const offset = {
      //   x: bounds.min.x,
      //   y: bounds.min.y
      // };
      
      // 마우스 위치 업데이트
      // mouse.absolute.x = mouse.position.x + offset.x;
      // mouse.absolute.y = mouse.position.y + offset.y;
    });

    // 회전하는 장애물 생성
    const rotatingObstacle = Bodies.rectangle(-400, 5000, 800, 20, {
      isStatic: true,
      angle: 0,
      render: {
        fillStyle: '#00F2FF'
      }
    });

    // 회전 애니메이션
    Matter.Events.on(engine, 'beforeUpdate', () => {
      // 매 프레임마다 0.02 라디안씩 회전
      Matter.Body.rotate(rotatingObstacle, 0.02);
    });

    // world에 추가 (기존 Composite.add 라인 수정)
    Composite.add(world, [
      boxA, 
      boxB, 
      ...walls, 
      // floor, 
      rotatingObstacle,  // 회전하는 장애물 추가
      // mouseConstraint,
    ]);

    // runner 생성 및 저장
    const runner = Runner.create();
    runnerRef.current = runner;

    // 키보드 이벤트 리스너
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        togglePause();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);


    Render.lookAt(render, boxB, {
      // x: width / 2,
      // y: height / 2
      x: ZIGZAG_VALLEY_CONFIG.width / 2,
      y: 0
    });

    // run the engine
    Runner.run(runner, engine);
    // Render.stop(render);

    // 카메라 따라가기
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (!boxB.position) return;
      Render.lookAt(render, boxB, {
        // x: width / 2,
        // y: height / 2
        x: ZIGZAG_VALLEY_CONFIG.width,
        y: window.innerHeight
      });
    });

    // Matter.Events.on(engine, 'afterUpdate', () => {
    //   if (boxA.position.y > ZIGZAG_VALLEY_CONFIG.height) {
    //     Composite.remove(world, boxA);
    //   }

    //   if (boxB.position.y > ZIGZAG_VALLEY_CONFIG.height) {
    //     Composite.remove(world, boxB);
    //   }
    // });

    // cleanup
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      // 이벤트 리스너 제거
      Matter.Events.off(engine, 'beforeUpdate');
      Matter.Events.off(engine, 'afterUpdate');

      // 러너 정지
      Matter.Runner.stop(runner);

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
    <MatterContext.Provider value={{ engine: engineRef.current, runner: runnerRef.current, items: itemsRef.current, togglePause }}>
      <div ref={targetRef}></div>
      <MainScreen />
    </MatterContext.Provider>
  )
}

export default App
