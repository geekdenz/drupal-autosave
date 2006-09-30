// $Id$

var changed = false;

$(function() {
  $('h1.title').after('<div id="autosave_status">status</div>');
  $('#autosave_status').css('visibility', 'hidden');
  
  $('input[@type=text]').keyup(function(e) {
    var key = window.event ? e.keyCode : e.which;
  	var keychar = String.fromCharCode(key);
  	reg = /[\w]/;
    if (reg.test(keychar)) {
      changed = true;
    }
  });
  $('textarea').keyup(function(e) {
    var key = window.event ? e.keyCode : e.which;
  	var keychar = String.fromCharCode(key);
  	reg = /[\w]/;
    if (reg.test(keychar)) {
      changed = true;
    }
  });
  $('input[@type=radio]').change(function() {
    changed = true;
  });
  $('input[@type=checkbox]').click(function() {
    changed = true;
  });
  $('select').change(function() {
    changed = true;
  });
});


function autosave(action, period) {
  if (changed == true) {
    $('form[@id=node-form]').ajaxSubmit('#autosave_status', after, null, action);
  }
  setTimeout('autosave("' + action + '", ' + period + ')', period);
}

function after() {
  $('#autosave_status').css('visibility', 'visible');
  changed = false;
}