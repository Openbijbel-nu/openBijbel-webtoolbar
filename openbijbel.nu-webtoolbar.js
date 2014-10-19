/**
 * This code is used to create an toolbar for debijbel.nl
 */

 //global reftagger settings (default settings)
 var refTagger = {
		settings: {
			bibleReader: "bible.faithlife",
			bibleVersion: "NIV"			
		}
	};

// using anonymous self executing function to protect the functions in their own scope
// see: http://markdalgleish.com/2011/03/self-executing-anonymous-functions/
 (function (window, document, $, undefined) {

 	/**
 	 * For including scripts
 	 */
 	 function require(scriptUrl, optionalClassName, onLoadFunction) {
 	 	var s = document.createElement('script');

 	 	s.type = 'text/javascript';
 	 	s.src = scriptUrl;

 	 	if (typeof(optionalClassName) != 'undefined')
 	 		s.className = optionalClassName;

 	 	if (typeof(onLoadFunction) != 'undefined') {
 	 		s.onreadystatechange = onLoadFunction;
 	 		s.onload = onLoadFunction;
 	 	}

 	 	document.getElementsByTagName('head')[0].appendChild(s);

 	 }

 	 var refTaggerLoaded = false;

 	 /**
 	  * Loads the refTagger script with a protocol independant URL
 	  */
 	 function loadRefTagger(onLoadFunction) {
 	 	if (refTaggerLoaded) {
 	 		if (typeof(onLoadFunction) == 'function')
 	 			onLoadFunction();

 	 		return;
 	 	}

 	 	require('//api.reftagger.com/v2/RefTagger.js', 'openbijbelreftaggerscript', function () {
 	 		refTaggerLoaded = true;
 	 		
 	 		if (typeof(onLoadFunction) == 'function')
 	 			onLoadFunction();
 	 	});
 	 }

 	 /**
 	  * Loads the bible translation. By default it's NIV.
 	  */
 	function chooseTranslation(translation) {
 		if (typeof(translation) == 'undefined') {
 			translation = 'NIV';
 		}

 		// set the already existing global variable with new options (so no var before this variable)
 		if (!refTaggerLoaded)
	 		refTagger = {
				settings: {
					bibleReader: "bible.faithlife",
					bibleVersion: translation		
				}
			};

		loadRefTagger(function () {
			$(".rtBibleRef").each(function(){
				$(this).attr("data-version", translation.toLowerCase());
			});

			openBijbelToolBar.find(".openbijbelvertaling").html("[[|]] &nbsp; " + translation + " ");
			openBijbelToolBar.find('.vertalingkeus').css("text-decoration","none");
			openBijbelToolBar.find('.vertalingkeus[data-translation="' + translation + '"]').css("text-decoration","underline");
		
			$('.openbijbelvertaling').text(openBijbelToolBar.find(".openbijbelvertaling").text());
		});
 	}

 	/**
 	 * Shows references instead of verse numbers
 	 */
 	function showReferences() {
		// find way to parse Dutch Biblebook names
 	}

 	// This variable will be used to attach a jQuery reference to the Open Bijbel top bar. 
 	// So we can use it in multiple functions.
 	var openBijbelToolBar = undefined;

 	/**
 	 *	Build the top bar
 	 */
 	function setupTopBar() {
 		// add the basics to the stickynotes top bar
 		$("body").prepend("<div class='openbijbeltoolbar'></div>");

 		openBijbelToolBar = $(".openbijbeltoolbar");

 		// build the basic content of the toolbar
 		var toolbarContent = 
			'<div class="openbijbelvertalingnaam openbijbelvertaling">[[|]] &nbsp; NIV</div>'
			+ '<div class="openbijbelknoppenarea">'
				+ '<span class="openbijbelknoptoelichting">Andere vertaling: </span>'
				+ '<span class="openbijbelknop vertalingkeus NIV" data-translation="NIV">NIV </span>'
				+ '<span class="openbijbelknop vertalingkeus ESV" data-translation="ESV">ESV </span>'
				+ '<span class="openbijbelknop vertalingkeus KJV" data-translation="KJV">KJV </span>'
				+ '<span class="openbijbelknop vertalingkeus NKJV" data-translation="NKJV">NKJV </span>'
				+ '<span class="openbijbelknop vertalingkeus NLT" data-translation="NLT">NLT </span>'
			+ '</div>';

 		openBijbelToolBar.append(toolbarContent);

		openBijbelToolBar.find(".openbijbelknoppenarea").append(' <span class="openbijbelknop kiesReset">(Reset)</span> ');


 		// set styling
 		openBijbelToolBar.css({
			"left":"0px",
			"right":"0px",
			"background-color": "#3352BC",
			"height": "35px",
			"padding":"10px",
			"color": "white",
			"margin-bottom":"5px"
		});

 		openBijbelToolBar.find(".openbijbelvertalingnaam").css({
			"font-weight":"bold",
			"float":"left",
			"color": "white"
		});

		openBijbelToolBar.find(".openbijbelknoppenarea").css({
			"color": "white",
			"float":"right"
		});

		openBijbelToolBar.find(".openbijbelknop").css({
			"color": "#A3A9BC",
			"cursor":"pointer"
		});

		openBijbelToolBar.find(".openbijbelknoptoelichting").css({
			"font-style": "italic"
		});

		openBijbelToolBar.find(".kiesReset").css({
			"color": "#646E8F",
			"cursor":"move"
		});
 	}

 	/**
 	 * Bind the events
 	 */
 	function bindEvents() {

 		openBijbelToolBar.on('click', '.vertalingkeus', function (e) {
 			e.preventDefault();

 			var translation = $(this).data('translation');

 			chooseTranslation(translation);
 		});

 		openBijbelToolBar.on('click', '.kiesReset', function() {
 			showReferences();

 			// choose default translation
 			chooseTranslation("NIV");
		});

 	}

 	/**
 	 * This function gets executed after all is loaded. This gives a main entrypoint for the code
 	 */
 	function main() {
 		showReferences();
 		setupTopBar();

 		// choose default translation
 		chooseTranslation("NIV");

 		bindEvents();
 	}

 	// execute the main function
 	main();
 })(window, document, jQuery);
