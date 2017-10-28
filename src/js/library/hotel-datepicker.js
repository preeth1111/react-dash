
var Datepicker = (function () {
'use strict';


var Datepicker = function Datepicker(input, options) {
        // Set default values
	var opts = options || {};

	this.format = opts.format || 'YYYY-MM-DD';
	this.infoFormat = opts.infoFormat || this.format;
	this.separator = opts.separator || ' - ';
	this.startOfWeek = opts.startOfWeek || 'sunday'; // Or monday
	this.startDate = opts.startDate || false;
	this.endDate = opts.endDate || new Date();
	this.minNights = opts.minNights || 0;
	this.maxNights = opts.maxNights || 0;
	this.selectForward = opts.selectForward || false;
	this.disabledDates = opts.disabledDates || [];
	this.enableCheckout = opts.enableCheckout || false;
	this.container = opts.container || '';
	this.animationSpeed = opts.animationSpeed || '.5s';
	this.hoveringTooltip = opts.hoveringTooltip || true; // Or a function
	this.autoClose = opts.autoClose === undefined ? true : opts.autoClose;
	this.i18n = opts.i18n || {
		selected: 'Your stay:',
		night: 'Night',
		nights: 'Nights',
		button: 'Close',
		'day-names': ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
		'month-names': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		'error-more': 'Date range should not be more than 1 night',
		'error-more-plural': 'Date range should not be more than %d nights',
		'error-less': 'Date range should not be less than 1 night',
		'error-less-plural': 'Date range should not be less than %d nights',
		'info-more': 'Please select a date range longer than 1 night',
		'info-more-plural': 'Please select a date range longer than %d nights',
		'info-range': 'Please select a date range between %d and %d nights',
		'info-default': 'Please select a date range'
	};
	this.getValue = opts.getValue || function () {
		return input.value;
	};
	this.setValue = opts.setValue || function (s) {
		input.value = s;
	};

        // DOM input
	this.input = input;

        // Initialize the datepicker
	this.init();
};

Datepicker.prototype.getWeekDayNames = function getWeekDayNames () {
		var this$1 = this;

	var week = '';

        // Start from monday if we passed that option
	if (this.startOfWeek === 'monday') {
		for (var i = 0; i < 7; i++) {
			week += '<th class="datepicker__week-name">' + this$1.lang('day-names')[(1 + i) % 7] + '</th>';
		}

		return week;
	}

        // Otherwise start from sunday (default)
	for (var i$1 = 0; i$1 < 7; i$1++) {
		week += '<th class="datepicker__week-name">' + this$1.lang('day-names')[i$1] + '</th>';
	}

	return week;
};

Datepicker.prototype.getMonthDom = function getMonthDom (month) {
        // Get month DOM element
	return document.getElementById(this.getMonthTableId(month));
};

Datepicker.prototype.getMonthName = function getMonthName (m) {
        // Get month name
	return this.lang('month-names')[m];
};

Datepicker.prototype.getDatepickerId = function getDatepickerId () {
        // Get datepicker ID
	return 'datepicker-' + this.generateId();
};

Datepicker.prototype.getMonthTableId = function getMonthTableId (month) {
        // Get month table ID
	return 'month-' + month + '-' + this.generateId();
};



Datepicker.prototype.getTodayButtonId = function getTodayButtonId () {
        // Get close button ID
	return 'todayselect-' + this.generateId();
};
Datepicker.prototype.getWeekButtonId = function getWeekButtonId () {
        // Get close button ID
	return 'weekselect-' + this.generateId();
};
Datepicker.prototype.getMonthButtonId = function getMonthButtonId () {
        // Get close button ID
	return 'monthselect-' + this.generateId();
};
//Datepicker.prototype.getTooltipId = function getTooltipId () {
        // Get close button ID
	//return 'tooltip-' + this.generateId();
//};

Datepicker.prototype.getNextMonth = function getNextMonth (month) {
        // Get next month date
	var _m = new Date(month.valueOf());

	return new Date(_m.setMonth(_m.getMonth() + 1));
};

Datepicker.prototype.getPrevMonth = function getPrevMonth (month) {
        // Get previous month date
	var _m = new Date(month.valueOf());

	return new Date(_m.setMonth(_m.getMonth() - 1));
};

Datepicker.prototype.getDateString = function getDateString (date, format) {
		if ( format === void 0 ) format = this.format;

        // Format date
	return fecha.format(date, format);
};

Datepicker.prototype.parseDate = function parseDate (date, format) {
		if ( format === void 0 ) format = this.format;

        // Parse a date object
	return fecha.parse(date, format);
};

Datepicker.prototype.init = function init () {
        // DOM container
	this.parent = this.container ? this.container : this.input.parentElement;

        // Start date of the selected range
	this.start = false;

        // End date of the selected range
	this.end = false;

        // Set the minimum of days required by the daterange
	this.minDays = this.minNights > 1 ? this.minNights + 1 : 2;

        // Set the maximum of days required by the daterange
	this.maxDays = this.maxNights > 0 ? this.maxNights + 1 : 0;

        // Set startDate if we passed that option
	if (this.startDate && typeof this.startDate === 'string') {
		this.startDate = this.parseDate(this.startDate);
	}

        // Set endDate if we passed that option
	if (this.endDate && typeof this.endDate === 'string') {
		this.endDate = this.parseDate(this.endDate);
	}

        // Hide tooltip on touch devices
	if (this.isTouchDevice()) {
		//this.hoveringTooltip = false;
	}

        // Flag that checks if the datepicker is open
	this.isOpen = false;

        // Flag that checks if the second date of the range is set
	this.changed = false;

        // Create the DOM elements
	this.createDom();

        // Set default time
	var defaultTime = new Date();

	if (this.startDate && this.compareMonth(defaultTime, this.startDate) < 0) {
		defaultTime = this.startDate;
	}

	if (this.endDate && this.compareMonth(this.getNextMonth(defaultTime), this.endDate) > 0) {
		defaultTime = this.getPrevMonth(this.endDate);
	}

        // Show months
	this.showMonth(defaultTime, 1);
	this.showMonth(this.getNextMonth(defaultTime), 2);

        // Print default info in top bar
	this.topBarDefaultText();

        // Parse disabled dates
	if (this.disabledDates.length > 0) {
		this.parseDisabledDates();
	}

        // Attach listeners
	this.addListeners();
};

Datepicker.prototype.addListeners = function addListeners () {
		var this$1 = this;

        // Next month button
	var nextButtons = this.datepicker.getElementsByClassName('datepicker__month-button--next');

	for (var i = 0; i < nextButtons.length; i++) {
		nextButtons[i].addEventListener('click', function (evt) { return this$1.goToNextMonth(evt); });
	}

        // Previous month button
	var prevButtons = this.datepicker.getElementsByClassName('datepicker__month-button--prev');

	for (var i$1 = 0; i$1 < prevButtons.length; i$1++) {
		prevButtons[i$1].addEventListener('click', function (evt) { return this$1.goToPreviousMonth(evt); });
	}

        // Open the datepicker on the input click
	this.input.addEventListener('click', function (evt) { return this$1.openDatepicker(evt); });

   
	
	document.getElementById(this.getTodayButtonId()).addEventListener('click', function (evt) { return this$1.todayDatepicker(evt); });
	document.getElementById(this.getWeekButtonId()).addEventListener('click', function (evt) { return this$1.weekDatepicker(evt); });
	document.getElementById(this.getMonthButtonId()).addEventListener('click', function (evt) { return this$1.monthDatepicker(evt); });

        // Close the datepicker on resize?
        // The problem is that mobile keyboards trigger the resize event closing
        // the datepicker. There are some workarounds (http://stackoverflow.com/q/14902321)
        // but for now I will disable this option. I'm open to new ideas.
        // window.addEventListener('resize', evt => this.closeDatepicker(evt));

        // Add a click event listener to the document. This will help us to:
        // 1 - Check if the click it's outside the datepicker
        // 2 - Handle the click on calendar days
	document.addEventListener('click', function (evt) { return this$1.documentClick(evt); });

        // Add a mouseover event listener to the document. This will help us to:
        // 1 - Handle the hover on calendar days
	document.addEventListener('mouseover', function (evt) { return this$1.documentHover(evt); });

        // Add a mouseout event listener to the document. This will help us to:
        // 1 - Hide the tooltip on the mouseout event on days
	//document.addEventListener('mouseout', function (evt) { return this$1.documentMouseOut(evt); });

        // Update the selected values when the input changes manually
	this.input.addEventListener('change', function () { return this$1.checkAndSetDefaultValue(); });
};

Datepicker.prototype.generateId = function generateId () {
        // Generate an unique ID for each datepicker
	var id = '';

        // Use input ID if set
	if (this.input.id) {
		id += this.input.id;
        // Otherwise create a random string
	} else {
            // @todo - Is a date string unique enough?
		id += Date.now();
	}

	return id;
};

Datepicker.prototype.createDom = function createDom () {
	var domString = this.createDatepickerDomString();

        // Insert the datepicker in the document
	this.parent.insertAdjacentHTML('beforeend', domString);

        // Store our datepicker in a property
	this.datepicker = document.getElementById(this.getDatepickerId());
};

Datepicker.prototype.createDatepickerDomString = function createDatepickerDomString () {
		var this$1 = this;

        // Generate our datepicker
	var html = '<div id="' + this.getDatepickerId() + '" style="display:none" class="datepicker datepicker--closed">';

	html += '<div class="datepicker__inner">';

        // Top bar section
	html += '<div class="btn-group" style="width:100%">' +
                    

            '<button type="button" id="' + this.getTodayButtonId() + '" style="width:33.3%">Today</button>' +       
'<button type="button" id="' + this.getWeekButtonId() + '" style="width:33.3%">Current Week</button>' +
'<button type="button" id="' + this.getMonthButtonId() + '" style="width:33.3%">Current Month</button>' +
                   
                '</div>';

        // Months section
	html += '<div class="datepicker__months">';

        // Print single months
	for (var i = 1; i <= 2; i++) {
		html += '<table id="' + this$1.getMonthTableId(i) + '" class="datepicker__month datepicker__month--month' + i + '"><thead><tr class="datepicker__month-caption"><th><span class="datepicker__month-button datepicker__month-button--prev" month="' + i + '">&lt;</span></th><th colspan="5" class="datepicker__month-name"></th><th><span class="datepicker__month-button datepicker__month-button--next" month="' + i + '">&gt;</span></th></tr><tr class="datepicker__week-days">' + this$1.getWeekDayNames(i) + '</tr></thead><tbody></tbody></table>';
	}

	html += '</div>';

        // Tooltip
	//html += '<div style="display:none" id="' + this.getTooltipId() + '" class="datepicker__tooltip"></div>';

	html += '</div>';

	html += '</div>';

	return html;
};

Datepicker.prototype.showMonth = function showMonth (date, month) {
        // Show month table and create the necessary HTML code
	var name = this.getMonthName(date.getMonth());
	var monthDom = this.getMonthDom(month);
	var monthName = monthDom.getElementsByClassName('datepicker__month-name')[0];
	var monthBody = monthDom.getElementsByTagName('tbody')[0];

        // Month caption
	monthName.textContent = name + ' ' + date.getFullYear();

        // Remove child elements before to insert the new month
	this.emptyElement(monthBody);

        // Append the month
	monthBody.insertAdjacentHTML('beforeend', this.createMonthDomString(date));

        // Check day dates
	this.updateSelectableRange();

        // Store current month dates
	this['month' + month] = date;
};

Datepicker.prototype.createMonthDomString = function createMonthDomString (_date) {
		var this$1 = this;

	var days = [];
	var html = '';
	var valid;
	_date.setDate(1);

	var dayOfWeek = _date.getDay();
	var currentMonth = _date.getMonth();

	if ((dayOfWeek === 0) && (this.startOfWeek === 'monday')) {
            // Add one week
		dayOfWeek = 7;
	}

        // If the first day is in the middle of the week, push also
        // the first days of the week (the days before our first day).
        // We need a complete week row.
        // Obviously, these days are part of the previous month.
	if (dayOfWeek > 0) {
		for (var i = dayOfWeek; i > 0; i--) {
			var _day = new Date(_date.getTime() - (86400000 * i));

                // Check if the day is valid. And pass this property to the days object
			valid = this$1.isValidDate(_day.getTime());

			if ((this$1.startDate && this$1.compareDay(_day, this$1.startDate) < 0) || (this$1.endDate && this$1.compareDay(_day, this$1.endDate) > 0)) {
				valid = false;
			}

                // We pass the type property to know if the day is part of the
                // previous month. We already know that it is true.
			days.push({
				date: _day,
				type: 'lastMonth',
				day: _day.getDate(),
				time: _day.getTime(),
				valid: valid
			});
		}
	}

        // Push 40 days. Each month table needs the days of the month plus
        // the remaining days (of the week row) before the first day of the month
        // and after the last day of the month. (PS. They will be hidden)
        // 40 days are enough to cover all the possibilities.
	for (var i$1 = 0; i$1 < 40; i$1++) {
		var _day$1 = this$1.addDays(_date, i$1);

            // Check if the day is valid. And pass this property to the days object
		valid = this$1.isValidDate(_day$1.getTime());

		if ((this$1.startDate && this$1.compareDay(_day$1, this$1.startDate) < 0) || (this$1.endDate && this$1.compareDay(_day$1, this$1.endDate) > 0)) {
			valid = false;
		}

            // We pass the type property to know if the day is part of the
            // current month or part of the next month
		days.push({
			date: _day$1,
			type: _day$1.getMonth() === currentMonth ? 'visibleMonth' : 'nextMonth',
			day: _day$1.getDate(),
			time: _day$1.getTime(),
			valid: valid
		});
	}

        // Create the week rows.
	for (var week = 0; week < 6; week++) {
            // Iterate the days object week by week.
            // If the last day is part of the next month, stop the loop.
		if (days[week * 7].type === 'nextMonth') {
			break;
		}

            // Flag for disabled dates
		var flag = 0;

		html += '<tr class="datepicker__week-row">';

            // Create the days of a week, one by one
		for (var i$2 = 0; i$2 < 7; i$2++) {
			var _day$2 = (this$1.startOfWeek === 'monday') ? i$2 + 1 : i$2;
			_day$2 = days[(week * 7) + _day$2];
			var isToday = this$1.getDateString(_day$2.time) === this$1.getDateString(new Date());
			var isDisabled = false;

                // Check if the day is one of the days passed in the
                // (optional) disabledDates option. And set valid to
                // false in this case.
			if (_day$2.valid && this$1.disabledDates.length > 0) {
				if (this$1.disabledDates.indexOf(this$1.getDateString(_day$2.time, 'YYYY-MM-DD')) > -1) {
					_day$2.valid = false;
					isDisabled = true;

					flag++;
				} else {
					flag = 0;
				}
			}

                // Each day has the "time" attribute (timestamp) and an appropriate class
			var dayAttributes = {
				time: _day$2.time,
				class: 'datepicker__month-day--' + _day$2.type + ' datepicker__month-day--' + (_day$2.valid ? 'valid' : 'invalid') + ' ' + (isToday ? 'datepicker__month-day--today' : '') + ' ' + (isDisabled ? 'datepicker__month-day--disabled' : '') + ' ' + (isDisabled && this$1.enableCheckout && (flag === 1) ? 'datepicker__month-day--checkout-enabled' : '')
			};

                // Create the day HTML
			html += '<td class="datepicker__month-day ' + dayAttributes.class + '" ' + this$1.printAttributes(dayAttributes) + '>' + _day$2.day + '</td>';
		}

		html += '</tr>';
	}

	return html;
};

Datepicker.prototype.openDatepicker = function openDatepicker () {
        // Open the datepicker
	if (!this.isOpen) {
            // Add/remove helper classes
		this.removeClass(this.datepicker, 'datepicker--closed');
		this.addClass(this.datepicker, 'datepicker--open');

            // Set (and check) the range value based on the current input value
		this.checkAndSetDefaultValue();

            // Slide down the datepicker
		this.slideDown(this.datepicker, this.animationSpeed);

            // Set flag
		this.isOpen = true;

            // Show selected days in the calendar
		this.showSelectedDays();

            // Disable (if needed) the prev/next buttons
		this.disableNextPrevButtons();
	}
};

Datepicker.prototype.closeDatepicker = function closeDatepicker () {
        // Close the datepicker
	if (!this.isOpen) {
		return;
	}

        // Add/remove helper classes
	this.removeClass(this.datepicker, 'datepicker--open');
	this.addClass(this.datepicker, 'datepicker--closed');

        // Slide up the datepicker
	this.slideUp(this.datepicker, this.animationSpeed);
	this.isOpen = false;
};
Datepicker.prototype.todayDatepicker = function todayDatepicker () {
        // Close the datepicker
	if (!this.isOpen) {
		return;
	}
	
	var dateRangeValue = this.getDateString(new Date()) + this.separator + this.getDateString(new Date());
this.setValue(dateRangeValue, this.getDateString(new Date()), this.getDateString(new Date()));
		this.changed = true;
        // Add/remove helper classes
	this.removeClass(this.datepicker, 'datepicker--open');
	this.addClass(this.datepicker, 'datepicker--closed');

        // Slide up the datepicker
	this.slideUp(this.datepicker, this.animationSpeed);
	this.isOpen = false;
};
Datepicker.prototype.weekDatepicker = function weekDatepicker () {
        // Close the datepicker
	if (!this.isOpen) {
		return;
	}
    
    var today = new Date();
    var day = today.getDay();
    var date = today.getDate() - day + (day == 0 ? -6:1);

        
    var StartDate = new Date(today.setDate(date));
   
  


      var dateRangeValue = this.getDateString(StartDate) + this.separator + this.getDateString(new Date());
this.setValue(dateRangeValue, this.getDateString(StartDate), this.getDateString(new Date()));
		this.changed = true;  // Add/remove helper classes
	this.removeClass(this.datepicker, 'datepicker--open');
	this.addClass(this.datepicker, 'datepicker--closed');

        // Slide up the datepicker
	this.slideUp(this.datepicker, this.animationSpeed);
	this.isOpen = false;
};
Datepicker.prototype.monthDatepicker = function monthDatepicker () {
        // Close the datepicker
	if (!this.isOpen) {
		return;
	}
 var today = new Date();
   

        
    var StartDate = new Date(today.setDate(1));
        var dateRangeValue = this.getDateString(StartDate) + this.separator + this.getDateString(new Date());
this.setValue(dateRangeValue, this.getDateString(StartDate), this.getDateString(new Date()));
		this.changed = true;
	this.removeClass(this.datepicker, 'datepicker--open');
	this.addClass(this.datepicker, 'datepicker--closed');

        // Slide up the datepicker
	this.slideUp(this.datepicker, this.animationSpeed);
	this.isOpen = false;
};
Datepicker.prototype.autoclose = function autoclose () {
        // Autoclose the datepicker when the second date is set
	if (this.autoClose && this.changed && this.isOpen && this.start && this.end) {
		this.closeDatepicker();
	}
};

Datepicker.prototype.documentClick = function documentClick (evt) {
        // Check if the click was outside the datepicker and close it
	if (!this.parent.contains(evt.target) && evt.target !== this.input) {
		this.closeDatepicker();
	} else if (evt.target.tagName.toLowerCase() === 'td') {
            // Check if the click was on a calendar day
		this.dayClicked(evt.target);
	}
};

Datepicker.prototype.documentHover = function documentHover (evt) {
        // Check if the hover is on a calendar day
	if (evt.target.tagName && evt.target.tagName.toLowerCase() === 'td') {
		this.dayHovering(evt.target);
	}
};

Datepicker.prototype.documentMouseOut = function documentMouseOut (evt) {
        // Check if the mouseout is on a calendar day
	if (evt.target.tagName && evt.target.tagName.toLowerCase() === 'td') {
            // Hide the tooltip
		//var tooltipContainer = document.getElementById(this.getTooltipId());
		//tooltipContainer.style.display = 'none';
	}
};

Datepicker.prototype.checkAndSetDefaultValue = function checkAndSetDefaultValue () {
        // Set range based on the input value

        // Get dates from input value
	var value = this.getValue();
	var dates = value ? value.split(this.separator) : '';

        // If we have our two dates, set the date range
	if (dates && (dates.length >= 2)) {
            // Format the values correctly
		var _format = this.format;

		if (_format.match(/Do/)) {
			_format = _format.replace(/Do/, 'D');
			dates[0] = dates[0].replace(/(\d+)(th|nd|st)/, '$1');
			dates[1] = dates[1].replace(/(\d+)(th|nd|st)/, '$1');
		}

            // Set the date range
		this.changed = false;
		this.setDateRange(this.parseDate(dates[0], _format), this.parseDate(dates[1], _format));
		this.changed = true;
	} 
};

Datepicker.prototype.setDateRange = function setDateRange (date1, date2) {
        // Swap dates if needed
	if (date1.getTime() > date2.getTime()) {
		var tmp = date2;

		date2 = date1;
		date1 = tmp;
		tmp = null;
	}

	var valid = true;

        // Check the validity of the dates
	if ((this.startDate && this.compareDay(date1, this.startDate) < 0) || (this.endDate && this.compareDay(date2, this.endDate) > 0)) {
		valid = false;
	}

        // If not valid, reset the datepicker
	if (!valid) {
            // Show default (initial) months
		this.showMonth(this.startDate, 1);
		this.showMonth(this.getNextMonth(this.startDate), 2);

            // Show selected days in the calendar
		this.showSelectedDays();

            // Disable (if needed) the prev/next buttons
		this.disableNextPrevButtons();

		return;
	}

	// Fix DST
	date1.setTime(date1.getTime() + (12 * 60 * 60 * 1000));
	date2.setTime(date2.getTime() + (12 * 60 * 60 * 1000));

        // Calculate the next month value
	this.start = date1.getTime();
	this.end = date2.getTime();

	if ((this.compareDay(date1, date2) > 0 && this.compareMonth(date1, date2) === 0)) {
		date2 = this.getNextMonth(date1);
	}

	if (this.compareMonth(date1, date2) === 0) {
		date2 = this.getNextMonth(date1);
	}

        // Show the months
	this.showMonth(date1, 1);
	this.showMonth(date2, 2);

        // Show selected days in the calendar
	this.showSelectedDays();

        // Disable (if needed) the prev/next buttons
	this.disableNextPrevButtons();

        // Check the selection
	this.checkSelection();

        // Show selected dates in top bar
	this.showSelectedInfo();

        // Close the datepicker
	this.autoclose();
};

Datepicker.prototype.showSelectedDays = function showSelectedDays () {
		var this$1 = this;

        // Show selected days in the calendar

        // Return early if we don't have the start and end dates
	if (!this.start && !this.end) {
		return;
	}

        // Get every td in the months table: our days
	var days = this.datepicker.getElementsByTagName('td');

        // Iterate each day and assign an appropriate HTML class
        // if they are selected in the date range
	for (var i = 0; i < days.length; i++) {
		var time = parseInt(days[i].getAttribute('time'), 10);

            // Add selected class
		if ((this$1.start && this$1.end && this$1.end >= time && this$1.start <= time) || (this$1.start && !this$1.end && this$1.getDateString(this$1.start, 'YYYY-MM-DD') === this$1.getDateString(time, 'YYYY-MM-DD'))) {
			this$1.addClass(days[i], 'datepicker__month-day--selected');
		} else {
			this$1.removeClass(days[i], 'datepicker__month-day--selected');
		}

            // Add class to the first day of the range
		if (this$1.start && this$1.getDateString(this$1.start, 'YYYY-MM-DD') === this$1.getDateString(time, 'YYYY-MM-DD')) {
			this$1.addClass(days[i], 'datepicker__month-day--first-day-selected');
		} else {
			this$1.removeClass(days[i], 'datepicker__month-day--first-day-selected');
		}

            // Add class to the last day of the range
		if (this$1.end && this$1.getDateString(this$1.end, 'YYYY-MM-DD') === this$1.getDateString(time, 'YYYY-MM-DD')) {
			this$1.addClass(days[i], 'datepicker__month-day--last-day-selected');
		} else {
			this$1.removeClass(days[i], 'datepicker__month-day--last-day-selected');
		}
	}
};

Datepicker.prototype.showSelectedInfo = function showSelectedInfo () {
      
	
	

   

	if (this.start && this.end) {
		
		var dateRangeValue = this.getDateString(new Date(this.start)) + this.separator + this.getDateString(new Date(this.end));

            
		

            // Set input value
		this.setValue(dateRangeValue, this.getDateString(new Date(this.start)), this.getDateString(new Date(this.end)));
		this.changed = true;
	} 
};

Datepicker.prototype.dayClicked = function dayClicked (day) {
	if (this.hasClass(day, 'datepicker__month-day--invalid')) {
		return;
	}

	var time = parseInt(day.getAttribute('time'), 10);
	this.addClass(day, 'datepicker__month-day--selected');

	if ((this.start && this.end) || (!this.start && !this.end)) {
		this.start = time;
		this.end = false;
	} else if (this.start) {
		this.end = time;
	}

        // Swap dates if they are inverted
	if (this.start && this.end && this.start > this.end) {
		var tmp = this.end;

		this.end = this.start;
		this.start = tmp;
	}

	this.start = parseInt(this.start, 10);
	this.end = parseInt(this.end, 10);

        // Remove hovering class from every day and hide tooltip
	this.clearHovering();

        // Show hover
	if (this.start && !this.end) {
            // Add hovering class
		this.dayHovering(day);
	}

        // Check day dates
	this.updateSelectableRange();

        // Check the selection
	this.checkSelection();

        // Show selected dates in top bar
	this.showSelectedInfo();

        // Show selected days in the calendar
	this.showSelectedDays();

        // Close the datepicker
	this.autoclose();
};

Datepicker.prototype.isValidDate = function isValidDate (time) {
        // Check if the date is valid
	time = parseInt(time, 10);

	if ((this.startDate && this.compareDay(time, this.startDate) < 0) || (this.endDate && this.compareDay(time, this.endDate) > 0)) {
		return false;
	}

        // Update valid dates during the selection
	if (this.start && !this.end) {
            // Check maximum/minimum days
		if ((this.maxDays > 0 && this.countDays(time, this.start) > this.maxDays) || (this.minDays > 0 && this.countDays(time, this.start) < this.minDays)) {
			return false;
		}

            // Check if date is before first date of range
		if (this.selectForward && time < this.start) {
			return false;
		}

            // Check the disabled dates
		if (this.disabledDates.length > 0) {
			var limit = this.getClosestDates(new Date(parseInt(this.start, 10)));

			if (limit[0] && this.compareDay(time, limit[0]) <= 0) {
				return false;
			}

			if (limit[1] && this.compareDay(time, limit[1]) >= 0) {
				return false;
			}
		}
	}

	return true;
};

Datepicker.prototype.checkSelection = function checkSelection () {
		var this$1 = this;

	var numberOfDays = Math.ceil((this.end - this.start) / 86400000) + 1;
	

	if (this.maxDays && numberOfDays > this.maxDays) {
		this.start = false;
		this.end = false;

            // Remove selected class from each day
		var days = this.datepicker.getElementsByTagName('td');
		for (var i = 0; i < days.length; i++) {
			this$1.removeClass(days[i], 'datepicker__month-day--selected');
			this$1.removeClass(days[i], 'datepicker__month-day--first-day-selected');
			this$1.removeClass(days[i], 'datepicker__month-day--last-day-selected');
		}

            // Show error in top bar
		var errorValue = this.maxDays - 1;
	
	} else if (this.minDays && numberOfDays < this.minDays) {
		this.start = false;
		this.end = false;

            // Remove selected class from each day
		var days$1 = this.datepicker.getElementsByTagName('td');
		for (var i$1 = 0; i$1 < days$1.length; i$1++) {
			this$1.removeClass(days$1[i$1], 'datepicker__month-day--selected');
			this$1.removeClass(days$1[i$1], 'datepicker__month-day--first-day-selected');
			this$1.removeClass(days$1[i$1], 'datepicker__month-day--last-day-selected');
		}

            // Show error in top bar
		var errorValue$1 = this.minDays - 1;
		
	} else if (this.start || this.end) {
            // Remove error and help classes from top bar
		
	} else {
            // Show help message
		
	}
};

Datepicker.prototype.addDays = function addDays (date, days) {
        // Add xx days to date
	var result = new Date(date);

	result.setDate(result.getDate() + days);

	return result;
};

Datepicker.prototype.countDays = function countDays (start, end) {
        // Return days between two dates
	return Math.abs(this.daysFrom1970(start) - this.daysFrom1970(end)) + 1;
};

Datepicker.prototype.compareDay = function compareDay (day1, day2) {
        // Compare two days: check if day1 is before/after/same day of day2
	var p = parseInt(this.getDateString(day1, 'YYYYMMDD'), 10) - parseInt(this.getDateString(day2, 'YYYYMMDD'), 10);

	if (p > 0) {
		return 1;
	}

	if (p === 0) {
		return 0;
	}

	return -1;
};

Datepicker.prototype.compareMonth = function compareMonth (month1, month2) {
        // Compare two months: check if month1 is before/after/same month of month2
	var p = parseInt(this.getDateString(month1, 'YYYYMM'), 10) - parseInt(this.getDateString(month2, 'YYYYMM'), 10);

	if (p > 0) {
		return 1;
	}

	if (p === 0) {
		return 0;
	}

	return -1;
};

Datepicker.prototype.daysFrom1970 = function daysFrom1970 (t) {
        // Get days from 1970
	return Math.floor(this.toLocalTimestamp(t) / 86400000);
};

Datepicker.prototype.toLocalTimestamp = function toLocalTimestamp (t) {
        // Convert timestamp to local timestamp
	if (typeof t === 'object' && t.getTime) {
		t = t.getTime();
	}

	if (typeof t === 'string' && !t.match(/\d{13}/)) {
		t = this.parseDate(t).getTime();
	}

	t = parseInt(t, 10) - (new Date().getTimezoneOffset() * 60 * 1000);

	return t;
};

Datepicker.prototype.printAttributes = function printAttributes (obj) {
        // Print object attributes in a DOM element
	var _obj = obj;
	var attribute = '';

	for (var attr in obj) {
		if (Object.prototype.hasOwnProperty.call(_obj, attr)) {
			attribute += attr + '="' + _obj[attr] + '" ';
		}
	}

	return attribute;
};

Datepicker.prototype.goToNextMonth = function goToNextMonth (e) {
        // Go to the next month
	var thisMonth = e.target.getAttribute('month');
	var isMonth2 = thisMonth > 1;
	var nextMonth = isMonth2 ? this.month2 : this.month1;

	nextMonth = this.getNextMonth(nextMonth);

        // Dont't go to the next month if:
        // 1. The second month is visible and it is the next month after
        //    our current month
        // 2. The month is after the (optional) endDate. There's no need
        //    to show other months in this case.
	if ((!this.isSingleMonth() && !isMonth2 && this.compareMonth(nextMonth, this.month2) >= 0) || this.isMonthOutOfRange(nextMonth)) {
		return;
	}

        // We can now show the month and proceed
	this.showMonth(nextMonth, thisMonth);
	this.showSelectedDays();
	this.disableNextPrevButtons();
};

Datepicker.prototype.goToPreviousMonth = function goToPreviousMonth (e) {
        // Go to the previous month
	var thisMonth = e.target.getAttribute('month');
	var isMonth2 = thisMonth > 1;
	var prevMonth = isMonth2 ? this.month2 : this.month1;

	prevMonth = this.getPrevMonth(prevMonth);

        // Dont't go to the previous month if:
        // 1. The click it's in the second month and the month we need is already
        //    shown in the first month
        // 2. The month is before the (optional) startDate. There's no need
        //    to show other months in this case.
	if ((isMonth2 && this.compareMonth(prevMonth, this.month1) <= 0) || this.isMonthOutOfRange(prevMonth)) {
		return;
	}

        // We can now show the month and proceed
	this.showMonth(prevMonth, thisMonth);
	this.showSelectedDays();
	this.disableNextPrevButtons();
};

Datepicker.prototype.isSingleMonth = function isSingleMonth () {
        // Check if the second month is visible
	return !this.isVisible(this.getMonthDom(2));
};

Datepicker.prototype.isMonthOutOfRange = function isMonthOutOfRange (month) {
	var _m = new Date(month.valueOf());

        // Return true for months before the startDate and months after the endDate
	if ((this.startDate && (new Date(_m.getFullYear(), _m.getMonth() + 1, 0, 23, 59, 59) < this.startDate)) || (this.endDate && (new Date(_m.getFullYear(), _m.getMonth(), 1) > this.endDate))) {
		return true;
	}

	return false;
};

    // Disable next/prev buttons according to the value of the prev/next
    // month. We don't want two same months at the same time!
Datepicker.prototype.disableNextPrevButtons = function disableNextPrevButtons () {
	if (this.isSingleMonth()) {
		return;
	}

	var month1 = parseInt(this.getDateString(this.month1, 'YYYYMM'), 10);
	var month2 = parseInt(this.getDateString(this.month2, 'YYYYMM'), 10);
	var d = Math.abs(month1 - month2);

        // First month "next" month button
	var nextButton = this.datepicker.getElementsByClassName('datepicker__month-button--next')[0];

        // Second month "previous" month button
	var prevButton = this.datepicker.getElementsByClassName('datepicker__month-button--prev')[1];

	if (d > 1 && d !== 89) {
		this.removeClass(nextButton, 'datepicker__month-button--disabled');
		this.removeClass(prevButton, 'datepicker__month-button--disabled');
	} else {
		this.addClass(nextButton, 'datepicker__month-button--disabled');
		this.addClass(prevButton, 'datepicker__month-button--disabled');
	}
};

Datepicker.prototype.topBarDefaultText = function topBarDefaultText () {
        // Show help message on top bar
	var topBarText = '';

	if (this.minDays && this.maxDays) {
		topBarText = this.lang('info-range');
	} else if (this.minDays && this.minDays > 2) {
		topBarText = this.lang('info-more-plural');
	} else if (this.minDays) {
		topBarText = this.lang('info-more');
	} else {
		topBarText = this.lang('info-default');
	}

	
};



Datepicker.prototype.updateSelectableRange = function updateSelectableRange () {
		var this$1 = this;

	var days = this.datepicker.getElementsByTagName('td');
	var isSelecting = this.start && !this.end;

        // Add needed classes
	for (var i = 0; i < days.length; i++) {
		if (this$1.hasClass(days[i], 'datepicker__month-day--invalid') && this$1.hasClass(days[i], 'datepicker__month-day--tmp')) {
			this$1.removeClass(days[i], 'datepicker__month-day--invalid');
			this$1.removeClass(days[i], 'datepicker__month-day--tmp');
			this$1.addClass(days[i], 'datepicker__month-day--valid');
		}

            // Update day classes during the date range selection
		if (isSelecting) {
			if (this$1.hasClass(days[i], 'datepicker__month-day--visibleMonth') && (this$1.hasClass(days[i], 'datepicker__month-day--valid') || this$1.hasClass(days[i], 'datepicker__month-day--disabled'))) {
				var time = parseInt(days[i].getAttribute('time'), 10);

				if (this$1.isValidDate(time)) {
					this$1.addClass(days[i], 'datepicker__month-day--valid');
					this$1.addClass(days[i], 'datepicker__month-day--tmp');
					this$1.removeClass(days[i], 'datepicker__month-day--invalid');
					this$1.removeClass(days[i], 'datepicker__month-day--disabled');
				} else {
					this$1.addClass(days[i], 'datepicker__month-day--invalid');
					this$1.addClass(days[i], 'datepicker__month-day--tmp');
					this$1.removeClass(days[i], 'datepicker__month-day--valid');
				}
			}
		}
	}

	return true;
};

Datepicker.prototype.dayHovering = function dayHovering (day) {
		var this$1 = this;

	var hoverTime = parseInt(day.getAttribute('time'), 10);
	//var tooltip = '';

	if (!this.hasClass(day, 'datepicker__month-day--invalid')) {
            // Get every td in the months table: our days
		var days = this.datepicker.getElementsByTagName('td');

            // Iterate each day and add the hovering class
		for (var i = 0; i < days.length; i++) {
			var time = parseInt(days[i].getAttribute('time'), 10);

			if (time === hoverTime) {
				this$1.addClass(days[i], 'datepicker__month-day--hovering');
			} else {
				this$1.removeClass(days[i], 'datepicker__month-day--hovering');
			}

			if ((this$1.start && !this$1.end) && ((this$1.start < time && hoverTime >= time) || (this$1.start > time && hoverTime <= time))) {
				this$1.addClass(days[i], 'datepicker__month-day--hovering');
			} else {
				this$1.removeClass(days[i], 'datepicker__month-day--hovering');
			}
		}

            // Generate date range tooltip
		/*if (this.start && !this.end) {
			var nights = this.countDays(hoverTime, this.start) - 1;

			if (this.hoveringTooltip) {
				if (typeof this.hoveringTooltip === 'function') {
					tooltip = this.hoveringTooltip(nights, this.start, hoverTime);
				} else if (this.hoveringTooltip === true && nights > 0) {
					var label = nights === 1 ? this.lang('night') : this.lang('nights');
					tooltip = (nights) + ' ' + label;
				}
			}
		}*/
	}

        // Show tooltip on hovering and set its position
	/*if (tooltip) {
		var dayBounding = day.getBoundingClientRect();
		var datepickerBounding = this.datepicker.getBoundingClientRect();
		var _left = dayBounding.left - datepickerBounding.left;
		var _top = dayBounding.top - datepickerBounding.top;

		_left += dayBounding.width / 2;

		var tooltipContainer = document.getElementById(this.getTooltipId());
		tooltipContainer.style.display = '';
		tooltipContainer.textContent = tooltip;
		var w = tooltipContainer.getBoundingClientRect().width;
		var h = tooltipContainer.getBoundingClientRect().height;

		_left -= w / 2;
		_top -= h;

		setTimeout(function () {
			tooltipContainer.style.left = _left + 'px';
			tooltipContainer.style.top = _top + 'px';
		}, 10);
	} else {
		var tooltipContainer$1 = document.getElementById(this.getTooltipId());
		tooltipContainer$1.style.display = 'none';
	}
	*/
};

Datepicker.prototype.clearHovering = function clearHovering () {
		var this$1 = this;

        // Remove hovering class from every day
	var days = this.datepicker.getElementsByTagName('td');
	for (var i = 0; i < days.length; i++) {
		this$1.removeClass(days[i], 'datepicker__month-day--hovering');
	}

        // Hide the tooltip
	//var tooltipContainer = document.getElementById(this.getTooltipId());
	//tooltipContainer.style.display = 'none';
};

Datepicker.prototype.clearSelection = function clearSelection () {
		var this$1 = this;

        // Reset start and end dates
	this.start = false;
	this.end = false;

        // Remove selected classes
	var days = this.datepicker.getElementsByTagName('td');
	for (var i = 0; i < days.length; i++) {
		this$1.removeClass(days[i], 'datepicker__month-day--selected');
		this$1.removeClass(days[i], 'datepicker__month-day--first-day-selected');
		this$1.removeClass(days[i], 'datepicker__month-day--last-day-selected');
	}

        // Reset input
	this.setValue('');

        // Check the selection
	this.checkSelection();

        // Show selected dates in top bar
	this.showSelectedInfo();

        // Show selected days in the calendar
	this.showSelectedDays();
};

Datepicker.prototype.parseDisabledDates = function parseDisabledDates () {
		var this$1 = this;

        // Sort disabled dates and store it in property
	var _tmp = [];

	for (var i = 0; i < this.disabledDates.length; i++) {
		_tmp[i] = fecha.parse(this$1.disabledDates[i], 'YYYY-MM-DD');
	}

	_tmp.sort(function (a, b) {
		return a - b;
	});

	this.disabledDatesTime = _tmp;
};

Datepicker.prototype.getClosestDates = function getClosestDates (x) {
		var this$1 = this;

        // This method implements part of the work done by the user Zeta
        // http://stackoverflow.com/a/11795472

        // Return an array with two elements:
        // - The closest date on the left
        // - The closest date on the right
	var dates = [false, false];

        // If the day is before the first disabled date return early
	if (x < this.disabledDatesTime[0]) {
            // Add one day if we want include the checkout
		if (this.enableCheckout) {
			dates = [false, this.addDays(this.disabledDatesTime[0], 1)];
            // Otherwise use the first date of the array
		} else {
			dates = [false, this.disabledDatesTime[0]];
		}

        // If the day is after the last disabled date return early
	} else if (x > this.disabledDatesTime[this.disabledDatesTime.length - 1]) {
		dates = [this.disabledDatesTime[this.disabledDatesTime.length - 1], false];
        // Otherwise calculate the closest dates
	} else {
		var bestPrevDate = this.disabledDatesTime.length;
		var bestNextDate = this.disabledDatesTime.length;
		var maxDateValue = Math.abs((new Date(0, 0, 0)).valueOf());
		var bestPrevDiff = maxDateValue;
		var bestNextDiff = -maxDateValue;
		var currDiff = 0;
		var i;

		for (i = 0; i < this.disabledDatesTime.length; ++i) {
			currDiff = x - this$1.disabledDatesTime[i];

			if (currDiff < 0 && currDiff > bestNextDiff) {
				bestNextDate = i;
				bestNextDiff = currDiff;
			}

			if (currDiff > 0 && currDiff < bestPrevDiff) {
				bestPrevDate = i;
				bestPrevDiff = currDiff;
			}
		}

		if (this.disabledDatesTime[bestPrevDate]) {
			dates[0] = this.disabledDatesTime[bestPrevDate];
		}

		if (typeof this.disabledDatesTime[bestPrevDate] === 'undefined') {
			dates[1] = false;
            // Add one day if we want include the checkout
		} else if (this.enableCheckout) {
			dates[1] = this.addDays(this.disabledDatesTime[bestNextDate], 1);
            // Otherwise use the date of the array
		} else {
			dates[1] = this.disabledDatesTime[bestNextDate];
		}
	}

	return dates;
};

Datepicker.prototype.lang = function lang (s) {
        // Return i18n string
	return (s in this.i18n) ? this.i18n[s] : '';
};

Datepicker.prototype.emptyElement = function emptyElement (element) {
        // Remove all child elements of a DOM node
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
};

    // Helper regex for DOM classes
Datepicker.prototype.classRegex = function classRegex (c) {
	return new RegExp('(^|\\s+)' + c + '(\\s+|$)');
};

    // Check if an element has a class
Datepicker.prototype.hasClass = function hasClass (el, c) {
	return this.classRegex(c).test(el.className);
};

    // Add a class to the element
Datepicker.prototype.addClass = function addClass (el, c) {
	if (!this.hasClass(el, c)) {
		el.className = el.className + ' ' + c;
	}
};

    // Remove class from element
Datepicker.prototype.removeClass = function removeClass (el, c) {
	el.className = el.className.replace(this.classRegex(c), ' ');
};

Datepicker.prototype.isVisible = function isVisible (element) {
        // Check if a DOM element is visible
	return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

Datepicker.prototype.slideDown = function slideDown (element, speed) {
        // Slide down an element
	element.style.display = '';
	var h = element.getBoundingClientRect().height;
	element.style.height = 0;
	this.recalc(element.offsetHeight);
	element.style.transition = 'height ' + speed;
	element.style.height = h + 'px';
	element.addEventListener('transitionend', function () {
		element.style.height = element.style.transition = element.style.display = '';
	});
};

Datepicker.prototype.slideUp = function slideUp (element, speed) {
        // Slide up an element
	var h = element.getBoundingClientRect().height;
	element.style.height = h + 'px';
	this.recalc(element.offsetHeight);
	element.style.transition = 'height ' + speed;
	element.style.height = 0;
	element.addEventListener('transitionend', function () {
		element.style.display = 'none';
	});
};

Datepicker.prototype.recalc = function recalc (element) {
        // Force browser recalculation
	return element.offsetHeight;
};

Datepicker.prototype.isTouchDevice = function isTouchDevice () {
        // This *does not* necessarily reflect a touchscreen device!!!
        // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
	return (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch));
};

    // ------------------ //
    //   PUBLIC METHODS   //
    // ------------------ //

Datepicker.prototype.open = function open () {
	this.openDatepicker();
};

Datepicker.prototype.close = function close () {
	this.closeDatepicker();
};

Datepicker.prototype.getDatePicker = function getDatePicker () {
	return this.datepicker;
};

Datepicker.prototype.setRange = function setRange (d1, d2) {
	if (typeof d1 === 'string' && typeof d2 === 'string') {
		d1 = this.parseDate(d1);
		d2 = this.parseDate(d2);
	}

	this.setDateRange(d1, d2);
};

Datepicker.prototype.clear = function clear () {
	this.clearSelection();
};

Datepicker.prototype.getNights = function getNights () {
	var count = 0;

	if (this.start && this.end) {
		count = this.countDays(this.end, this.start) - 1;
	} else {
		var value = this.getValue();
		var dates = value ? value.split(this.separator) : '';

		if (dates && (dates.length >= 2)) {
			var _format = this.format;

			if (_format.match(/Do/)) {
				_format = _format.replace(/Do/, 'D');
				dates[0] = dates[0].replace(/(\d+)(th|nd|st)/, '$1');
				dates[1] = dates[1].replace(/(\d+)(th|nd|st)/, '$1');
			}

			count = this.countDays(this.parseDate(dates[0], _format), this.parseDate(dates[1], _format)) - 1;
		}
	}

	return count;
};

return Datepicker;

}());
