var app = new Vue({
    el: "#app-timer",
    data: {
        hourformat: "",
        clock: "",
        // clockAnimate: undefined,
        TodaysDate: "",
        alarmTime: "",
        alarmTimeHour: "",
        alarmTimeMinute: "",
        alarmTimeSeconds: "",
        timeDiff: "00:00:00",
        showTimer: "",
        interval: 1000,
        showClock: "",
        APMs: "",
        saveInterval: undefined,
        timeInterval: undefined,
        countDown: undefined,
        identify: undefined
    },
    methods: {
        setAlarm() {

            this.timeDiff = null;
            // this.alarmTimeMinute = this.alarmTimeHour = this.alarmTimeSeconds = null;
            var time = $(".timepicker");
            var newTime = time.val();
            var timeSplit = newTime.split(":");
            var timeSplitLetter = timeSplit[1] && timeSplit[1].split(" ");


            this.alarmTimeHour = timeSplit[0];

            this.alarmTimeMinute = timeSplitLetter[0];

            this.APMs = timeSplitLetter[1];

            if (this.APMs == "PM") {
                if (this.alarmTimeHour == 12) {
                    this.alarmTimeHour = timeSplit[0];
                } else {

                    this.alarmTimeHour = Number(timeSplit[0]) + 12;
                }
            } else {
                this.alarmTimeHour = Number(timeSplit[0]) + 12;

            }




            // this shows the hours, minutes and seconds inputs
            this.alarmTime = this.alarmTimeHour + ":" + this.alarmTimeMinute + ":" + this.alarmTimeSeconds;

            // Getting the Current Date
            var currentDate = moment().format("ddd MMMM D YYYY HH:mm:ss ZZ");

            // Setting Date format
            var setDate = moment(currentDate, "ddd MMMM D YYYY HH:mm:ss ZZ");

            // setting my Hour, Minutes and seconds binding it with my Input
            setDate.set({
                h: this.alarmTimeHour,
                m: this.alarmTimeMinute
                    // s: this.alarmTimeSeconds,
            });


            // * Getting the time Difference
            var eventTime = setDate.format("X"); // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
            var currentTime = moment().format("X"); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
            var diffTime = eventTime - currentTime;
            var interval = 1000;
            var clockIcon = $("#clock");
            duration = moment.duration(diffTime * interval, "milliseconds");

            // Counting the time down
            this.countDown = function() {
                duration = moment.duration(duration - interval, "milliseconds");

                // When Alarm is Done counting 
                if (duration.seconds() < 0) {
                    this.timeDiff = $(".stop").text("Time's Up!");

                    clearInterval(this.saveInterval);

                    $.fn.extend({
                        animateCss: function(animationName) {
                            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                            this.addClass('animated ' + animationName).one(animationEnd, function() {
                                $(this).removeClass("animated " + animationName);
                            });
                            return this;
                        }
                    });

                    // Enabling the animation for alarm
                    clockIcon.animateCss('shake red-text');

                    // Push notification
                    Push.create("Alram with Vue", {
                        body: "Time up young warlock \n too bad you don't have a time stone",
                        icon: 'img/clock.png',
                        vibrate: [300, 100],
                        timeout: 4000,
                        tag: "alarm",
                        onClick: function() {
                            window.focus("https://bit.ly/alarmVue");
                            this.close();
                        }
                    });

                    // Sound Notification
                    var audio = new Audio('./files/droplet.mp3');

                    audio.play();

                } else if (duration.hours() || duration.minutes() || duration.seconds() > 0) {
                    this.timeDiff = $(".countdown").text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());
                    this.showTimer = this.timeDiff;
                    // this.alarmDone()
                }
            };

            this.resetInterval();
            // this.resetAlarm();

        },
        resetInterval() {
            //* Update Alarm
            clearInterval(this.saveInterval);
            this.saveInterval = setInterval(this.countDown, this.interval);
        },

        resetAlarm() {
            //* Reseting Alarm
            $("#clock").removeClass("animated shake");
            $("#clock").removeClass("red-text");
            console.log("class removed");

            clearInterval(this.saveInterval);
            this.timeDiff = $(".countdown").text("00:00:00");

        },
        getDate() {
            // Getting the Calendar and updated Clock time
            var calender = moment().format('dddd MMMM D YYYY');
            var clock = moment().format('hh:mm A');
            this.TodaysDate = calender;
            this.clock = clock;

            // Comparing Time of Day
            var hours = moment().format('HH')
            if (hours >= 12) {
                if (hours >= 16) {
                    this.hourformat = "Evening";
                } else {
                    this.hourformat = "Afternoon";
                }
            } else {
                this.hourformat = "Morning";
            }
        }

    },
    created() {
        this.timeInterval = setInterval(this.getDate, 100);
    }
});