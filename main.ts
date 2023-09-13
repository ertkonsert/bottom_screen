radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 50) {
        if (xbar > 0) {
            led.unplot(xbar + 1, 4)
            xbar = xbar - 1
            led.plot(xbar, 4)
        }
    }
    if (receivedNumber == 60) {
        if (xbar < 3) {
            led.unplot(xbar, 4)
            xbar = xbar + 1
            led.plot(xbar + 1, 4)
        }
    }
})
function radioSend (send_x: number, send_y: number, send_angle_y: number, send_angle_x: number) {
    radio.sendValue("angle_y", send_angle_y)
    radio.sendValue("angle_x", send_angle_x)
    radio.sendValue("ball_x", send_x)
    radio.sendValue("ball_y", send_y)
    state = "inactive"
}
input.onButtonPressed(Button.A, function () {
    radio.sendString("reset")
    basic.clearScreen()
    state = "active"
    ball_x = 2
    ball_y = 3
    ball_angle_y = -1
    ball_angle_x = 1
    xbar = 2
    led.plot(xbar, 4)
    led.plot(xbar + 1, 4)
})
function collisionCheck () {
    if (ball_x == xbar) {
        ball_angle_y = -1
        ball_angle_x = -1
    } else if (ball_x == xbar + 1) {
        ball_angle_y = -1
        ball_angle_x = 1
    } else {
        state = "inactive"
        basic.clearScreen()
        basic.showIcon(IconNames.Sad)
    }
}
radio.onReceivedValue(function (name, value) {
    if (name == "ball_y") {
        ball_y = value
        check += 1
    }
    if (name == "ball_x") {
        ball_x = value
        check += 1
    }
    if (name == "angle_y") {
        ball_angle_y = value
        check += 1
    }
    if (name == "angle_x") {
        ball_angle_x = value
        check += 1
    }
    if (check == 4) {
        state = "active"
        check = 0
    }
})
let check = 0
let state = ""
let xbar = 0
let ball_angle_x = 0
let ball_angle_y = 0
let ball_y = 0
let ball_x = 0
radio.setGroup(65)
ball_x = 2
ball_y = 3
ball_angle_y = -1
ball_angle_x = 1
xbar = 2
led.plot(xbar, 4)
led.plot(xbar + 1, 4)
basic.forever(function () {
    while (state == "active") {
        led.plot(ball_x, ball_y)
        basic.pause(500)
        if (ball_y + ball_angle_y < 0) {
            if (ball_x + ball_angle_x > 4) {
                ball_angle_x = -1
            }
            if (ball_x + ball_angle_x < 0) {
                ball_angle_x = 1
            }
            radioSend(ball_x + ball_angle_x, 4, ball_angle_y, ball_angle_x)
        }
        if (ball_y + ball_angle_y > 3) {
            collisionCheck()
        }
        if (ball_x + ball_angle_x > 4) {
            ball_angle_x = -1
        }
        if (ball_x + ball_angle_x < 0) {
            ball_angle_x = 1
        }
        led.unplot(ball_x, ball_y)
        ball_y += ball_angle_y
        ball_x += ball_angle_x
    }
})
