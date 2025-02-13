import { useEffect, useRef } from 'react'
import Matter from 'matter-js';
import ZIGZAG_VALLEY_CONFIG from './maps/ZizzagValley';
import MainScreen from './screens/MainScreen';
import useRouletteStore from './stores/store';
import { v4 } from 'uuid';
import { ITEM_LABEL_PREFIX, WALL_LABEL_PREFIX } from './consts';


function App() {
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const previousItemRef = useRef<string>('');
  const itemsRef = useRef<Matter.Body[]>([]);

  // 엔진 상태 관리를 위한 ref 추가
  const runnerRef = useRef<Matter.Runner | null>(null);
  const isRunningRef = useRef<boolean>(useRouletteStore.getState().isRunning);  // 실행 상태 추적용 ref 추가

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

    // 미니맵 렌더러 생성
    const minimapRender = Render.create({
      element: targetRef.current,
      engine: engine,
      options: {
        width: 200,                    // 미니맵 크기
        height: 400,
        wireframes: false,
        background: '#1c1c1c',
        pixelRatio: 1,
        hasBounds: true
      }
    });

    // 미니맵 스타일 설정
    minimapRender.canvas.style.position = 'fixed';
    minimapRender.canvas.style.right = '20px';
    minimapRender.canvas.style.top = '20px';
    minimapRender.canvas.style.border = '2px solid #333';
    minimapRender.canvas.style.borderRadius = '10px';

    // 두 렌더러 실행
    Render.run(minimapRender);

    // 미니맵 뷰 설정
    Render.lookAt(minimapRender, {
      min: { x: 0, y: 0 },
      max: { x: ZIGZAG_VALLEY_CONFIG.width, y: ZIGZAG_VALLEY_CONFIG.height }
    });

    const renderItem = (list: string[]) => {
      // debugger;
      // if (previousItemRef.current === list.join(',')) return;
      // previousItemRef.current = list.join(',');
      console.log(previousItemRef.current, '???');
      let startX = ZIGZAG_VALLEY_CONFIG.width / 2;
      let startY = 200;

      // 없으면 제거
      Composite.remove(world, Matter.Composite.allBodies(world)
        .filter(body => body.label?.startsWith(ITEM_LABEL_PREFIX)));

      // 7가지 색상 정의
      const COLORS = [
        '#FF6B6B',  // 빨강
        '#4ECDC4',  // 청록
        '#45B7D1',  // 하늘
        '#96CEB4',  // 민트
        '#FFEEAD',  // 노랑
        '#D4A5A5',  // 분홍
        '#9B59B6'   // 보라
      ];

      // 랜덤 색상 선택 함수
      const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

      // 있으면 추가
      const bodies = list.map((item, index) => {
        const color = getRandomColor();
        const body = Bodies.circle(startX, startY, 40, {
          label: `${ITEM_LABEL_PREFIX}#${index}`,
          restitution: 0.8,
          friction: 0.01,
          density: 0.001,
          render: {
            fillStyle: color,
            sprite: {
              texture: `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="40" fill="${color.replace('#', '%23')}"/>
                <text x="40" y="40" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="16">${item}</text>
              </svg>`,
              xScale: 1,
              yScale: 1
            }
          }
        });
        startX += 120;
        return body;
      });

      if (bodies.length > 0) {
        Composite.add(world, bodies);
        Render.lookAt(render, bodies[0], {
            x: window.innerWidth,
            y: window.innerHeight / 2
          });
      }
      itemsRef.current = bodies;
    }

    useRouletteStore.subscribe((state) => {
      renderItem(state.itemList);

      const runner = runnerRef.current;
      if (!runner) return;

      if (isRunningRef.current !== state.isRunning) {
        isRunningRef.current = state.isRunning;
        if (isRunningRef.current) {
          runner.enabled = true;
        } else {
          runner.enabled = false;
        }
      }
    });


    const walls = ZIGZAG_VALLEY_CONFIG.walls.map(wall => {
      // TODO:: Bodies.fromVertices 로 바꿔야 함
      const ground = Bodies.rectangle(wall.x, wall.y, wall.width, wall.height, {
        label: WALL_LABEL_PREFIX + v4(),
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
    Composite.add(world, walls);
    Composite.add(world, [
      rotatingObstacle,
    ]);
    renderItem(useRouletteStore.getState().itemList);

    // runner 생성 및 저장
    const runner = Runner.create();
    runnerRef.current = runner;

    // run the engine
    Runner.run(runner, engine);
    runner.enabled = false;
    // Render.stop(render);

    // 카메라 따라가기
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (itemsRef.current.length === 0) return;
      const target = itemsRef.current.reduce((prev, current) => {
        const index = Composite.allBodies(world).findIndex(body => body.label === current.label);
        if (prev.position.y > current.position.y || index === -1) {
          return prev;
        } else {
          return current;
        }
      }, itemsRef.current[0]);
      Render.lookAt(render, target, {
        x: window.innerWidth,
        y: window.innerHeight / 2
      });
    });

    // 예시: 특정 라벨의 물체 제거
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (itemsRef.current.length === 0) return;
      itemsRef.current.forEach((item) => {
        if (item.position.y > ZIGZAG_VALLEY_CONFIG.height) {
          Composite.remove(world, item);
        }
      });
    });

    // cleanup
    return () => {
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

      // 미니맵 렌더러 정리
      Render.stop(minimapRender);
      minimapRender.canvas.remove();
    }
  }, [])


  return (
    <>
      <div ref={targetRef}></div>
      <MainScreen />
    </>
  )
}

export default App
