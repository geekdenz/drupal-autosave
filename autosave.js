// $Id$

var changed = false;

$(function() {
  $('form#node-form').before('<div id="autosave_status">status</div>');
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


function autosave(url, period) {
  if (changed == true) {
    var options = {
      target: '#autosave_status',
      url: url,
      after: function() {
        $('#autosave_status').css('visibility', 'visible');
        changed = false;
      }
    };
    $('form[@id=node-form]').ajaxSubmit(options);
  }
  setTimeout('autosave("' + url + '", ' + period + ')', period);
}