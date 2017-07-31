var jhc = (function() { //placing all inside jhc namespace for neatitude
    return {
        outputLine: function(output) {
            this.outputToConsole(output + "<br>", false);
            this.autoscrollConsole();
        },

        outputToConsole: function(output, logbool) {
            document.getElementById("console_output").innerHTML += output;
        },

        autoscrollConsole: function() {
            document.getElementById("console_output").scrollTop = document.getElementById("console_output").scrollHeight;
        },

        outputHello: function() {
            outputLine("Hello");
        },

        isValidInput: function(str) {
            if (str == null || str == "") {
                return false;
            }
            else {
                return true;
            }
        },

        getInputLine: function() {
            var result = document.forms["console_input_form"]["console_input"].value;
            return result;
        },

        clearInput: function() {
            document.forms["console_input_form"]["console_input"].value = "";
        },

        clearOutput: function() {
            document.getElementById("console_output").innerHTML = "";
        }
    };
})();