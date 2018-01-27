game.initEvents = function() {
    this.eventMap = {
        //simple mood expressions
        "uranosCoolLvl1": this.getEventRecord(10),
        "aresMadLvl1": this.getEventRecord(5),
        "poseidonPatientLvl1": this.getEventRecord(4),
        "poseidonPatientLvl2": this.getEventRecord(4),
        "kronosTick": this.getEventRecord(5),
        "playDice": this.getEventRecord(10),
        //ares storyline
        "aresStormOut": this.getEventRecord(4, {is_waiter: true, wait_time: 10, starting_count: 4}),
        "aresAphroditeLoveLvl1": this.getEventRecord(1, {run_once: true}),
        "aresAphroditeLoveLvl2": this.getEventRecord(3, {run_once: true, starting_count: 3}),
        "aresAphroditeLoveLvl3": this.getEventRecord(3, {is_waiter: true, wait_time: 10, starting_count: 3, run_once: true}), //leave room together
        //poseidon storyline
        "poseidonDespairLvl1": this.getEventRecord(3),
        "poseidonDespairLvl2": this.getEventRecord(3, {wait_time: 2}),
        "poseidonPilotShip": this.getEventRecord(1)
    }
    this.eventMap["poseidonDespairLvl2"].waitStart();
}

game.procTemperament = function(t_val) {
    this.turnCounter++;
    this.addUniformHumours(t_val, 10);
    
    //if the updated humour goes over 127, everyone starts to feel it\
    //removing because it's OP
    var averageHumours = this.getAverageHumours();
    /*if (averageHumours[this.personArray[0].humourToInt(t_val)] > 127) { 
        for (i = 1; i < this.personArray.length; i++) {
            this.personArray[i].addHumour(t_val, 5);
        }
    }*/
    
    this.procReturns(t_val);
    
    //general stuff
    if (this.eventMap["kronosTick"].advance() && this.personArray[4].present) {
        jhc.outputLine("Kronos adjusts his glasses.");
    }
    
    this.personArray[6].addHumour("m", 2); //poseidon will get more and more melancholic
    
    if (averageHumours[0] > 110) { //dice game, relaxes people but also raises choleric
        if (this.eventMap["playDice"].advance()) {
            var i1 = this.turnCounter % this.personArray.length;
            var i2 = (this.turnCounter + 2) % this.personArray.length;
            if (i1 == i2) i2 = (i2 + 1) % this.personArray.length;
            var winner_number = i1 > i2 ? i1 : i2;
            var loser_number = i1 > i2 ? i2 : i1;
            jhc.outputLine(this.personArray[i1].name + 
                            " and " + this.personArray[i2].name +
                            " start playing dice. " +
                            this.personArray[winner_number].name + " wins!");
            this.subUniformHumours("m", 10);
            this.personArray[winner_number].addHumour("c", 5);
            this.personArray[winner_number].addHumour("s", 10);
            this.personArray[loser_number].addHumour("p", 5);
            this.personArray[loser_number].addHumour("c", 10);
        }
    }
    
    //specific character interactions below
    if (t_val == "s") {    
        this.procS(t_val);
    }
    else if (t_val == "c") {
        this.procC(t_val);
    }
    else if (t_val == "m") {
        this.procM(t_val);
    }
    else if (t_val == "p") {
        this.procP(t_val);
    }
    console.log("Turn " + this.turnCounter);
    for (var i = 0; i < this.personArray.length; i++) {
        var print_hmrs = "";
        for (var j = 0; j < 4; j++) {
            print_hmrs += (this.personArray[i].humours[j] + " ");
        }
        console.log(this.personArray[i].name + " " + print_hmrs);
    }
}

game.addNotPresentArrayToPerson = function (person) {
    var nparray = [];
    for (var i = 0; i < this.personArray.length; i++) {
        if (this.personArray[i].name != person.name && !this.personArray[i].present) {
            nparray += this.personArray[i].name;
        }
    }
    if (nparray != undefined)
        person.nparray = nparray;
}

game.updateNotPresentArrayToPerson = function (person) {
    if (person.nparray === undefined) {
        this.addNotPresentArrayToPerson(person);
        return;
    }
    function remove(array, element) {
        const index = array.indexOf(element);
        
        if (index !== -1) {
            array.splice(index, 1);
        }
    }
    var to_remove = [];
    for (var i = 0; i < person.nparray.length; i++) {
        for (var j = 0; j < this.personArray.length; j++) {
            if (this.personArray[j].present) { //if the character has reappeared since
                to_remove.push(i); //avoid changing length of array til were done
            }
        }
    }
    to_remove.forEach(function(el) {
        remove(person.nparray, el);
    });
    this.personArray.forEach(function(el) {
        if (!person.nparray.includes(el.name) && !el.present && el.name != person.name)  {
            person.nparray += el.name;
        }
    });
}

game.procReturns = function(t_val) {
    if (this.eventMap["aresStormOut"].waitAdvance()) { //this will trigger when the wait ends and no other time
        this.personArray[3].present = true;
        jhc.outputLine("Ares returns to the table with a sheepish look.");
        var newly_missing = 0;
        for (var i = 0; i < this.personArray.length; i++) {
            if (i != 3 && !this.personArray[i].present) {
                if (this.personArray[3].nparray.includes(this.personArray[i].name)) {
                    continue;
                }
                else {
                    newly_missing++;
                }
            }
        }
        if (newly_missing == 0) return; //nobody new has left
        jhc.outputLine("Ares looks around and notices the newly empty " + (newly_missing > 1 ? "seats" : "seat") +
                       ". He walks away.");
        this.processLeaveFor(this.personArray[3]);
    }
    
}

game.procS = function(t_val) {
    if (this.personArray[5].present) {
        if (this.personArray[5].humours[3] > 120) {
            if (this.eventMap["uranosCoolLvl1"].advance()) {
                jhc.outputLine("Uranos meets your gaze.");
            }
        }
    }
}

game.procC = function(t_val) {
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
            this.processLeaveFor(this.personArray[3]);
            jhc.outputLine("Ares stands up, his hands balled into tight fists\
                            and a look of rage and frustration on his face. He storms out\
                            loudly.");
            this.eventMap["aresStormOut"].advance();
        }
    }
}

game.procM = function(t_val) {
    console.log("!!");
    if (this.personArray[6].present) {
        var despair1_first_run = !this.eventMap["poseidonDespairLvl1"].has_run;
        var despair2_first_run = !this.eventMap["poseidonDespairLvl2"].has_run;
        if (this.eventMap["poseidonDespairLvl2"].waiting() &&
            this.eventMap["poseidonDespairLvl1"].advance()) {
            jhc.outputLine("Poseidon sighs. " + (despair1_first_run ? "Presumably he has a plan and this is not it." : ""));
            this.eventMap["poseidonDespairLvl2"].waitAdvance();
        }
        else if (this.eventMap["poseidonDespairLvl2"].advance()) {
            jhc.outputLine("Poseidon looks awfully tense. " + (despair2_first_run ? "You hope he doesn't try anything rash." : ""));
        }
        if (!this.eventMap["poseidonDespairLvl2"].waiting() &&
            !this.personArray[4].present && this.personArray[6].humours[2] > 127) { //kronos is needed to prevent poseidon
            jhc.outputLine("Poseidon gets to his feet and storms out the door towards the bridge. \
                            Things happen FINISH THIS");
            this.waitForReset();
        }
    }
}

game.procP = function(t_val) {
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
