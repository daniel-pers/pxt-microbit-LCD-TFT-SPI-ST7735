let heightCheck = 0
let gravity = 0
let xIndex = 0
let xCursor = 0
let xVelocity = 0
let playBooster = false
let yVelocity = 0
let segmentHeights: number[] = []
let allHeights: number[] = []
let yPosition = 0
let xPosition = 0
let startup = false
let inTheZone = false
let landingStartX = 0
let landingEndX = 0
landingEndX = 0
landingStartX = 0
inTheZone = false
allHeights = []
segmentHeights = []
segmentHeights = []
allHeights = []
startup = true
xCursor = 0
allHeights = [0]
segmentHeights = [0]
allHeights = [0]
heightCheck = 0
playBooster = false
gravity = 2
xVelocity = 0
yVelocity = 0
xPosition = 2048
yPosition = 64
pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
basic.forever(() => {
    if (startup == true) {
        basic.showNumber(0)
        display.setupScreen()
        basic.showNumber(1)
        lunar.drawLandscape()
        basic.showNumber(2)
        startup = false
        display.writeJacobsLander(550, 1800, true)
        music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
        basic.pause(2500)
        display.writeJacobsLander(550, 1800, false)
        basic.showNumber(3)
    }
    display.fastSpriteAt(xPosition, yPosition, false)
    basic.showNumber(4)
    if (pins.digitalReadPin(DigitalPin.P12) == 0) {
        yVelocity = yVelocity - 8
        playBooster = true
    }
    basic.showNumber(5)
    if (input.buttonIsPressed(Button.A)) {
        xVelocity = xVelocity - 4
        playBooster = true
    }
    if (input.buttonIsPressed(Button.B)) {
        xVelocity = xVelocity + 4
        playBooster = true
    }
    xPosition = xPosition + xVelocity
    yPosition = yPosition + yVelocity
    yVelocity = yVelocity + gravity
    xIndex = xPosition / 32
    xIndex += 4
    heightCheck = allHeights[xIndex]
    heightCheck = heightCheck - 8 * display.displayScale()
    if (yPosition > heightCheck) {
        inTheZone = xPosition > landingStartX && xPosition < landingEndX
        if (inTheZone && yVelocity < 64) {
            yPosition = heightCheck - 64
            display.fastSpriteAt(xPosition, yPosition, true)
            music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
            yVelocity = 0
            display.writeYouLanded(550, 1800, true)
            basic.pause(2500)
            display.writeYouLanded(550, 1800, false)
            display.fastSpriteAt(xPosition, yPosition, false)
            yPosition = 32
            xPosition = 2048
        } else {
            display.fastSpriteAt(xPosition, yPosition, true)
            music.playTone(131, music.beat(BeatFraction.Whole))
            yVelocity = 0 - yVelocity
            display.writeYouCrashed(550, 1800, true)
            basic.pause(2500)
            display.writeYouCrashed(550, 1800, false)
            display.fastSpriteAt(xPosition, yPosition, false)
        }
    }
    display.fastSpriteAt(xPosition, yPosition, true)
    if (playBooster) {
        lunar.whiteNoise(50, 500)
        playBooster = false
    } else {
        basic.pause(50)
    }
})
