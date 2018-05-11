jQuery(document).ready(function($) {

	if (window.MathJax) {
		MathJax.Hub.signal.Interest(function (message) { 
			if (message[0] === 'TeX Jax - parse error') console.log(message[0]); // Se der erro, avisa
			if (message[0] === 'Begin PreProcess') { // Quando começar a carregar, anim de load
				$('article').addClass('carregando');
				$('#loader').addClass('visivel');
			}
			else if (message[0] === 'End Process') { // Terminou de carregar, volta ao normal
				$('article').removeClass('carregando');
				$('#loader').removeClass('visivel');
			}
		});
		
	} else{
		// console.log('Essa página não tem Mathjax');
	}

	var $btSumario = $('#btsumario');
	var $sumario = $('#sumario');
	var $btFechaSumario = $('#fecharSumario');
	var animationEndEvents = 'animationend webkitAnimationEnd oanimationend MSAnimationEnd'
	var transitionEndEvents = 'transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd';

	var fecharSumario = function(){
		$btSumario.removeClass('sumario-aberto');
		$sumario.addClass('escondido');
		$sumario.on(transitionEndEvents, function(event) {
			console.log('sumário voltou');
			$(this).addClass('dn').removeClass('itens-aparece').off(transitionEndEvents);
			$btSumario.on('click', abrirSumario);
		});
		$('body').off('click');
	}

	var abrirSumario = function(){
		console.log('clicou no botao do sumario');
		$btSumario.off('click').addClass('sumario-aberto').trigger('blur');
		$sumario.removeClass('dn');
		setTimeout(function(){
			$sumario.removeClass('escondido').addClass('itens-aparece');
			$('body').on('click', fecharSumario);
		}, 60);
	}

	$btSumario.on('click', abrirSumario);

	$btFechaSumario.on('click', fecharSumario);

	$sumario.on('click', function(event) {
		event.stopPropagation();
	});



	var $alt_perguntas = $('.alternativas');

	if ($alt_perguntas) {
		$alt_perguntas.each(function(index, el) {
			var $alts = $(el).children('label');
			var $alt_correta = $alts.filter('[data-correta]');
			var $input_alts = $alts.children('input');
			// $(el).data('alt_correta', $alts.index( $alts.filter('[data-correta]') ) );
			$input_alts.on('change', function(event) {
				if ($(this).is(':checked')) {
					$input_alts.attr('disabled', 'disabled');
					var $label_desse_input = $(this).closest('label');
					$label_desse_input.addClass('marcada revelada');
					$alt_correta.addClass('revelada');
				}
			});

		});
	}

	var $prepo_perguntas = $('.preposicoes');

	if ($prepo_perguntas) {
		$prepo_perguntas.each(function(index, el) {
			var $itens_prepo = $(el).children('li');
			$itens_prepo.each(function(index2, el2) {
				var vouf = $(el2).attr('data-resposta');
				var $bt_vouf = $(el2).children('button');
				$bt_vouf.on('click', function(event) {
					$(el2).addClass('respondida');
					$bt_vouf.attr('disabled', 'disabled').off('click');
					if ($(this).is('.bt-'+vouf)) {
						$(el2).addClass('acertou');
					} else{
						$(el2).addClass('errou');
					}
				});
			});
		});
	}

});






