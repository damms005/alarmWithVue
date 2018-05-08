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
        interval: 1000,
        showClock: "",
        saveInterval: undefined,
        timeInterval: undefined,
        countDown: undefined,
        identify: undefined
    },
    methods: {
        setAlarm() {

            this.timeDiff = null;

            // this shows the hours, minutes and seconds inputs
            this.alarmTime = this.alarmTimeHour + ":" + this.alarmTimeMinute + ":" + this.alarmTimeSeconds;

            // Getting the Current Date
            var currentDate = moment().format("ddd MMMM D YYYY HH:mm:ss ZZ");

            // Setting Date format
            var setDate = moment(currentDate, "ddd MMMM D YYYY HH:mm:ss ZZ");

            // setting my Hour, Minutes and seconds binding it with my Input
            setDate.set({
                h: this.alarmTimeHour,
                m: this.alarmTimeMinute,
                s: this.alarmTimeSeconds
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

                if (duration.seconds() < 0) {
                    this.timeDiff = $(".countdown").text("Time is Up !!");
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
                        onClick: function() {
                            window.focus("https://bit.ly/alarmVue");
                            this.close();
                        }
                    });
                    Push.extend();

                    // When Countdown alarm Time is Up
                } else if (duration.hours() || duration.minutes() || duration.seconds() > 0) {
                    this.timeDiff = $(".countdown").text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());
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
        const Push = require('pushjs');
        const PushFCM = require('pushjs-fcm');


        // Installing Firebase
        var config = {
            apiKey: "AIzaSyAujIYu8N7xyebiuysqWqA5wyfxxp7RYnE",
            authDomain: "push-alarm-43c80.firebaseapp.com",
            databaseURL: "https://push-alarm-43c80.firebaseio.com",
            projectId: "push-alarm-43c80",
            storageBucket: "",
            messagingSenderId: "1097281088688"
        };

        firebase.initializeApp(config);
        Push.config({
            FCM: config
        });
        Push.extend(PushFCM);
        Push.Permission.request(onGranted, onDenied);

    }
    this.timeInterval = setInterval(this.getDate, 100);
});



// notify() {
//     let push = new Notification("Alarm with Vue", {
//         body: "Time is up young Warlock" + "\n" + "too bad you don't have a time stone",
//         icon: "../../img/clock.png",
//         tag: "Alarm"
//     });
// }










/***
 * enter time in input 
 * set alarm
 * reset diff
 * store entered time in a variable
 * get time diff
 * decrement diff unitl zero
 * 
 * 
 * 
 * 
 * 
 * 
 */