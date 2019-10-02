(function($) {
  "use strict";

/**
 * @class Drupal.availabilityCalendar.Viewport
 *
 * @constructor Creates a new Drupal.availabilityCalendar.Viewport object.
 * @param {Object} settings
 *   object with the following properties (name type (default) description):
 *   {
 *     cvid {Integer} Required: the selector of the calendar view to operate on.
 *     dimensionsCalculation string ('fixed') IF and how to calculate the
 *       dimensions of the viewport. One of:
 *       - none
 *       - fixed
 *       - responsive_block
 *       - responsive_inline
 *     month
 *       width     int (0) The width of 1 calendar month. Used to calculate the
 *                         width of the viewport. If 0, the actual width of a
 *                         calendar month is taken.
 *       height    int (0) The height of 1 calendar month. See width for more
 *                         info.
 *     cols        int (0) The number of months that is shown horizontally in
 *                         the viewport. If 0, this is calculated dynamically,
 *                         based on the available width.
 *     rows        int (1) The number of months that is shown vertically in the
 *                         viewport.
 *     scroll      int (0) Indicating how many rows or cols to scroll.
 *     animate     Animation parameters, @see http://api.jquery.com/animate/
 *       backward  Internal/advanced usage.
 *       forward   Internal/advanced usage.
 *       speed     int|string ('slow') The animation speed, see jquery
 *                         documentation of animate().
 *     totalMonths int (calculated) Internal usage, do not pass in.
 *     firstMonth  int (calculated) Internal usage, do not pass in.
 *     width  int (calculated) Internal usage, do not pass in. Contains the
 *            width of 1 calendar as will be used in calculations.
 *     height  int (calculated) Internal usage, do not pass in. Contains the
 *            height of 1 calendar as will be used in calculations.
 *   }
 */
Drupal.availabilityCalendar.Viewport = function(settings) {
  var that = this;
  /** @type {jQuery} */
  var view;
  var viewport;
  var viewportField;
  var viewportSettings;

  /**
   * Initializes the viewport.
   *
   * But beware of reinitializing after ajax events triggered a new round of
   * attachBehaviors.
   */
  this.init = function(settings) {
    viewportSettings = settings;
    view = Drupal.availabilityCalendar.getCalendarView(viewportSettings.cvid).getView();
    viewport = $(".cal-viewport-inner", view);
    viewportField = viewport.parent().parent();
    initSettings();
    calculateDimensions();
    initAnimation();
    initHandlers();
  };

  /**
   * Extends the settings with their defaults and adds the animations.
   */
  function initSettings() {
    viewportSettings = $.extend(true, {
      dimensionsCalculation: 'fixed',
      responsive: false,
      month: {width: 0, height: 0},
      cols: 0,
      rows: 1,
      scroll: 1,
      animate: {speed: "slow"},
      totalMonths: Drupal.availabilityCalendar.getCalendarView(viewportSettings.cvid).getNumberOfMonths(),
      firstMonth: 1
    }, viewportSettings);

    // Get outer width of a month wrapper. These are needed to define the
    // animations.
    // If the calendar is initially hidden, e.g. in a collapsed fieldset or a
    // tab, the width and height cannot be easily retrieved. Therefore, a nice
    // small jQuery plugin - actual - is used to get the actual outerWidth and
    // outerHeight regardless current visibility. To save an additional HTTP
    // request, this plugin is inlined at the end of this file.
    if (viewportSettings.month.width === 0) {
      viewportSettings.month.width = $(".cal-month", view).first().actual('outerWidth', {includeMargin: true});
    }
    if (viewportSettings.month.height === 0) {
      viewportSettings.month.height = $(".cal-month", view).first().actual('outerHeight', {includeMargin: true});
    }
    viewportSettings.animate.custom = viewportSettings.animate.forward !== undefined;
  }

  /**
   * Sets the dimensions of the viewport.
   */
  function calculateDimensions() {
    if (viewportSettings.dimensionsCalculation !== 'none') {
      if (viewportSettings.dimensionsCalculation === 'responsive_block' || viewportSettings.dimensionsCalculation === 'responsive_inline') {
        // Calculate the number of cols, given the available width.
        var viewportField = viewport.parent().parent();
        var availableWidth = viewportField.actual('width');
        if (viewportSettings.dimensionsCalculation === 'responsive_inline') {
          viewportField.children('.cal-buttons').each(function() {
            availableWidth -= $(this).actual('outerWidth', {includeMargin: true});
          });
        }
        viewportSettings.cols = Math.max(1, Math.floor(availableWidth / viewportSettings.month.width));
        if (viewportSettings.rows === 1) {
          // Do not scroll more than the number of visible months.
          viewportSettings.scroll = Math.min(viewportSettings.cols, viewportSettings.scroll);
        }
      }

      viewport.parent().width(viewportSettings.cols * viewportSettings.month.width);
      viewport.parent().height(viewportSettings.rows * viewportSettings.month.height);
    }

    // Check the scroll value w.r.t. the actual viewport size.
    if (viewportSettings.rows === 1) {
      // If scrolling horizontally, the inner viewport should be infinitely wide.
      viewport.width(10000);
      // Do not scroll more than the number of cols.
      if (viewportSettings.scroll > viewportSettings.cols) {
        viewportSettings.scroll  = viewportSettings.cols;
      }
    }
    else {
      // Do not scroll more than the number of rows.
      if (viewportSettings.scroll > viewportSettings.rows) {
        viewportSettings.scroll  = viewportSettings.rows;
      }
    }
  }

  function initAnimation() {
    if (!viewportSettings.animate.custom) {
      var isLtr = $('html').attr('dir') !== 'rtl';
      viewportSettings.animate.backward = viewportSettings.rows > 1 ? { top: "+=" + (viewportSettings.scroll * viewportSettings.month.height) }
        : isLtr ? { left:  "+=" + (viewportSettings.scroll * viewportSettings.month.width) }
        : { right: "+=" + (viewportSettings.scroll * viewportSettings.month.width) };
      viewportSettings.animate.forward = viewportSettings.rows > 1 ? { top: "-=" + (viewportSettings.scroll * viewportSettings.month.height) }
        : isLtr ? { left: "-=" + (viewportSettings.scroll * viewportSettings.month.width) }
        : { right: "-=" + (viewportSettings.scroll * viewportSettings.month.width) };
    }
  }

  /**
   * Initialize event handlers for our own buttons.
   */
  function initHandlers() {
    viewport.once('Drupal-availabilityCalendar-Viewport', function () {
      $(".cal-backward", view).click(function() { that.scrollBackward(); });
      $(".cal-forward", view).click(function() { that.scrollForward(); });
    });
    setEnabledState();
  }

  /**
   * Set the enabled/disabled state of the clickable elements.
   */
  function setEnabledState() {
    if (viewportSettings.firstMonth <= 1) {
      $(".cal-backward", view).attr("disabled", "disabled");
    }
    else {
      $(".cal-backward", view).removeAttr("disabled");
    }
    if (viewportSettings.firstMonth + viewportSettings.rows * viewportSettings.cols > viewportSettings.totalMonths) {
      $(".cal-forward", view).attr("disabled", "disabled");
    }
    else {
      $(".cal-forward", view).removeAttr("disabled");
    }
  }

  /**
   * Scroll the viewport backward (if possible).
   */
  this.scrollBackward = function() {
    if (viewportSettings.firstMonth > 1) {
      viewport.animate(viewportSettings.animate.backward, viewportSettings.animate.speed);
      viewportSettings.firstMonth -= viewportSettings.rows > 1 ? viewportSettings.scroll * viewportSettings.cols : viewportSettings.scroll;
      setEnabledState();
    }
  };

  /**
   * Scroll the viewport forward (if possible).
   */
  this.scrollForward = function() {
    if (viewportSettings.firstMonth + viewportSettings.rows * viewportSettings.cols <= viewportSettings.totalMonths) {
      viewport.animate(viewportSettings.animate.forward, viewportSettings.animate.speed);
      viewportSettings.firstMonth += viewportSettings.rows > 1 ? viewportSettings.scroll * viewportSettings.cols : viewportSettings.scroll;
      setEnabledState();
    }
  };

  this.init(settings);
};

/**
 * @type {Object} Collection of viewport instances.
 */
Drupal.availabilityCalendar.viewports = {};

/**
 * Multiton implementation for accessing viewports on the page.
 *
 * @param {Integer} cvid
 * @returns {?Drupal.availabilityCalendar.Viewport}
 */
Drupal.availabilityCalendar.getViewport = function(cvid) {
  return Drupal.availabilityCalendar.viewports[cvid] !== undefined ? Drupal.availabilityCalendar.viewports[cvid] : null;
};

/**
 * Initialization code that works by implementing the Drupal behaviors paradigm.
 *
 * Based on the information in the settings, the calendar viewports are created.
 */
Drupal.behaviors.availabilityCalendarViewport = {
  attach: function(context, settings) {
    if (settings.availabilityCalendar && settings.availabilityCalendar.viewports) {
      var key;
      for (key in settings.availabilityCalendar.viewports) {
        if (settings.availabilityCalendar.viewports.hasOwnProperty(key)) {
          var viewportSettings = settings.availabilityCalendar.viewports[key];
          if (Drupal.availabilityCalendar.viewports[viewportSettings.cvid] === undefined) {
            Drupal.availabilityCalendar.viewports[viewportSettings.cvid] = new Drupal.availabilityCalendar.Viewport(viewportSettings);
          }
          else {
            Drupal.availabilityCalendar.viewports[viewportSettings.cvid].init(viewportSettings);
          }
        }
      }
    }
  }
};

}(jQuery));

