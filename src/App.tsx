import { useEffect, useRef } from 'react'
import Matter from 'matter-js';
import ZIGZAG_VALLEY_CONFIG from './maps/ZizzagValley';
import useRouletteStore, { useRouletteItemStore } from './stores/store';
import { v4 } from 'uuid';
import { ITEM_LABEL_PREFIX, ROTATING_OBSTACLE_LABEL_PREFIX, WALL_LABEL_PREFIX } from './consts';
import ItemInput from './components/ItemInput';
import StartButton from './components/StartButton';


function App() {
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<Matter.Body[]>([]);

  // 엔진 상태 관리를 위한 ref 추가
  const runnerRef = useRef<Matter.Runner | null>(null);
  const isMinimapRef = useRef<boolean>(false);

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
        y: 0,
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
    minimapRender.canvas.style.left = '20px';
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
      let startX = ZIGZAG_VALLEY_CONFIG.width / 2;
      let startY = 200;

      // 없으면 제거
      Composite.remove(world, Matter.Composite.allBodies(world)
        .filter(body => body.label?.startsWith(ITEM_LABEL_PREFIX)));
      // 20가지 색상 정의
      const COLORS = [
        '#FF6B6B',  // 빨강
        '#4ECDC4',  // 청록
        '#45B7D1',  // 하늘
        '#96CEB4',  // 민트
        '#FFEEAD',  // 노랑
        '#D4A5A5',  // 분홍
        '#9B59B6',  // 보라
        '#2ECC71',  // 초록
        '#E74C3C',  // 진한 빨강
        '#3498DB',  // 파랑
        '#F1C40F',  // 골드
        '#1ABC9C',  // 터콰이즈
        '#E67E22',  // 주황
        '#8E44AD',  // 진한 보라
        '#16A085',  // 다크 터콰이즈
        '#D35400',  // 진한 주황
        '#27AE60',  // 다크 그린
        '#2980B9',  // 진한 파랑
        '#F39C12',  // 밝은 주황
        '#C0392B'   // 버건디
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
          velocity: {
            x: 0,
            y: 0,
          },
          frictionAir: 0.01,
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
        Render.lookAt(render, bodies[bodies.length - 1], {
          x: window.innerWidth,
          y: window.innerHeight
        });
      }
      itemsRef.current = bodies;
    }

    useRouletteItemStore.subscribe((state) => {
      renderItem(state.itemList);
    });

    useRouletteStore.subscribe((state) => {
      const runner = runnerRef.current;
      if (!runner) return;

      if (state.isRunning) {
        engine.gravity.y = 1;
        runner.enabled = true;
      } else {
        engine.gravity.y = 0;
        runner.enabled = false;
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

    const rotatingObstacles = ZIGZAG_VALLEY_CONFIG.rotatingObstacles.map(obstacle => {
      const body = Bodies.rectangle(obstacle.x, obstacle.y, obstacle.width, obstacle.height, {
        label: ROTATING_OBSTACLE_LABEL_PREFIX + v4(),
        isStatic: true,
        angle: 0,
        render: {
          fillStyle: '#00F2FF'
        }
      });

      return body;
    });

    // 회전 애니메이션
    Matter.Events.on(engine, 'beforeUpdate', () => {
      // 매 프레임마다 0.02 라디안씩 회전
      rotatingObstacles.forEach(obstacle => {
        Matter.Body.rotate(obstacle, 0.02);
      });
    });

    // world에 추가 (기존 Composite.add 라인 수정)
    Composite.add(world, walls);
    Composite.add(world, rotatingObstacles);
    renderItem(useRouletteItemStore.getState().itemList);

    // runner 생성 및 저장
    const runner = Runner.create();
    runnerRef.current = runner;

    // run the engine
    Runner.run(runner, engine);
    // Render.stop(render);

    const moveCamera = () => {
      if (isMinimapRef.current) return;
      if (itemsRef.current.length === 0) return;

      // 현재 world에 존재하는 공들만 필터링
      const existingBodies = itemsRef.current.filter(item => 
        Composite.allBodies(world).some(body => body.label === item.label)
      );

      if (existingBodies.length === 0) return;

      // 존재하는 공들 중 가장 아래에 있는 공 찾기
      const target = existingBodies.reduce((lowest, current) => 
        current.position.y > lowest.position.y ? current : lowest
      , existingBodies[0]);

      Render.lookAt(render, target, {
        x: window.innerWidth,
        y: window.innerHeight
      });
    }

    // 카메라 따라가기
    Matter.Events.on(engine, 'afterUpdate', moveCamera);

    // 예시: 특정 라벨의 물체 제거
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (itemsRef.current.length === 0) return;
      itemsRef.current.forEach((item) => {
        if (item.position.y > ZIGZAG_VALLEY_CONFIG.height) {
          Composite.remove(world, item);
        }
      });
    });

    const handleMinimapMouseMove = (e: MouseEvent) => {
      isMinimapRef.current = true;
      const rect = minimapRender.canvas.getBoundingClientRect();
      const scaleX = ZIGZAG_VALLEY_CONFIG.width / minimapRender.canvas.width;
      const scaleY = ZIGZAG_VALLEY_CONFIG.height / minimapRender.canvas.height;

      // 미니맵에서의 마우스 위치를 실제 게임 좌표로 변환
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // 메인 뷰 이동
      Render.lookAt(render, {
        min: { x: x - window.innerWidth, y: y - window.innerHeight },
        max: { x: x + window.innerWidth, y: y + window.innerHeight }
      });
    }

    const handleMinimapMouseLeave = () => {
      isMinimapRef.current = false;
      moveCamera();
    }

    // 미니맵 마우스 이벤트 처리
    minimapRender.canvas.addEventListener('mousemove', handleMinimapMouseMove);
    minimapRender.canvas.addEventListener('mouseleave', handleMinimapMouseLeave);

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

      // 미니맵 마우스 이벤트 제거
      // minimapRender.canvas.removeEventListener('mousemove');
    }
  }, [])


  return (
    <>
      <div ref={targetRef}></div>
      <ItemInput />
      <StartButton />
    </>
  )
}

export default App
