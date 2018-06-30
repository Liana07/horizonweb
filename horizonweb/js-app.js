// A new entry in the browser history stack is made, using replacestate method at page load. 
// A new property URL is added to the state object, and set equal to the first window at page load (wdw-signup)

//define the current href
var path = window.location.href;

//dont do anything until logo and rest of DOM is loaded
$(document).ready(function () {
    var oState = {
        "url": "wdw-homepage"
    };
    //replace the empty state at pageload
    history.replaceState(oState, '', path + '/homepage');
    //console.log(oState.url);
});


/************************************************************************/
/* Mobile Navigation Functions/Events ***********************************/
/************************************************************************/

//run function that shows mobile menu, when click event on burger menu
$("#menu-bars").click(function () {
    fnShowMenu();
});

//hide the menu bar, eventhandler on document is used, as the menu bar is dynamicly created from backend
//depending on user status
$(document).on('click', '.link, .link-dashboard, .logout, #content-cover', function () {
    if(!($(this).hasClass('link-to-dashboard'))){
        fnHideMenu();
    }
    
});

//function animates the mobile menu from -30vw to 0vw
function fnShowMenu() {
    //	 animate the menu
    $("nav>ul").animate({
        "right": "0vw"
    }, 800);
    // show the content cover
    $("#content-cover").show();
}

//function animates the mobile menu from 0vw to -30vw 
function fnHideMenu() {
    //	 animate the menu
    $("nav>ul").animate({
        "right": "-45vw"
    }, 800);
    // show the content cover
    $("#content-cover").hide();
}
$('#link-dashboard').click(function(){
    if($(window).width() < 768){
        $('.mobile-dashboard').fadeToggle(1000); 
    }
    
});
if($(window).width() > 768){
    $('.mobile-dashboard').hide(); 
}

/************************************************************************/
/* Eventhandler-> Grab link attr ****************************************/
/************************************************************************/


$(document).on("click", ".link, .link-dashboard", function () {

    //grab the data attribute of the element clicked (the new window to show)
    var sWindowToShow = $(this).attr("data-go-to");

    //pass the data attribute value to the navigation fn as a string
    fnNavigation(sWindowToShow);
    //Clear login/signup Windows for error messages
  /*  if (sWindowToShow == 'wdw-login' || sWindowToShow == 'wdw-signup') {
        fnRemoveMessage($('#frm-login'));
        fnRemoveMessage($('#frm-signup'));
    }*/

});
/************************************************************************/
/* Function Navigation **************************************************/
/************************************************************************/
//gets a window to show string, and shows it
//updates the state objects url property 

function fnNavigation(sWindowToShow) {

    //remove current class from all nav elements
    if(!sWindowToShow.startsWith('admin')){
     $("nav ul li").removeClass('current'); 
 }else{
    $('nav#nav-dashboard > ul > li').removeClass('dashboard-current');
}

if(!sWindowToShow.startsWith('admin')){
 $("nav ul li[data-go-to= " + sWindowToShow + "]").addClass("current"); 
}
if(sWindowToShow.startsWith('admin')){
    $("nav#nav-dashboard > ul > li[data-go-to= " + sWindowToShow + "]").addClass("dashboard-current");  
}


    //add current class to the element that has the present data attr value
    

    console.log(sWindowToShow);
    //hide all windows, show current
    if(sWindowToShow === 'wdw-login'){
        fnLogin();
        return false;    }
        if(sWindowToShow === 'wdw-dashboard'){
            $(".wdw").hide();
            $('#wdw-dashboard').fadeToggle();
            $('#admin-event-list').show();
        }
        else if(sWindowToShow.startsWith('admin')){
            $('.wdw-dashboard').hide();
            $('#' + sWindowToShow).fadeIn();
        }
        else{
         $(".wdw").hide();
         $(".wdw-dashboard").hide();
         $("#" + sWindowToShow).fadeIn();
     }
 //split method returns an array of strings
 var sURL = sWindowToShow.split('-');

 var url = path + '/' + sURL[1];
    //update the state object's url property
    var oState = {
        "url": sWindowToShow
    };

    //push the new state to the history entry ()
    window.history.pushState(oState, '', url);



    /************************************************************************/
    /* 1.2 Popstate Eventhandler ********************************************/
    /************************************************************************/

//register an eventhandler, when an popstate event happens on the window object
// eg. users presses forward/back button (browses the history entries pushed by fnNavigation)
window.onpopstate = fnPopstateHandler;

//when a popstate event happens, run this function
function fnPopstateHandler(e) {

    //console.log(e.state.url + ' ' + window.history.length);

    //the event object passed to the popstate eventhandler contains a copy of the history state object (passed with event object), the url property contains
    //the window to show
    $(".wdw").hide()
    $("#" + e.state.url).show();

};


    //split method returns an array of strings
    var sURL = sWindowToShow.split('-');

    var url = path + '/' + sURL[1];
    //update the state object's url property
    var oState = {
        "url": sWindowToShow
    };

    //push the new state to the history entry ()
    window.history.pushState(oState, '', url);

    //console.log(oState.url);
}
/************************************************************************/
/* Log In Functions *****************************************************/
/************************************************************************/
function fnLogin(){

    $('body').css('overflow-y', 'hidden');
    $('#wdw-login').css('top', pageYOffset*2).fadeIn();

    $('main').addClass('blur');
    $('header').addClass('blur');

    $('.login-bd').click(function(){
        $('#wdw-login').hide();
        $('main').removeClass('blur');
        $('header').removeClass('blur');
        $("nav ul li").removeClass('current');
        $('body').css('overflow-y', 'scroll');
    }).children().click(function(e) {
        return false;
    });

}
//var username = 'johndoe@horizon.com';
//var password = 'admin';
var username = 'test';
var password = 'test';

