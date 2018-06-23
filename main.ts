
/**
 * Custom functions and blocks for interfacing with TFT display
 * and most code is from http://www.obliquely.org.uk/connecting-a-microbit-and-adafruit-1-44-display/
 *
 * For documentation on the AdaFruit 1.44" TFT display
 * see: https://learn.adafruit.com/adafruit-1-44-color-tft-with-micro-sd-socket
 *
 * The code to drive the display has been adapted from the code provided (in C++)
 * by AdaFruit.
 *
 * For syntax that makes functions and enums available in the blocks editor
 * see https://makecode.microbit.org/blocks/custom
 */

/**
 * TFT display commands
 * Only the commands actually used are included here. See the ST7735R
 * data sheet for the full set of commands.
 */
enum TftCom {
    NOOP = 0x00,
    SWRESET = 0x01,
    SLPOUT = 0x11,
    NORON = 0x13,
    INVOFF = 0x20,
    DISPON = 0x29,
    CASET = 0x2A,
    RASET = 0x2B,
    RAMWR = 0x2C,
    MADCTL = 0x36,
    COLMOD = 0x3A,
    FRMCTR1 = 0xB1,
    FRMCTR2 = 0xB2,
    FRMCTR3 = 0xB3,
    INVCTR = 0xB4,
    PWCTR1 = 0xC0,
    PWCTR2 = 0xC1,
    PWCTR3 = 0xC2,
    PWCTR4 = 0xC3,
    PWCTR5 = 0xC4,
    VMCTR1 = 0xC5,
    GMCTRP1 = 0xE0,
    GMCTRN1 = 0xE1,
    DELAY = 0xFFFF
}

/**
 * 显示TFT LCD液晶
 */
//% weight=100 color=#0fbc11 icon="\uf108" block="TFT LCD液晶"
namespace TFTDisplay {
    let screen_x = 0
    let screen_y = 0

    function displayScale(): number {
        return 1
    }

    /**
     * The display width in ‘working coordinates’. These are pixel values * displayScale()
     */
    function displayWidth(): number {
        return screen_x * displayScale()
    }

    /**
     * The display height in ‘working coordinates’. These are pixel values * displayScale()
     */
    function displayHeight(): number {
        return screen_y * displayScale()
    }

    /**
     * Convert a working coordinate to an actual pixel coordinate.
     * Don’t expose this in final code. It should be internal.
     */
    function roundedPixel(value: number): number {
        let adjusted = value / displayScale();
        adjusted = adjusted + (value & (displayScale() - 1) ? 1 : 0)
        return adjusted;
    }

    function outOfBounds(v1: number, v2 = 0, v3 = 0, v4 = 0): boolean {
        if (v1 < 0 || v1 > screen_x - 1) {
            return true
        }
        if (v2 < 0 || v2 > screen_y - 1) {
            return true
        }
        if (v3 < 0 || v3 > screen_x - 1) {
            return true
        }
        if (v4 < 0 || v4 > screen_y - 1) {
            return true
        }
        return false
    }

    /**
     * Set the address window
     */
    function setAddrWindow(x0: number, y0: number, x1: number, y1: number) : void {

        if (outOfBounds(x0, y0, x1, y1)) {
            return
        }
        // set the column
        //tftCom(TftCom.CASET, [0x00, x0 + 2, 0x00, x1 + 2]) // 2 is an adjust for thr AdaFruit 1.44 display
        tftCom(TftCom.CASET, [0x00, x0, 0x00, x1])
        //tftCom(TftCom.CASET, [0x00, 0x00, 0x00, 0x7F])
	    // set the row
        //tftCom(TftCom.RASET, [0x00, y0 + 3, 0x00, y1 + 3]) // 3 is an adjust for thr AdaFruit 1.44 display
        tftCom(TftCom.RASET, [0x00, y0, 0x00, y1])
        //tftCom(TftCom.RASET, [0x00, 0x00, 0x00, 0x9f])
	}

