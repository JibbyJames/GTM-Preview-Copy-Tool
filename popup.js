var loadSettings = function() {
    var gtmPreviewCopyToolOptions = {}
    try {
        if (localStorage.gtmPreviewCopyToolOptions) {
              gtmPreviewCopyToolOptions = JSON.parse(localStorage.gtmPreviewCopyToolOptions);
        }
    } catch(error) {
        console.log(error);
    }

    // Set copy option.
    if(gtmPreviewCopyToolOptions && gtmPreviewCopyToolOptions.copyType) {
        document.getElementById(gtmPreviewCopyToolOptions.copyType).checked = true;
    } else {
        document.getElementById("gtm_copyType_text").checked = true;
    }
}

var saveSettings = function() {
    var gtmPreviewCopyToolOptions = {};

    // Get copy type
    var radios = document.getElementsByName('gtm_copyType');    
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            gtmPreviewCopyToolOptions['copyType'] = radios[i].value;    
            break;
        }
    }

    try{
        localStorage['gtmPreviewCopyToolOptions'] = JSON.stringify(gtmPreviewCopyToolOptions);
      }
      catch(error){
        console.log(error);
    }

    chrome.storage.sync.set(gtmPreviewCopyToolOptions);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, gtmPreviewCopyToolOptions, function(response) {});
    });
}

loadSettings();

$('input[type=radio][name=gtm_copyType]').change(function() {
    saveSettings();
});