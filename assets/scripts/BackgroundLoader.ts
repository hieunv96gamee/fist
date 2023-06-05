import {Task} from "./base/Task";

export class BackgroundLoader {
    public static tasks: Task[] = [];

    private static removeTask(task) {
        let id = this.tasks.indexOf(task);
        if (id != -1) {
            this.tasks.splice(id, 1);
        }
        cc.log("completed. Remain: " + this.tasks.length);
    }

    public static addTask(task: Task) {
        if (this.tasks.length > 0) {
            let endTask = this.tasks[this.tasks.length - 1];
            endTask._completeCallback = () => {
                this.removeTask(endTask);
                task._callback();
            };

        } else {
            task._callback();
        }

        task._completeCallback = () => {
            this.removeTask(task);
        };

        this.tasks.push(task);
    }


}