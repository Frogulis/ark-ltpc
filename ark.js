var game = (function() {

    var game_name = "Temper";
    var game_version = "0.5";
    
    var colorS, colorC, colorM, colorP;
    var personArray;
    var missingArray = [];
    var eventMap;
    
    return { //start of "ark" module functions
        getEventRecord: function(myCount, options) {
            if (options === undefined) options = {};
            if (options.is_waiter === undefined) options.is_waiter = false;
            if (options.wait_time === undefined) options.wait_time = 1;
            if (options.starting_count === undefined) options.starting_count = 0;
            if (options.run_once === undefined) options.run_once = false;
            var advanceFunc = function() { //counts down and returns true + resets when cur == 0
                if (this.run_once && this.has_run) {
                    return false;
                }
                if (this.waiting()) {
                    return false;
                }
                if (!this.has_run) this.has_run = true;
                if (this.cur == 0) {
                    this.cur = this.count;
                    if (this.is_waiter) {
                        this.waitStart();
                    }
                    return true;
                }
                else {
                    this.cur--;
                    return false;
                }
            }
            var stepFunc = function() { //counts down and returns true when cur == 0, but won't reset
                if (this.waiting()) {
                    return false;
                }
                if (this.cur > 0) {
                    this.cur--;
                    return false;
                }
                return true;
            }
            var readyFunc = function() { //returns whether the event is ready to trigger
                if (this.waiting()) {
                    return false;
                }
                return (this.cur == 0);
            }
            var checkFunc = function() { //returns the current number of counts left
                return this.cur;
            }
            var waitStartFunc = function() { //starts the wait
                if (this.is_waiter) {
                    this.wait_cur = this.wait_max;
                    this.waiting_status = true;
                }
            }
            var waitingFunc = function() { //returns whether its waiting
                return this.waiting_status;
            }
            var waitStepFunc = function() { //counts down the wait time and returns true when cur == 0, but wont reset
                if (!this.waiting()) {
                    return false;
                }
                if (this.wait_cur > 0) {
                    this.wait_cur--;
                    return false;
                }
                return true;
            }
            var waitAdvanceFunc = function() {
                if (!this.waiting()) {
                    return false;
                }
                if (this.wait_cur == 0) {
                    this.wait_cur = this.wait_max;
                    if (this.is_waiter) {
                        this.waiting_status = false;
                    }
                    return true;
                }
                else {
                    this.wait_cur--;
                    return false;
                }
            }
            
            return {
                advance: advanceFunc, //counts down and returns true + resets when cur == 0
                step: stepFunc, //counts down and returns true when cur == 0, but won't reset
                ready: readyFunc, //returns whether the event is ready to trigger
                check: checkFunc,
                waitStart: waitStartFunc,
                waiting: waitingFunc,
                waitAdvance: waitAdvanceFunc,
                waitStep: waitStepFunc,
                cur: options.starting_count,
                count: myCount,
                is_waiter: options.is_waiter,
                wait_cur: options.wait_time,
                wait_max: options.wait_time,
                waiting_status: false,
                run_once: options.run_once,
                has_run: false                
            }
        },
    
        getColorObject: function inner_name(myR, myG, myB) {
            var avgFunc = function(other) { //define function once
                var temp = inner_name(other.r, other.g, other.b);
                temp.r = Math.floor((this.r + temp.r) / 2);
                temp.g = Math.floor((this.g + temp.g) / 2);
                temp.b = Math.floor((this.b + temp.b) / 2);
                return temp;
            };
            if (myR > 255 || myG > 255 || myB > 255 ||
                myR < 0 || myG < 0 || myB < 0) {
                return {
                    getAverage: avgFunc,
                    r: 255,
                    g: 255,
                    b: 255
                };
            }
            return {
                getAverage: avgFunc,
                r: myR,
                g: myG,
                b: myB
            };
        },
        
        getPersonObject: function(myName, myS, myC, myM, myP) {
            var humourToIntFunc = function(val) {
                if (val == "s") return 0;
                else if (val == "c") return 1;
                else if (val == "m") return 2;
                else if (val == "p") return 3;
                return 0;
            }
            var addHumourFunc = function(humour, amount)
            {
                console.log("Adding " + amount + " to " + humour);
                var humourInt = this.humourToInt(humour);
                
                if (this.humours[humourInt] + amount > 150 || this.humours[humourInt] + amount < 0 || amount < 0) {
                    return; //fix this
                }
                this.humours[humourInt] += amount;
                for (i = (humourInt + 1) % 4; amount > 0; i = (i + 1) % 4) {
                    if (i == humourInt) continue; //we dont subtract from the one we're adding to
                    if (this.humours[i] > 0) {
                        this.humours[i]--;
                        amount--;
                    }
                }
            };
            
            if (myS < 0 || myC < 0 || myM < 0 || myP < 0) {
                return {
                    humourToInt: humourToIntFunc,
                    addHumour: addHumourFunc,
                    name: myName,
                    humours: [38, 38, 37, 37]
                };
            }
            return {
                humourToInt: humourToIntFunc,
                addHumour: addHumourFunc,
                name: myName,
                humours: [myS, myC, myM, myP],
                present: true
            };
        },
    
        gameInit: function() {
            jhc.clearInput();
            jhc.clearOutput();
            jhc.outputLine(game_name + "<br>A long-term journey through space.<br>" +
            "**********************************<br>" + 
            "You take your place at the table. Your crewmates are already seated.<br>" +
            "Glancing around, you see the familiar faces of Hermes, Aphrodite, Ares, Kronos, Uranos and Poseidon.<br>" +
            "May the gods help you all.<br>" +
            "**********************************<br>");
            colorS = this.getColorObject(255, 0, 0);
            colorC = this.getColorObject(127, 127, 0);
            colorM = this.getColorObject(0, 0, 255);
            colorP = this.getColorObject(0, 255, 0);
            this.personArray = [this.getPersonObject("Gaia",       0,     25,    100,     25),
                                this.getPersonObject("Hermes",    25,     50,     25,     50),
                                this.getPersonObject("Aphrodite", 1,     25,     25,     25),
                                this.getPersonObject("Ares",      25,    100,     25,      0),
                                this.getPersonObject("Kronos",    25,     75,     25,     25),
                                this.getPersonObject("Uranos",   100,     25,      0,     25),
                                this.getPersonObject("Poseidon",  25,      0,     25,    100)];
            this.initEvents();
            this.genBackground();
        },
        
        initEvents: 0,

        gameInput: function() {
            var input_line = jhc.getInputLine();
            jhc.clearInput();
            if (!jhc.isValidInput(input_line)) {
                return;
            }
            jhc.outputLine(" > " + input_line);
            
            this.procInput(input_line.toLowerCase().split(" "));
            this.genBackground();
        },
        
        roomDescription: function() {
            var desc = "A utilitarian room containing little but the smooth table at which you're seated.\
                        A set of dice and a cup have been placed at the centre of the table.\
                        Looking around, you see ";
            //compile lists of present and missing people
            var missingArray = [];
            var present_names = "";
            for (var i = 1; i < this.personArray.length - 1; i++) {
                if (this.personArray[i].present) {
                    present_names = present_names + this.personArray[i].name;
                    if (this.personArray.length > 2) {
                        present_names = present_names + ", "; //these are so that the commas are correct
                    }
                    else {
                        present_names = present_names + " "; //as above
                    }
                }
                else {
                    missingArray.push(this.personArray[i]);
                }
            }
            present_names = present_names + "and " + this.personArray[this.personArray.length - 1].name + ". ";
            desc = desc + present_names;
            if (missingArray.length > 1) {
                var missing_names = "";
                for (var i = 0; i < missingArray.length - 1; i++) {
                    missing_names = missing_names + this.missingArray[i].name;
                    if (missingArray.length > 2) {
                        missing_names = missing_names + ", ";
                    }
                    else {
                        missing_names = missing_names + " ";
                    }
                }
                missing_names = missing_names + "and " + missingArray[missingArray.length - 1].name + " ";
                desc = desc + missing_names + "are conspicuously absent.";
            }
            else if (missingArray.length == 1) {
                desc = desc + missingArray[0].name + " is conspicuously absent.";
            }
            return desc;
        },
        
        createColor: function(myr, myg, myb) {
            return { r: myr, g: myg, b: myb };
        },
        
        setBackground: function(r, g, b) {
            stringgen = (function(r, g, b,) {
                if (r > 255 || g > 255 || b > 255 ||
                    r < 0 || g < 0 || b < 0) {
                    console.log("Invalid RGB values: " + r + " " + g + " " + b);
                    return "#ffffff";
                }
                else {
                    console.log("Changing BG to: " + r + " " + g + " " + b);
                    return "#" + r.toString(16) + g.toString(16) + b.toString(16);
                }
            });
            document.getElementsByTagName("html")[0].style.backgroundColor = stringgen(r, g, b);
        },
        
        getAverageHumours: function() {
            var s = 0;
            var c = 0;
            var m = 0;
            var p = 0;
            for (i = 0; i < this.personArray.length; i++) {
                s += this.personArray[i].humours[0];
                c += this.personArray[i].humours[1];
                m += this.personArray[i].humours[2];
                p += this.personArray[i].humours[3];
            }
            s /= this.personArray.length;
            c /= this.personArray.length;
            m /= this.personArray.length;
            p /= this.personArray.length;
            return [s, c, m, p];
        },
        
        /*genBackground: function() {
            //get average of humours then fraction of 150
            var humours = this.getAverageHumours();
            humours[0] /= 150;
            humours[1] /= 150;
            humours[2] /= 150;
            humours[3] /= 150;
            //now we average all the colours and blend with grey for nice pastel tones
            var bg = getColorObject(127, 127, 127);
            bg = bg.getAverage(getColorObject(colorS.r * humours[0], colorS.g * humours[0], colorS.b * humours[0]));
            bg = bg.getAverage(getColorObject(colorC.r * humours[1], colorC.g * humours[1], colorC.b * humours[1]));
            bg = bg.getAverage(getColorObject(colorM.r * humours[2], colorM.g * humours[2], colorM.b * humours[2]));
            bg = bg.getAverage(getColorObject(colorP.r * humours[3], colorP.g * humours[3], colorP.b * humours[3]));
            bg = bg.getAverage(getColorObject(150, 150, 150));
            this.setBackground(Math.floor(bg.r), Math.floor(bg.g), Math.floor(bg.b));
        },*/
        
        genBackground: function() {
            //get average of humours then fraction of 150
            var humours = this.getAverageHumours();
            humours[0] /= 255; //converting each to value between 0 and 1
            humours[1] /= 255;
            humours[2] /= 255;
            humours[3] /= 255;
            //now we average all the colours and blend with grey for nice pastel tones
            var bg = this.getColorObject(127, 127, 127);
            bg = bg.getAverage(this.getColorObject(colorS.r * humours[0], colorS.g * humours[0], colorS.b * humours[0]));
            bg = bg.getAverage(this.getColorObject(colorC.r * humours[1], colorC.g * humours[1], colorC.b * humours[1]));
            bg = bg.getAverage(this.getColorObject(colorM.r * humours[2], colorM.g * humours[2], colorM.b * humours[2]));
            bg = bg.getAverage(this.getColorObject(colorP.r * humours[3], colorP.g * humours[3], colorP.b * humours[3]));
            bg = bg.getAverage(this.getColorObject(150, 150, 150));
            this.setBackground(Math.floor(bg.r), Math.floor(bg.g), Math.floor(bg.b));
        },
        
        procTemperament: 0,

        procInput: function(t_input) {
            if (t_input[0] == "help") {
                jhc.outputLine("You may express either (S)anguine, (C)holeric, (M)elancholic or (P)hlegmatic temperament. You may also (L)ook.");
            }
            else if (t_input[0] == "quit" || t_input[0] == "exit") {
                jhc.outputLine("Just close the browser tab!");
            }
            else if (t_input[0] == "reset") {
                this.gameInit();
            }
            else if (t_input[0] == "s" || t_input[0] == "sanguine") {
                jhc.outputLine("You express your sanguine temperament.");
                this.procTemperament("s");
            }
            else if (t_input[0] == "c" || t_input[0] == "choleric") {
                jhc.outputLine("You express your choleric temperament.");
                this.procTemperament("c");
            }
            else if (t_input[0] == "m" || t_input[0] == "melancholic") {
                jhc.outputLine("You express your melancholic temperament.");
                this.procTemperament("m");
            }
            else if (t_input[0] == "p" || t_input[0] == "phlegmatic") {
                jhc.outputLine("You express your phlegmatic temperament.");
                this.procTemperament("p");
            }
            else if (t_input[0] == "l" || t_input[0] == "look") {
                jhc.outputLine(this.roomDescription());
                                
            }
            else {
                jhc.outputLine("I don't understand. Try again.");
            }
        }
    };
})();