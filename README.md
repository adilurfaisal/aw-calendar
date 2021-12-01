<p align="center"><a target="_blank" href="https://awcalendar.butechltd.com"><img src="https://raw.githubusercontent.com/adilurfaisal/aw-calendar/master/assets/aw-calendar-logo-56px.png"></a></p>

<a target="_blank" href="https://awcalendar.butechltd.com"><img src="https://komarev.com/ghpvc/?username=adilurfaisal&color=dc143c"></a>

# AW Calendar

Awesome event ajax calendar for any responsive website. You can use multiple elements. 
<a target="_blank" href="https://awcalendar.butechltd.com">Demo</a>

# Features
* Responsive Design 
* Easy to use
* Ajax event load
* Ajax event add, update & delete
* Easy to customize
* +10 Methods
* +15 Events Listener
* Demo Incudes

<a target="_blank" href="https://awcalendar.butechltd.com"><img src="https://raw.githubusercontent.com/adilurfaisal/aw-calendar/master/assets/demo-1.gif"></a>

## How to use
```html
<!-- Use this element in body -->
<div class="aw-calendar"></div>
```
```html
<!-- AW Calendar -->
<script src="https://awcalendar.butechltd.com/0.0.1/awcalendar.min.js"></script>

<!-- Use this script end of html body -->
<script>
let awcal = new awCalendar(".aw-calendar");
awcal.render();
</script>
```
<a target="_blank" href="https://awcalendar.butechltd.com"><img src="https://awcalendar.butechltd.com/github/screenshot-basic.JPG"></a>

These are default options for aw-calendar. You can also use advanced options.

## Advance Options
```html
<!-- AW Calendar -->
<script src="https://awcalendar.butechltd.com/0.0.1/awcalendar.min.js"></script>

<!-- Use this script end of html body -->
<script>
// Use this script end of the body
let today = new Date();
let awcal = new awCalendar(".aw-calendar", {
     offDays: [5,6],
     startDate: today.setMonth(today.getMonth()-3),
     endDate: today.setMonth(today.getMonth()+3),
     eventLoad: "./event-load.php",
     eventSave: "./event-save.php",
     backgroundImg: "img/07.jpeg",
     eventModal: true
});
awcal.render();
</script>
```
<a target="_blank" href="https://awcalendar.butechltd.com"><img src="https://raw.githubusercontent.com/adilurfaisal/aw-calendar/master/assets/screenshot-advance.JPG"></a>

## Methods
<code>setData, dateFormat, setToday, getToday, isOffday, isToday, isEvent, setMonth, setYear, getMonth, getYear, getDate, evtAdd, evtDelete, evtLoad</code>
```html
<script>
// Use this script end of the body
let today = new Date();
let awcal = new awCalendar(".aw-calendar", {
     eventModal: true
});
awcal.render();
setTimeout(function(){
   awcal.setData("offDays", [0]);
   awcal.setToday("2021-10-01");
   awcal.setYear(today.getFullYear()-1);
   awcal.setMonth(today.getMonth()-1);
   awcal.render();
   awcal.evtAdd({date:"2021-10-05", title:"AW Calendar Init", description:"First day for AW Calendar"});
});
</script>
```

## Event Listener
<code>offDays, startDate, endDate, eventLoad, eventSave, backgroundImg, backgroundColor, eventModal, SetData, SelectDate, ChangeCal, EventUpdate, EventAdd, EventDelete, setToday, setMonth, setYear
</code>
```html
<script>
// Use this script end of the body
let today = new Date();
let awcal = new awCalendar(".aw-calendar", {
     offDays: [5,6],
     startDate: today.setMonth(today.getMonth()-3),
     endDate: today.setMonth(today.getMonth()+3),
     eventLoad: "./event-load.php",
     eventSave: "./event-save.php",
     backgroundImg: "img/06.jpg",
     eventModal: true
});
awcal.render();
awcal.on("SelectDate", function(obj){
       // Do something
});
awcal.on("ChangeCal", function(obj){
       // Do something
});
awcal.on("EventUpdate, EventAdd, EventDelete", function(obj){
       // Do something
});
</script>
```

## Donate
<p align="center">
<a target="_blank" href="https://www.paypal.com/donate?hosted_button_id=2ZTMGY2F3C8GW"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"></a>
</p>


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

