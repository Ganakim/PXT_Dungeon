function setState(sprite: Sprite, newState: string, x: number, y: number) {}
function Move(sprite: Sprite, x: number, y: number) {
  if (y != 0 && sprite.vx == 0) {
    if (sprite.vy != y * 50) {
      animation.runImageAnimation(sprite, animations[1][y + 2], 200, true);
    }
    sprite.vy = y * 50;
    pause(300);
    sprite.y = Math.round((sprite.y - 8) / 16) * 16 + 8;
    if (Math.round(controller.dy(50)) != y) {
      sprite.vy = 0;
      animation.runImageAnimation(sprite, animations[0][y + 2], 200, true);
    }
  } else if (x != 0 && sprite.vy == 0) {
    if (sprite.vx != x * 50) {
      animation.runImageAnimation(sprite, animations[1][x + 1], 200, true);
    }
    sprite.vx = x * 50;
    pause(300);
    sprite.x = Math.round((sprite.x - 8) / 16) * 16 + 8;
    if (Math.round(controller.dx(50)) != x) {
      sprite.vx = 0;
      animation.runImageAnimation(sprite, animations[0][x + 1], 200, true);
    }
  }
}
let animations: Image[][][] = [];
animations = [
  [
    assets.animation`idleLeft`,
    assets.animation`idleUp`,
    assets.animation`idleRight`,
    assets.animation`idleDown`
  ],
  [
    assets.animation`walkkLeft`,
    assets.animation`walkkUp`,
    assets.animation`walkkRight`,
    assets.animation`walkkDown`
  ],
  [
    assets.animation`attackLeft`,
    assets.animation`attackUp`,
    assets.animation`attackRight`,
    assets.animation`attackDown`
  ],
];
scene.setBackgroundColor(7);
tiles.setCurrentTilemap(tilemap`level2`);
let princess = sprites.create(
  img`
    . . . . . f f 4 4 f f . . . . . 
    . . . . f 5 4 5 5 4 5 f . . . . 
    . . . f e 4 5 5 5 5 4 e f . . . 
    . . f b 3 e 4 4 4 4 e 3 b f . . 
    . . f 3 3 3 3 3 3 3 3 3 3 f . . 
    . f 3 3 e b 3 e e 3 b e 3 3 f . 
    . f 3 3 f f e e e e f f 3 3 f . 
    . f b b f b f e e f b f b b f . 
    . f b b e 1 f 4 4 f 1 e b b f . 
    f f b b f 4 4 4 4 4 4 f b b f f 
    f b b f f f e e e e f f f b b f 
    . f e e f b d d d d b f e e f . 
    . . e 4 c d d d d d d c 4 e . . 
    . . e f b d b d b d b b f e . . 
    . . . f f 1 d 1 d 1 d f f . . . 
    . . . . . f f b b f f . . . . . 
    `,
  SpriteKind.Player
);
setState(princess, "idle", 0, -1);
scene.cameraFollowSprite(princess);
tiles.placeOnRandomTile(princess, assets.tile`myTile`);
let spawn = princess.tilemapLocation();
tiles.setTileAt(spawn, sprites.castle.tileGrass1);
forever(function () {
  Move(princess, Math.round(controller.dx(50)), Math.round(controller.dy(50)));
});
