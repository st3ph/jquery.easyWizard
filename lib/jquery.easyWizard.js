(function( $ ) {
	var methods = {
		init : function(options) {
			var settings = $.extend( {
				'stepClassName' : 'step',
				'prevButton' : 'Prev',
				'nextButton' : 'Next',
				'debug' : true
			}, options);

			return this.each(function() {
				thisSettings = settings;
				$this = $(this);
				$steps = $this.find('.'+thisSettings.stepClassName);
				thisSettings.steps = $steps.length;
				thisSettings.width = $(this).width();

				if(thisSettings.steps > 1) {
					// Create UI
					//$steps.hide();
					$this.css({
						'position': 'relative',
						'overflow': 'hidden'
					}).addClass('easyPager');

					$steps.each(function(index) {
						step = index + 1;
						$(this).css({
							'position': 'absolute',
							'left': thisSettings.width,
							'width': thisSettings.width
						}).attr('data-step', step);

						if(!index) {
							$(this).addClass('active').css({
								'left': 0
							}).show();
						}

						paginationHtml = '<div id="easyWizardStep'+step+'" class="easyWizardButtons">';
							paginationHtml	+= step > 1 ?'<button class="prev">'+thisSettings.prevButton+'</button>':'';
							paginationHtml += step < thisSettings.steps?'<button class="next">'+thisSettings.nextButton+'</button>':'';
						paginationHtml	+= '</div>';
						$paginationBloc = $(paginationHtml);
						$paginationBloc.find('.prev').bind('click.easyWizard', function(e) {
							e.preventDefault();

							methods.prevStep.apply($this);
						});

						$paginationBloc.find('.next').bind('click.easyWizard', function(e) {
							e.preventDefault();

							methods.nextStep.apply($this);
						});
						$(this).append($paginationBloc);
					});
				}else if(thisSettings.debug) {
					console.log('Can\'t make a wizard with only one step oO');
				}
			});
		},
		prevStep : function( ) {
			$activeStep = this.find('.active');
			if($activeStep.prev('.'+thisSettings.stepClassName).length) {
				prevStep = parseInt($activeStep.attr('data-step')) - 1;
				methods.goToStep.call(this, prevStep);
			}
		},
		nextStep : function( ) {
			$activeStep = this.find('.active');
			if($activeStep.next('.'+thisSettings.stepClassName).length) {
				nextStep = parseInt($activeStep.attr('data-step')) + 1;
				methods.goToStep.call(this, nextStep);
			}
		},
		goToStep : function(step) {
			$activeStep = this.find('.active');
			$nextStep = this.find('.'+thisSettings.stepClassName+'[data-step="'+step+'"]');
			currentStep = $activeStep.attr('data-step');

			// Define direction for sliding
			if(currentStep < step) { // forward
				leftValue = thisSettings.width * -1;
			}else { // backward
				leftValue = thisSettings.width;
			}

			$activeStep.animate({
				'left': leftValue
			}).removeClass('active');

			$nextStep.animate({
				'left': 0
			}).addClass('active');
		}
	};

	$.fn.easyWizard = function(method) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.easyWizard' );
		}
	};
})(jQuery);