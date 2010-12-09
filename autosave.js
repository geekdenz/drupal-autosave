var autosaved_form;

if (Drupal.jsEnabled) {
  $(document).ready(function() {
    $('body').append('<div id="autosave-status"><span id="status"></span><span id="operations"> \
    <span id="view"><a href="#">View</a></span> \
    <span id="ignore"><a href="#" title="Ignore/Delete Saved Form">Ignore</a></span> \
    <span id="keep"><a href="#" title="Keep Saved Form - Revert to Saved">Keep</a></span></span></div>');
    autosaved = Drupal.settings.autosave;   
    autosaved_form_id = 'node-form';
    
    if (autosaved.serialized) {
      $('#autosave-status #keep').css('display', 'none').css('visibility', 'hidden');
      $('#autosave-status #view a').click(function() {
        if ($(this).html() == 'View') {
          $('#' + autosaved_form_id).formHash(autosaved.serialized);
          if (Drupal.settings.autosave.wysiwyg && Drupal.wysiwyg) {
            // need to loop through any WYSIWYG editor fields and update the visible iframe fields with hidden field content
            for (var instance in Drupal.wysiwyg.instances) {
              Drupal.wysiwyg.instances[instance].setContent($('#' + instance).val());
            }
          }
          
          //CKEditor support
          if (typeof(CKEDITOR) != 'undefined' ) {
            for (var instance in CKEDITOR.instances) {
              CKEDITOR.instances[instance].setData($('#' + instance).val());
            }
          }
          
          $('#' + autosaved_form_id).focus();
          $(this).html('Reset');
          $('#autosave-status #keep').css('display', 'inline').css('visibility', 'visible');
          $('#autosave-status #keep a').html('Keep'); 
        }
        else if ($(this).html() == 'Reset') {
          form = document.getElementById(autosaved_form_id);
          form.reset();

          //CKEditor support
          if (typeof(CKEDITOR) != 'undefined' ) {
            for (var instance in CKEDITOR.instances) {
              CKEDITOR.instances[instance].setData($('#' + instance).val());
            }
          }
          
          $('#autosave-status #keep').css('display', 'none').css('visibility', 'hidden');
          $(this).html('View');
        }    
        return false;
      });
      $('#autosave-status #ignore a').click(function() {
        $('#autosave-status').fadeOut('slow');
        form = document.getElementById(autosaved_form_id);
        form.reset();

        //CKEditor support
        if (typeof(CKEDITOR) != 'undefined' ) {
          for (var instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].setData($('#' + instance).val());
          }
        }
        
        $('#autosave-status #operations').css('display', 'none').css('visibility', 'hidden');
        Drupal.attachAutosave();
        return false;
      });
      $('#autosave-status #keep a').click(function() {
        $('#autosave-status').fadeOut('slow');
        form = document.getElementById(autosaved_form_id);
        $('#autosave-status #operations').css('display', 'none').css('visibility', 'hidden');
        Drupal.attachAutosave();
        return false;
      });
      $('#autosave-status #status').html('This form was autosaved on ' + autosaved.saved_date);
      $('#autosave-status').slideDown();
    }
    // There are no autosaved forms, continue with autosave.
    else {
      Drupal.attachAutosave();
    }
  });
} 

Drupal.saveForm = function() {
  if (Drupal.settings.autosave.wysiwyg && Drupal.wysiwyg) {
    // need to loop through any WYSIWYG editor fields and update the real (hidden) text fields before saving
    for (var instance in Drupal.wysiwyg.instances) {
      if (Drupal.wysiwyg.instances[instance].editor != 'none') {
        var content = Drupal.wysiwyg.instances[instance].getContent();
        $('#' + instance).val(content);
      }
    }
  }
  
  //CKEditor support
  if (typeof(CKEDITOR) != 'undefined') {
    for (var instance in CKEDITOR.instances) {
      CKEDITOR.instances[instance].updateElement();
    }
  }
  
  var serialized = $('#node-form').formHash();
  serialized['q'] =  Drupal.settings.autosave.q;
  $.ajax({
    url: Drupal.settings.basePath + "autosave/handler",
    type: "POST",
    dataType: "xml/html/script/json",
    data: serialized,
    complete: function(XMLHttpRequest, textStatus) {
      if (!Drupal.settings.autosave.hidden) Drupal.displaySaved();
      Drupal.attachAutosave();
    }
  });
}   

Drupal.attachAutosave = function() {
  setTimeout('Drupal.saveForm()', Drupal.settings.autosave.period * 1000);
}

Drupal.displaySaved = function() {
  $('#autosave-status #status').html('Form autosaved.');
  $('#autosave-status #operations').css('display', 'none').css('visibility', 'hidden');
  $('#autosave-status').slideDown();
  setTimeout("$('#autosave-status').fadeOut('slow')", 3000);  
}

