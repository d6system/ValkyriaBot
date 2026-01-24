module.exports = {
    name: "Schedules a Timer",

    description: "Creates a date to use it in your blocks.",

    category: "Schedule Timer",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "scheduletime",
            "name": "CRON / DATE",
            "description": `Acceptable Types: Date, Text, Unspecified\n\nDescription: The CRON (* * * * * *) or DATE to schedule the timer.
            
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)`,
            "types": ["date", "text", "unspecified"]
        },
        {
            "id": "customId",
            "name": "Custom ID",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The custom ID for this scheduled timer.",
            "types": ["text", "unspecified"]
        },
        {
            "id": "content",
            "name": "Content",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: Define your Text Content for the Timer here which will be returned in the Timer Reached Event.",
            "types": ["text", "unspecified"]
        }
    ],

    options: [
        {
            "id": "rememberSchedule",
            "name": "Save Schedule?",
            "description": "Description: Should this Timer be saved even if the Bot restarts? Otherwise it will be lost after a bot restart and would have to be rescheduled.",
            "type": "CHECKBOX",
            "defaultValue": true
        },
        {
            "id": "removedOnFinish",
            "name": "Remove Job on Finished? (CRON)",
            "description": "Description: Should the job be removed once it is finished?",
            "type": "CHECKBOX",
        },
        {
            "id": "customId",
            "name": "Custom ID",
            "description": "Description: The custom ID for this scheduled timer.",
            "type": "TEXT"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "job",
            "name": "Schedule Job",
            "description": "Type: Object\n\nDescription: The Schedule Job object.",
            "types": ["object", "unspecified"]
        }
    ],

    init(DBB, blockname) {
        const EventEmitter = require('events');
        if(!DBB.Dependencies.SchedulerTimer) DBB.Dependencies.SchedulerTimer = new class SchedulerTimer extends EventEmitter {
            constructor(){
                super();
                this.jobs = {};
            }

            addJob(id, job, scheduletime, removedOnFinish, content, rememberSchedule){
                this.jobs[id] = { job, time: scheduletime, removedOnFinish, content, rememberSchedule };
            }

            removeJob(id, job, removedOnFinish){
                let j = this.jobs[id];
                let oldData = DBB.Blocks.Data.getData("SchedulerTimer");
                if((j?.time instanceof Date || removedOnFinish) && oldData[id]) {
                    delete oldData[id];
                    DBB.Blocks.Data.setData("SchedulerTimer", oldData);
                };
                delete this.jobs[id];
                job.cancel()
            }

            removeJobById(id){
                const job = this.jobs[id];
                if(job) {
                    delete this.jobs[id];
                    let oldData = DBB.Blocks.Data.getData("SchedulerTimer");
                    if(oldData[id]) {
                        delete oldData[id];
                        DBB.Blocks.Data.setData("SchedulerTimer", oldData);
                    };
                    job.job?.cancel()
                }
            }

            getJob(id){
                return this.jobs[id];
            }

            getAllJobs(){
                return this.jobs;
            }

            clearJobs(){
                for(const key in this.jobs){
                    this.jobs[key].job.cancel();
                }
                this.jobs = {};
                let oldData = DBB.Blocks.Data.getData("SchedulerTimer");
                if(oldData) {
                    for(const key in oldData){
                        if(oldData[key].removedOnFinish) delete oldData[key];
                    }
                    DBB.Blocks.Data.setData("SchedulerTimer", oldData);
                };
            }

            JobReached(id, job, removedOnFinish){
                this.emit("jobReached", {...this.jobs[id], id});
                this.removeJob(id, job, removedOnFinish);
            }
        }()

        let oldData = DBB.Blocks.Data.getData("SchedulerTimer");
        if(!oldData) DBB.Blocks.Data.setData("SchedulerTimer", {});
        oldData = DBB.Blocks.Data.getData("SchedulerTimer");
        for(const key in DBB.Blocks.Data.getData("SchedulerTimer")){
            let { scheduletime, removedOnFinish, content } = DBB.Blocks.Data.getData("SchedulerTimer")[key];
                if(new Date(scheduletime) < new Date()) {
                    delete oldData[key];
                    continue;
                } else {
                require(`./${blockname}.js`).declareTimer(DBB, key, new Date(scheduletime), true, removedOnFinish, content);
            }
        }
        DBB.Blocks.Data.setData("SchedulerTimer", oldData);
    },

    async declareTimer(DBB, id, scheduletime, rememberSchedule, removedOnFinish, content){
        if(DBB.Dependencies.SchedulerTimer.getJob(id)) {
            DBB.Dependencies.SchedulerTimer.removeJobById(id)
        };
        const schedule = require("node-schedule");
        const job = schedule.scheduleJob(scheduletime, () => {
            DBB.Dependencies.SchedulerTimer.JobReached(id, job, removedOnFinish);
        });
        DBB.Dependencies.SchedulerTimer.addJob(id, job, scheduletime, removedOnFinish, content, rememberSchedule);
        let oldData = DBB.Blocks.Data.getData("SchedulerTimer");
        if(rememberSchedule && oldData){
            DBB.Blocks.Data.setData("SchedulerTimer", { ...oldData, [id]: { id, scheduletime, removedOnFinish, content } });
        } else if(oldData && oldData[id]){
            delete oldData[id];
            DBB.Blocks.Data.setData("SchedulerTimer", oldData);
        }
        return job;
    },

    async code(cache, DBB) {
        try {
            const success = await require('./!auto_package_manager').getPackageManager()?.requires(
                { name: "node-schedule", version: "latest" }
            )
            if (!success) console.log("Failed to install dependencies! (Schedule Timer)")
        } catch (e) {
            console.log(e)
        }

        const scheduletime = this.GetInputValue("scheduletime", cache);
        const customId = this.GetInputValue("customId", cache) || this.GetOptionValue("customId", cache);
        const rememberSchedule = this.GetOptionValue("rememberSchedule", cache);
        const content = this.GetInputValue("content", cache);

        if(!scheduletime) return console.error("No Schedule Time provided!");
        if(!customId) return console.error("No Custom ID provided!");

        const job = require(`./${cache.name}.js`).declareTimer(DBB, customId, scheduletime, rememberSchedule, this.GetOptionValue("removedOnFinish", cache), content);
        this.StoreOutputValue(job, "job", cache);
        this.RunNextBlock("action", cache);
    }
}