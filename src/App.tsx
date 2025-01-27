import { useEffect, useRef, useState } from 'react'
import GameScreen from './screens/gameScreens.ts'

function App() {
  const [count, setCount] = useState(0)
  const gameRef = useRef<Phaser.Game | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.WEBGL,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'matter',
        matter: {
          gravity: {
            x: 0,
            y: 0.5
          }
        }
      },
      scene: [GameScreen]
    })
    gameRef.current = game;
    game.scene.start('roulette');
    targetRef.current.appendChild(game.canvas);

    return () => {
      game.destroy(true);
      gameRef.current = null;
    }
  }, [])


  return (
    <div ref={targetRef}></div>
  )
}

export default App
