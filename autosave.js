(function ($) {

var showingRestoreCommand;

Drupal.behaviors.autosave = {

  attach: function (context, settings) {
    var autosaveSettings;

    $('body').append('<div id="autosave-status"><span id="status"></span></div>');

    autosaveSettings = settings.autosave;
    console.debug(autosaveSettings);

    $('#' + autosaveSettings.formid).autosave({
      interval: autosaveSettings.period * 1000, // Time in ms
      url: autosaveSettings.url,
      setup: function (e, o) {
        var ignoreLink, restoreLink;

        console.debug('jquery.autosave setup');

        // If there is a saved form for this user, let him know so he can reload it
        // if desired.
        if (autosaveSettings.savedTimestamp) {
          showingRestoreCommand = true;

          ignoreLink = $('<a>').attr('href', '#').attr('title', 'Ignore/Delete saved form').html(Drupal.t('Ignore')).click(function (e) {
            Drupal.behaviors.autosave.hideMessage();
            return false;
          });
          restoreLink = $('<a>').attr('href', '#').attr('title', 'Restore saved form').html(Drupal.t('Restore')).click(function (e) {
            console.log('Do restore stuff here.');
            var callbackPath = Drupal.settings.basePath + 'autosave/restore/' + autosaveSettings.formid + '/' + autosaveSettings.savedTimestamp;

            // AHAH request the form from Drupal, which will be rebuilt.  After
            // the load() completes, though, we need to reattach any Javascript
            // for the form.
            $('#' + autosaveSettings.formid).load(callbackPath, null, function () {
              Drupal.attachBehaviors($('#' + autosaveSettings.formid));
            });

            return false;

            // We should be able to just AHAH return drupal_render(drupal_build_form($form_id, array('input' => $our_saved_post)));
            // Try this tomorrow. :-)
          });

          Drupal.behaviors.autosave.displayMessage(Drupal.t('This form was autosaved on ' + autosaveSettings.savedDate), {
            // Show the message for 30 seconds, or hide it when the user starts
            // editing the form.
            timeout: 30000,
            extra: $('<span id="operations">').append(ignoreLink).append(' - ').append(restoreLink)
          });
        }
      },
      save: function (e, o) {
        console.debug('jquery.autosave saving');
        Drupal.behaviors.autosave.displayMessage(Drupal.t('Form autosaved.'));
      },
      dirty: function (e, o) {
        if (showingRestoreCommand) {
          Drupal.behaviors.autosave.hideMessage();
        }
      }
    });

    /*
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
    */
  },

  saveForm: function() {
    /*
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
    */
  },

  attachAutosave: function() {
    /*
    autosaved = Drupal.settings.autosave;
    setTimeout('Drupal.behaviors.autosave.saveForm()', autosaved.period * 1000);
    */
  },

  hideMessage: function() {
    $('#autosave-status').fadeOut('slow');
  },

  displayMessage: function(message, settings) {
    settings = settings || {};
    settings.timeout = settings.timeout || 3000;
    settings.extra = settings.extra || '';
    //settings = $.extend({}, {timeout: 3000, extra: ''}, settings);
    var status = $('#autosave-status');
    status.empty().append('<span id="status">' + message + '</span>');
    if (settings.extra) {
      status.append(settings.extra);
    }
    $('#autosave-status').slideDown();
    console.debug(settings.timeout);
    setTimeout(Drupal.behaviors.autosave.hideMessage, settings.timeout);
  }
}

})(jQuery);

