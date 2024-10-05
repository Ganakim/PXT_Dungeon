namespace SpriteKind {
    export const Player_Attack = SpriteKind.create()
    export const Player_Character = SpriteKind.create()
    export const Dungeon_Worker = SpriteKind.create()
}
namespace MultiplayerState {
    export const animation = MultiplayerState.create()
    export const x = MultiplayerState.create()
    export const y = MultiplayerState.create()
    export const moving = MultiplayerState.create()
}
function currentAnimation (playerId: number) {
    if (mp.getPlayerSprite(mp.getPlayerByIndex(playerId)) != runtimeVariables.undefinedValue()) {
        for (let a of animations[playerId]) {
            if (a[currentDir(playerId)].indexOf(mp.getPlayerSprite(mp.getPlayerByIndex(playerId)).image) != -1) {
                return animations[playerId].indexOf(a)
            }
        }
    }
    return 0
}
function dirFromXY (x: number, y: number) {
    if (x != 0) {
        return x + 1
    } else if (y != 0) {
        return y + 2
    }
    return -1
}
mp.onButtonEvent(mp.MultiplayerButton.A, ControllerButtonEvent.Released, function (p) {
    mp.setPlayerState(p, MultiplayerState.animation, 0)
})
function generateRoom (dWidth: number, dHeight: number) {
    worker = sprites.create(img`
        f 
        `, SpriteKind.Dungeon_Worker)
    worker.sx = rng.randomRange(3, 8)
    worker.sy = rng.randomRange(3, 8)
    worker.x = rng.randomRange(Math.ceil(worker.sx / 2), dWidth - Math.ceil(worker.sx / 2))
    if (worker.sx % 2 != 0) {
        worker.x += 0.5
    }
    worker.y = rng.randomRange(Math.ceil(worker.sy / 2), dHeight - Math.ceil(worker.sy / 2))
    if (worker.sy % 2 != 0) {
        worker.y += 0.5
    }
    for (let room of sprites.allOfKind(SpriteKind.Dungeon_Worker)) {
        if (worker.overlapsWith(room)) {
            sprites.destroy(worker)
        }
    }
    for (let index = 0; index < worker.sy; index++) {
        for (let index = 0; index < worker.sx; index++) {
            tiles.setTileAt(tiles.getTileLocation(0, 0), assets.tile`transparency16`)
        }
    }
}
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
mp.onControllerEvent(ControllerEvent.Connected, function (p) {
    mp.setPlayerState(p, 100, 0)
    mp.setPlayerSprite(p, sprites.create(animations[pid][0][3][0], SpriteKind.Player_Character))
    mp.setPlayerState(p, MultiplayerState.animation, 0)
    mp.setPlayerState(p, MultiplayerState.moving, 0)
    mp.setPlayerState(p, MultiplayerState.x, 0)
    mp.setPlayerState(p, MultiplayerState.y, 1)
    pid += 1
})
function attack (playerId: number, attack_animation: any[]) {
    if (currentAnimation(playerId) == 2 && mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.moving) == 0) {
        attack_effect = sprites.create(img`
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
        attack_effect.setPosition(mp.getPlayerSprite(mp.getPlayerByIndex(playerId)).x, mp.getPlayerSprite(mp.getPlayerByIndex(playerId)).y)
        attack_effect.x += mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.x) * 16
        attack_effect.y += mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.y) * 16
        attack_effect.lifespan = 300
        animation.runImageAnimation(
        attack_effect,
        attack_animation,
        100,
        true
        )
        pause(250)
    }
}
function dx (playerId: number) {
    if (mp.isButtonPressed(mp.getPlayerByIndex(playerId), mp.MultiplayerButton.Left)) {
        return -1
    } else if (mp.isButtonPressed(mp.getPlayerByIndex(playerId), mp.MultiplayerButton.Right)) {
        return 1
    }
    return 0
}
function dy (playerId: number) {
    if (mp.isButtonPressed(mp.getPlayerByIndex(playerId), mp.MultiplayerButton.Up)) {
        return -1
    } else if (mp.isButtonPressed(mp.getPlayerByIndex(playerId), mp.MultiplayerButton.Down)) {
        return 1
    }
    return 0
}
function smoothGridMove (playerId: number, x: number, y: number) {
    if (mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.moving) == 0) {
        if (x == mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.x) && y == mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.y)) {
            mp.setPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.moving, 1)
            mp.setPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.animation, 1)
            mp.getPlayerSprite(mp.getPlayerByIndex(playerId)).setVelocity(x * 50, y * 50)
            pause(300)
            mp.setPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.moving, 0)
            mp.getPlayerSprite(mp.getPlayerByIndex(playerId)).setVelocity(0, 0)
            snapToGrid(mp.getPlayerSprite(mp.getPlayerByIndex(playerId)))
        } else if (x != 0 || y != 0) {
            mp.setPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.x, x)
            mp.setPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.y, y)
            pause(60)
        } else if (mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.animation) == 1) {
            mp.setPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.animation, 0)
        }
    }
}
mp.onButtonEvent(mp.MultiplayerButton.A, ControllerButtonEvent.Pressed, function (p) {
    mp.setPlayerState(p, MultiplayerState.animation, 2)
})
function currentDir (playerId: number) {
    return dirFromXY(mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.x), mp.getPlayerState(mp.getPlayerByIndex(playerId), MultiplayerState.y))
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
function generateDungeon (seed: number, width: number, height: number, density: number) {
    rng = Random.createRNG(seed)
    tiles.setCurrentTilemap(tilemap`level12`)
    for (let index = 0; index < density; index++) {
        generateRoom(width, height)
    }
}
let attack_effect: Sprite = null
let rng: FastRandomBlocks = null
let worker: Sprite = null
let pid = 0
let animations: Image[][][][] = []
animations = [[[
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
]], [[
assets.animation`idleDownLeft`,
assets.animation`idleUpRight`,
assets.animation`idleDownRight`,
assets.animation`idleDownLeft`
], [
assets.animation`walkDownLeft`,
assets.animation`walkUpRight`,
assets.animation`walkDownRight`,
assets.animation`walkDownLeft`
]]]
pid = 0
generateDungeon(1, 50, 50, 30)
forever(function () {
    if (mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)) != runtimeVariables.nullValue()) {
        smoothGridMove(0, dx(0), dy(0))
        attack(0, [img`
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
            `])
    }
})
forever(function () {
    if (mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Three)) != runtimeVariables.nullValue()) {
        smoothGridMove(1, dx(1), dy(1))
    }
})
forever(function () {
    if (mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Three)) != runtimeVariables.nullValue()) {
        smoothGridMove(2, dx(2), dy(2))
    }
})
forever(function () {
    if (mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)) != runtimeVariables.nullValue()) {
        smoothGridMove(3, dx(3), dy(3))
    }
})
game.onUpdate(function () {
    for (let currentPlayer of mp.allPlayers()) {
        if (currentAnimation(mp.getPlayerProperty(currentPlayer, mp.PlayerProperty.Index)) != mp.getPlayerState(currentPlayer, MultiplayerState.animation)) {
            animation.runImageAnimation(
            mp.getPlayerSprite(currentPlayer),
            animations[mp.getPlayerProperty(currentPlayer, mp.PlayerProperty.Index)][mp.getPlayerState(currentPlayer, MultiplayerState.animation)][currentDir(mp.getPlayerProperty(currentPlayer, mp.PlayerProperty.Index))],
            150,
            true
            )
        }
    }
})