    /**
     * Write a command to the TFT display
     */
    function tftCom(command: TftCom, params: Array<number>) : void {

        // handle the pseudo ‘DELAY’ command - provides a delay in milliseconds
        if (command == TftCom.DELAY) {
            let waitTime: number = 500
            if (params.length == 1) {
                waitTime = params[0]
            }
            basic.pause(waitTime)
            return
        }

        // let the TFT know we’re sending a command (rather than data)
        pins.digitalWritePin(DigitalPin.P1, 0) // command/data = command
        // select the TFT controller
        pins.digitalWritePin(DigitalPin.P16, 0) // select the TFT as SPI target

        pins.spiWrite(command)

        // let the TFT know we’re sending data bytes (rather than a command)
        pins.digitalWritePin(DigitalPin.P1, 1) // command/data = data

        for (let dataItem of params) {
            pins.spiWrite(dataItem)
        }

        // de-select the TFT controller
        pins.digitalWritePin(DigitalPin.P16, 1) // de-elect the TFT as SPI target

        // restore pin to zero (for tidiness - not required)
        pins.digitalWritePin(DigitalPin.P1, 0) // command/data = command
    }

    /**
     * Do initial set up for display. (Required before any drawing begins.)
     */
    function tftSetup() : void {

        // General Setup (for various display types)

        // 1. Software Reset
        tftCom(TftCom.SWRESET, [1])
        tftCom(TftCom.DELAY, [1])
        tftCom(TftCom.SWRESET, [0])
        tftCom(TftCom.DELAY, [1])
        tftCom(TftCom.SWRESET, [1])
        tftCom(TftCom.DELAY, [120]) // we need ot wait at least 120ms

        // 2. Exit Sleep Mode
        tftCom(TftCom.SLPOUT, [])
        tftCom(TftCom.DELAY, [120]) // we need to wait at least 120ms

        // 3. Frame rate ctrl - normal mode
        tftCom(TftCom.FRMCTR1, [0x01, 0x2C, 0x2D])

        // 4. Frame rate ctrl - idle mode
        tftCom(TftCom.FRMCTR2, [0x01, 0x2C, 0x2D])

        // 5. Frame rate ctrl - dot inversion mode
        tftCom(TftCom.FRMCTR3, [0x01, 0x2C, 0x2D, 0x01, 0x2C, 0x2D])

        // 6. Display inversion ctrl - no inversion
        tftCom(TftCom.INVCTR, [0x07])

        // 7. Power Control -4.6v, Auto Mode
        tftCom(TftCom.PWCTR1, [0xA2, 0x02, 0x84])

        // 8. Power control,VGH25 = 2.4C VGSEL = -10 VGH = 3 * AVDD
        tftCom(TftCom.PWCTR2, [0xC5])

        // 9: Power control, Opamp current small + Boost Frequency
        tftCom(TftCom.PWCTR3, [0x0A, 0x00])

        // 10: Power control, BCLK/2, Opamp current small & Medium low
        tftCom(TftCom.PWCTR4, [0x8A, 0x2A])

        // 11: Power control
        tftCom(TftCom.PWCTR5, [0x8A, 0xEE])

        // 12: Power control
        tftCom(TftCom.VMCTR1, [0x0E])

        // 13. Don’t invert display
        //tftCom(TftCom.INVOFF, [])

        // 14: Memory access control (directions)
        tftCom(TftCom.MADCTL, [0xC0])

        // Further General Setup (for various display types)

        //1: Gamma Correction
        tftCom(TftCom.GMCTRP1, [0x0F, 0x1A, 0x0F, 0x18, 0x2F, 0x28, 0x20, 0x22, 0x1F, 0x1B, 0x23, 0x37, 0x00, 0x07, 0x02, 0x10])

        //2: Gamma Correction
        tftCom(TftCom.GMCTRN1, [0x0F, 0x1B, 0x0F, 0x17, 0x33, 0x2C, 0x29, 0x2E, 0x30, 0x30, 0x39, 0x3F, 0x00, 0x07, 0x03, 0x10])
		
        // 3: set color mode, 16-bit colour
        tftCom(TftCom.COLMOD, [0x05])

        // 4: Main screen turn on
        tftCom(TftCom.DISPON, [])
    }

