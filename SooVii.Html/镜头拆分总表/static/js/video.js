$(function () {
    //播放
    //$("#media").click(function () {
    //    media.stop();
    //})
    $("#btnplay").click(function () {
        media.play();
    })
    $("#btnback").click(function () {
        media.back();
    })
    $("#btnstop").click(function () {
        media.stop();
    })
    $("#btngo").click(function () {
        media.go();
    })
    $("#btnprev").click(function () {
        media.prev();
    })
    $("#btnnext").click(function () {
        media.next();
    })
    $("#fpszhuzhen,#fpsdefault,#fpsdouble").click(function () {
        var val = parseInt($(this).attr("data-val"));
        $(this).addClass("curr");
        $(this).siblings().removeClass("curr");
        media.changeFps(val);
    })
    $("#framePlus").click(function () {
        media.framePlus();
    })
    $("#frameLess").click(function () {
        media.frameLess();
    })
    $("#goframe").click(function () {
        media.gtoFrame();
    })
    $("#master").slider({
        min: 0,
        orientation: "horizontal",
        range: "min",
        animate: false,
        start: function (event, ui) {
            media.tag = false;
            media.stop();
        },
        stop: function (event, ui) {
            media.setTime(ui.value);
            media.tag = true;
            media.play();
        }
    });
    $("#sound").slider({
        max: 10,
        min: 0,
        orientation: "horizontal",
        range: "min",
        animate: true,
        value: 10,
        stop: function (event, ui) {
            media.volume(ui.value);
        }
    });
})

