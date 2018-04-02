function get_section_errors(section_id){
	var errors = new Array();

	if(section_id == "information"){
		var first_name = $("#cc_first_name").val();
		var last_name = $("#cc_last_name").val();
		var company = $("#cc_company").val();
		var email = $("#cc_email").val();
		var phone = $("#cc_phone").val();
		var phone_regex = /^(\d[\s-]?)?[\(\[\s-]{0,2}?\d{3}[\)\]\s-]{0,2}?\d{3}[\s-]?\d{4}$/i;
		var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(first_name.length == 0){
			errors.push('Please enter your first name.');
		}
		if(last_name.length == 0){
			errors.push('Please enter your last name.');
		}
		if(company.length == 0){
			errors.push('Please enter your company.');	
		}
		if(email.length == 0){
			errors.push('Please enter your email address.');
		}
		if(phone.length == 0){
			errors.push('Please enter your phone number.');
		}

		if(!email_regex.test(email)){
			errors.push('Please enter a valid email address.');
		}
		if(!phone_regex.test(phone)){
			errors.push('Please enter a valid phone number.');
		}
	}
	else if(section_id == "cabinet_space"){
		var total_u = parseInt($('select#cc_lt_10u').val(), 10) + (parseInt($('select#cc_10u').val(),10) * 10) + (parseInt($('select#cc_20u').val(), 10) * 20) + (parseInt($('select#cc_40u').val(), 10) * 40);
		if(total_u == 0){
			errors.push('Please select some cabinet space.');
		}
	}

	else if(section_id == "power"){
		if($('.colo_calc_cabinet_voltage select option:selected[value=0]').length > 0 || $(".colo_calc_cabinet_result input[type=hidden][value='']").length > 0){
			errors.push('Please make sure each cabinet has both Voltage and Amps selected.');
		}
	}

	else if(section_id == "connectivity"){
		if($("select#cc_public_ips option:selected[value='*']").length > 0 || $("input#bandwidth_mbps[type=hidden][value='']").length > 0){
			errors.push('Please select the desired Bandwidth (Mbps) and number of Public IP Addresses.');
		}
	}

	else if(section_id == "extras"){
		var cabinet_shelves = $('input#cc_cabinet_shelves').val();

		if(!$.isNumeric(cabinet_shelves) || Math.floor(cabinet_shelves) != cabinet_shelves || cabinet_shelves < 0 ){
			errors.push('Please enter a numeric value greater than or equal to 0 for Cabinet Shelves.');	
		}
	}

	errors.reverse();

	return errors;
}

function clear_status_classes(item){
	item.removeClass('active in_progress incomplete complete unavailable');
}