    /**
     * Draw a line of a given colour
     */
    //% blockId="TFT_drawLine" block="drawLine on x0:%x0|y0:%y0|x1:%x1|y1:%y1|colour:%colour"
    //% weight=97
    export function drawLine(x0: number, y0: number, x1: number, y1: number, colour: number) : void {
        let xDelta = x1 - x0
        let yDelta = y1 - y0

        if (Math.abs(yDelta) > Math.abs(xDelta)) {
            let ySteps = Math.abs(yDelta / displayScale())
            let xIncrement = xDelta == 0 ? 0 : xDelta / ySteps
            let yIncrement = yDelta > 0 ? displayScale() : -1 * displayScale()

            let x = x0
            let y = y0;
            for (let steps = 0; steps <= ySteps; steps++) {
                drawPixel(roundedPixel(x), roundedPixel(y), colour)
                x = x + xIncrement
                y = y + yIncrement
            }
            return
        }

        let xSteps = Math.abs(xDelta / displayScale())
        let yIncrement = yDelta == 0 ? 0 : yDelta / xSteps;
        let xIncrement = xDelta > 0 ? displayScale() : -1 * displayScale()

        let y = y0;
        let x = x0
        for (let steps = 0; steps <= xSteps; steps++) {
            drawPixel(roundedPixel(x), roundedPixel(y), colour)
            y = y + yIncrement
            x = x + xIncrement
        }
    }

    /**
     * Draw a single pixel of a given colour
     */
    //% blockId="TFT_drawPixel" block="drawPixel on x:%x|y:%y|colour:%colour"
    //% weight=98
    export function drawPixel(x: number, y: number, colour: number) : void {
        if (outOfBounds(x, y)) {
            return
        }

        setAddrWindow(x, y, x + 1, y + 1);
        // send data (16 bits in two bytes)
        tftCom(TftCom.RAMWR, [colour >> 8, colour])
    }

    /**
     * Fill a rectangle with a given colour
     */
    //% blockId="TFT_fillRect" block="fillRect on x:%x|y:%y|width:%width|height:%height|colour:%colour"
    //% weight=96
    export function fillRect(x: number, y: number, width: number, height: number, colour: number) : void {

        if (outOfBounds(x, y)) {
            return;
        }

        if ((x + width) > screen_x) {
            width = screen_x - x;
        }

        if ((y + height) > screen_y) {
            height = screen_y - y;
        }

        let hiColour = (colour >> 8) % 256;
        let loColour = colour % 256;

        setAddrWindow(x, y, x + width - 1, y + height - 1);

        // we are going to manually implement the RAMWR command here because
        // we have custom parameters. See comments in tftCom for details
        // of what’s going on here.
        pins.digitalWritePin(DigitalPin.P1, 0); // command/data = command
        pins.digitalWritePin(DigitalPin.P16, 0); // select the TFT as SPI target
        pins.spiWrite(TftCom.RAMWR);
        pins.digitalWritePin(DigitalPin.P1, 1); // command/data = data

        for (let indexY = height; indexY > 0; indexY--) {
            for (let indexX = width; indexX > 0; indexX--) {
                pins.spiWrite(hiColour)
                pins.spiWrite(loColour)
            }
        }

        pins.digitalWritePin(DigitalPin.P16, 1) // de-elect the TFT as SPI target
        pins.digitalWritePin(DigitalPin.P1, 0) // command/data = command
    }

    /**
     * Setup and clear screen ready for used
     */
    //% blockId="TFT_setupScreen" block="setupScreen on x:%x|y:%y"
    //% weight=99
    export function setupScreen(x: number = 128, y: number = 160) : void {
        screen_x = x
        screen_y = y
        pins.spiFrequency(4000000) // try a fast rate for serial bus

        tftSetup()

        fillRect(
            0,
            0,
            x,
            y,
            0
        )
    }
	
	/**
     * Clear screen
     */
    //% blockId="TFT_clearScreen" block="clearScreen"
    //% weight=95
    export function clearScreen() : void {
        fillRect(
            0,
            0,
            screen_x,
            screen_y,
            0
		)
    }
}
