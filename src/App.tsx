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
      Body = Matter.Body,
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

    // SVG 경로 정의
    const svgPath = `M 1110 -12.0546 
      L 1112.18 1187.94
      L 357.197 2096.9
      M 1830 -0.054595
      L 1832.18 1199.94
      L 1094.2 2088.51
      M 1287.85 4004.15
      L 359.976 3243.2
      M 1985.46 3989.19
      L 1075.97 3243.2
      M 364 2068.95
      L 366.184 3268.94
      M 1084 2080.95
      L 1086.18 3280.94
      M 1219 3965.95
      L 1221.18 5165.94
      M 1939 3977.95
      L 1941.18 5177.94
      M 1210.89 5184.15
      L 315.888 6362.15
      M 1930.77 5159.69
      L 2828.77 6325.69
      M 339.181 7610.24
      L 1464.18 9142.24
      M 2812.9 7561.73
      L 1746.9 9148.73
      M 321.995 6343.46
      L 344.995 7627.46
      M 2816 6310.5
      L 2816 7544.5
      M 1468 9131.95
      L 1470.18 10331.9
      M 1750 9131.95
      L 1752.18 10331.9`;
    // SVG 요소 생성
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    path.setAttribute('d', svgPath);
    svg.appendChild(path);
    document.body.appendChild(svg);  // 임시로 DOM에 추가

    // SVG path를 vertices로 변환
    const vertices = Matter.Svg.pathToVertices(path, 1);
    
    document.body.removeChild(svg);  // DOM에서 제거

    // SVG로 벽 생성
    const svgWall = Bodies.fromVertices(0, 0, [vertices], {
      isStatic: true,
      render: {
        fillStyle: '#FFFFFF'
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

    // 회전하는 장애물 생성
    const rotatingObstacle = Bodies.rectangle(-400, 5000, 800, 20, {
      isStatic: true,
      angle: 0,
      render: {
        fillStyle: '#FF4444'
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
      floor, 
      rotatingObstacle,  // 회전하는 장애물 추가
      mouseConstraint,
      svgWall,
    ]);

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
