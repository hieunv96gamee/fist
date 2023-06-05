export class Task {

    _callback;
    _completeCallback;

    constructor(cb: Function){
        this._callback = cb;
    }

    completed() {
        if (this._completeCallback) {
            this._completeCallback();
        }
    }
}

export class TaskManager {

    tasks: Task[] = [];

    addTask(task: Task) {
        this.tasks.push(task);
    }

    run(onProcess: (count, total) => void, completeCallback: Function) {
        if (this.tasks.length === 0) {
            completeCallback();
            return;
        }

        let total = this.tasks.length;
        onProcess(0, total);
        for (let i = 0; i < total - 1; i++) {
            this.tasks[i]._completeCallback = () => {
                onProcess((i + 1), total);
                this.tasks[i + 1]._callback();
            };
        }
        this.tasks[total - 1]._completeCallback = () => {
            onProcess(total, total);
            completeCallback();
        };
        this.tasks[0]._callback();
    }
}
