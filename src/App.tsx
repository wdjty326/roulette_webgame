import { useEffect, useRef, useState } from 'react'
import viteLogo from '/vite.svg'
import { logo, reactLogo as reactLogoStyle, card, readTheDocs } from './App.css.ts'
import GameScreen from './screens/gameScreens.ts'

function App() {
  const [count, setCount] = useState(0)
  // const [game, setGame] = useState<Phaser.Game | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
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
