import { style, keyframes, globalStyle } from '@vanilla-extract/css';

export const logo = style({
  height: '6em',
  padding: '1.5em',
  willChange: 'filter',
  transition: 'filter 300ms',
  
  ':hover': {
    filter: 'drop-shadow(0 0 2em #646cffaa)'
  }
});

export const reactLogo = style({
  ':hover': {
    filter: 'drop-shadow(0 0 2em #61dafbaa)'
  }
});

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

globalStyle('a:nth-of-type(2) .logo', {
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      animation: `${spin} 20s linear infinite`
    }
  }
});

export const card = style({
  padding: '2em'
});

export const readTheDocs = style({
  color: '#888'
}); 