var gtmPreviewCopyToolOptions = {};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

var myLog = function(text) {
    console.log("GTM-Preview-Copy-Tool: " + text);
}

var flattenObject = function(ob) {
	var toReturn = {};
	
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

var textIntoObject = function(text) {
    // Remove dot notations (gtm only) so that eval can work.
    result = text.replace(/\s(gtm\..*?):/g, " '$1':");
    result = result.replace(/{(gtm\..*?):/g, "{'$1':");

    // Also wrap [object HTMLDivElement] in quotes.
    result = result.replace("[object HTMLDivElement],","'[object HTMLDivElement]',");

    // Remove line breaks
    result = result.replace(/(\r\n\t|\n|\r\t)/gm,"");

    // Make it into a JS object.
    result = eval("(" + result + ")");

    return result;
}

var readyForExcel = function(data) {
    var result = "";
    for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
    
        var obj = data[key];

        result += (key + "\t" + obj + "\n");
    }

    // Removes that extra newline.
    result = result.trim()

    return result;
}

chrome.storage.sync.get(null,function(items) {
    if (items.hasOwnProperty('copyType')) {
        gtmPreviewCopyToolOptions['copyType'] = items['copyType'];
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    gtmPreviewCopyToolOptions['copyType'] = request.copyType;
});

$(document).arrive("iframe[style*=\'2147483647\']", function() {

    var myFrame = $('iframe[style*=\'2147483647\']');
   
    myFrame.on("load", function() {

        myLog("Loaded Successfully");
        
        var iFrameDOM = myFrame.contents();

        buttonCSS = "<style type='text/css'> .gtm-copy-btn{cursor:pointer;float:right;font-size:18px;color:#d7d7d7;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.gtm-copy-btn:hover{color:#a7a7a7}.gtm-copy-btn:active{font-size:17px;color:#777!important} </style>";
        $(iFrameDOM).find('head').append(buttonCSS);

        iFrameDOM.on('click', '.gtm-copy-btn', function() {
            
            var result = "";

            // Get the data layer code lines of the clicked card.
            var lines = $(this).parents('.gtm-debug-card').find('.CodeMirror-code')[0].getElementsByClassName("CodeMirror-line");

            // Get text
            for (var i = 0; i < lines.length - 1; i++) {
                result += lines[i].textContent.trim() + "\n";
            }
            result += lines[lines.length - 1].textContent;

            switch(gtmPreviewCopyToolOptions['copyType']) {                
                case "gtm_copyType_json":
                    result = textIntoObject(result);
                    result = JSON.stringify(result);
                    break;
                case "gtm_copyType_dl":
                    result = textIntoObject(result);
                    result = JSON.stringify(result);
                    result = result.replaceAll('"', "'");
                    result = "dataLayer.push(" + result + ");";
                    break;
                case "gtm_copyType_excel":
                    result = textIntoObject(result);
                    result = flattenObject(result);                    
                    result = readyForExcel(result);
                    break;
                case "gtm_copyType_text":                  
                default:
                    result = "";
                    for (var i = 0; i < lines.length - 1; i++) {
                        result += lines[i].textContent + "\n";
                    }
                    result += lines[lines.length - 1].textContent;
                    break;
            }

            copyToClipboard(result);
        });

        iFrameDOM.find('.gtm-debug-data-layer-content-container').on({
            mouseenter: function () {
                // Show Buttons
                $buttons = $(this).find('.gtm-copy-btn');
                if($buttons.length == 1) {
                    $buttons.show();
                } else{

                    var copyButton = $('<div></div>', {
                        class: 'gtm-copy-btn',
                        text: '\uD83D\uDCCB'
                    });

                    $(this).find('.gtm-debug-card__title').append(copyButton); 
                }
            },
            mouseleave: function () {
                // Hide Buttons
                $(this).find('.gtm-copy-btn').hide();
            }
        }, '.gtm-debug-card');    

    });        
});