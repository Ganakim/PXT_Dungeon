namespace SpriteKind {
    export const Player_Attack = SpriteKind.create()
}
function currentAnimation () {
    for (let animation2 of animations) {
        if (animation2[currentDir()].indexOf(princess.image) != -1) {
            return animations.indexOf(animation2)
        }
    }
    return -1
}
function dirFromXY (x: number, y: number) {
    if (x != 0) {
        return x + 1
    } else if (y != 0) {
        return y + 2
    }
    console.log("This is a catastrophe")
    return -1
}
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    sprites.setDataNumber(princess, "animation", 0)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.setDataNumber(princess, "animation", 2)
})
function xFromDir (dir: number) {
    if (dir == 0) {
        return -1
    } else if (dir == 1) {
        return 0
    } else if (dir == 2) {
        return 1
    } else if (dir == 3) {
        return 0
    }
    return 0
}
function loadLevel (x: number, y: number) {
    tiles.setCurrentTilemap(map[x][y][0])
    sprites.setDataNumber(princess, "map.x", x)
    sprites.setDataNumber(princess, "map.y", y)
    tiles.placeOnRandomTile(princess, assets.tile`myTile`)
    spawn = princess.tilemapLocation()
    tiles.setCurrentTilemap(map[x][y][1])
}
function dx () {
    if (controller.B.isPressed()) {
        return 0
    }
    return Math.min(Math.max(-1, Math.round(controller.dx())), 1)
}
function dy () {
    if (dx() != 0 || controller.B.isPressed()) {
        return 0
    }
    return Math.min(Math.max(-1, Math.round(controller.dy())), 1)
}
function currentDir () {
    return dirFromXY(sprites.readDataNumber(princess, "x"), sprites.readDataNumber(princess, "y"))
}
function yFromDir (dir: number) {
    if (dir == 0) {
        return 0
    } else if (dir == 1) {
        return -1
    } else if (dir == 2) {
        return 0
    } else if (dir == 3) {
        return 1
    }
    return 0
}
function snapToGrid (sprite: Sprite) {
    sprite.x = Math.round((sprite.x - 8) / 16) * 16 + 8
    sprite.y = Math.round((sprite.y - 8) / 16) * 16 + 8
}
let attack: Sprite = null
let spawn: tiles.Location = null
let princess: Sprite = null
let animations: Image[][][] = []
let map: tiles.TileMapData[][][] = []
map = [[
[],
[],
[],
[tilemap`spawbs02`, tilemap`ground02`],
[]
], [
[],
[],
[],
[tilemap`spawns12`, tilemap`ground12`],
[]
], [
[],
[],
[],
[],
[]
]]
animations = [[
assets.animation`idleLeft`,
assets.animation`idleUp`,
assets.animation`idleRight`,
assets.animation`idleDown`
], [
assets.animation`walkLeft`,
assets.animation`walkUp`,
assets.animation`walkRight`,
assets.animation`walkDown`
], [
assets.animation`attackLeft`,
assets.animation`attackUp`,
assets.animation`attackRight`,
assets.animation`attackDown`
]]
princess = sprites.create(img`
    . . . . . f f 4 4 f f . . . . . 
    . . . . f 5 4 5 5 4 5 f . . . . 
    . . . f e 4 5 5 5 5 4 e f . 9 . 
    . . f b 3 e 4 4 4 4 e 3 b 9 1 9 
    . . f 3 3 3 3 3 3 3 3 3 3 f 9 . 
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
    `, SpriteKind.Player)
