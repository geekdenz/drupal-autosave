(function ($) {

var showingRestoreCommand;

Drupal.behaviors.autosave = {

  attach: function (context, settings) {
    var autosaveSettings;

    // Add a div for us to put messages in.
    $('body').append('<div id="autosave-status"><span id="status"></span></div>');

    autosaveSettings = settings.autosave;

    $('#' + autosaveSettings.formid).autosave({
      interval: autosaveSettings.period * 1000, // Time in ms
      url: autosaveSettings.url,
      setup: function (e, o) {
        var ignoreLink, restoreLink;

        // If there is a saved form for this user, let him know so he can reload it
        // if desired.
        if (autosaveSettings.savedTimestamp) {
          showingRestoreCommand = true;

          ignoreLink = $('<a>').attr('href', '#').attr('title', 'Ignore/Delete saved form').html(Drupal.t('Ignore')).click(function (e) {
            Drupal.behaviors.autosave.hideMessage();
            return false;
          });
          restoreLink = $('<a>').attr('href', '#').attr('title', 'Restore saved form').html(Drupal.t('Restore')).click(function (e) {
            var callbackPath = Drupal.settings.basePath + 'autosave/restore/' + autosaveSettings.formid + '/' + autosaveSettings.savedTimestamp;

            // AHAH request the form from Drupal, which will be rebuilt.  After
            // the load() completes, though, we need to reattach any Javascript
            // for the form.
            $('#' + autosaveSettings.formid).load(callbackPath, null, function () {
              Drupal.attachBehaviors($('#' + autosaveSettings.formid));
              // I am unclear why this seems to have no effect.
              Drupal.behaviors.autosave.hideMessage();
            });

            return false;
          });

          Drupal.behaviors.autosave.displayMessage(Drupal.t('This form was autosaved on ' + autosaveSettings.savedDate), {
            // Show the message for 30 seconds, or hide it when the user starts
            // editing the form.
            timeout: 30000,
            extra: $('<span id="operations">').append(ignoreLink).append(' - ').append(restoreLink)
          });
        }

        // Wire up TinyMCE to autosave.
        if (tinymce) {
          setInterval(function() {
            // Save text data from the tinymce area back to the original form element.
            // Once it's in the original form element, autosave will notice it
            // and do what it needs to do.
            // Note: There seems to be a bug where after a form is restored,
            // everything works fine but tinyMCE keeps reporting an undefined
            // error internally.  As its code is compressed I have absolutely no
            // way to debug this.  If you can figure it out, please file a patch.
            tinymce.triggerSave();
          }, autosaveSettings.period * 1000);
        }

      },
      save: function (e, o) {
        Drupal.behaviors.autosave.displayMessage(Drupal.t('Form autosaved.'));
      },
      dirty: function (e, o) {
        if (showingRestoreCommand) {
          Drupal.behaviors.autosave.hideMessage();
        }
      }
    });
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
    setTimeout(Drupal.behaviors.autosave.hideMessage, settings.timeout);
  }
}

})(jQuery);
