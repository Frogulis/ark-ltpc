game.procTemperament = function(t_val) {
    this.personArray[0].addHumour(t_val, 10);
    //if the updated humour goes over 127, everyone starts to feel it
    var averageHumours = this.getAverageHumours();
    if (averageHumours[this.personArray[0].humourToInt(t_val)] > 127) { 
        for (i = 1; i < this.personArray.length; i++) {
            this.personArray[i].addHumour(t_val, 5);
        }
    }
    //specific character interactions below
    if (t_val == "s") {
        for (i = 0; i < this.personArray.length; i++) {
            if (i != 3) {
                this.personArray[i].addHumour(t_val, 5);
            }
        }
        
        if (this.personArray[5].humours[3] > 120) {
            if (this.eventMap["uranosCoolLvl1"].ready()) {
                jhc.outputLine("Uranos meets your gaze.");
            }
        }
    }
    else if (t_val == "c") {
        this.personArray[3].addHumour(t_val, 10);
        if (this.personArray[3].humours[1] > 125) {
            if (this.eventMap["aresMadLvl1"].ready()) {
                jhc.outputLine("Ares looks murderous.");
            }
        }
    }
    else if (t_val == "m") {
    
    }
    else if (t_val == "p") {
        this.personArray[6].addHumour(t_val, 10);
        if (this.personArray[6].humours[3] > 110) {
            jhc.outputLine("Poseidon's patience seems never-ending.");
        }
        if (this.personArray[6].humours[3] > 135) {
            jhc.outputLine("Is Poseidon even paying attention?");
        }
    }
}