(function () {
    window.initMoviePlayer = function (url) {
        var video = document.querySelector("[data-player-video]");
        var cover = document.querySelector("[data-player-cover]");
        var button = document.querySelector("[data-player-button]");
        var started = false;
        var hlsInstance = null;

        function attach() {
            if (!video || started) {
                return;
            }
            started = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (typeof Hls !== "undefined" && Hls.isSupported()) {
                hlsInstance = new Hls({ enableWorker: true });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
            } else {
                video.src = url;
            }
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    video.setAttribute("controls", "controls");
                });
            }
        }

        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                attach();
            });
        }
        if (cover) {
            cover.addEventListener("click", attach);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (!started) {
                    attach();
                }
            });
            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        }
    };
})();
