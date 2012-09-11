(function( $ ) {
	var easyWizardMethods = {
		init : function(options) {
			var settings = $.extend( {
				'stepClassName' : 'step',
				'showSteps' : true,
				'stepsText' : '{n}. {t}',
				'showButtons' : true,
				'prevButton' : '< Back',
				'nextButton' : 'Next >',
				'debug' : true,
				'submitButton': true,
				'submitButtonText': 'Submit'
			}, options);

			return this.each(function() {
				thisSettings = settings;
				$this = $(this);
				$steps = $this.find('.'+thisSettings.stepClassName);
				thisSettings.steps = $steps.length;
				thisSettings.width = $(this).width();

				if(thisSettings.steps > 1) {
					// Create UI
					$this.css({
						'position': 'relative',
						'overflow': 'hidden'
					}).addClass('easyPager');

					$stepsHtml = $('<ul class="easyWizardSteps">');

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

						stepText = thisSettings.stepsText.replace('{n}', '<span>'+step+'</span>');
						stepText = stepText.replace('{t}', $(this).attr('data-step-title'));
						$stepsHtml.append('<li'+(!index?' class="current"':'')+' data-step="'+step+'">'+stepText+'</li>');
					});

					if(thisSettings.showSteps) {
						$(this).before($stepsHtml);
					}

					if(thisSettings.showButtons) {
						paginationHtml = '<div class="easyWizardButtons">';
							paginationHtml += '<button class="prev">'+thisSettings.prevButton+'</button>';
							paginationHtml += '<button class="next">'+thisSettings.nextButton+'</button>';
							paginationHtml += thisSettings.submitButton?'<button type="submit" class="submit">'+thisSettings.submitButtonText+'</button>':'';
						paginationHtml	+= '</div>';
						$paginationBloc = $(paginationHtml);
						$paginationBloc.find('.prev, .submit').hide();
						$paginationBloc.find('.prev').bind('click.easyWizard', function(e) {
							e.preventDefault();

							easyWizardMethods.prevStep.apply($this);
						});

						$paginationBloc.find('.next').bind('click.easyWizard', function(e) {
							e.preventDefault();

							easyWizardMethods.nextStep.apply($this);
						});
						$(this).after($paginationBloc);
					}
				}else if(thisSettings.debug) {
					console.log('Can\'t make a wizard with only one step oO');
				}
			});
		},
		prevStep : function( ) {
			$activeStep = this.find('.active');
			if($activeStep.prev('.'+thisSettings.stepClassName).length) {
				prevStep = parseInt($activeStep.attr('data-step')) - 1;
				easyWizardMethods.goToStep.call(this, prevStep);
			}
		},
		nextStep : function( ) {
			$activeStep = this.find('.active');
			if($activeStep.next('.'+thisSettings.stepClassName).length) {
				nextStep = parseInt($activeStep.attr('data-step')) + 1;
				easyWizardMethods.goToStep.call(this, nextStep);
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

			// Slide !
			$activeStep.animate({
				'left': leftValue
			}).removeClass('active');

			$nextStep.animate({
				'left': 0
			}).addClass('active');

			// Defines steps
			if(thisSettings.showSteps) {
				$('.easyWizardSteps .current').removeClass('current');
				$('.easyWizardSteps').find('li[data-step="'+step+'"]').addClass('current');
			}

			// Define buttons
			if(thisSettings.showButtons) {
				$paginationBloc = $this.next('.easyWizardButtons');
				if(step == 1) {
					$paginationBloc.find('.prev, .submit').hide();
				}else if(step < thisSettings.steps) {
					$paginationBloc.find('.submit').hide();
					$paginationBloc.find('.prev, .next').show();
				}else {
					$paginationBloc.find('.next').hide();
					$paginationBloc.find('.submit').show();
				}
			}
		}
	};

	$.fn.easyWizard = function(method) {
		if ( easyWizardMethods[method] ) {
			return easyWizardMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return easyWizardMethods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.easyWizard' );
		}
	};
})(jQuery);