$('#btn-login').click(function(){
    var email = $('#txt-email').val();
    var pass = $('#txt-password').val();
    $('#log-in-error').hide();
    $('#lbl-username-error').hide();
    $('#lbl-password-error').hide();
    $('#txt-email, #txt-password').removeClass('input-error');

    if(email === ''){
        $('#lbl-username-error').show();
        $('#txt-email').addClass('input-error');   
    }
    if(pass === ''){
        $('#lbl-password-error').show();
        $('#txt-password').addClass('input-error');  
    }

    if((email !== username && pass !== '') || (pass !== password && email !== '')){
        $('#log-in-error').fadeIn(500);
        $('#txt-email, #txt-password').addClass('input-error');

    }

    if(email === username && pass === password){
        fnShowLoader(2000);
        $('#wdw-login').fadeOut('slow');
        $('main').removeClass('blur');
        $('#link-login').hide();
        $('#link-profile').show();
        $('#link-dashboard').show();
        $('header').removeClass('blur');

        
        setTimeout(function(){
            fnNavigation('wdw-profile-page');
            fnShowUserMessage('Welcome John Doe, you have 2 upcoming events in your calendar');
        },1500);
    }

});

$('#link-profile').click(function(){
    $('#logout').fadeToggle('slow');
}).children().click(function(e) {
  return false;
});
$('ul#logout li').click(function(){
    $('#logout').fadeOut('slow');
});

$('.logout').click(function(){
    $('#link-login').show();
    $('#link-profile').hide();
    $('#link-dashboard').hide();
});
/************************************************************************/
/* Show Loading Screen **************************************************/
/************************************************************************/

function fnShowLoader(miliseconds){
  $('body').css('overflow-y', 'hidden');
  $('#loading-screen').css('top', pageYOffset*2).fadeIn();

  setTimeout(function(){
     $('body').css('overflow-y', 'scroll');
     $('#loading-screen').fadeOut();
 }, miliseconds);

}

/************************************************************************/
/* Alert Modal **********************************************************/
/************************************************************************/
function fnShowAlertModal (message){
    $('body').css('overflow-y', 'hidden');
    $('#alert-modal').css('top', pageYOffset*2).fadeIn('slow');
    $('main').addClass('blur');
    $('header').addClass('blur');
    $('.alert-message').append('<h2>'+message+'</2>');
    $('.btn-modal').append(
        `<button id="btn-continue" class="btn btn-one-primary-color">No, Continue</button>
        <button id="btn-cancel-event" class="btn btn-one-highlight-color">Yes, Cancel all</button>`
        );
}

function fnCloseModal(){
    $('#alert-modal').fadeOut('slow');
    $('main').removeClass('blur');
    $('header').removeClass('blur');
    $('body').css('overflow-y', 'scroll');
}

function fnEmptyModal(){
    $('.alert-message').empty();
    $('.btn-modal').empty();
}
/************************************************************************/
/* User message *********************************************************/
/************************************************************************/

function fnShowUserMessage(message){
    $('#lblMessage').text(message);
    setTimeout(function(){
        $('#user-message').show('slow', "linear").delay(4500).fadeOut('slow'); 
    }, 1000);   
}

