// Kaboom docs: https://kaboomjs.com/
// Kaboom Editor info: https://docs.replit.com/tutorials/kaboom

// create layers to add things to, set "objects" layer as the default
layers([
  'background',
  'objects',
  'ui',
], 'objects');

// create the platformer level design (right here in the code!)
// X creates skeletons, = creates ground blocks, and O creates the winning portal
const map = addLevel([
  "  ==     = =                    X  O ",
  "             =====           X  = =  ",
  "=    =             ===    =====      ",
  "=       =             X =            ",
  "= =   X    =     X  ===             =",
  "======= == ================== =======",
  "       =  =                  =       ",
], {
    width: 20,
    height: 20,
    pos: vec2(0, 0),
    '=': [
      sprite('grass'),
      solid(),
      'ground'
    ],
    'X': [
      sprite('skeleton'),
      body(),
      'enemy',
    ],
    'O': [
      sprite('portal'),
      'portal',
    ],
  }
);

// create our player
const player = add([
  sprite('mage'), // use the 'mage' sprite
  pos(20, 80),
  body(), // make gravity and jumping work for our player
  'player',
]);

// give our player the ability to move and jump
const SPEED = 50;
keyPress('up', () => {
  if (player.grounded()) {
    player.jump(250);
  }
});
keyDown('right', () => {
  player.move(SPEED, 0);
});
keyDown('left', () => {
  player.move(-SPEED, 0);
});
player.action(() => {
  camPos(player.pos); // make camera follow the player
  player.resolve(); // make the player not fall through the ground
});

// give player ability to cast a fire ball spell
keyPress('space', () => {
  play('whoosh'); // play the 'whoosh' noise
  add([
    sprite('fireball'),
    pos(player.pos.add(vec2(10, 5))), // start the fireball about where the player's forward hand is
    'spell', // add a 'spell' label to use elsewhere in the code
    'projectile',
    {
      dir: vec2(1, 0),
      speed: 70,
    }
  ]);
});

// move the spells (the fireballs) after they are cast
action('spell', (spell) => {
  spell.move(spell.dir.scale(spell.speed));
});

// destroy the spell 1 second after cast
on('add', 'spell', (spell) => {
  wait(1, () => {
    destroy(spell);
  });
})

// destroy both the enemy and the spell when they hit each other
overlaps('spell', 'enemy', (s, k) => {
  destroy(s);
  destroy(k);
  score++;
  scoreUi.text = score;
})

// make the skeleton enemies shoot arrows every 2 seconds
loop(2, () => {
  every('enemy', e => {
    add([
      sprite('arrow'),
      pos(e.pos.add(vec2(-10, 5))),
      'arrow',
      'projectile',
      {
        dir: vec2(-1, 0),
        speed: 70,
      }
    ]);
  })
});

// move the arrows
action('arrow', (arrow) => {
  arrow.move(arrow.dir.scale(arrow.speed));
});

// end the game if an arrow hits the player
overlaps('arrow', 'player', (s, k) => {
  play('doing');
  go('menu', { gameState: 'You lose... try again!' });
});

// destroy arrows and spells (projectiles) if they hit ground blocks
overlaps('projectile', 'ground', (projectile, ground) => {
  destroy(projectile);
})

// create the portal that the player wins the game by touching
loop(0.5, () => {
  every("portal", (obj) => {
    obj.color = rand(rgb(0, 0, 0), rgb(1, 1, 1));
  });
});
overlaps('portal', 'player', (s, k) => {
  play('ding');
  go('menu', { gameState: 'You win :) Woohoo!' });
});

// add background (the forest image is 785 pixels by 455 pixels)
add([
  sprite("forest"),
  origin("topleft"),
  scale(width() / 785, height() / 455),
  layer("background")
]);

// make the background and ui (user interface) layers fixed in place / not move with camera
camIgnore(['background', 'ui']);
camScale(2);

// create the score ui, which is updated when an enemy is destroyed
let score = 0;
const scoreUi = add([
  text(score, 16),
  pos(width()/2, 10),
  layer('ui'),
]);

// add instructions to the top left of the screen
add([
  text('arrow keys - move', 12),
  pos(10, 10),
  layer('ui')
]);
add([
  text('space - fire ball', 12),
  pos(10, 30),
  layer('ui')
]);
