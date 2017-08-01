var game = (function() {

    var game_name = "Temper";
    var game_version = "0.1";
    
    var colorS, colorC, colorM, colorP;
    var personArray;
    
    function getColorObject(myR, myG, myB) {
        var avgfunc = function(other) {
            var temp = getColorObject(other.r, other.g, other.b);
            temp.r = Math.floor((this.r + temp.r) / 2);
            temp.g = Math.floor((this.g + temp.g) / 2);
            temp.b = Math.floor((this.b + temp.b) / 2);
            return temp;
        };
        if (myR > 255 || myG > 255 || myB > 255 ||
            myR < 0 || myG < 0 || myB < 0) {
            return {
                getAverage: avgfunc,
                r: 255,
                g: 255,
                b: 255
            };
        }
        return {
            getAverage: avgfunc,
            r: myR,
            g: myG,
            b: myB
        };
    }
    
    function getPersonObject(myName, myS, myC, myM, myP) {
        if (myS < 0 || myC < 0 || myM < 0 || myP < 0) {
            return {
                name: myName,
                s: 38,
                c: 38,
                m: 36,
                p: 36
            };
        }
        return {
            name: myName,
            s: myS,
            c: myC,
            m: myM,
            p: myP
        };
    }
    
    return {
        
        gameInit: function() {
            jhc.clearInput();
            jhc.clearOutput();
            jhc.outputLine(game_name + "<br>A long-term journey through space.<br>" +
            "**********************************<br>" + 
            "You take your place at the table. Your crewmates are already seated.<br>" +
            "Glancing around, you see the familiar faces of Hermes, Aphrodite, Ares, Kronos, Uranos and Poseidon.<br>" +
            "May the gods help you all.<br>" +
            "**********************************<br>");
            colorS = getColorObject(255, 0, 0);
            colorC = getColorObject(255, 255, 0);
            colorM = getColorObject(0, 86, 255);
            colorP = getColorObject(0, 255, 42);
            this.personArray = [getPersonObject("Gaia",       0,     25,    100,     25),
                                getPersonObject("Hermes",    25,     50,     25,     50),
                                getPersonObject("Aphrodite", 75,     25,     25,     25),
                                getPersonObject("Ares",       0,    125,     25,      0),
                                getPersonObject("Kronos",    25,     75,     25,     25),
                                getPersonObject("Uranos",   100,     25,      0,     25),
                                getPersonObject("Poseidon",  25,      0,     25,    100)];
            this.genBackground();
        },

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
        
        genBackground: function() {
            //get average of humours then fraction of 150
            var tS = 0;
            var tC = 0;
            var tM = 0;
            var tP = 0;
            for (i = 0; i < this.personArray.length; i++) {
                tS += this.personArray[i].s;
                tC += this.personArray[i].c;
                tM += this.personArray[i].m;
                tP += this.personArray[i].p;
            }
            tS = (tS / 7) / 150;
            tC = (tC / 7) / 150;
            tM = (tM / 7) / 150;
            tP = (tP / 7) / 150;
            //now we average all the colours
            var bg = getColorObject(255, 255, 255);
            bg = bg.getAverage(getColorObject(Math.floor(colorS.r * tS), Math.floor(colorS.g * tS), Math.floor(colorS.b * tS)));
            bg = bg.getAverage(getColorObject(Math.floor(colorC.r * tC), Math.floor(colorC.g * tC), Math.floor(colorC.b * tC)));
            bg = bg.getAverage(getColorObject(Math.floor(colorM.r * tM), Math.floor(colorM.g * tM), Math.floor(colorM.b * tM)));
            bg = bg.getAverage(getColorObject(Math.floor(colorP.r * tP), Math.floor(colorP.g * tP), Math.floor(colorP.b * tP)));
            this.setBackground(bg.r, bg.g, bg.b);
        },

        procInput: function(t_input) {
            if (t_input[0] == "help") {
                jhc.outputLine("You may express either (S)anguine, (C)holeric, (M)elancholic or (P)hlegmatic temperament.");
            }
            else if (t_input[0] == "s" || t_input[0] == "sanguine") {
                jhc.outputLine("You express your sanguine temperament.");
                procTemperament("s");
            }
            else if (t_input[0] == "c" || t_input[0] == "choleric") {
                jhc.outputLine("You express your choleric temperament.");
                procTemperament("c");
            }
            else if (t_input[0] == "m" || t_input[0] == "melancholic") {
                jhc.outputLine("You express your melancholic temperament.");
                procTemperament("m");
            }
            else if (t_input[0] == "p" || t_input[0] == "phlegmatic") {
                jhc.outputLine("You express your phlegmatic temperament.");
                procTemperament("p");
            }
            else {
                jhc.outputLine("I don't understand. Try again.");
            }
        },
        
        procTemperament: function(t_val) {
            if (t_num == "s") {
                
            }
        }
    };
})();