/************************************************************************/
/* Attend event *********************************************************/
/************************************************************************/

$(document).on("click", "#attend_event", function(){

    fnShowUserMessage('Web Development Summit is added to your calendar');
    $(this).attr("id","unsubscribe");
    $(this).text('Unsubscribe from this event');
});
$(document).on("click", "#unsubscribe", function(){
    fnShowUserMessage('Web Development Summit is removed from your calendar');
    $(this).attr("id","attend_event");
    $(this).text('Attend this event');
});
/************************************************************************/
/* Delete event *********************************************************/
/************************************************************************/


$(document).on("click", ".delete-event", function(){
   var remove1 = $(this).prevUntil('div.tablex__item--foot-delete');
   var remove2 = $(this);

   $('body').css('overflow-y', 'hidden');
   $('#alert-modal').css('top', pageYOffset*2).fadeIn('slow');
   $('main').addClass('blur');
   $('header').addClass('blur');
   $('.alert-message').append('<h2>You are about to delete an event! Press delete if you are sure. Else press cancel</2>');
   $('.btn-modal').append(
    `<button id="btn-delete-event" class="btn btn-one-highlight-color">Yes, Delete Event</button>
    <button id="btn-continue" class="btn btn-one-primary-color">Cancel</button>`
    );
   $(document).on("click", "#btn-delete-event", function(){
    remove1.hide();
    remove2.hide();
    fnCloseModal();
    fnShowUserMessage('Event has been deleted!');
    $('.btn-modal').empty();
    $('.alert-message').empty();
});
});



/************************************************************************/
/* Create Event *********************************************************/
/************************************************************************/
$(document).on("click", ".cancel-event", function () {
    fnShowAlertModal('You want to cancel the event creation?');
    
});

$(document).on("click", "#btn-continue", function () {
    fnCloseModal();
    fnEmptyModal();
});

$(document).on("click", "#btn-cancel-event", function () {
    fnCloseModal();
    fnEmptyModal();
    //go to event list
});


/*Step one*/
$('#save_step1').on("click", function () {
    console.log('click');
    $('#create_event_first .lbl-error').remove();
    $("#create_event_first input").removeClass('input-error');

    var emptyInputs = 0;

    $("#create_event_first input").each(function(){
        if ($(this).val()  === "") {

            $(this).addClass('input-error');
            $(this).after('<label class="lbl-error"><h4 class="error">Please fill in the '+ $(this).attr("placeholder")+'</h4></label>');
            emptyInputs++;
        }
    });
    if(emptyInputs == 0){
        $('#create_event_second').fadeIn('slow');
        $('#create_event_second')[0].scrollIntoView(true);
        $('#save_step1, #cancel_step1').hide();
    }

});

/*Step 2*/
$('#save_step2').on("click", function () {

    $('#create_event_second .lbl-error').remove();
    $("#create_event_second textarea").removeClass('input-error');

    var emptyInputs = 0;

    $("#create_event_second textarea").each(function(){
        if ($(this).val()  === "") {

            $(this).addClass('input-error');
            $(this).after('<label class="lbl-error"><h4 class="error">Please fill in the '+ $(this).attr("placeholder")+'</h4></label>');
            emptyInputs++;
        }
    });
    if(emptyInputs == 0){
        $('#create_event_third').fadeIn('slow');
        $('#create_event_third')[0].scrollIntoView(true);
        $('#save_step2, #cancel_step2').hide();
    }

});
/*Step 3*/
$('#save_step3').on("click", function () {

    $('#create_event_third .lbl-error').remove();
    $("#create_event_third input").removeClass('input-error');

    var emptyInputs = 0;

    $("#create_event_third input").each(function(){
        if ($(this).val()  === "") {

            $(this).addClass('input-error');
            $(this).after('<label class="lbl-error"><h4 class="error">Please fill in the '+ $(this).attr("placeholder")+'</h4></label>');
            emptyInputs++;
        }
    });
    if(emptyInputs == 0){
        $('#create_event_fourth').fadeIn('slow');
        $('#create_event_fourth')[0].scrollIntoView(true);
        $('#save_step3, #cancel_step3').hide();
    }

});