function _media() {
    this.list = [],
    this.tag = true;
    this.gotoFrameInput = null;
    this.video = null;
    this.currentFrame = 0;
    this.currentFrameObj = null;
    this.timeCount = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.isPlay = false;
    this.task = false;
    this.playId = 0;
    this.sleep = 10;
    this.tmobj = null;
}
_media.prototype = {
    setTime: function (val) {
        this.video.currentTime = val;
    },
    init: function (e) {
        this.video = document.getElementById(e.id);
        this.currentFrameObj = document.getElementById("currentFrame");
        this.gotoFrameInput = document.getElementById("toFrame");

        $("#master").slider({ max: e.length });
        this.playId = e.playId;
        this.timeCount = e.length;
        this.fps = e.fps;
        this.frameCount = e.frameCount;
        this.video.src = e.src;
        //this.refreshFrames();
        var el = this;

        document.getElementById("frameCount").innerHTML = e.frameCount;
        document.getElementById("totalPlayTime").innerHTML = (el.formatTime(el.timeCount));
        var currentPlayTime = document.getElementById("currentPlayTime");
        this.video.addEventListener("timeupdate", function () {
            currentPlayTime.innerHTML = (el.formatTime(el.video.currentTime));
            if (el.tag) {
                $("#master").slider({ value: el.video.currentTime });
            }
        }, false);

        if (e.current && e.current > 0) {
            var toTimeStep = parseInt(e.current) / this.frameCount;
            setTimeout(function () {
                el.video.currentTime = el.timeCount * toTimeStep;
            }, 500);
            this.stop();
        }
        return this;
    },
    playPause: function () {
        if (!this.video) { return; }
        if (this.frameCount < 25) { return; }
        if (this.video.paused) {
            this.play();
        }
        else { 
            this.stop();
        }
    },
    play: function () {
        if (!this.video) { return; } 
        if (this.frameCount < 25) {
            var el = this; 
            var frame = 0;
            clearInterval(el.tmobj);
            el.tmobj = setInterval(function () {
                console.log(el.video.paused);
                if (el.video.paused) {
                     frame++;
                    var toTimeStep = parseInt(frame) / el.frameCount;
                    currentTime = el.timeCount * toTimeStep;
                    el.currentFrame = Math.ceil((currentTime / el.timeCount) * el.frameCount);
                    el.currentFrameObj.innerHTML = el.currentFrame;
                    el.video.currentTime = currentTime;
                    if (frame >= el.frameCount) {
                        clearInterval(el.tmobj); 
                    } 
                }
              
            }, el.sleep);
        } else {
            if (!this.task) { this.refreshFrames(); }
            this.video.play();
        }
        return this;
    },
    stop: function () {
        if (!this.video) { return; }
        this.video.pause();
        return this;
    },
    goBegin: function () {
        this.gotoFrameInput.value = 0;
        this.gtoFrame();
        return this;
    },
    goEnd: function () {
        this.gotoFrameInput.value = this.frameCount;
        this.gtoFrame();
        return this;
    },
    changeFps: function (fps) {
        if (!this.video) { return; }
        if (fps == 24) {
            this.fps = fps;
        }
        if (this.frameCount < 25) {
            clearInterval(this.tmobj);
            this.sleep = fps == 1 ? 500 : fps == 24 ? 250 : 100;
        } else {
            this.video.playbackRate = fps / this.fps;
        }
        this.play();
        return this;
    },
    next: function () {
        var tag = false;
        var url = "";
        for (var i = 0; i < this.list.length; i++) {
            if (tag) {
                url = this.list[i];
                break;
            }
            if (this.playId == this.list[i]) {
                tag = true;
            }
        }
        if (url != "") {
            window.location.href = url;
        } else {
            alert("抱歉，没有下一个视频！")
        }
    },
    prev: function () {
        var tag = false;
        var url = "";
        for (var i = this.list.length - 1; i >= 0; i--) {
            if (tag) {
                url = this.list[i];
                break;
            }
            if (this.playId == this.list[i]) {
                tag = true;
            }
        }
        if (url != "") {
            window.location.href = url;
        } else {
            alert("抱歉，没有上一个视频！")
        }
    },
    refreshFrames: function () {
        console.log("start");
        var el = this;
        el.task = true;
        var currentTime = 0;
        var t = setInterval(function () {
            currentTime = el.video.currentTime;
            el.currentFrame = Math.ceil((currentTime / el.timeCount) * el.frameCount);
            el.currentFrameObj.innerHTML = el.currentFrame;
            if (Math.ceil(currentTime) >= el.timeCount) {
                clearInterval(t);
                el.video.currentTime = el.timeCount;
                el.currentFrameObj.innerHTML = el.frameCount;
                el.task = false;
                console.log("end...");
            }
            //el.fn.call(this, el.currentFrame);
        }, 10);








        //if (el.frameCount < 25) {
        //    var frame = 0;
        //    var t = setInterval(function () {
        //        frame++;
        //        var toTimeStep = parseInt(frame) / el.frameCount;
        //        currentTime = el.timeCount * toTimeStep;
        //        el.currentFrame = Math.ceil((currentTime / el.timeCount) * el.frameCount);
        //        el.currentFrameObj.innerHTML = el.currentFrame;
        //        console.log(currentTime + "----" + el.currentFrame);
        //        el.video.currentTime = currentTime;
        //        if (frame >= el.frameCount) {
        //            clearInterval(t);
        //            el.task = false;
        //            console.log("end...");
        //        }
        //    }, 1000);
        //}

    },
    gtoFrame: function () {
        if (!this.video) { return; }
        var toTimeStep = parseInt(this.gotoFrameInput.value) / this.frameCount;
        this.video.currentTime = this.timeCount * toTimeStep;
        this.stop();
        return this;
    },
    go: function (v) {
        if (!this.video) { return; }
        this.video.currentTime += (v == undefined ? 10 : v);
        this.play();
        return this;
    },
    back: function (v) {
        if (!this.video) { return; }
        this.video.currentTime -= (v == undefined ? 10 : v);
        this.play();
        return this;
    },
    framePlus: function () {
        if (!this.video) { return; }
        var val = this.gotoFrameInput.value;
        var frame = parseInt(val == "" ? 0 : val);
        frame++;
        if (frame >= this.frameCount) {
            frame = this.frameCount;
        }
        this.gotoFrameInput.value = (frame);
        return this;
    },
    frameLess: function () {
        if (!this.video) { return; }
        var val = this.gotoFrameInput.value;
        var frame = parseInt(val == "" ? 0 : val);
        frame--;
        if (frame <= 0) {
            frame = 1;
        }
        this.gotoFrameInput.value = (frame);
        return this;
    },
    volume: function (val) {
        if (!this.video) { return; }
        this.video.volume = val * 0.1;
        return this;
    },
    screenshot: function (fun) {
        if (!this.video) { return; }
        this.stop();
        var el = this;
        setTimeout(function () {
            var cvs = document.getElementById("ScreenshotContainer");
            if (cvs == null) {
                cvs = document.createElement('canvas');
                cvs.id = "ScreenshotContainer";
                cvs.style.display = "none";
                document.body.appendChild(cvs);
            }
            var context2D = cvs.getContext("2d");
            cvs.width = el.video.videoWidth;
            cvs.height = el.video.videoHeight;
            context2D.drawImage(el.video, 0, 0);

            fun({ time: el.formatTime(el.video.currentTime), frame: el.currentFrame, img: cvs.toDataURL("image/png") });
        }, 200);
    },
    formatTime: function (lastSecond) {
        lastSecond = Math.ceil(lastSecond);
        var hh, mm, ss;
        var day = parseInt(lastSecond / (3600 * 24));
        var hour = parseInt(lastSecond / 3600) - day * 24;
        var minute = parseInt(lastSecond / 60) - day * 60 * 24 - hour * 60;
        var second = lastSecond - day * 3600 * 24 - hour * 3600 - minute * 60;
        hh = hour < 10 ? "0" + hour : hour;
        mm = minute < 10 ? "0" + minute : minute;
        ss = second < 10 ? "0" + second : second;
        var t = hh + ":" + mm + ":" + ss;
        return t;
    }
}
window.$media = function () {
    return new _media();
}