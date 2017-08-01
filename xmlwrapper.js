var xmlw = (function() {

    return {
        testRun: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    runTest(this);
                }
            }
            xhttp.open("GET", "test.xml", true);
            xhttp.send(null);
            
            function runTest(xml) {
                alert("Running XML test. Stand by.");
                var xmlDoc = xml.responseXML;
                alert(" " + xmlDoc.getElementsByTagName("outside").length);
            }
        }
    };
})();