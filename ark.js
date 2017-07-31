var game = (function() {

    var game_name = "workinprogessgame";
    var game_version = "0.1";
    
    return {
        gameInit: function() {
            jhc.clearInput();
            jhc.clearOutput();
            jhc.outputLine(game_name + "<br>A long-term journey through space.<br>" +
            "**********************************<br>");
        },

        gameInput: function() {
            var input_line = jhc.getInputLine();
            jhc.clearInput();
            if (!jhc.isValidInput(input_line)) {
                return;
            }
            jhc.outputLine(" > " + input_line);
            
            this.gameDummyFunction(input_line.toLowerCase().split(" "));
        },

        gameDummyFunction: function(t_input) {
            if (t_input[0] == "go" || t_input[0] == "g") {
                if (t_input[1] == "n" || t_input[1] == "north") {
                    jhc.outputLine("Going north.");
                }
                else if (t_input[1] == "e" || t_input[1] == "east") {
                    jhc.outputLine("Going east.");
                }
                else if (t_input[1] == "s" || t_input[1] == "south") {
                    jhc.outputLine("Going south.");
                }
                else if (t_input[1] == "w" || t_input[1] == "west") {
                    jhc.outputLine("Going west.");
                }
                else {
                    jhc.outputLine("I don't know that way.");
                }
            }
            else {
                jhc.outputLine("Invalid command.");
            }
        }
    };
})();