/*Step 4*/
$('#save_step4').on("click", function () {

    $('#create_event_fourth .lbl-error').remove();
    $("#create_event_fourth input").removeClass('input-error');

    var emptyInputs = 0;

    $("#create_event_fourth input").each(function(){
        if ($(this).val()  === "") {

            $(this).addClass('input-error');
            $(this).after('<label class="lbl-error"><h4 class="error">Please fill in the '+ $(this).attr("placeholder")+'</h4></label>');
            emptyInputs++;
        }
    });
    if(emptyInputs == 0){
        $('#create_event_fifth').fadeIn('slow');
        $('#create_event_fifth')[0].scrollIntoView(true);
        $('#save_step4, #cancel_step4').hide();
    }

});


/*Step 5 - Final*/
$('#save_final').on("click", function () {
    fnShowLoader(2000);
    setTimeout(function(){
        $('#admin-add-event').fadeOut('slow');
        $('#admin-event-list').show();
    }, 2300);

    fnShowUserMessage('Your event is added to the event list');
});

// $('#save_step2').on("click", function () {

//   $('#create_event_third').fadeIn('slow');

//   $('#create_event_third')[0].scrollIntoView(true);
//   $('#save_step2, #cancel_step2').hide();
// });


// $('#save_step3').on("click", function () {

//   $('#create_event_fourth').fadeIn('slow');

//   $('#create_event_fourth')[0].scrollIntoView(true);
//   $('#save_step3, #cancel_step3').hide();
// });

/*
$('#save_step4').on("click", function () {

  $('#create_event_fifth').fadeIn('slow');

  $('#create_event_fifth')[0].scrollIntoView(true);
  $('#save_step4, #cancel_step4').hide();
});*/






var replaced;
$(document).on("click", "#ok_button", function() {
  // Save what's being replaced
  var content = $("#location").val();  

  replaced = $('#location').replaceWith('<div class="displaythis" id = "location2">' + content + '<a href="" id="link2" >Change location</a> </div>');

  $('#ok_button').hide();

});
$(document).on("click", "#link2", function(e) {

  // Restore it

  $("#location2").replaceWith(replaced);

  e.preventDefault();
  $('#ok_button').show();


});

/*Info Hover*/
$('.info-hover').mouseover(function(){
    $(this).siblings('.info-hover-message').fadeIn();
    $(this).mouseleave(function() {
        $(this).siblings('.info-hover-message').fadeOut();
    });
});




/************************************************************************/
/* Add to event list ****************************************************/
/************************************************************************/




var iElementNumber = 0;

$(document).on('change', '[type="file"]', function () {
    var preview = new FileReader();
    preview.readAsDataURL(this.files[0]);
    var self = this;
    preview.onload = function (event) {
        $(self).siblings(".img-preview").attr("src", event.target.result);
    }

});


$('#save_final').on('click', function(){

    $('input').each(function(){    
        var id = $(this).attr('id');
        var value = $(this).val();
        console.log (value);
        localStorage.setItem(id, value);
        console.log (localStorage.getItem(id,value));
    });   
});

$('#save_final').on('click', function(){

    $('textarea').each(function(){    
        var id = $(this).attr('id');
        var value = $(this).val();
        console.log (value);
        localStorage.setItem(id, value);
        console.log (localStorage.getItem(id,value));
    });   
});

$('#save_final').on('click', function(){

    $('select').each(function(){    
        var id = $(this).attr('id');
        var value = $(this).find(":selected").text();
        localStorage.setItem(id, value);
    });   
});

