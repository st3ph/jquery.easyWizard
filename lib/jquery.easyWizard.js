/* ========================================================
 * easyWizard v1.1.3
 * http://st3ph.github.com/jquery.easyWizard
 * ========================================================
 * Copyright 2012 - 2015 Stéphane Litou
 * http://stephane-litou.com
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 * ======================================================== */
(function( $ ) {
    var arrSettings = [];
    var easyWizardMethods = {
        init : function(options) {
            var settings = $.extend( {
                'stepClassName' : 'step',
                'showSteps' : true,
                'stepsText' : '{n}. {t}',
                'showButtons' : true,
                'buttonsClass' : '',
                'prevButton' : '< Back',
                'nextButton' : 'Next >',
                'debug' : false,
                'submitButton': true,
                'submitButtonText': 'Submit',
                'submitButtonClass': '',
                before: function(wizardObj, currentStepObj, nextStepObj) {},
                after: function(wizardObj, prevStepObj, currentStepObj) {},
                beforeSubmit: function(wizardObj) {
                    wizardObj.find('input, textarea').each(function() {
                        if(!this.checkValidity()) {
                            this.focus();
                            step = $(this).parents('.'+thisSettings.stepClassName).attr('data-step');
                            easyWizardMethods.goToStep.call(wizardObj, step);

                            return false;
                        }
                    });
                }
            }, options);

            arrSettings[this.index()] = settings;

            return this.each(function() {
                thisSettings = settings;

                $this = $(this); // Wizard Obj
                $this.addClass('easyWizardElement');
                $steps = $this.find('.'+thisSettings.stepClassName);
                thisSettings.steps = $steps.length;
                thisSettings.width = $(this).width();

                if(thisSettings.steps > 1) {
                    // Create UI
                    $this.wrapInner('<div class="easyWizardWrapper" />');
                    $this.find('.easyWizardWrapper').width(thisSettings.width * thisSettings.steps);
                    $this.css({
                        'position': 'relative',
                        'overflow': 'hidden'
                    }).addClass('easyPager');

                    $stepsHtml = $('<ul class="easyWizardSteps">');

                    $steps.each(function(index) {
                        step = index + 1;
                        $(this).css({
                            'float': 'left',
                            'width': thisSettings.width,
                            'height': '1px'
                        }).attr('data-step', step);

                        if(!index) {
                            $(this).addClass('active').css('height', '');
                        }else {
                            $(this).find('input, textarea, select, button').attr('tabindex', '-1');
                        }

                        stepText = thisSettings.stepsText.replace('{n}', '<span>'+step+'</span>');
                        stepText = stepText.replace('{t}', $(this).attr('data-step-title'));
                        $stepsHtml.append('<li'+(!index?' class="current"':'')+' data-step="'+step+'">'+stepText+'</li>');
                    });

                    if(thisSettings.showSteps) {
                        $this.prepend($stepsHtml);
                    }

                    if(thisSettings.showButtons) {
                        paginationHtml = '<div class="easyWizardButtons">';
                            paginationHtml += '<button class="prev '+thisSettings.buttonsClass+'">'+thisSettings.prevButton+'</button>';
                            paginationHtml += '<button class="next '+thisSettings.buttonsClass+'">'+thisSettings.nextButton+'</button>';
                            paginationHtml += thisSettings.submitButton?'<button type="submit" class="submit '+thisSettings.submitButtonClass+'">'+thisSettings.submitButtonText+'</button>':'';
                        paginationHtml  += '</div>';
                        $paginationBloc = $(paginationHtml);
                        $paginationBloc.css('clear', 'both');
                        $paginationBloc.find('.prev, .submit').hide();
                        $paginationBloc.find('.prev').bind('click.easyWizard', function(e) {
                            e.preventDefault();

                            $wizard = $(this).parents('.easyWizardElement');
                            easyWizardMethods.prevStep.apply($wizard);
                        });

                        $paginationBloc.find('.next').bind('click.easyWizard', function(e) {
                            e.preventDefault();

                            $wizard = $(this).parents('.easyWizardElement');
                            easyWizardMethods.nextStep.apply($wizard);
                        });
                        $this.append($paginationBloc);
                    }

                    $formObj = $this.is('form')?$this:$(this).find('form');

                    // beforeSubmit Callback
                    $this.find('[type="submit"]').bind('click.easyWizard', function(e) {
                        $wizard = $(this).parents('.easyWizardElement');
                        var beforeSubmitValue = thisSettings.beforeSubmit($wizard);
                        if(beforeSubmitValue === false) {
                            return false;
                        }
                        return true;
                    });
                }else if(thisSettings.debug) {
                    console.log('Can\'t make a wizard with only one step oO');
                }
            });
        },
        prevStep : function( ) {
            thisSettings = arrSettings[this.index()];
            $activeStep = this.find('.'+ thisSettings.stepClassName +'.active');
            if($activeStep.prev('.'+thisSettings.stepClassName).length) {               
                prevStep = parseInt($activeStep.prev().attr('data-step'));
                easyWizardMethods.goToStep.call(this, prevStep);
            }
        },
        nextStep : function( ) {
            thisSettings = arrSettings[this.index()];           
            $activeStep = this.find('.'+ thisSettings.stepClassName +'.active');
            if($activeStep.next('.'+thisSettings.stepClassName).length) {
                nextStep = parseInt($activeStep.next().attr('data-step'));
                easyWizardMethods.goToStep.call(this, nextStep);
            }
        },
        goToStep : function(step) {
            thisSettings = arrSettings[this.index()];
            $activeStep = this.find('.'+ thisSettings.stepClassName +'.active');
            $nextStep = this.find('.'+thisSettings.stepClassName+'[data-step="'+step+'"]');
            currentStep = $activeStep.attr('data-step');

            // Prevent sliding same step
            if (currentStep == step) return;

            // Before callBack
            var beforeValue = thisSettings.before(this, $activeStep, $nextStep);
            if(beforeValue === false) {
                return false;
            }

            // Define direction for sliding
            if(currentStep < step) { // forward
                leftValue = thisSettings.width * -1;
            }else { // backward
                leftValue = thisSettings.width;
            }

            // Slide !
            $activeStep.removeClass('active');
            $activeStep.find('input, textarea, select, button').attr('tabindex', '-1');

            $nextStep.css('height', '').addClass('active');
            $nextStep.find('input, textarea, select, button').removeAttr('tabindex');

            this.find('.easyWizardWrapper').stop(true, true).animate({
                'margin-left': thisSettings.width * (step - 1) * -1
            }, function () {
                $activeStep.css({ height: '1px' });
            });

            // Defines steps
            this.find('.easyWizardSteps .current').removeClass('current');
            this.find('.easyWizardSteps li[data-step="'+step+'"]').addClass('current');

            // Define buttons
            $paginationBloc = this.find('.easyWizardButtons');
            if($paginationBloc.length) {
                if(step == 1) {
                    $paginationBloc.find('.prev, .submit').hide();
                    $paginationBloc.find('.next').show();
                }else if(step < thisSettings.steps) {
                    $paginationBloc.find('.submit').hide();
                    $paginationBloc.find('.prev, .next').show();
                }else {
                    if($nextStep.prev('.'+thisSettings.stepClassName).length) { // If there is a previous step, must be always the case but... you know =)
                        $paginationBloc.find('.prev').show();
                    }
                    $paginationBloc.find('.next').hide();
                    $paginationBloc.find('.submit').show();
                }
            }

            // After callBack
            thisSettings.after(this, $activeStep, $nextStep);
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
