/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	// "instructions/instruct-2.html",
	// "instructions/instruct-3.html",
	// "instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	// "instructions/instruct-2.html",
	// "instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var StroopExperiment = function() {

	var wordon, // time word is presented
	    listening = false;

	// Stimuli for a basic Stroop experiment

	var filenames = [
		'cardio01_loop2_6', 
		'cardio01_loop2_10', 
		'cardio01_loop2_4', 
		'cardio01_loop3_4', 
		'cardio01_loop4_5', 
		'cardio01_loop5_0', 
		'cardio01_loop5_2', 
		'cardio00_loop10_0', 
		'cardio00_loop2_17', 
		'cardio00_loop2_4', 
		'cardio00_loop3_0', 
		'cardio00_loop4_1', 
		'cardio00_loop4_20', 
		'cardio00_loop4_5', 
		'cardio00_loop2_1', 
		'cardio00_loop2_23', 
		'cardio00_loop2_5', 
		'cardio00_loop3_4', 
		'cardio00_loop4_13', 
		'cardio00_loop4_24', 
		];


	// var choice_fixs = ['_mp', '_sc'];
	var choices = [];
	var stims = [];
	for (let filename of filenames) {
		var choice_fixs = ['_vil', '_loop', '_his'];
		let choice = [];
		// let stim_name = filename + stim_fix + '.gif';
		stims.push(filename + '_gt.mp4');
		for (let choice_fix of choice_fixs){
			let choice_name = filename + choice_fix + '.mp4';
			choice.push(choice_name);
		}
		choices.push(choice);
	}
	choices = choices.map(_.shuffle);
	var stims_n_choices = _.zip(stims, choices);
	stims_n_choices = _.shuffle(stims_n_choices);

    const stim_path = "/static/experiments/mturk_vidoes/";
	const gotcha_path = "/static/experiments/";

    var stim, choice;
    var count = 0;
	var next = function() {
		if (stims_n_choices.length===0) {
			finish();
        }
        if (count===10 || count===20 || count===30) {
            document.getElementById('next').style.visibility = 'hidden';
			
            if (count===10) {
                stim = 'gotcha1';
                choice = ['gotcha_good.mp4', 'gotcha_bad.mp4', 'gotcha_bad.mp4'];
            } else if (count===20){
                stim = 'gotcha2';
                choice = ['gotcha_bad.mp4', 'gotcha_good.mp4', 'gotcha_bad.mp4'];
			} else {
                stim = 'gotcha3';
                choice = ['gotcha_bad.mp4', 'gotcha_bad.mp4', 'gotcha_good.mp4'];
			}
	
			show_gotcha_stim(stim);
            show_gotchas(choice[0], choice[1], choice[2]);
            d3.select('#prompts1').html('<h4 id="prompt1">Click on video that looks more similar to the video at top. Then click "Next" to proceed.</h4>');
            
            wordon = new Date().getTime();
            listening = true;
            count += 1;
            
            setTimeout(function(){
                // $('button').show();
                $('dummy').show();
                document.getElementById('next').style.visibility = 'visible';
                // document.addEventListener('keydown', response_handler, true);
            }, 8000);
        }
        else if (count===43){
            finish();
        }
		else {
            // $('button').hide();
            // $('dummy').hide();
            document.getElementById('next').style.visibility = 'hidden';
            // d3.select('#next').hide()
			let stim_n_choice = stims_n_choices.shift();
			stim = stim_n_choice[0];
			choice = stim_n_choice[1];
			show_stim(stim);
            show_choices(choice[0], choice[1], choice[2]);
            d3.select('#prompts1').html('<h4 id="prompt1">Click on video that looks more similar to the video at top. Then click "Next" to proceed.</h4>');
            
            wordon = new Date().getTime();
            listening = true;
            count += 1;
            
            setTimeout(function(){
                // $('button').show();
                $('dummy').show();
                document.getElementById('next').style.visibility = 'visible';
                // document.addEventListener('keydown', response_handler, true);
            },8000);
		}
	};
	
	var finish = function() {
	    // $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};

	var show_gotcha_stim = function(filename) {
		d3.select("#stim")
			.append("video")
			.attr('autoplay', '')
			.attr('loop', '')
			.attr('src', gotcha_path + 'gotcha_gt.mp4')
			.attr('width', '500')
			.attr("id", "stim_img");
		$('#stim_img').ready(function(){}); // wait until image loaded
	};

	var show_stim = function(filename) {
		let tr_f = filename;
		tr_f = tr_f.substring(0, tr_f.length - 2);
		d3.select("#stim")
			.append("video")
			.attr('autoplay', '')
			.attr('loop', '')
			.attr('src', stim_path + tr_f)
			.attr('width', '500')
			.attr("id", "stim_img");
		$('#stim_img').ready(function(){}); // wait until image loaded
	};

	var show_gotchas = function(filename_1, filename_2, filename_3) {
		d3.select("#choice1")
            .append("video")
			.attr('autoplay', '')
			.attr('loop', '')
			.attr('src', gotcha_path + filename_1)
			.attr('width', '500')
			.attr('class', 'option-img')
            .attr("id", "img1");
		d3.select("#choice2")
			.append("video")
			.attr('autoplay', '')
			.attr('loop', '')
			.attr('src', gotcha_path + filename_2)
			.attr('width', '500')
			.attr('class', 'option-img')
            .attr("id", "img2");
		d3.select("#choice3")
			.append("video")
			.attr('autoplay', '')
			.attr('loop', '')
			.attr('src', gotcha_path + filename_3)
			.attr('width', '500')
			.attr('class', 'option-img')
			.attr("id", "img3");
        
	};

	var show_choices = function(filename_1, filename_2, filename_3) {
		d3.select("#choice1")
            .append("video")
			.attr('autoplay', '')
			.attr('loop', '')
			.attr('src', stim_path + filename_1)
			.attr('width', '500')
			.attr('class', 'option-img')
            .attr("id", "img1");
		d3.select("#choice2")
			.append("video")
			.attr('autoplay', '')
			.attr('loop', '')
			.attr('src', stim_path + filename_2)
			.attr('width', '500')
			.attr('class', 'option-img')
            .attr("id", "img2");
		
		d3.select("#choice3")
			.append("video")
			.attr('autoplay', '')
			.attr('loop', '')
			.attr('src', stim_path + filename_3)
			.attr('width', '500')
			.attr('class', 'option-img')
            .attr("id", "img3");
	};

	var remove_stim = function() {
		d3.select("#stim_img").remove();
	};

    var color_count1 = 0;
    var color_count2 = 0;
    var color_count3 = 0;

    function setColor(btn, cc) {
        var property = document.getElementById(btn);
        if (cc == 0) {
            property.style.backgroundColor = "#FFFFFF"
            cc = 1;        
        }
        else {
            property.style.backgroundColor = "#7FFF00"
            cc = 0;
        }
        return cc;
    }

	var remove_choices = function() {
		d3.select("#img1").remove();
        d3.select("#img2").remove();
        d3.select("#img3").remove();
        color_count1 = setColor('choice1', 0);
        color_count2 = setColor('choice2', 0);
        color_count3 = setColor('choice3', 0);
	};

	var remove_prompts = function() {
		d3.select("#prompt1").remove();
		// d3.select("#prompt2").remove();
		// d3.select("#prompt3").remove();
	};

	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	// $("body").focus().keydown(response_handler);
	var choice_num = -1;
	$('#choice1').click(function(){
        choice_num=0;
        setColor("choice1", 1); setColor("choice2", 0); setColor("choice3", 0);
    });
	$('#choice2').click(function(){
        choice_num=1;
        setColor("choice1", 0); setColor("choice2", 1); setColor("choice3", 0);
    });
	$('#choice3').click(function(){
        choice_num=2;
        setColor("choice1", 0); setColor("choice2", 0); setColor("choice3", 1);
    });
	// $('#choice3').click(function(){choice_num=2;});
	$('#next').click(function(){
		if (choice_num !== -1){
			let chosen = choice[choice_num];
			let rt = new Date().getTime() - wordon;
			psiTurk.recordUnstructuredData(stim, chosen);
			psiTurk.recordUnstructuredData('time_'+stim, rt);
			choice_num = -1;
			remove_stim();
			remove_choices();
			remove_prompts();
			next();
		}
		else{
			alert('Please choose an option!');
		}
	});

	// Start the test
	next();
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});
