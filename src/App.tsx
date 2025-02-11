import { useCallback, useEffect, useRef } from 'react'
// import GameScreen from './screens/gameScreens.ts'
import Matter from 'matter-js';
import ZIGZAG_VALLEY_CONFIG from './maps/ZizzagValley';
import MatterContext from './matter';
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
  const isRunningRef = useRef<boolean>(true);  // 실행 상태 추적용 ref 추가

  // 일시정지/재개 함수
  const togglePause = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const runner = runnerRef.current;
    if (!runner) return;

    isRunningRef.current = !isRunningRef.current;  // 상태 토글

    if (!isRunningRef.current) {
      // 일시정지
      runner.enabled = false;  // Runner의 enabled 속성을 직접 수정
    } else {
      // 재개
      runner.enabled = true;
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

    const renderItem = (list: string[]) => {
      // debugger;
      // if (previousItemRef.current === list.join(',')) return;
      // previousItemRef.current = list.join(',');

      let startX = 1000;
      let startY = 200;

      // 없으면 제거
      Matter.Composite.allBodies(world)
        .filter(body => body.label?.startsWith(ITEM_LABEL_PREFIX))
        .forEach(body => {
          Composite.remove(world, body);
        });

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
        startX += 80;
        return body;
      });

      if (bodies.length > 0) {
        Composite.add(world, bodies);
        Render.lookAt(render, bodies[0], {
          // x: width / 2,
          // y: height / 2
          x: ZIGZAG_VALLEY_CONFIG.width / 2,
          y: 0
        });
      }
      itemsRef.current = bodies;
    }

    useRouletteStore.subscribe((state) => {
      renderItem(state.itemList);
    });

    renderItem(useRouletteStore.getState().itemList);

    // // create two boxes and a ground
    // const boxA = Bodies.circle(1000, 200, 40, {
    //   label: 'ball_1',  // 고유 라벨 추가
    //   restitution: 0.8,
    //   friction: 0.01,
    //   density: 0.001,
    //   render: {
    //     fillStyle: '#F35e66'
    //   }
    // });

    // const boxB = Bodies.circle(1250, 50, 40, {
    //   label: 'ball_2',  // 고유 라벨 추가
    //   restitution: 0.8,
    //   friction: 0.01,
    //   density: 0.001,
    //   render: {
    //     fillStyle: '#63C132'
    //   }
    // });

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

    // run the engine
    Runner.run(runner, engine);
    runner.enabled = false;
    // Render.stop(render);

    // 카메라 따라가기
    Matter.Events.on(engine, 'afterUpdate', () => {
      if (itemsRef.current.length === 0) return;
      const target = itemsRef.current.reduce((prev, current) => {
        if (prev.position.y > current.position.y) {
          return prev;
        } else {
          return current;
        }
      }, itemsRef.current[0]);
      Render.lookAt(render, target, {
        // x: width / 2,
        // y: height / 2
        x: ZIGZAG_VALLEY_CONFIG.width / 2,
        y: 0
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
