'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestIdleCallbackShim = require('./request-idle-callback-shim');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultIsReady = function defaultIsReady() {
    return true;
};

var QueueWorker = function () {
    function QueueWorker(callback) {
        var isReady = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultIsReady;

        var _this = this;

        var queue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 3000;

        _classCallCheck(this, QueueWorker);

        this.idleHandler = function (deadline) {
            if (!_this.isReady()) {
                return _this.schedule();
            }

            while (deadline.timeRemaining() > 0 && _this.queue.length > 0) {
                _this.callback(_this.queue.shift());
            }

            _this.schedule();
        };

        this.queue = queue;
        this.callback = callback;
        this.isReady = isReady;
        this.timeout = timeout;
        this.isScheduled = false;

        this.task = null;

        if (this.queue.length) {
            this.schedule();
        }
    }

    _createClass(QueueWorker, [{
        key: 'enqueue',
        value: function enqueue(data) {
            this.queue.push(data);

            if (!this.isScheduled) {
                this.schedule();
            }
        }
    }, {
        key: 'schedule',
        value: function schedule() {
            var hasWork = this.queue.length !== 0;

            if (!hasWork) {
                this.isScheduled = false;
                return;
            }

            this.isScheduled = true;
            this.task = (0, _requestIdleCallbackShim.requestIdleCallback)(this.idleHandler, { timeout: this.timeout });
        }
    }, {
        key: 'cancelTask',
        value: function cancelTask() {
            if (!this.task) {
                return false;
            }

            (0, _requestIdleCallbackShim.cancelIdleCallback)(this.task);
            return true;
        }
    }]);

    return QueueWorker;
}();

exports.default = QueueWorker;