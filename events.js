game.initEvents = function() {
    this.eventMap = {
        //simple mood expressions
        "uranosCoolLvl1": this.getEventRecord(10),
        "aresMadLvl1": this.getEventRecord(5),
        "poseidonPatientLvl1": this.getEventRecord(4),
        "poseidonPatientLvl2": this.getEventRecord(4),
        //ares storyline
        "aresStormOut": this.getEventRecord(4, {is_waiter: true, wait_time: 10, starting_count: 4}),
        "aresAphroditeLoveLvl1": this.getEventRecord(1, {run_once: true}),
        "aresAphroditeLoveLvl2": this.getEventRecord(3, {run_once: true, starting_count: 3}),
        "aresAphroditeLoveLvl3": this.getEventRecord(3, {is_waiter: true, wait_time: 5, starting_count: 3, run_once: true}) //leave room together
    }
}

game.procTemperament = function(t_val) {
    this.personArray[0].addHumour(t_val, 10);
    //if the updated humour goes over 127, everyone starts to feel it
    var averageHumours = this.getAverageHumours();
    if (averageHumours[this.personArray[0].humourToInt(t_val)] > 127) { 
        for (i = 1; i < this.personArray.length; i++) {
            this.personArray[i].addHumour(t_val, 5);
        }
    }
    
    if (this.eventMap["aresStormOut"].waitAdvance()) { //this will trigger when the wait ends and no other time
        this.personArray[3].present = true;
    }
    //specific character interactions below
    if (t_val == "s") {    
        if (this.personArray[5].present) {
            if (this.personArray[5].humours[3] > 120) {
                if (this.eventMap["uranosCoolLvl1"].advance()) {
                    jhc.outputLine("Uranos meets your gaze.");
                }
            }
        }
    }
    else if (t_val == "c") {
        if (this.personArray[3].present) {
            this.personArray[3].addHumour(t_val, 10);
            if (this.personArray[3].humours[1] > 110) {
                if (this.eventMap["aresMadLvl1"].advance()) {
                    jhc.outputLine("Ares looks murderous.");
                    this.eventMap["aresStormOut"].step();
                }
            }
            if (this.personArray[3].humours[1] > 120 && //ares high chol
                     this.personArray[2].humours[0] < 30 && //aphro low sang
                     this.eventMap["aresStormOut"].ready()) {
                this.personArray[3].present = false;
                jhc.outputLine("Ares stands up, his hands balled into tight fists\
                                and a look of rage and frustration on his face. He storms out\
                                loudly.");
                this.eventMap["aresStormOut"].advance();
            }
        }
        
    }
    else if (t_val == "m") {
    
    }
    else if (t_val == "p") {
        if (this.personArray[6].present) {
            this.personArray[6].addHumour(t_val, 10);
            if (this.personArray[6].humours[3] > 110 && this.eventMap["poseidonPatientLvl1"].advance()) {
                jhc.outputLine("Poseidon's patience seems never-ending.");
                this.eventMap["poseidonPatientLvl2"].step();
            }
            else if (this.personArray[6].humours[3] > 135 && this.eventMap["poseidonPatientLvl2"].ready()) {
                jhc.outputLine("Is Poseidon even paying attention?");
                this.eventMap["poseidonPatientLvl2"].advance(); //don't want it repeating
            }
        }
    }
}