/*
 * Inlined version of jQuery.actual plugin.
 * See http://dreamerslab.com/blog/en/get-hidden-elements-width-and-height-with-jquery/
 *
 * The following copyright and license message only holds for the code below.
 */
/*! Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.14
 *
 * Requires: jQuery 1.2.3 ~ 1.9.0
 */
;(function(e){e.fn.extend({actual:function(t,n){if(!this[t]){throw'$.actual => The jQuery method "'+t+'" you called does not exist'}var r={absolute:false,clone:false,includeMargin:false};var i=e.extend(r,n);var s=this.eq(0);var o,u;if(i.clone===true){o=function(){var e="position: absolute !important; top: -1000 !important; ";s=s.clone().attr("style",e).appendTo("body")};u=function(){s.remove()}}else{var a=[];var f="";var l;o=function(){if(e.fn.jquery>="1.8.0")l=s.parents().addBack().filter(":hidden");else l=s.parents().andSelf().filter(":hidden");f+="visibility: hidden !important; display: block !important; ";if(i.absolute===true)f+="position: absolute !important; ";l.each(function(){var t=e(this);a.push(t.attr("style"));t.attr("style",f)})};u=function(){l.each(function(t){var n=e(this);var r=a[t];if(r===undefined){n.removeAttr("style")}else{n.attr("style",r)}})}}o();var c=/(outer)/g.test(t)?s[t](i.includeMargin):s[t]();u();return c}})})(jQuery)
;
(function($) {
"use strict";

/**
 * @class Drupal.availabilityCalendar.Command represents a calendar state
 * changing command during the whole creation phase, i.e. from click on a state
 * to the click on the end date.
 *
 * @param {Drupal.availabilityCalendar.Calendar} calendar
 * @param {*} fieldContext
 * @constructor
 */
Drupal.availabilityCalendar.Command = function(calendar, fieldContext) {
  this.state = "";
  this.from = null;
  this.to = null;
  this.elt = $(".availability-changes", fieldContext);

  /**
   * Sets the state of the current command and, as this is supposed to be the
   * first parameter to be set, cleans the from and to dates.
   *
   * @param {String} [selectedState]
   */
  this.start = function(selectedState) {
    if (selectedState !== undefined) {
      this.state = selectedState;
    }
    this.from = null;
    this.to = null;
    this.show();
  };

  /**
   * Adds a date to the command. If it is the 1st date it will be the from date.
   * If it is the 2nd date it will be the to date, if necessary, swapping the
   * from and to dates.
   *
   * @param {Date} date
   */
  this.addDate = function(date) {
    if (this.from === null) {
      this.from = date;
    }
    else if (this.to === null) {
      this.to = date;
      if (this.to < this.from) {
        var from = this.from;
        this.from = this.to;
        this.to = from;
      }
      if (calendar.isOvernight()) {
        // Overnight rental: to date = departure date = am only: store as "from"
        // to "to - 1 day". But in the case of clicking twice on the same day,
        // it will be handled as a 1 night booking.
        if (this.to > this.from) {
          this.to.setDate(this.to.getDate() - 1);
        }
      }
    }
    this.show();
  };

  /**
   * @returns {Boolean} Whether the current command is complete.
   */
  this.isComplete = function() {
    return this.to !== null && this.from !== null && this.state !== "";
  };

  /**
   * Replaces the current command in the accompanying hidden field.
   */
  this.show = function() {
    var val = this.elt.val();
    var pos = val.lastIndexOf("\n") + 1;
    val = val.substr(0, pos) + this.toString();
    this.elt.val(val);
  };

  /**
   * Finishes the current command and starts a new one.
   */
  this.finish = function() {
    this.show();
    this.elt.val(this.elt.val() + "\n");
    this.start();
  };

  /**
   * @returns String
   *   A string representation of the current command.
   */
  this.toString = function() {
    var result = "";
    result += "state: ";
    result += this.state !== "" ? this.state : "-";
    result += " from: ";
    result += this.from !== null ? Drupal.availabilityCalendar.formatIsoDate(this.from) : "-";
    result += " to: ";
    result += this.to !== null ? Drupal.availabilityCalendar.formatIsoDate(this.to) : "-";
    return result;
  };
};

/**
 * @class Drupal.availabilityCalendar.Editor
 *   Provides the glueing code that connects the form elements on entity edit
 *   forms (for entities with an availability calendar field) with the
 *   Drupal.availabilityCalendar.Calendar API object and the
 *   Drupal.availabilityCalendar.Command class.
 *
 * @param {Object} settings
 * @param {Integer} settings.cvid
 */
Drupal.availabilityCalendar.Editor = function(settings) {
  /** @type {Drupal.availabilityCalendar.Calendar} */
  var calendar;
  var view;
  var editorSettings;
  var fieldContext;
  var formRadios;
  var command;
  var calSelectedDay;

  this.init = function(settings) {
    editorSettings = settings;
    view = Drupal.availabilityCalendar.getCalendarView(editorSettings.cvid);
    calendar = view.getCalendar();
    fieldContext = view.getView().parents(".form-wrapper").first();
    fieldContext.once("Drupal-availabilityCalendar-Editor", function () {
      formRadios = $(".form-radios.availability-states", fieldContext);
      initCommand();
      attach2Checkbox();
      attach2States();
      bind2CalendarEvents();
    });
  };

  /**
   * Initialize a new Drupal.availabilityCalendar.Command object.
   */
  function initCommand() {
    command = new Drupal.availabilityCalendar.Command(calendar, fieldContext);
    command.start($("input[type=radio]:checked", formRadios).val());
    // Add css_class of states as class to wrapper elements around the radios.
    $("[type=radio]", formRadios).parent().addClass(function() {
      return Drupal.availabilityCalendar.getStates().get(($(this).children("[type=radio]").val())).cssClass;
    });
  }

  /**
   * Attach to "enable calendar" checkbox (if it exists).
   */
  function attach2Checkbox() {
    var enable = $(".availability-enable", fieldContext);
    if (enable.size() > 0 ) {
      $(".availability-details", fieldContext).toggle(enable.filter(":checked").size() > 0);
      enable.click(function () {
        $(".availability-details", fieldContext).toggle("fast");
      });
    }
  }

  /**
   * Attach to state radios events.
   */
  function attach2States() {
    $("input[type=radio]", formRadios).click(function() {
      // State clicked: remove cal-selected and restart current command.
      removeCalSelected();
      command.start($("input[type=radio]:checked", formRadios).val());
    });
  }

  /**
   * Attach to the calendar calendarClick event.
   */
  function bind2CalendarEvents() {
    $(calendar)
      .bind("calendarClick", selectDay)
      .bind("calendarMonthClick", selectMonth)
      .bind("calendarWeekClick", selectWeek)
      .bind("calendarDayOfWeekClick", selectDayOfWeek);
  }

  /**
   * Event handler that processes a click on a date in the calendar.
   *
   * @param {jQuery.Event} event
   * @param {Date} date
   */
  function selectDay(event, date/*, view*/) {
    command.addDate(date);
    if (!command.isComplete()) {
      setCalSelected(command.from);
    }
    else {
      removeCalSelected();
      event.target.changeRangeState(command.from, command.to, command.state);
      command.finish();
    }
  }

  /**
   * Changes a whole month at once.
   *
   * It does so by resetting the command and simulating 2 clicks:
   * - on the 1st day of the given month.
   * - in case of a full day calendar: on the last day of the given month.
   * - in case of an overnight calendar: on the 1st day of the next month.
   * The calendar will adjust this range to the currently administered range.
   *
   * @param {jQuery.Event} event
   * @param {{year:Integer, month:Integer}} month
   */
  function selectMonth(event, month/*, view*/) {
    removeCalSelected();
    command.start();
    command.addDate(new Date(month.year, month.month - 1, 1));
    command.addDate(new Date(month.year, month.month, event.target.isOvernight() ? 1 : 0));
    var realRange = event.target.changeRangeState(command.from, command.to, command.state);
    command.from = realRange.from;
    command.to = realRange.to;
    command.finish();
  }

  /**
   * Changes a whole month at once.
   *
   * It does so by resetting the command and simulating 2 clicks:
   * - on the 1st day of the given month.
   * - in case of a full day calendar: on the last day of the given month.
   * - in case of an overnight calendar: on the 1st day of the next month.
   * The calendar will adjust this range to the currently administered range.
   *
   * @param {jQuery.Event} event
   * @param {{year: Integer, month: Integer, week: Integer, firstDay: String}} week
   */
  function selectWeek(event, week/*, view*/) {
    // Simulate 2 clicks:
    // - on the 1st day of the given week.
    // - in case of a full day calendar: on the last day of the given week.
    // - in case of an overnight calendar: on the 1st day of the next week.
    removeCalSelected();
    command.start();
    command.addDate(new Date(week.firstDay.getTime()));
    var to = new Date(week.firstDay.getTime());
    to.setDate(to.getDate() + (event.target.isOvernight() ? 7 : 6));
    command.addDate(to);
    var realRange = event.target.changeRangeState(command.from, command.to, command.state);
    if (realRange.from !== null) {
      command.from = realRange.from;
      command.to = realRange.to;
      command.finish();
    }
    else {
      command.start();
    }
  }

  /**
   * Changes all the same day of the week days in a month at once.
   *
   * @param {jQuery.Event} event
   * @param {{year: Integer, month: Integer, dayOfWeek: Integer}} dayOfWeek
   *   The day of the week clicked. As this is always within the context of 1
   *   month, the year and month number should also be passed in.
   *   The dayOfWeek property is an integer between 1 (monday) and 7 (sunday).
   */
  function selectDayOfWeek(event, dayOfWeek/*, view*/) {
    removeCalSelected();
    command.start();
    // Start at the 1st day of the given month,
    var date = new Date(dayOfWeek.year, dayOfWeek.month - 1, 1);
    // and advance to the 1st given day of the week in that month
    while (date.getDay() !== dayOfWeek.dayOfWeek % 7) {
      date.setDate(date.getDate() + 1);
    }
    // Loop over all that days of the week in the given month.
    while (date.getMonth() < dayOfWeek.month) {
      command.addDate(date);
      command.addDate(date);
      var realRange = event.target.changeRangeState(command.from, command.to, command.state);
      if (realRange.from !== null) {
        command.finish();
      }
      else {
        command.start();
      }
      // Go to the same day next week.
      date.setDate(date.getDate() + 7);
    }
  }

  /**
   * Set the cal-selected class on the day cell of the given date.
   *
   * @param {Date} day
   */
  function setCalSelected(day) {
    removeCalSelected();
    calSelectedDay = new Date(day.getTime());
    calendar.addExtraState(calSelectedDay, "cal-selected");
  }

  /**
   * Removes the cal-selected class on the day cell where it was last set on.
   */
  function removeCalSelected() {
    if (calSelectedDay !== null) {
      calendar.removeExtraState(calSelectedDay, "cal-selected");
      calSelectedDay = null;
    }
  }

  this.init(settings);
};

/**
 * @type {Object} Collection of calendar editor instances.
 */
Drupal.availabilityCalendar.editors = {};

/**
 * Multiton implementation for accessing calendar editors on the page.
 *
 * @param {Integer} cvid
 * @return {?Drupal.availabilityCalendar.Editor}
 */
Drupal.availabilityCalendar.getEditor = function(cvid) {
  return Drupal.availabilityCalendar.editors[cvid] !== undefined ? Drupal.availabilityCalendar.editors[cvid] : null;
};

/**
 * Initialization code that works by implementing the Drupal behaviors paradigm.
 *
 * Based on the information in the settings, the calendar editors are created.
 */
Drupal.behaviors.availabilityCalendarEditor = {
  attach: function(context, settings) {
    if (settings.availabilityCalendar && settings.availabilityCalendar.editors) {
      var key;
      for (key in settings.availabilityCalendar.editors) {
        if (settings.availabilityCalendar.editors.hasOwnProperty(key)) {
          var editorSettings = settings.availabilityCalendar.editors[key];
          if (Drupal.availabilityCalendar.editors[editorSettings.cvid] === undefined) {
            Drupal.availabilityCalendar.editors[editorSettings.cvid] = new Drupal.availabilityCalendar.Editor(editorSettings);
          }
          else {
            Drupal.availabilityCalendar.editors[editorSettings.cvid].init(editorSettings);
          }
        }
      }
    }
  }
};

}(jQuery));
;
