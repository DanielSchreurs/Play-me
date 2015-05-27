(function () {
    "use strict";
    window.Dino = function (oApplication) {
        var O_SPRITE_SHEET = null,
            S_SPRITE_SHEET_SRC = "./img/dinosprite.png",
            I_MAXRUBER = 2,
            aRubber = [],
            iCenti = 0,
            iSecondes = 0,
            iMinutes = 0,
            time,
            isGameRestarted = false,
            iAnimationRequestId,
            oTime = {
                "start": null,
                "current": null
            };
        var oBoy = {
            "verticalBoost": -13,
            "animationStep": 0,
            "isJumping": false,
            "animationMaxSteep": 0,
            "isDangerZone": false,
            "collectedRubber": 0,
            "previousCollectedRubber": 0,
            "verticalSpeed": 0,
            "verticalAcceleration": 0,
            "oCurrentFrame":1,
            "position": {
                "top": 0,
                "bottom": 0,
                "left": 0,
                "right": 0
            },
            "init": function () {
                this.animationMaxSteep = this.spriteFrames.length;
                this.collectedRubber = 0;
                this.previousCollectedRubber = 0;
                fWritteInHtml("#score", this.collectedRubber);
            },
            "spriteFrames": [
                {
                    "sx": 0,
                    "sy": 30,
                    "sw": 50,
                    "sh": 60,
                    "dw": 50
                }, {
                    "sx": 50,
                    "sy": 30,
                    "sw": 48,
                    "sh": 60,
                    "dw": 48
                }, {
                    "sx": 98,
                    "sy": 30,
                    "sw": 42,
                    "sh": 60,
                    "dw": 42
                }, {
                    "sx": 140,
                    "sy": 30,
                    "sw": 21,
                    "sh": 60,
                    "dw": 21
                }, {
                    "sx": 161,
                    "sy": 30,
                    "sw": 50,
                    "sh": 60,
                    "dw": 50
                }
            ],
            "frame": {
                "dx": 80,
                "dy": 212,
                "dh": 60
            },
            "render": function (iSteep) {
                this.oCurrentFrame = this.spriteFrames[iSteep];
                oApplication.context.drawImage(
                    O_SPRITE_SHEET,
                    this.oCurrentFrame.sx,
                    this.oCurrentFrame.sy,
                    this.oCurrentFrame.sw,
                    this.oCurrentFrame.sh,
                    this.frame.dx,
                    this.frame.dy,
                    this.oCurrentFrame.dw,
                    this.frame.dh
                );
            },
            "update": function (oKeyEvent) {
                var i, c = aRubber.length, pos = this.position, rubberPos, maxY, deltaX, deltaY, iDistance;
                if (oKeyEvent) {
                    if (!this.verticalAcceleration) {
                        this.verticalAcceleration = 0.8;
                    }
                    (!this.isJumping) && (this.verticalSpeed = this.verticalBoost);
                    this.isJumping = true;
                }
                this.position.top = this.frame.dy - this.frame.dh;
                this.position.bottom = this.frame.dy + this.frame.dh;
                this.position.left = this.frame.dx - this.oCurrentFrame.dw;
                this.position.right = this.frame.dx + this.oCurrentFrame.dw;
                this.verticalSpeed += this.verticalAcceleration;
                this.frame.dy += this.verticalSpeed;
                if (this.frame.dy > 212) {
                    this.frame.dy = 212;
                    this.verticalAcceleration = false;
                    this.isJumping = false;
                }
                for (i = 0; i < c; i++) {
                    rubberPos = aRubber[i].frame;
                    maxY = oApplication.height - (oGround.frame.dh + aRubber[i].frame.dr * 2);
                    if ((pos.right > rubberPos.dx - rubberPos.dr && pos.left < rubberPos.dx - rubberPos.dr * 2)) {
                        if (pos.bottom > maxY) {
                            gameOver(this);
                        } else {
                            this.isDangerZone = true;
                        }
                    }
                }
                if (this.isDangerZone) {
                    if (this.previousCollectedRubber === this.collectedRubber) {
                        this.collectedRubber++;
                        fWritteInHtml("#score", this.collectedRubber);
                    }
                } else {
                    this.previousCollectedRubber = this.collectedRubber;
                }
                this.isDangerZone = false;
            }
        };
        var oGround = {
            "speed": 5,
            "frame": {
                "sx": 0,
                "sy": 0,
                "sw": 700,
                "sh": 30,
                "dx": 0,
                "dy": 270,
                "dw": 700,
                "dh": 30
            },
            "maxOffset": 700 - oApplication.width,
            "render": function () {
                oApplication.context.drawImage(
                    O_SPRITE_SHEET,
                    this.frame.sx,
                    this.frame.sy,
                    this.frame.sw,
                    this.frame.sh,
                    this.frame.dx,
                    this.frame.dy,
                    this.frame.dw,
                    this.frame.dh
                );
            },
            "update": function () {
                if (this.frame.dx <= -this.maxOffset) {
                    this.frame.dx = 0;
                }
                this.frame.dx -= this.speed;
                this.render();
            }
        };
        var Rubber = function (dx, dr) {
            this.frame = {
                "dx": dx,
                "dr": dr
            };
        };
        Rubber.prototype.speed = 4;
        Rubber.prototype.render = function () {
            var ctx = oApplication.context;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = oApplication.color;
            ctx.arc(this.frame.dx, oApplication.height - (this.frame.dr + oGround.frame.dh), this.frame.dr, 90, 0, 2 * Math.PI);
            ctx.fill();
        };
        Rubber.prototype.update = function () {
            var iRayon = Math.round(Math.random() * 10) + 10,
                iDistance = (Math.round(Math.random() * 250) + 200);
            this.frame.dx -= this.speed;
            if (this.frame.dx <= -this.frame.dr * 2) {
                this.frame.dx = oApplication.width + iDistance;
                this.frame.dr = iRayon;
                this.speed += 0.1;
            }
            this.render();
        };
        var fGenerateRubber = function () {
            aRubber = [];
            var i = 0, c = I_MAXRUBER, iRayon, iDistance;
            for (; i < c; i++) {
                iRayon = (Math.round(Math.random() * 10) + 15);
                iDistance = (Math.round(Math.random() * 500) + 200);
                aRubber.push(new Rubber(i === 0 ? oApplication.width + iRayon : aRubber[i - 1].frame.dx + iDistance, iRayon));
            }
        };
        var fStartgame = function () {
            oGround.render();
            window.addEventListener("keydown", start);
            window.addEventListener("keydown", startUpdate);
            oBoy.render(1);
            fStartDraw(211, 30, 203, 86, (oApplication.width - 100) / 2, ((oApplication.height - 150) / 3) * 2, 203, 86, "Appuyez sur la flèche du haut de votre clavier!", 14);
        };
        var startUpdate = function (e) {
            if (e.keyCode === 38) {
                oBoy.update(e);
            }
        };
        var start = function (e) {
            window.removeEventListener("keydown", start);
            if (e.keyCode === 38) {
                oBoy.init();
                fGenerateRubber();
                fAnimationLoop();
                fChrono(e);
            }
        };

        var fAnimationLoop = function () {
            var c = aRubber.length, i;
            iAnimationRequestId = window.requestAnimationFrame(fAnimationLoop);
            oTime.current = (new Date()).getTime();
            oApplication.context.clearRect(0, 0, oApplication.width, oApplication.height);
            oGround.update();
            oBoy.update();
            aRubber.forEach(function (oRubber) {
              oRubber.update();
            });
            if (oTime.current - oTime.start > 100) {
                oTime.start = (new Date()).getTime();
                (++oBoy.animationStep < oBoy.animationMaxSteep) || (oBoy.animationStep = 0);
                fChrono();
            }
            oBoy.render(oBoy.animationStep);

        };
        var gameOver = function (oBoy) {
            window.cancelAnimationFrame(iAnimationRequestId);
            iCenti = 0;
            iSecondes = 0;
            iMinutes = 0;
            fStartDraw(414, 36, 138, 80, (oApplication.width - 138) / 2, (oApplication.height - 80) / 2, 138, 68, "Votre score " + oBoy.collectedRubber, 20);
            window.addEventListener("keydown", start);
        };
        var fStartDraw = function (sx, sy, sw, wh, dx, dy, dw, dh, mesaage, fontSize) {
            var ctx = oApplication.context;
            ctx.fillStyle = "black";
            ctx.font = " 100 " + fontSize + "px Avenir, sans-serif";
            ctx.textAlign = "center";
            ctx.texBasseline = "top";
            ctx.fillText(mesaage, 300, (oApplication.height / 3) * 2);
            ctx.drawImage(O_SPRITE_SHEET, sx, sy, sw, wh, dx, dy, dw, dh);
        };
        var fWritteInHtml = function (querySelector, value) {
            var elt = document.querySelector(querySelector).childNodes[0];
            elt.nodeValue = value;
        };
        var fChrono = function () {
            iCenti++;
            if (iCenti > 9) {
                iCenti = 0;
                iSecondes++;
            }
            if (
                iSecondes > 59) {
                iSecondes = 0;
                iMinutes++;
            }
            time =
            (iMinutes<10?'0'+iMinutes:iMinutes)
            + ' : ' +
            (iSecondes<10?'0'+iSecondes:iSecondes)
            + ' : ' +
            (iCenti<10?'0'+iCenti:iCenti);
            fWritteInHtml("#time", time);
        };
        O_SPRITE_SHEET = new Image();
        O_SPRITE_SHEET.addEventListener("load", fStartgame);
        O_SPRITE_SHEET.src = S_SPRITE_SHEET_SRC;
    };
})();