sprites.setDataNumber(princess, "animation", 0)
sprites.setDataNumber(princess, "x", 0)
sprites.setDataNumber(princess, "y", 1)
scene.cameraFollowSprite(princess)
loadLevel(1, 3)
tileUtil.setTileAt(map[sprites.readDataNumber(princess, "map.x")][sprites.readDataNumber(princess, "map.y")][0], spawn, assets.tile`transparency16`)
game.onUpdate(function () {
    if (sprites.readDataBoolean(princess, "moving")) {
        if (princess.x - scene.cameraProperty(CameraProperty.X) == -72 && sprites.readDataNumber(princess, "x") == -1) {
            if (map[sprites.readDataNumber(princess, "map.x") - 1][sprites.readDataNumber(princess, "map.y")].length > 0) {
                tiles.placeOnTile(princess, tiles.getTileLocation(tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Columns) - 1, princess.tilemapLocation().row))
                loadLevel(sprites.readDataNumber(princess, "map.x") - 1, sprites.readDataNumber(princess, "map.y"))
            }
        } else if (princess.x - scene.cameraProperty(CameraProperty.X) == 72 && sprites.readDataNumber(princess, "x") == 1) {
            if (map[sprites.readDataNumber(princess, "map.x") + 1][sprites.readDataNumber(princess, "map.y")].length > 0) {
                tiles.placeOnTile(princess, tiles.getTileLocation(0, princess.tilemapLocation().row))
                loadLevel(sprites.readDataNumber(princess, "map.x") + 1, sprites.readDataNumber(princess, "map.y"))
            }
        } else if (princess.y - scene.cameraProperty(CameraProperty.Y) == 52 && sprites.readDataNumber(princess, "y") == 1) {
            if (map[sprites.readDataNumber(princess, "map.x")][sprites.readDataNumber(princess, "map.y") + 1].length > 0) {
                tiles.placeOnTile(princess, tiles.getTileLocation(princess.tilemapLocation().column, 0))
                loadLevel(sprites.readDataNumber(princess, "map.x"), sprites.readDataNumber(princess, "map.y") + 1)
            }
        } else if (princess.y - scene.cameraProperty(CameraProperty.Y) == -52 && sprites.readDataNumber(princess, "y") == -1) {
            if (map[sprites.readDataNumber(princess, "map.x")][sprites.readDataNumber(princess, "map.y") - 1].length > 0) {
                tiles.placeOnTile(princess, tiles.getTileLocation(princess.tilemapLocation().column, tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Rows) - 1))
                loadLevel(sprites.readDataNumber(princess, "map.x"), sprites.readDataNumber(princess, "map.y") - 1)
            }
        }
    }
})
forever(function () {
    if (!(sprites.readDataBoolean(princess, "moving"))) {
        if (dx() == sprites.readDataNumber(princess, "x") && dy() == sprites.readDataNumber(princess, "y")) {
            sprites.setDataBoolean(princess, "moving", true)
            sprites.setDataNumber(princess, "animation", 1)
            sprites.setDataNumber(princess, "x", dx())
            sprites.setDataNumber(princess, "y", dy())
            princess.setVelocity(dx() * 50, dy() * 50)
            pause(300)
            sprites.setDataBoolean(princess, "moving", false)
            princess.setVelocity(0, 0)
            snapToGrid(princess)
        } else if (dx() != 0 || dy() != 0) {
            sprites.setDataNumber(princess, "x", dx())
            sprites.setDataNumber(princess, "y", dy())
            pause(60)
        } else {
            if (sprites.readDataNumber(princess, "animation") == 1) {
                sprites.setDataNumber(princess, "animation", 0)
            }
        }
    }
})
game.onUpdate(function () {
    if (currentAnimation() != sprites.readDataNumber(princess, "animation")) {
        animation.runImageAnimation(
        princess,
        animations[sprites.readDataNumber(princess, "animation")][currentDir()],
        150,
        true
        )
    }
})
forever(function () {
    if (currentAnimation() == 2 && !(sprites.readDataBoolean(princess, "moving"))) {
        attack = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Player_Attack)
        attack.setPosition(princess.x, princess.y)
        attack.x += sprites.readDataNumber(princess, "x") * 16
        attack.y += sprites.readDataNumber(princess, "y") * 16
        attack.lifespan = 300
        animation.runImageAnimation(
        attack,
        [img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . 9 . . . . 
            . . . 9 . . . . . . 9 1 9 . . . 
            . . 9 1 9 . . . . . . 9 . . . . 
            . . . 9 . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . 9 . . . . . . . 
            . . . . . . . 9 1 9 . . . . . . 
            . . 9 . . . . . 9 . . . . . . . 
            . 9 1 9 . . . . . . . . . . . . 
            . . 9 . . . . . . . . . . . . . 
            . . . . . . . . . . . . . 9 . . 
            . . . . . . . . . . . . 9 1 9 . 
            . . . . . . . . . . . . . 9 . . 
            `,img`
            . . . . . . . . . . . . . . . . 
            . . . . . . 9 . . . . . . . . . 
            . . . . . 9 1 9 . . . . . . . . 
            . . . . . . 9 . . . . . . . . . 
            . . . . . . . . . . . . . 9 . . 
            . . . . . . . . . . . . 9 1 9 . 
            . . . . . . . . . . . . . 9 . . 
            . 9 . . . . 9 . . . . . . . . . 
            9 1 9 . . 9 1 9 . . . . . . . . 
            . 9 . . . . 9 . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . 9 . . . . . . . 
            . . . . . . . 9 1 9 . . . . . . 
            . . . . . . . . 9 . . . . . . . 
            `,img`
            . . . . . . . . . 9 . . . . . . 
            . . . . . . . . 9 1 9 . . . . . 
            . . . . . . . . . 9 . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . 9 . . . . . . . . . . . . . 
            . 9 1 9 . . . . . . . . . . . . 
            . . 9 . . . . . 9 . . . . . . . 
            . . . . . . . 9 1 9 . . . . . . 
            . . . . . . . . 9 . . . . . 9 . 
            . . . . . . . . . . . . . 9 1 9 
            . . . . . . . . . . . . . . 9 . 
            . . . . . . . . . . . . . . . . 
            . . . . . 9 . . . . . . . . . . 
            . . . . 9 1 9 . . . . . . . . . 
            . . . . . 9 . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `],
        100,
        true
        )
        pause(250)
    }
})
