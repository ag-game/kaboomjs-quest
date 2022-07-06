// get the height and width of the screen to use for centering things
const w = width();
const h = height();

// get a message like "you win" or "you lose" to display
// at the start, just display "welcome to"
const message = args.gameState || 'Welcome to';

// create ui later and make it fixed in place
layers([
  'ui',
], 'ui');
camIgnore(['ui']);

// add all the text to this screen
add([
  text(message, 18),
  origin('center'),
  pos(w / 2, h / 2 - 60),
  layer('ui'),
]);
add([
  text('Kaboom Quest', 30),
  color(1, 0, 1),
  origin('center'),
  pos(w / 2, h / 2),
  layer('ui'),
]);
add([
  text('Press space to start', 14),
  origin('center'),
  pos(w / 2, h / 2 + 60),
  layer('ui'),
]);

// make the game start when users press the space bar
keyDown('space', () => {
  go('game');
});
