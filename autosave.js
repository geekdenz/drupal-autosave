var autosaved_form;

(function ($) { 

Drupal.behaviors.autosave = {   
  
  attach: function (context, settings) { 
    $('body').append('<div id="autosave-status"><span id="status"></span><span id="operations"> \
    <span id="view"><a href="#">' + Drupal.t("View") + '</a></span> \
    <span id="ignore"><a href="#" title="' + Drupal.t("Ignore/Delete Saved Form") + '">' + Drupal.t("Ignore") + '</a></span> \
    <span id="keep"><a href="#" title="' + Drupal.t("Keep Saved Form - Revert to Saved") + '">' + Drupal.t("Keep") + '</a></span></span></div>');
    
    autosaved = Drupal.settings.autosave;   
    autosaved_form_id = autosaved.formid;
    
    if (autosaved.serialized) {
      $('#autosave-status #keep').css('display', 'none').css('visibility', 'hidden');
      $('#autosave-status #view a').click(function() {
        if ($(this).html() == 'View') {
          $('#' + autosaved_form_id).formHash(autosaved.serialized);
          if (autosaved.wysiwyg && Drupal.wysiwyg) {
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
              CKEDITOR.instances[instance].setData('');
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
            CKEDITOR.instances[instance].setData('');
          }
        }
        
        $('#autosave-status #operations').css('display', 'none').css('visibility', 'hidden');
        Drupal.behaviors.autosave.attachAutosave();
        return false;
      });
      $('#autosave-status #keep a').click(function() {
        $('#autosave-status').fadeOut('slow');
        form = document.getElementById(autosaved_form_id);
        $('#autosave-status #operations').css('display', 'none').css('visibility', 'hidden');
        Drupal.behaviors.autosave.attachAutosave();
        return false;
      });
      $('#autosave-status #status').html('This form was autosaved on ' + autosaved.saved_date);
      $('#autosave-status').slideDown();
    }
    // There are no autosaved forms, continue with autosave.
    else {
      Drupal.behaviors.autosave.attachAutosave();
    }
  },
  
  saveForm: function() {
    autosaved = Drupal.settings.autosave;
    if (autosaved.wysiwyg && Drupal.wysiwyg) {
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
  
    var serialized = $('#' + autosaved.formid).formHash();
    $.ajax({
      //url: settings.basePath + "autosave/handler",   
      url: autosaved.url, 
      type: "POST",
      dataType: "xml/html/script/json",
      data: ({
        form_id: autosaved.formid, 
        q: autosaved.q,
        serialized: serialized
      }),
      complete: function(XMLHttpRequest, textStatus) {
        if (!autosaved.hidden) Drupal.behaviors.autosave.displaySaved();
        Drupal.behaviors.autosave.attachAutosave();
      }
    });
  },   

  attachAutosave: function() {
    autosaved = Drupal.settings.autosave;
    setTimeout('Drupal.behaviors.autosave.saveForm()', autosaved.period * 1000);
  },

  displaySaved: function() {
    $('#autosave-status #status').html('Form autosaved.');
    $('#autosave-status #operations').css('display', 'none').css('visibility', 'hidden');
    $('#autosave-status').slideDown();
    setTimeout("Drupal.behaviors.autosave.fadeout();", 3000);  
  },
  
  fadeout: function() {   
    $('#autosave-status').fadeOut('slow');
  }
}

})(jQuery);

