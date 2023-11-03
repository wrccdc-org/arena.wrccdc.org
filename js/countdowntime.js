$(document).ready(function () {
    $.getJSON("competition.json", function (eventData) {
        console.log = function() {};
        var data = eventData[0]; // let us assume list
        for (var i = 0; i < eventData.length; i++) {
            var eventStartTime = new Date(eventData[i].startTime);
            if (eventStartTime > currentDate) {
                data = eventData[i];
                break;
            }
        }
        var items = [];
        $.each(data, function (key, val) {
            items.push(val);
        });

        if (items === undefined || items.length == 0) {
            document.getElementById('showData').innerHTML = "ERROR: JSON FILE NOT FOUND.";
        }

        var days = 0;
        var hours = 0;
        var minutes = 0;
        var seconds = 0;

        document.getElementById('showData').innerHTML = items[0];

        var dateStr = items[2];
        var dateStr2 = items[3];
        var date = new Date(dateStr);
        var date2 = new Date(dateStr2);
        var currentDate = new Date();

        // Check if the competition is in the past, present, or future
        var eventType="competition"
        if(items.length>2){
            eventType=items[1];
        }
	eventType = eventType.toUpperCase(); // caps lock on
        if (currentDate < date) {
            // Competition is in the future, set up a countdown
            var countDownDate = date.getTime();
            document.getElementById('nextEvent').innerHTML = eventType + " STARTS ON: " + formatDate(date) + " IN ";
            startCountdown(countDownDate);
        } else if (currentDate >= date && currentDate <= date2) {
            // Competition is currently active, set up a countdown for the end
            var endCompDate = date2.getTime();
            document.getElementById('nextEvent').innerHTML = eventType + " IS CURRENTLY ACTIVE. IT ENDS IN: ";
            startCountdown(endCompDate);
        } else {
            // Competition is in the past
            document.getElementById('nextEvent').innerHTML = "COMPETITION IS OVER. SEE YOU AT NEXT EVENT!";
            var over = "&bull;";
            document.getElementById('days').innerHTML = over;
            document.getElementById('hours').innerHTML = over;
            document.getElementById('minutes').innerHTML = over;
            document.getElementById('seconds').innerHTML = over;
        }

        function startCountdown(targetDate) {
            var x = setInterval(function () {
                var now = new Date().getTime();
                var distance = targetDate - now;

                if (distance > 0) {
                    distance = Math.floor(distance / 1000);
                    days = Math.floor(distance / 86400);
                    distance = distance % 86400;
                    hours = Math.floor(distance / 3600);
                    distance = distance % 3600;
                    minutes = Math.floor(distance / 60);
                    distance = distance % 60;
                    seconds = Math.floor(distance);
                } else {
                    clearInterval(x);
                }

                document.getElementById('days').innerHTML = days;
                document.getElementById('hours').innerHTML = hours;
                document.getElementById('minutes').innerHTML = minutes;
                document.getElementById('seconds').innerHTML = seconds;
            }, 1000);
        }

        function formatDate(date) {
            var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return monthArray[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        }
        console.info("Made by @succurity_ <3.");
    });
});


