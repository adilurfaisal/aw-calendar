class awCalendar extends HTMLElement{
    
    /**
     * constructor
     * @param {String} eleclass 
     * @param {JSON} opt 
    */
    constructor(eleclass, opt) {
        super();
        this.event_options = ["offDays", "startDate", "endDate", "eventLoad", "eventSave", "backgroundImg", "backgroundColor", "eventModal", "SetData", "SelectDate", "ChangeCal", "EventUpdate", "EventAdd", "EventDelete", "setToday", "setMonth", "setYear"];
        this.event_arr = [];
        this.date = new Date();
        this.today = new Date();
        this.date.setHours(24,0,0,0);
        this.options = {};
        this.new_options = {};

        document.querySelector(eleclass).append(this);
        if(opt){
            Object.keys(opt).forEach((v, i)=>{
                this.setData(v, opt[v]);
            })
        }
    }

    /**
     * Date Formating
     * @param {Date} date 
     * @param {String} format 
     * @return {String}
    */
    dateFormat = (date, format) => {
        var z = {
            M: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            m: date.getMinutes(),
            s: date.getSeconds()
        };
        format = format.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
            return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2);
        });
            
        return format.replace(/(y+)/g, function(v) {
            return date.getFullYear().toString().slice(-v.length);
        });
    }

    /**
     * Set Data 
     * @param {String} key 
     * @param {String} val 
    */
    setData(key, val){
        if(!this.event_options.includes(key)){
            return false;
        }
        this.options[key] = val;
        this.new_options[key] = val;
        
        this.dispatchEvent(new CustomEvent(key, {
            detail: val,
            bubbles: true,
            composed: true
        }));

        return this.setAttribute(key, val);
    }

    /**
     * On Event 
     * @param {String} evt 
     * @param {Function} fn 
    */
    on = (evt, fn) => {
        if(evt.trim()=="*"){
            Object.values(this.event_options).forEach((evtel) => {
                this.addEventListener(evtel.trim(), fn);
            })
        }else{
            evt.split(",").forEach((evtel) => {
                this.addEventListener(evtel.trim(), fn);
            })
        }
    }

    /**
     * Request 
     * @param {String} method 
     * @param {String} url 
     * @param {JSON} parms 
     * @return {JSON}
    */
    request = (method, url, parms) => {
        return new Promise(function (resolve, reject) {
            const xhttp = new XMLHttpRequest();
            xhttp.onload = () => resolve({
                status: xhr.status,
                response: xhr.responseText
            });
            xhttp.onerror = () => reject({
                status: xhr.status,
                response: xhr.responseText
            });
            xhttp.open(method, url);
            xhttp.send(JSON.stringify(parms));
        });
    }

    /**
     * Set Today 
     * @param {Date} date 
    */    
    setToday = (date) => {
        this.today = new Date(date);
        this.querySelectorAll(".cal-days>div").forEach((el) => {
            if(new Date(el.date).toDateString()==new Date(date).toDateString()){
                el.classList.add("today");
            }else{
                el.classList.remove("today");
            }
        })
        this.dispatchEvent(new CustomEvent("setToday", {
            detail: { data: this.today },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Check Offday  
     * @param {Date} date 
     * @return {Boolean}
    */    
    isOffday = (date) => {
        let check_offday = Object.values(this.querySelectorAll(".cal-days>div.offday")).filter((e, i) =>{
            return new Date(date).toDateString()===new Date(e.date).toDateString();
        });
        return check_offday[0] ? true : false;
    }

    /**
     * Check Today  
     * @param {Date} date 
     * @return {Boolean}
    */    
    isToday = (date) => {
        return (new Date(date).toDateString()===new Date(this.today).toDateString()) ? true : false;
    }

    /**
     * Check Today  
     * @param {Date} date 
     * @return {JSON}
    */    
    isEvent = (date) => {
        let check_offday = Object.values(this.querySelectorAll(".cal-days>div.events")).filter((e, i) =>{
            return new Date(date).toDateString()===new Date(e.date).toDateString();
        });
        return (check_offday[0] && check_offday[0].events) ? check_offday[0].events : [];
    }

    /**
     * Set Calendar Month  
     * @param {Number} num 
    */    
    setMonth = (num) => {
        if(this.date.getMonth()!=parseInt(num)){
            this.date.setMonth(parseInt(num));
            this.dispatchEvent(new CustomEvent("setMonth", {
                detail: { data: this.today },
                bubbles: true,
                composed: true
            }));
        }
        return this.date.getMonth()
    }

    /**
     * Set Calendar Year  
     * @param {Number} num 
    */    
    setYear = (num) => {
        if(this.date.getFullYear()!=parseInt(num)){
            this.date.setFullYear(parseInt(num));
            this.dispatchEvent(new CustomEvent("setYear", {
                detail: { data: this.today },
                bubbles: true,
                composed: true
            }));
        }
        return this.date.getFullYear();
    }

    /**
     * Get Calendar Day  
     * @return {Number}
    */    
    getDay = () => {
        return this.date.getDay();
    }

    /**
     * Get Calendar Month  
     * @return {Number}
    */    
    getMonth = () => {
        return this.date.getMonth();
    }

    /**
     * Get Calendar Year  
     * @return {Number}
    */    
    getYear = () => {
        return this.date.getFullYear();
    }

    /**
     * Get Calendar Date  
     * @return {Date}
    */    
    getDate = () => {
        return this.date;
    } 

    /**
     * Get Calendar Date  
     * @return {Date}
    */
    getToday = () => {
        return this.today;
    }

    /**
     * Start Date & End Date  Outside Disable 
     * @param {Date} str_date 
     * @param {Date} end_date 
    */        
    prenxtDisableDays = (str_date, end_date) => {
        this.querySelectorAll(".cal-days>div").forEach((el) => {
            if(new Date(el.date)<new Date(str_date)){
                el.classList.add("disableday");
            }
            if(new Date(el.date)>new Date(end_date)){
                el.classList.add("disableday");
            }
        })
    }
    
    /**
     * Event Add 
     * @param {JSON} evt_data 
    */  
    evtAdd = (evt_data) => {
        let _this = this;
        if(!evt_data){
            return console.error("Event Data Error!");
        }
        if(!evt_data.date){
            return console.error("Event date Error!");
        }
        if(!evt_data.title){
            return console.error("Event title Error!");
        }
        if(!evt_data.description){
            return console.error("Event description Error!");
        }
        let evt_format = {
            date: new Date(evt_data.date),
            title: evt_data.title,
            description: evt_data.description,
            type: (evt_data.type) ? evt_data.type : "events"
        };
        this.event_arr = (this.event_arr) ? this.event_arr : [];
        let event_index = Object.values(this.event_arr).findIndex((el)=>{
            return new Date(el.date).toDateString()==evt_format.date.toDateString();
        });
        if(event_index>-1){
            this.dispatchEvent(new CustomEvent("EventUpdate", {
                detail: { data: evt_format, olddata: this.event_arr[event_index] },
                bubbles: true,
                composed: true
            }));
            evt_format.action = "update";
            this.event_arr[event_index] = evt_format;
        }else{
            this.dispatchEvent(new CustomEvent("EventAdd", {
                detail: { data: evt_format },
                bubbles: true,
                composed: true
            }));
            evt_format.action = "add";
            this.event_arr.push(evt_format);
        }
        if(this.options && this.options.eventSave){
            try {
                const xhttp = new XMLHttpRequest();
                xhttp.onload = function() {
                    let resdata = this.responseText;
                };
                xhttp.open("POST", _this.options.eventSave);
                xhttp.send(JSON.stringify(evt_format));
            }catch(err) {
                console.error(err);
            }
        }
        return this.evtLoad(this.event_arr);
    }
    
    /**
     * Event Add 
     * @param {Date} evt_data 
    */  
    evtDelete = (evt_data) => {
        let _this = this;
        if(!evt_data){
            return console.error("Event Data Error!");
        }
        if(!evt_data.date){
            return console.error("Event date Error!");
        }
        this.event_arr = (this.event_arr) ? this.event_arr : [];
        let event_index = Object.values(this.event_arr).findIndex((el)=>{
            return new Date(el.date).toDateString()==evt_data.date.toDateString();
        });
        let evt_format = this.event_arr[event_index];
        evt_format.action = "delete";
        if(event_index>-1){
            this.event_arr[event_index] = [];
        }
        if(this.options && this.options.eventSave){
            try {
                const xhttp = new XMLHttpRequest();
                xhttp.onload = function() {
                    let resdata = this.responseText;
                };
                xhttp.open("POST", _this.options.eventSave);
                xhttp.send(JSON.stringify(evt_format));
            }catch(err) {
                console.error(err);
            }
        }
        this.dispatchEvent(new CustomEvent("EventDelete", {
            detail: { data: evt_data },
            bubbles: true,
            composed: true
        }));
        return this.evtLoad(this.event_arr);
    }
    
    /**
     * Event Load 
     * @param {JSON} evt_data 
    */  
    evtLoad = (evt_data) => {
        evt_data = (evt_data && typeof evt_data === 'object') ? evt_data : this.event_arr;
        let evt_arr = ["events", "offday"];
        this.querySelectorAll(".cal-days>div").forEach((el) => {
            let evt_filter = Object.values(evt_data).find((e) => {
                return new Date(e.date).toDateString()== new Date(el.date).toDateString();
            });
            if(evt_filter && evt_filter.title && evt_arr.includes(evt_filter.type)){
                el.classList.add(evt_filter.type);
                el.events = evt_filter;
            }else{
                el.classList.remove("events");
            }
        })
        return evt_data;
    }

    /**
     * Render Calendar 
    */  
    render(){
        this.awInit();
    }
    

    /**
     * Calendar Initiation
    */  
    awInit(){
        
        let _this = this;

        let init = () => {

            _this.options.startDate = new Date(_this.options['startDate']);
            _this.options.startDate.setHours(0,0,0,0);
            _this.options.endDate = new Date(_this.options['endDate']);
            _this.options.endDate.setHours(0,0,0,0);
            _this.options.offDays = (_this.options.offDays) ? _this.options.offDays : [];
            
            if(_this.date<_this.options.startDate){
                _this.date.setFullYear(_this.options.startDate.getFullYear());
                _this.date.setMonth(_this.options.startDate.getMonth());
            }
            
            if(_this.date>_this.options.endDate){
                _this.date.setFullYear(_this.options.endDate.getFullYear());
                _this.date.setMonth(_this.options.endDate.getMonth());
            }

            let cur_first_week_str = new Date(_this.date.getFullYear(), _this.date.getMonth(), 1).getDay();
            let cur_last_date = new Date(_this.date.getFullYear(), _this.date.getMonth()+1, 0);
            let cur_last_week_end = cur_last_date.getDay();
            let cur_last_day = cur_last_date.getDate();

            let pre_last_date = new Date(_this.date.getFullYear(), _this.date.getMonth(), 0).getDate();
            _this.dispatchEvent(new CustomEvent("ChangeCal", {
                detail: {
                    date: new Date(_this.date.getFullYear(), _this.date.getMonth(), 1)
                },
                bubbles: true,
                composed: true
            }));

            _this.innerHTML = `
                <style>
                *{
                    font-family: 'Open Sans', sans-serif;
                    box-sizing: border-box;
                }
                .calendar{
                    width: 100%; /*100% 35rem; */
                    height: 100%; /*100% 45rem; */
                    min-width: 16rem;
                    min-height: 16rem;
                    color: white;
                    font-size: 1.6rem;
                    background-repeat: no-repeat !important;
                    background-size: 100% 100% !important;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -o-user-select: none;
                    user-select: none;
                    position: relative;
                }
                .calendar *{
                    z-index: 10;
                }
                .calendar .cal-background{
                    position: absolute;
                    background: url('img/07.jpeg');
                    background-repeat: no-repeat !important;
                    background-size: 100% 100% !important;
                    opacity: 0.9;
                    box-sizing: content-box;
                    width: 100%;
                    height: 100%;
                    -webkit-filter: blur(5px);
                    -moz-filter: blur(5px);
                    -o-filter: blur(5px);
                    -ms-filter: blur(5px);
                    filter: blur(2px) brightness(0.5);
                    z-index: 9;
                }
                .calendar>.cal-header{
                    width: 100%;
                    height: 15%; /* 7rem 20%; */                    
                    background: -moz-linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
                    background: -webkit-linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
                    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;
                    text-shadow: 0.1rem 0.2rem 0.1rem black;
                }
                .calendar>.cal-header>.title>.month-title{
                    font-size: 70%;
                    text-transform: uppercase;
                    -webkit-animation: xscale-anim-02s 0.2s;
                    -moz-animation: xscale-anim-02s 0.2s;
                    -o-animation: xscale-anim-02s 0.2s;
                    -ms-transition: xscale-anim-02s 0.2s; 
                    animation: xscale-anim-02s 0.2s;
                }
                .calendar>.cal-header>.title>.month-sub-title{
                    font-size: 50%;
                    -webkit-animation: xscale-anim-02s 0.2s;
                    -moz-animation: xscale-anim-02s 0.2s;
                    -o-animation: xscale-anim-02s 0.2s;
                    -ms-transition: xscale-anim-02s 0.2s; 
                    animation: xscale-anim-02s 0.2s;
                }
                .calendar>.cal-header>.prevBtn, .calendar>.cal-header>.nextBtn{
                    height: 100%;
                    font-size: 100%;
                    font-weight: 800;
                    padding: 1rem 1.5rem;
                    cursor: pointer;
                    text-shadow: 0.1rem 0.2rem 0.1rem black;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .calendar>.cal-header>.prevBtn:hover{
                    color: #c7c3c3;
                    background: -moz-linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
                    background: -webkit-linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
                    background: linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
                }
                .calendar>.cal-header>.nextBtn:hover{
                    color: #c7c3c3;
                    background: -moz-linear-gradient(to left, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
                    background: -webkit-linear-gradient(to left, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
                    background: linear-gradient(to left, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
                }
                .calendar>.cal-weeks{
                    width: 100%;
                    height: 8%; /* 2.6rem 10% */
                    display: flex;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.7); /*rgba(94, 69, 69, 0.8) */
                    font-size: 50%;
                }
                .calendar>.cal-weeks>div{
                    width: calc(100%/7);
                    height: 100%;
                    min-height: 1.5rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-shadow: 0.1rem 0.2rem 0.1rem black;
                    box-shadow: 0.1rem 0.1rem 0.1rem rgb(255 255 255 / 10%);
                }
                .calendar>.cal-weeks>div:hover{
                    background: rgba(107, 107, 107, 0.3); /* #5a4545 */
                    border-radius: 0.2rem;
                }
                .calendar>.cal-weeks>div.offday{
                    color: #ff8383;
                }
                .calendar>.cal-days{
                    width: 100%;
                    height: 77%; /* 27.3rem 70% */
                    display: flex;
                    flex-wrap: wrap;
                    background: rgba(0, 0, 0, 0.7); /*rgba(74, 55, 55, 1)*/
                }
                .calendar>.cal-days>div{
                    margin: 0.03rem 0;
                    width: calc(100%/7);
                    height: calc(96%/6);
                    min-height: 2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    text-shadow: 0.1rem 0.2rem 0.1rem black;
                    box-shadow: 0.1rem 0.1rem 0.1rem rgba(255,255,255,0.05);
                    transition: all 0.8s;
                    font-size: 50%;
                }
                .calendar>.cal-days>div>span{
                    -webkit-animation: yscale-anim-02s 0.2s;
                    -moz-animation: yscale-anim-02s 0.2s;
                    -o-animation: yscale-anim-02s 0.2s;
                    -ms-transition: yscale-anim-02s 0.2s; 
                    animation: yscale-anim-02s 0.2s;
                }
                @keyframes yscale-anim-02s {
                    from {-webkit-transform: scale(0,1);}
                    to {-webkit-transform: scale(1,1);}
                }
                @keyframes xscale-anim-02s {
                    from {-webkit-transform: scale(1,0);}
                    to {-webkit-transform: scale(1,1);}
                }
                .calendar>.cal-days>div.today{
                    background: rgba(107, 107, 107, 0.2); /* #725555 */;
                    border-radius: 0.2rem;
                }
                .calendar>.cal-days>div.offday{
                    color: #ff8383;
                }
                .calendar>.cal-days>div.events:after{
                    content: '';
                    position: absolute;
                    margin-right: -1.5rem;
                    margin-top: -1.5rem;
                    height: 0.5rem;
                    width: 0.5rem;
                    background: rgba(255, 0, 0, 0.7);
                    border-radius: 50%;
                    -webkit-animation: zoom-anim 0.5s;
                    -moz-animation: zoom-anim 0.5s;
                    -o-animation: zoom-anim 0.5s;
                    -ms-transition: zoom-anim 0.5s; 
                    animation: yszoom-anim 0.5s;
                }
                @keyframes zoom-anim {
                    from {-webkit-transform: scale(0,0);}
                    to {-webkit-transform: scale(1,1);}
                }
                .calendar>.cal-days>div:hover:not(.today), .calendar>.cal-days>div.hover{
                    background: rgba(107, 107, 107, 0.3); /* #5a4545 */
                    border-radius: 0.2rem;
                }
                .calendar>.cal-days>div.prevdays:not(.offday), .calendar>.cal-days>div.nextdays:not(.offday){
                    color: #919191;
                }
                .calendar>.cal-days>div.disableday{
                    color: rgba(255,255,255,0.2) !important;
                    text-shadow: none;
                }
                </style>
                <div class="calendar">
                    <div class="cal-background"></div>
                    <div class="cal-header">
                        <div class="prevBtn"><</div>
                        <div class="title">
                            <div class="month-title"></div>
                            <div class="month-sub-title"></div>
                        </div>
                        <div class="nextBtn">></div>
                    </div>
                    <div class="cal-weeks">

                    </div>
                    <div class="cal-days">

                    </div>
                </div>

                <style>
                .eventModal{
                    display: block;
                    left: 0;
                    top: 0;
                    position: fixed;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0,0,0,0.4);
                    z-index: 9999;
                }
                .eventModal[role="show"]{
                    display: block;
                }
                .eventModal[role="hide"]{
                    display: none;
                }
                .eventModal>.modal-content{
                    margin: 10rem auto;
                    width: 80%;
                    background-color: white;
                    border-radius: 0.2rem;
                    padding: 1rem 2rem;
                    box-shadow: 0.05rem 0.05rem 0.2rem black;
                    float: none !important;
                }
                .eventModal[role="show"]>.modal-content{
                    -webkit-animation: scale-anim-02s 0.2s;
                    -moz-animation: scale-anim-02s 0.2s;
                    -o-animation: scale-anim-02s 0.2s;
                    -ms-transition: scale-anim-02s 0.2s; 
                    animation: scale-anim-02s 0.2s;
                }
                .eventModal[role="hide"]>.modal-content{
                    -webkit-animation: scale-anim-02s 0.2s;
                    -moz-animation: scale-anim-02s 0.2s;
                    -o-animation: scale-anim-02s 0.2s;
                    -ms-transition: scale-anim-02s 0.2s; 
                    animation: scale-anim-02s 0.2s;
                }
                @keyframes scale-anim-02s {
                    from {-webkit-transform: scale(0,0);}
                    to {-webkit-transform: scale(1,1);}
                }
                .eventModal>.modal-content>.modal-header{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .eventModal>.modal-content>.modal-header>.close{
                    font-size: 1.7rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .eventModal>.modal-content>.modal-body{
                    width: 100%;
                }
                .form-body{
                    border-radius: 0.5rem;
                    background-color: #f2f2f2 !important;
                    padding: 2rem;
                }
                .form-input{
                    
                }
                .form-input button{
                    font-size: 1.2rem;
                    background-color: #4CAF50;
                    color: white;
                    padding: 1rem 1.2rem;
                    border: none;
                    border-radius: 0.4rem;
                    cursor: pointer;
                    float: right;
                    margin: 0.4rem;
                }
                .form-input button:hover{
                    background-color: #45a049;
                }
                .form-input input,.form-input textarea,.form-input select{
                    font-size: 1rem;
                    margin: 10px;
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border: 0.1rem solid #ccc;
                    text-shadow: 0.03rem 0.03rem 0.1rem black;
                    outline:none;
                    resize: vertical;
                }
                .form-input label {
                    padding: 1rem ;
                    display: inline-block;
                }
                .form-input input:focus,.form-input textarea:focus,.form-input select:focus{
                    border-bottom: 0.1rem solid rgba(0,0,0,0.8);
                    border-left: 0.01rem solid rgba(0,0,0,0.3);
                    border-right: 0.01rem solid rgba(0,0,0,0.3);
                }
                .col-25 {
                  float: left;
                  width: 25%;
                  margin-top: 6px;
                }
                .col-75 {
                  float: left;
                  width: 75%;
                  margin-top: 6px;
                }
                .row:after {
                  content: "";
                  display: table;
                  clear: both;
                }
                @media screen and (max-width: 600px) {
                    .col-25, .col-75, input[type=submit] {
                      width: 100%;
                      margin-top: 0;
                    }
                }
                </style>
                <!-- The Modal -->
                <div class="eventModal modal" role="hide">
                    <!-- Modal content -->
                    <div class="modal-content form-body col-75 ">
                        <div class="modal-header">
                            <h3>Event Form</h3>
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body">
                            <form action="" method="post">
                                <input type="hidden" name="date" placeholder="Date"/>
                                <div class="row form-input">
                                    <div class="col-25">
                                        <label for="fname">Title</label>
                                    </div>
                                    <div class="col-75">
                                        <input type="text" name="title" placeholder="Title"/>
                                    </div>
                                </div>
                                <div class="row form-input">
                                    <div class="col-25">
                                        <label for="fname">Description</label>
                                    </div>
                                    <div class="col-75">
                                        <textarea name="description" placeholder="Description"></textarea>
                                    </div>
                                </div>
                                <div class="row form-input" style="display: block;">
                                    <button name="addEvent" type="button">Add Event</button>
                                    <button name="deleteEvent" type="button">Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;


            if(_this.options.backgroundColor){
                _this.querySelector(".calendar .cal-background").style.background = `${_this.options.backgroundColor}`;
            }else if(_this.options.backgroundImg){
                _this.querySelector(".calendar .cal-background").style.background = `url('${_this.options.backgroundImg}')`;
            }else{
                _this.querySelector(".calendar .cal-background").style.background = `#262626`;
            }

            this.week_names = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ];

            Object.values(this.week_names).map((v, i)=>{
                let offday = (_this.options.offDays.includes(i)) ? "offday" : "";
                let wkele = document.createElement("div");
                if(offday){
                    wkele.classList.add(`${offday}`);
                }
                wkele.week = `${i}`;
                wkele.classList.add(`week-${i}`);
                wkele.innerHTML = `${v}`;
                _this.querySelector(".cal-weeks").append(wkele);
            });

            _this.querySelector(".cal-header>.title>.month-title").innerHTML = `${_this.date.toLocaleString("en-US", {month: "long"})}`;
            _this.querySelector(".cal-header>.title>.month-sub-title").innerHTML = `${_this.date.toLocaleString("en-US", {year: "numeric"})}`;
            
            if(_this.options.eventLoad){
                try {
                    const xhttp = new XMLHttpRequest();
                    xhttp.onload = function() {
                        let resdata = JSON.parse(this.responseText);
                        resdata = (resdata && typeof resdata === 'object') ? resdata : [];
                        resdata = Object.values(resdata).map((v, i)=>{
                            v.date = new Date(v.date)
                            return v;
                        })
                        _this.event_arr = (resdata) ? resdata : [];
                        _this.evtLoad(_this.event_arr);
                    };
                    let pdata = {
                        "str_date": _this.dateFormat(_this.options.startDate, "yyyy-MM-dd"),
                        "end_date": _this.dateFormat(_this.options.endDate, "yyyy-MM-dd")
                    };
                    xhttp.open("POST", _this.options.eventLoad);
                    xhttp.send(JSON.stringify(pdata));
                }catch(err) {
                    console.error(err);
                }
            }


            let awdays = _this.querySelector(".cal-days");
            for(let i=parseInt(cur_first_week_str-1); i>=0; i--){
                let eldate = new Date(_this.date.getFullYear(), _this.date.getMonth()-1, pre_last_date-i, 0, 0, 0);
                let class_arr = [];
                class_arr.push("week-"+eldate.getDay());
                class_arr.push("prevdays");
                class_arr.push((_this.options.offDays.includes(eldate.getDay()) ? "offday" : ""));

                let apel = document.createElement("div");
                apel.setAttribute("class", `${class_arr.join(" ")}`);
                apel.setAttribute("date", `${eldate}`);
                apel.setAttribute("title", `${eldate.toDateString()}`);
                apel.date = `${eldate}`;
                let apspn = document.createElement("span");
                apspn.innerHTML = `${eldate.getDate()}`;
                apel.append(apspn);
                awdays.append(apel);
            }
            for(let i=0; i<cur_last_day; i++){
                let eldate = new Date(_this.date.getFullYear(), _this.date.getMonth(), i+1, 0, 0, 0);
                let class_arr = [];
                class_arr.push("week-"+eldate.getDay());
                class_arr.push((_this.options.offDays.includes(eldate.getDay()) ? "offday" : ""));

                let apel = document.createElement("div");
                apel.setAttribute("class", `${class_arr.join(" ")}`);
                apel.setAttribute("date", `${eldate}`);
                apel.setAttribute("title", `${eldate.toDateString()}`);
                apel.date = `${eldate}`;
                let apspn = document.createElement("span");
                apspn.innerHTML = `${eldate.getDate()}`;
                apel.append(apspn);
                awdays.append(apel);
            }
            let total_rows = (cur_first_week_str+cur_last_day);
            let need_rows = Math.floor(total_rows/6)<6 ? 7 : 0;
            for(let i=0; i<((6+need_rows)-cur_last_week_end); i++){
                let eldate = new Date(_this.date.getFullYear(), _this.date.getMonth()+1, i+1, 0, 0, 0);
                let class_arr = [];
                class_arr.push("week-"+eldate.getDay());
                class_arr.push("nextdays");
                class_arr.push((_this.options.offDays.includes(eldate.getDay()) ? "offday" : ""));
                
                let apel = document.createElement("div");
                apel.setAttribute("class", `${class_arr.join(" ")}`);
                apel.setAttribute("date", `${eldate}`);
                apel.setAttribute("title", `${eldate.toDateString()}`);
                apel.date = `${eldate}`;
                let apspn = document.createElement("span");
                apspn.innerHTML = `${eldate.getDate()}`;
                apel.append(apspn);
                awdays.append(apel);
            }

            _this.setToday(_this.today);

            _this.prenxtDisableDays(_this.options.startDate, _this.options.endDate);

            _this.querySelector(".calendar>.cal-header>.prevBtn").addEventListener("click", ()=>{
                _this.date.setMonth(_this.date.getMonth()-1);
                init();
            });
            
            _this.querySelector(".calendar>.cal-header>.nextBtn").addEventListener("click", ()=>{
                _this.date.setMonth(_this.date.getMonth()+1);
                init();
            });

            _this.querySelectorAll(".cal-weeks>div").forEach((el)=>{
                el.addEventListener("mouseover", (e)=>{
                    _this.querySelectorAll(`.cal-days>div.week-${el.week}`).forEach((cdele)=>{
                        cdele.classList.add("hover");
                    });
                });
                el.addEventListener("mouseout", (e)=>{
                    _this.querySelectorAll(`.cal-days>div`).forEach((cdele)=>{
                        cdele.classList.remove("hover");
                    });
                });
            });
            

            _this.querySelectorAll(".cal-days>div:not(.disableday)").forEach((el)=>{
                el.addEventListener("click", (e)=>{

                    let select_date = new Date(el.date);
                    let event_data = (el.events) ? el.events : [];

                    if(_this.options && _this.options.eventModal){
                        let title = (event_data && event_data.title) ? event_data.title : "";
                        let description = (event_data && event_data.description) ? event_data.description : "";
                        _this.querySelector(".eventModal input[name='date']").value = _this.dateFormat(select_date, "yyyy-MM-dd");
                        _this.querySelector(".eventModal input[name='title']").value = title;
                        _this.querySelector(".eventModal textarea[name='description']").value = description;
                        _this.querySelector(".eventModal").setAttribute("role", "show");
                    }

                    _this.dispatchEvent(new CustomEvent("SelectDate", {
                        detail: {
                            date: select_date,
                            events: event_data
                        },
                        bubbles: true,
                        composed: true
                    }));
                })
            });


            _this.querySelector(".eventModal .close").addEventListener("click", (e)=>{
                _this.querySelector(".eventModal").setAttribute("role", "hide");
            });

            _this.querySelector(".eventModal button[name='addEvent']").addEventListener("click", (el)=>{
                let dtdate = new Date(_this.querySelector(".eventModal input[name='date']").value);
                let title = _this.querySelector(".eventModal input[name='title']").value;
                let description = _this.querySelector(".eventModal textarea[name='description']").value;

                let evt_data = {
                    date: dtdate,
                    title: title,
                    description: description,
                    type: "events"
                };

                _this.evtAdd(evt_data);
                _this.querySelector(".eventModal").setAttribute("role", "hide");
            });

            
            _this.querySelector(".eventModal button[name='deleteEvent']").addEventListener("click", (el)=>{
                let dtdate = new Date(_this.querySelector(".eventModal input[name='date']").value);
                let evt_data = {
                    date: dtdate,
                };
                _this.evtDelete(evt_data);
                _this.querySelector(".eventModal").setAttribute("role", "hide");
            });

            
            if(_this.new_options && Object.values(_this.new_options).length>0){
                const obj = Object.assign({}, _this.new_options);
                _this.dispatchEvent(new CustomEvent("SetData", {
                    detail: obj,
                    bubbles: true,
                    composed: true
                }));
            }
            _this.new_options = [];
            
        };
        init();
    }
}
window.customElements.define("aw-calendar", awCalendar);