$(document).ready(function() {

	$( ".colo_calc_section" ).on( "changeSection", function( event, to_section, action ) {
		var from_section = $(this);
		var errors = (action == 'next' ? get_section_errors(from_section.attr("id")) : "" );
		$(".colo_calc_errors", from_section).remove();

		if(errors.length == 0){

			if(from_section.attr("id") == 'cabinet_space' && action == 'next'){
				var total_u = parseInt($('select#cc_lt_10u').val(), 10) + (parseInt($('select#cc_10u').val(),10) * 10) + (parseInt($('select#cc_20u').val(), 10) * 20) + (parseInt($('select#cc_40u').val(), 10) * 40);
				total_cabinets = Math.ceil(total_u / 40);
				
				if(parseInt($('select#cc_40u').val(), 10) > 0){
					$('#cc_dedicated_firewall').html("<option value='dedicated'>Dedicated Firewall</option><option value='none'>No Firewall</option>");
					$('input#cc_cabinet_shelves').parent().show();

					$('dd#summary_cabinet_space').text("Full Rack " + (total_cabinets > 1 ? " x " + total_cabinets + " " : "") + "(" + total_u + "U)");
				}
				else{
					$('#cc_dedicated_firewall').html("<option value='dedicated'>Dedicated Firewall</option><option value='shared'>Shared Firewall</option><option value='none'>No Firewall</option>");
					$('input#cc_cabinet_shelves').parent().hide();

					if(parseInt($('select#cc_20u').val(), 10) > 0){
						$('dd#summary_cabinet_space').text("Half Rack (20U)");
					}
					else if(parseInt($('select#cc_10u').val(), 10) > 0){
						$('dd#summary_cabinet_space').text("Quarter Rack (10U)");
					}
					else if(parseInt($('select#cc_lt_10u').val(), 10) > 0){
						$('dd#summary_cabinet_space').text(total_u + "U");
					}
				}

				var cabinets_html = "";

				for(var i = 1; i <= total_cabinets; i++){
					cabinets_html += "	<div class='colo_calc_cabinet'>";
					cabinets_html += "		<h3>Cabinet " + i + "</h3>";
					cabinets_html += "		<div class='colo_calc_cabinet_fields'>";
					cabinets_html += "			<div class='colo_calc_cabinet_voltage'>";
					cabinets_html += "				<label for='cc_cab_" + i + "_voltage'>Voltage</label>";

					select_class = parseInt($('select#cc_40u').val(), 10) > 0 ? "full_cab" : "partial_cab";

					cabinets_html += "				<select id='cab_" + i + "_voltage' name='cc_cab_" + i + "_voltage' class='" + select_class + "' data-cabid='" + i + "'>";
					cabinets_html += "					<option value='0'>Please Select</option>";
					cabinets_html += "					<option value='120'>120</option>";

					if(parseInt($('select#cc_40u').val(), 10) > 0){
						cabinets_html += "					<option value='208'>208</option>";
					}

					cabinets_html += "				</select>";
					cabinets_html += "			</div>";

					if(parseInt($('select#cc_40u').val(), 10) > 0){

						cabinets_html += "			<div class='colo_calc_cabinet_power full' data-cabid='" + i + "'>";
						cabinets_html += "				<div data-val='16' class='colo_calc_cabinet_amps unavailable'>16 Amps</div>";
						cabinets_html += "				<div data-val='24' class='colo_calc_cabinet_amps unavailable'>24 Amps</div>";
						cabinets_html += "				<div data-val='32' class='colo_calc_cabinet_amps unavailable'>32 Amps</div>";
						cabinets_html += "				<input type='hidden' id='cab_" + i + "_amps' name='cc_cab_" + i + "_amps' />";
						cabinets_html += "			</div>";

					}
					else{

						cabinets_html += "			<div class='colo_calc_cabinet_power partial'>";
						cabinets_html += "				<label>Power</label>";
						cabinets_html += "				<div class='power_slider' id='cab_" + i + "'>Please select a voltage.</div>";
						cabinets_html += "			</div>";

						cabinets_html += "			<div class='colo_calc_cabinet_result'>";
						cabinets_html += "				<h3 id='cab_" + i + "_display_amps'></h3>";
						//cabinets_html += "				<p id='cab_" + i + "_price'>$XX.XX each</p>";
						cabinets_html += "				<input type='hidden' id='cab_" + i + "_amps' name='cc_cab_" + i + "_amps' />";
						cabinets_html += "			</div>";

					}

					cabinets_html += "		</div>";
					cabinets_html += "	</div>";
				}

				$('#colo_calc_cabinets_container').html(cabinets_html);
			}

			if(from_section.attr("id") == 'power' && action == 'next'){
				var total_amps = 0;

				$(".colo_calc_cabinet input[type=hidden]").each(function(){
					total_amps += parseInt($(this).val(), 10);
				});

				$('dd#summary_power').text(total_amps + " Amps");
			}

			if(from_section.attr("id") == 'connectivity' && action == 'next'){
				var total_amps = 0;
				
				$(".colo_calc_cabinet_result input[type=hidden]").each(function(){
					total_amps += parseInt($(this).val(), 10);
				});

				$('dd#summary_bandwidth').text($('input#bandwidth_mbps').val() + " Mbps");
				$('dd#summary_ips').text($('select#cc_public_ips option:selected').val());
			}

			if(from_section.attr("id") == 'extras' && action == 'back'){
				$('#extras_summary').hide();
				$('#extras_summary li:not("#extras_head")').text('');
			}

			$('.colo_calc_section_content', from_section).slideUp(400, function(){
				var new_from_class = (action == 'next' ? 'complete' : 'unavailable');

				clear_status_classes(from_section);
				from_section.addClass(new_from_class);

				clear_status_classes(to_section);
				to_section.addClass('in_progress');

				$('.colo_calc_section_content', to_section).slideDown(400, function(){
					to_section.addClass('active');
				});
			});
		}
		else{
			from_section.removeClass('in_progress').addClass('incomplete');

			$(".colo_calc_section_content", from_section).prepend("<div class='colo_calc_errors'></div>");

			for(x in errors){
				$(".colo_calc_errors", from_section).prepend("<div class='colo_calc_error'>" + errors[x] + "</div>");
			}
		}
	});

	$('a.colo_calc_next').click(function(){
		var from_section = $(this).parent().parent();
		var to_section = $(this).parent().parent().next('.colo_calc_section');
		from_section.trigger( "changeSection", [ to_section, 'next' ] );
		return false;
	});

	$('a.colo_calc_back').click(function(){
		$('.colo_calc_left > .colo_calc_errors').remove();
		var from_section = $(this).parent().parent();
		var to_section = $(this).parent().parent().prev('.colo_calc_section');
		from_section.trigger( "changeSection", [ to_section, 'back' ] );
		return false;
	});

	$('#colo_calc_form').submit(function(){
		$('input.colo_calc_submit').attr('readonly', 'readonly');

		var errors = get_section_errors('extras');
		var valid = (errors.length == 0);
		$(".colo_calc_errors").remove();
		
		if(!valid){
			$(".colo_calc_section#extras").removeClass('in_progress').addClass('incomplete');
			
			$(".colo_calc_section_content", from_section).prepend("<div class='colo_calc_errors'></div>");

			for(x in errors){
				$(".colo_calc_errors", from_section).prepend("<div class='colo_calc_error'>" + errors[x] + "</div>");
			}
		}
		else{
			var cc_dedicated_firewall = $('#cc_dedicated_firewall').val();
			var cc_cabinet_shelves = $('#cc_cabinet_shelves').val();

			if( cc_dedicated_firewall != 'none' || ( $('#cc_cabinet_shelves:visible').length > 0 && cc_cabinet_shelves > 0 ) ){
				$('#extras_summary.summary_data').show();

				if( cc_dedicated_firewall != 'none' ){
					$('li#summary_firewall').text( cc_dedicated_firewall.charAt(0).toUpperCase() + cc_dedicated_firewall.slice(1) + " firewall.").show();
				}
				if( $('#cc_cabinet_shelves:visible').length > 0 && cc_cabinet_shelves > 0 ){
					$('li#summary_cabinet_shelves').text(cc_cabinet_shelves + " cabinet shelves.").show();
				}
			}

			$("#colo_calc_form").addClass('loading');

			var colo_calc_data = {
				action: "get_colo_calc_quote",
				postdata: $('#colo_calc_form').serialize()
			}

			$.post('/wp-admin/admin-ajax.php', colo_calc_data, function(result) {
				$("#colo_calc_form").removeClass('loading');
				if(result.status == "ok"){
					$(".colo_calc_section#extras .colo_calc_section_content").slideUp(400, function(){
						clear_status_classes($(".colo_calc_section#extras"));
						$(".colo_calc_section#extras").addClass('complete');
					});
					$('#summary_recurring_cost').text(result.monthly);

					if($('.colo_calc_thanks').length == 0){
						$('#colo_calc_thanks').fadeIn(400);
					}
				}
				else{
					$('input.colo_calc_submit').removeAttr('readonly');

					var errors = result.errors;
					var first_section = "";

					$.each([ 'information', 'cabinet_space', 'power', 'connectivity', 'extras' ], function( index, value ) {
						if( value in result.errors ){
							clear_status_classes($(".colo_calc_section#" + value ));
							$(".colo_calc_section#" + value ).addClass('incomplete');

							if(first_section.length == 0){
								first_section = value;
								$(".colo_calc_section#" + value + " .colo_calc_section_content").slideDown(400, function(){
									$(".colo_calc_section#" + value ).addClass('active');
								});
							}

							$(".colo_calc_section#" + value + " .colo_calc_section_content").prepend("<div class='colo_calc_errors'></div>");

							for(x in result.errors[value]){
								$(".colo_calc_section#" + value + " .colo_calc_errors").prepend("<div class='colo_calc_error'>" + result.errors[value][x] + "</div>");
							}
						}
					});

					if( "form" in result.errors ){
						$(".colo_calc_left").prepend("<div class='colo_calc_errors'></div>");

						for(x in result.errors['form']){
							$(".colo_calc_left > .colo_calc_errors").prepend("<div class='colo_calc_error'>" + result.errors['form'][x] + "</div>");
						}
					}

					if("form" in result.errors){
						var to = $("form#colo_calc_form");
						var top = to.scrollTop();

						$('body').animate({scrollTop:top}, '500');
					}
					else if(first_section.length > 0){
						var to = $(".colo_calc_section#" + first_section );
						var top = to.scrollTop();

						$('body').animate({scrollTop:top}, '500');
					}
				}
			}, 'json');
		}

		return false;
	});

	$( ".connectivity_slider" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: 100,
		slide: function( event, ui ) {
			$( "#" + $(this).attr("id") + "_display_mbps" ).text( ui.value + " Mbps");
			//$( "#" + $(this).attr("id") + "_price" ).text( "$" + ui.value + " each");
			$( "#" + $(this).attr("id") + "_mbps" ).val( ui.value );
		}
	});

	$( ".connectivity_slider" ).each(function(){
		$( "#" + $(this).attr("id") + "_display_mbps" ).text( $(this).slider( "value" ) + " Mbps" );
		//$( "#" + $(this).attr("id") + "_price" ).text( "$" + $(this).slider( "value" ) + " each" );
		$( "#" + $(this).attr("id") + "_mbps" ).val( $(this).slider( "value" ) );
	});

	$('#colo_calc_cabinets_container').on("change", ".colo_calc_cabinet_voltage select", function(){
		var voltage = $('option:selected', $(this)).val();
		var cabinet_type = $(this).attr('class');

		if(cabinet_type == "full_cab"){
			var cabinet_id = $(this).attr('data-cabid');
			var default_amps = 0;

			$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps").removeClass('inactive active unavailable');

			if(voltage == '120'){
				default_amps = ( cabinet_type == "full_cab" ? 32 : 16 );
				if(cabinet_type == "full_cab"){
					$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=24]").addClass('unavailable');
					$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=32]").addClass('active');
					$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=16]").addClass('inactive');
				}
				else{
					$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=24]").addClass('unavailable');
					$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=32]").addClass('unavailable');
					$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=16]").addClass('active');
				}
			}
			else if(voltage == '208'){
				default_amps = 24;
				$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=24]").addClass('active');
				$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=32]").addClass('unavailable');
				$(".colo_calc_cabinet_power[data-cabid='" + cabinet_id + "'] .colo_calc_cabinet_amps[data-val=16]").addClass('unavailable');
			}

			$( "#cab_" + cabinet_id + "_amps" ).val( default_amps );
		}
		else{
			var slider_max = 16;
			var slider_element = $('.power_slider', $(this).parent().next('.colo_calc_cabinet_power'));

			//slider_element.slider( "destroy" );

			if(voltage == 0){
				slider_element.text("Please select a voltage.");
			}
			else{
				slider_element.text("");

				slider_element.slider({
					range: "min",
					value: slider_max,
					min: 1,
					max: slider_max,
					slide: function( event, ui ) {
						$( "#" + $(this).attr("id") + "_display_amps" ).text( ui.value + " Amps");
						//$( "#" + $(this).attr("id") + "_price" ).text( "$" + ui.value + " each");
						$( "#" + $(this).attr("id") + "_amps" ).val( ui.value );
					}
				});

				$( "#" + slider_element.attr("id") + "_display_amps" ).text( slider_element.slider( "value" ) + " Amps" );
				//$( "#" + slider_element.attr("id") + "_price" ).text( "$" + slider_element.slider( "value" ) + " each" );
				$( "#" + slider_element.attr("id") + "_amps" ).val( slider_element.slider( "value" ) );
			}
		}
	});

	$('#colo_calc_cabinets_container').on("click", ".colo_calc_cabinet_amps:not('.unavailable')", function(){
		var cabinet_id = $(this).parent().attr('data-cabid');
		var cabinet_amps;

		if($(this).attr('data-val') == "16"){
			cabinet_amps = 16;
			$(".colo_calc_cabinet_amps[data-val=16]", $(this).parent()).removeClass('inactive active').addClass('active');
			$(".colo_calc_cabinet_amps:not('[data-val=16]')", $(this).parent()).removeClass('inactive active').addClass('inactive');
		}
		else if($(this).attr('data-val') == "24"){
			cabinet_amps = 24;
			$(".colo_calc_cabinet_amps[data-val=24]", $(this).parent()).removeClass('inactive active').addClass('active');
			$(".colo_calc_cabinet_amps:not('[data-val=24]')", $(this).parent()).removeClass('inactive active').addClass('inactive');
		}
		else if($(this).attr('data-val') == "32"){
			cabinet_amps = 32;
			$(".colo_calc_cabinet_amps[data-val=32]", $(this).parent()).removeClass('inactive active').addClass('active');
			$(".colo_calc_cabinet_amps:not('[data-val=32]')", $(this).parent()).removeClass('inactive active').addClass('inactive');
		}

		$( "#cab_" + cabinet_id + "_amps" ).val( cabinet_amps );
	});

	

	$('.colo_calc_section#cabinet_space select').change(function(){
		$(".colo_calc_section#cabinet_space .colo_calc_form_field.active").removeClass('active');

		if($('option:selected', $(this)).val() > 0) { 
			$(this).parent().addClass('active'); 
			$('.colo_calc_form_field').not($(this).parent()).addClass('inactive');
		}
		else{
			$('.colo_calc_form_field').removeClass('inactive').addClass('active');
		}

		$(".colo_calc_section#cabinet_space select").not(this).val(0);
	});

	$('.colo_calc_left').on('click', '.colo_calc_start_over', function(){
		$('.colo_calc_left > .colo_calc_errors').remove();
		$('#extras_summary').hide();
		$('#extras_summary li:not("#extras_head")').text('');

		clear_status_classes( $('.colo_calc_section#power') );
		clear_status_classes( $('.colo_calc_section#connectivity') );
		$('.colo_calc_section#extras').trigger( "changeSection", [ $('.colo_calc_section#cabinet_space'), 'back' ] );
		$('#colo_calc_thanks').fadeOut(400);
		return false;
	});
});