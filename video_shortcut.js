const SKIP_SECONDS = 5;
const ALT_SKIP_SECONDS = 1;
const SHIFT_SKIP_SECONDS = 15;
const ALT_SHIFT_SKIP_SECONDS = 30;

const video_shortcut = {
    init() {
        this._video = null;
        this._onVideoPlay = (e) => {
            this._video = e.target;
        };

        this._bindVideoEvents();
        this._bindMutationObserver();
        this._bindHotKeys();
    },

    _bindMutationObserver() {
        const observer = new MutationObserver((mutatons, observer) => {
            mutatons.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'VIDEO') {
                            this._bindVideoEvent(node);
                        }
                    })
                }
            })
        })
        observer.observe(document, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    },

    _bindVideoEvents() {
        const videos = document.getElementsByTagName('video');
        Array.from(videos).forEach((video) => this._bindVideoEvent(video));
    },

    _bindVideoEvent(video) {
        video.removeEventListener('play', this._onVideoPlay);
        video.addEventListener('play', this._onVideoPlay);
    },

    _bindHotKeys(element) {
        window.addEventListener(
            "keydown",
            e => {
                if (this._video === null) {
                    return;
                }
                
                let shouldPreventEvent = true;
                if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                    let seconds = SKIP_SECONDS;
                    if (e.altKey && !e.shiftKey) {
                        seconds = ALT_SKIP_SECONDS;
                    } else if (e.altKey && e.shiftKey) {
                        seconds = ALT_SHIFT_SKIP_SECONDS;
                    } else if (!e.altKey && e.shiftKey) {
                        seconds = SHIFT_SKIP_SECONDS;
                    }
                    this._skip(seconds, e.code === 'ArrowLeft');
                } else if (e.code === 'Space') {
                    this._togglePause();
                } else {
                    shouldPreventEvent = false;
                }

                if (shouldPreventEvent) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            },
            true,
        );
    },

    _togglePause() {
        if (this._video) {
            if(this._video.paused) {
                this._video.play();
            } else {
                this._video.pause();
            }
        }
    },

    _skip(seconds, backward = false) {
        if (this._video) {
            if (backward) {
                this._video.currentTime -= seconds;
            } else {
                this._video.currentTime += seconds;
            }
        }
    },

};