$('#save_final').on('click', function(){

 var name=localStorage.getItem("name");
 var date=localStorage.getItem("date");
 var location=localStorage.getItem("venue_name");
 var address=localStorage.getItem("address");
 var city=localStorage.getItem("city");
 var zip=localStorage.getItem("zip");
 var date=localStorage.getItem("date");
 var starttime=localStorage.getItem("starttime");
 var endtime=localStorage.getItem("endtime");
 var seatnumber=localStorage.getItem("places_no");
 var sponsor= localStorage.getItem("sponsors_create");
 var description= localStorage.getItem("description"); 
 var description2= localStorage.getItem("description2"); 
 var price= localStorage.getItem("price_event"); 
 var image= localStorage.getItem("file_0"); 

 $(function () {
  $('#name_edit').val(name);
});
 $(function () {
  $('#location_edit').val(location);
  $('#address_edit').val(address);
  $('#city_edit').val(city);
  $('#zip_edit').val(zip);
  $('#date_edit').val(date);
  $('#starttime_edit').val(starttime);
  $('#endtime_edit').val(endtime);
});
 $(function () {
  $('#places_no_edit').val(seatnumber);
});
 $(function () {
  $('#description_edit').val(description);
});
 $(function () {
  $('#description2_edit').val(description2);
});
 $(function () {
  $('#price_event_edit').val(price);
});

 $(function () {
  $('#file-0_ed').val(image);
});

 var tbevents="";


 tbevents +='<div class="tablex__item tablex__item--head link" data-go-to="wdw-view-event" id="new_name">'+name+'</div>';
 tbevents += '<div class="tablex__item" id="new_date">'+date+'</div>';
 tbevents += '<div class="tablex__item" id="new_location">'+location+'</div>';
 tbevents +='<div class="tablex__item" id="new_seat">'+seatnumber+'('+seatnumber+' free)</div>';
 tbevents += '<div class="tablex__item" id="event_sps">'+sponsor+'</div>';
 tbevents += '<div class="tablex__item tablex__item--foot link" data-go-to="admin-edit-event" id="edit_link">Edit <div class="fa fa-edit fa-fw"></div></div>';
 tbevents += '<div class="tablex__item tablex__item--foot-delete delete-event">Delete <div class="fa fa-trash fa-fw"></div></div>';
 tbevents +='</div>';

//}

$("#tablex_tab").append(tbevents);


});

/*Edit Functionality*/



$('#save_edit').on('click', function(){

    $('input').each(function(){    
        var id = $(this).attr('id');
        var value = $(this).val();
       // console.log (value);
       localStorage.setItem(id, value);
       // console.log (localStorage.getItem(id,value));
   });   
});

$('#save_edit').on('click', function(){

    $('textarea').each(function(){    
        var id = $(this).attr('id');
        var value = $(this).val();
       // console.log (value);
       localStorage.setItem(id, value);
        //console.log (localStorage.getItem(id,value));
    });   
});

$('#save_edit').on('click', function(){

    $('select').each(function(){    
        var id = $(this).attr('id');
        var value = $(this).find(":selected").text();
        localStorage.setItem(id, value);
    });   
});



$('#save_edit').on('click', function(){

 var name=localStorage.getItem("name_edit");
 var date=localStorage.getItem("datetime_edit");
 var location=localStorage.getItem("location_edit");
 var seatnumber=localStorage.getItem("places_no_edit");
 var sponsor= localStorage.getItem("select_sponsors_edit");


 console.log(localStorage.getItem("name_edit"));

 $('#new_name').html(name);
 $('#new_date').html(date);
 $('#new_seat').html(seatnumber);
 $('#new_location').html(location);
 $('#event_sps').html(sponsor);

});

$('#save_edit').on("click", function () {
    fnShowLoader(2000);
    setTimeout(function(){
        $('#admin-edit-event').fadeOut('slow');
        $('#admin-event-list').show();
    }, 2300);

    fnShowUserMessage('Your event has been updated');
});


/************************************************************************/
/* Date Time Picker Styles **********************************************/
/************************************************************************/
$.datetimepicker.setLocale('en');

$('#datetimepicker_format').datetimepicker({value:'2015/04/15 05:03', format: $("#datetimepicker_format_value").val()});
console.log($('#datetimepicker_format').datetimepicker('getValue'));

$("#datetimepicker_format_change").on("click", function(e){
    $("#datetimepicker_format").data('xdsoft_datetimepicker').setOptions({format: $("#datetimepicker_format_value").val()});
});
$("#datetimepicker_format_locale").on("change", function(e){
    $.datetimepicker.setLocale($(e.currentTarget).val());
});

$('#datetimepicker').datetimepicker({
    dayOfWeekStart : 1,
    lang:'en',
    disabledDates:['1986/01/08','1986/01/09','1986/01/10'],
    startDate:  '1986/01/05'
});



$('#starttime, #endtime').datetimepicker({
    datepicker:false,
    format:'H:i',
    step:30
});

$('#date').datetimepicker({
    yearOffset:0,
    lang:'en',
    timepicker:false,
    format:'d/m/Y',
    formatDate:'Y/m/d',
    minDate:'-1970/01/02' // yesterday is minimum date
    
});
$('#eventlist_datetimepicker').datetimepicker({
    formatDate: 'd.m.Y',
    inline: true,
    timepicker: false,
    minDate:'-1970/01/02',
    //defaultDate: '+10.09.2017',
   defaultDate: '+03.01.1970', // it's my birthday 
   timepickerScrollbar: false
});