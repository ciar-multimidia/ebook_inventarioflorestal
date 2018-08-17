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

	var $btSumario = $('.btsumario');
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

	var $perguntas = $('.pergunta[data-tipo]');
	var $boxScore = $('.pontuacao-final');
	var nAcertos = 0;

	$boxScore.find('.n-total').text($perguntas.length);

	var tentarMostrarPontuacao = function(){
		if ($perguntas.filter('[data-acertou]').length === $perguntas.length) {
			$boxScore.find('.n-acertos').text(nAcertos);
			setTimeout(function(){
				$boxScore.addClass('db');
				var scrollDestiny = 
					$boxScore.offset().top > $('body').height()-$(window).height() ?
					$('body').height()-$(window).height() :
					$boxScore.offset().top;
				$('html,body').animate({'scrollTop': scrollDestiny}, 1000, function() {
					$boxScore.addClass('visivel');
				});
			},600);
		}
	}

	if ($perguntas.length > 0) {
		$perguntas.each(function(index, el) {
			var $thisPergunta = $(el);
			var tipoPergunta = $(el).attr('data-tipo');
			if (tipoPergunta === 'uma-correta') {
				var $alts = $thisPergunta.find('.alternativas > label');
				var $alt_correta = $alts.filter('[data-correta]');
				var $input_alts = $alts.children('input');
				// $thisPergunta.data('alt_correta', $alts.index( $alts.filter('[data-correta]') ) );
				$input_alts.on('change', function(event) {
					$input_alts.attr('disabled', 'disabled');
					var $label_desse_input = $(this).closest('label');
					$label_desse_input.addClass('marcada revelada');
					$alt_correta.addClass('revelada');
					if ($label_desse_input.is($alt_correta)) {
						$thisPergunta.attr('data-acertou', 'true');
						nAcertos++;
					} else{
						$thisPergunta.attr('data-acertou', 'false');
					}
					tentarMostrarPontuacao();
				});
			} 

			else if (tipoPergunta === 'v-ou-f') {
				var $itens_prepo = $thisPergunta.find('.preposicoes > li');
				var prepos_clicados = 0;
				var prepos_acertados = 0;
				$itens_prepo.each(function(index2, el2) {
					var vouf = $(el2).attr('data-resposta');
					var $bt_vouf = $(el2).children('button');
					$bt_vouf.on('click', function(event) {
						$(el2).addClass('respondida');
						$bt_vouf.attr('disabled', 'disabled').off('click');
						prepos_clicados++;
						if ($(this).is('.bt-'+vouf)) {
							$(el2).addClass('acertou');
							prepos_acertados++;
						} else{
							$(el2).addClass('errou');
						}
						if (prepos_clicados === $itens_prepo.length) {

							if (prepos_acertados === $itens_prepo.length) {
								$thisPergunta.attr('data-acertou', 'true');
								nAcertos++;
							}
							else{
								$thisPergunta.attr('data-acertou', 'false');
							}

							tentarMostrarPontuacao();
							
						}

					});
				});
			}
		});
	}
});






