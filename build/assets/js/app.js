//------- Test Module --------//

var Test = (function() {
	var _fromTest = function() {
		alert("Hi there! I'm inside Test Module");
	}

	return {
		init: function() {
			$('.arrow-down').on('click', function(e) {
				e.preventDefault(e);
				_fromTest();
			})
		}
	}
	
})();

//------ Preloader Module -------//

var Preloader = (function() {
	
	var preloader = $('.preloader'),
		body = $('body'),
		percentsTotal = 0; //сколько картинок загружено

	//-Понадобятся-:
		//1.метод, который будет вычленять пути до картинок и формировать массив
		//2.метод, котрый считает и выставляет кол-во загруженных процентов
		//3.метод вставки картинки и в зависимости от этого высчитывания процентов

	//1.набор картинок
	var _imgPath = $('*').map(function(index, element) {
		var backgroundImg = $(element).css('background-image'),
			img = $(element).is('img'),
			path = ' '; //чем заполнять

		//если бэкграунд картинка существует
		if (backgroundImg != 'none') {
			path = backgroundImg.replace('url("', '').replace('")', ''); //делаем чистый путь до картинки
		}

		//если есть картинка
		if (img) {
			path = $(element).attr('src');
		}

		//если наполнение не пустое
		if (path) return path
	});

	//2.посчитать процент
	var _setPercents = function(totalPercent, currentPercent) {
		var percents = Math.ceil(currentPercent / totalPercent * 100); //чтобы округлялось в большую сторону и доходило до 100%
		
		$('.preloader__percents').text(percents + '%');

		//если 100 и более %, то прячем прелоадер
		if (percents >= 100) {
			preloader.delay(500);
			preloader.fadeOut('slow', function() {
				body.removeClass('body-preload');
			});
		}
	};

	//3.загрузить картинку и вставить процент
	var _loadImages = function(images) {

		//если картинок нет вообще, то прячем прелоадер
		if (!images.length) {
			preloader.delay(500);
			preloader.fadeOut('slow', function() {
				body.removeClass('body-preload');
			});
		}

		//если картинки есть, то используем стандартный метод для массивов
		images.forEach(function(image, index, imagesArray) {

			//создаем картинку заново (фейково)
			var fakeImage = $('<img>', {
				attr : {
					src : image
				}
			});

			//проверяем загрузилось ли изображение
			//error - если ошибка в пути картинки, то все равно загрузить
			fakeImage.on('load error', function() {
				percentsTotal++;
				_setPercents(imagesArray.length, percentsTotal);
			});
		});

	};

	return {
		init: function() {
			body.addClass('body-preload');

			//т.к. метод .map() возвращает объект, то преобразуем его в массив
			var imgsArray = _imgPath.toArray();

			_loadImages(imgsArray);
		}
	}
})();

//  сохраняем всю сцену параллакса
var layers = document.getElementsByClassName('parallax__layer');

//передаем функцию обработчик

var  moveLayers = function (e) {

    var initialX = (window.innerWidth/2) - e.pageX,  //находим центр нашего экрана по оси X, вычитаем положение мышки по оси X
        initialY = (window.innerHeight/2) - e.pageY;

    [].slice.call(layers).forEach(function (layer, i) {        // в метод массива slice передать в качестве this наши слои (псевдомассив(коллекцию), чтобы можно было использовать методы массива
        var
            divider = i/100,
            positionX = initialX * divider,
            positionY = initialY * divider,
            layerStyle = layer.style,                       //анимируем слой, сохраняем стиль слоя
            transformString = 'translate3d('+ positionX +'px, '+ positionY +'px, 0)'; //изменяем в стиле свойство трансформ по осям (X, Y, Z) b и сохраняем

        layerStyle.transform = transformString;
        layerStyle.bottom = '-' + 'px';
    });
}


// пишем обработчик событий
window.addEventListener('mousemove', moveLayers);
//--- Main Menu Module -------------//

var MainMenu = (function() {
	var _clickHamburger = function() {
		var nav = $('.navigation');

		$('body').toggleClass('body-active');
		setTimeout(function () {
			$('.main-menu').toggleClass('main-menu-active');
		}, 300);
		nav.toggleClass('navigation-active');

		$('.hamburger').toggleClass('on');
		$('.hamburger-menu').toggleClass('animate');
	}

	return {
		init: function() {
			$('.hamburger').on('click', function(e) {
				e.preventDefault();

				_clickHamburger();
			});
		}
	}
})();

//-----SLIDER MODULE-----//

var Slider = (function() {

	var sliderContainer = $('.works__slider__container'),
		prevBtn = sliderContainer.find('.slider__nav__link_prev'),
		nextBtn = sliderContainer.find('.slider__nav__link_next'),
		prevSliderItems = prevBtn.find('.slider__nav__item'),
		nextSliderItems = nextBtn.find('.slider__nav__item'),
		itemsLength = prevSliderItems.length,
		display = sliderContainer.find('.slider__img'),
		bigImg = display.find('.slider__img_big'),
		title = sliderContainer.find('.slider__info__subtitle'),
		technology = sliderContainer.find('.slider__info__tech'),
		link = sliderContainer.find('.slider__info__btn'),
		duration = 500,
		isAnimate = false,
		counter = 0;

	var _Defaults = function() {
		// left btn
		prevBtn
			.find('.slider__nav__item')
			.eq(counter - 1)
			.addClass('.slider__nav__item_active');

		// right btn
		nextBtn
			.find('.slider__nav__item')
			.eq(counter + 1)
			.addClass('.slider__nav__item_active');
	};

	var _prevSlideAnimate = function(sliderCounterPrev) {
		var reqItemPrev = prevSliderItems.eq(sliderCounterPrev - 1),
			activeItemPrev = prevSliderItems.filter('.slider__nav__item_active');

		activeItemPrev.animate({
			'top': '100%' //'100%' prev
		}, duration);

		reqItemPrev.animate({
			'top': 0
		}, duration, function() {
			activeItemPrev.removeClass('slider__nav__item_active')
				.css('top', '-100%'); // '-100%' prev
			
			$(this).addClass('slider__nav__item_active');

			isAnimate = false;
		});
	};

	var _nextSlideAnimate = function(sliderCounterNext) {
		var reqItemNextIndex = sliderCounterNext + 1,
			activeItemNext = nextSliderItems.filter('.slider__nav__item_active');

		if (reqItemNextIndex > itemsLength - 1) {
			reqItemNextIndex = 0;
		}

		var reqItemNext = nextSliderItems.eq(reqItemNextIndex);

		activeItemNext.animate({
			'top': '-100%' //'-100%' next
		}, duration);

		reqItemNext.animate({
			'top': 0
		}, duration, function() {
			activeItemNext.removeClass('slider__nav__item_active')
				.css('top', '100%'); // '100%' next
			
			$(this).addClass('slider__nav__item_active');

			isAnimate = false;
		});

	};

	var _getData = function() {
		var dataObj = {
			images : [],
			titles : [],
			technologys : [],
			links : []
		};

		prevSliderItems.each(function() {
			var $this = $(this); //each from 'prevSliderItems'

			dataObj.images.push($this.data('src'));
			dataObj.titles.push($this.data('title'));
			dataObj.technologys.push($this.data('tech'));
			dataObj.links.push($this.data('link'));
		});

		return dataObj;
	};

	var _changeData = function(changeDataCounter) {
		var _data = _getData();

		bigImg
			.stop(true, true)
			.fadeOut(duration, function() {
				$(this).attr('src', _data.images[changeDataCounter]);
			})
			.fadeIn(duration);

		title
			.stop(true, true)
			.fadeOut(duration, function() {
				$(this).text(_data.titles[changeDataCounter])
			})
			.stop(true, true)
			.fadeIn(duration);

		technology
			.stop(true, true)
			.fadeOut(duration, function() {
				$(this).text(_data.technologys[changeDataCounter])
			})
			.stop(true, true)
			.fadeIn(duration);

		link.attr('href', _data.links[changeDataCounter]);
	};

	var _moveSlide = function(direction) {
		var directions = {
			next : function() {
				if (counter < itemsLength - 1) {
					counter++;
				} else {
					counter = 0;
				}
			},
			prev : function() {
				if (counter > 0) {
					counter--;
				} else {
					counter = itemsLength - 1;
				}
			}
		};

		directions[direction]();


		if(!isAnimate) {

			isAnimate = true;

			_nextSlideAnimate(counter);
			_prevSlideAnimate(counter);
			_changeData(counter);
		}
	};

	return {
		init: function() {
			_Defaults();

			$('.slider__nav__link_prev').on('click', function(e) {
				e.preventDefault();

				_moveSlide('prev');
			});

			$('.slider__nav__link_next').on('click', function(e) {
				e.preventDefault();

				_moveSlide('next');
			});
		}
	}
})();
//----- Contact-Form Module ------//

var ContactForm = (function() {

	var form = $('.contact-form__input-group'),
		inputName = $('#contact-form__input__name'),
		inputEmail = $('#contact-form__input__email'),
		inputMessage = $('#contact-form__input__message'),
		btnSubmit = form.find('.btn_submit'),
		btnReset = form.find('.btn_reset'),
		popUp = $('.popup'),
		popUpText = $('.popup_text'),
		popUpClose = $('.popup_close');

	var _clickSubmit = function() {

		var nameValue = inputName.val(),
			emailValue = inputEmail.val(),
			messageValue = inputMessage.val();

		if (!nameValue === true || !emailValue === true || !messageValue === true) {

			popUpText.html('Заполните все поля!');
			popUp.addClass('popup_active');
		
		} else {

			var email_reg = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

			if (!email_reg.test(inputEmail.val())) {

		        inputEmail.css('border-color', 'red');
		        popUpText.html('E-mail введён неверно!');
		        popUp.addClass('popup_active');
		        setInterval(function() {
					popUp.removeClass('popup_active');
				}, 10000);

		    } else {
		    	$.ajax({
					url: '../assets/php/contact-form.php',
					method: 'post',
					data: {
						name: nameValue,
						email: emailValue,
						message: messageValue
					}
				}).done(function(response) {
					console.log('done');
					popUpText.html('Сообщение отправлено!');
					popUp.addClass('popup_active');
					_reset();
					setInterval(function() {
						popUp.removeClass('popup_active');
					}, 10000);
				}).fail(function(error) {
					console.log('error');
					popUpText.html('Произошла ошибка!');
					popUp.addClass('popup_active');
					setInterval(function() {
						popUp.removeClass('popup_active');
					}, 10000);
				});	
		    }
		}		
	};

	var _reset = function() {
		inputName.val('');
		inputEmail.val('');
		inputMessage.val('');
		popUp.removeClass('popup_active');
	};

	return {
		init: function() {
			$('.btn_submit').on('click', function(e) {
				e.preventDefault();

				_clickSubmit();
			});

			$('.popup').on('click', function() {

	        	popUp.removeClass('popup_active');

	        	_reset();
			});

			$('.btn_reset').on('click', function(e) {
				e.preventDefault();

				_reset();
			})
		}
	}
})();
// ---- MODULES INITIALIZATION ----- //

$(document).ready(function() {
	Preloader.init();

	if ($('#hamburger').length) {
		MainMenu.init();
	}

	if ($('.arrow-down').length) {
		Test.init();
	}

	if ($('#works__slider').length) {
		Slider.init();
	}

	if($('.works__form').length) {
		ContactForm.init();
	}

	if ($('#blog').length) {
		BlogMenu.init();
	}
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIiwicGFyYWxsYXguanMiLCJtYWluLW1lbnUuanMiLCJzbGlkZXIuanMiLCJjb250YWN0LWZvcm0uanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy0tLS0tLS0gVGVzdCBNb2R1bGUgLS0tLS0tLS0vL1xuXG52YXIgVGVzdCA9IChmdW5jdGlvbigpIHtcblx0dmFyIF9mcm9tVGVzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFsZXJ0KFwiSGkgdGhlcmUhIEknbSBpbnNpZGUgVGVzdCBNb2R1bGVcIik7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmFycm93LWRvd24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoZSk7XG5cdFx0XHRcdF9mcm9tVGVzdCgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblx0XG59KSgpO1xuIiwiLy8tLS0tLS0gUHJlbG9hZGVyIE1vZHVsZSAtLS0tLS0tLy9cblxudmFyIFByZWxvYWRlciA9IChmdW5jdGlvbigpIHtcblx0XG5cdHZhciBwcmVsb2FkZXIgPSAkKCcucHJlbG9hZGVyJyksXG5cdFx0Ym9keSA9ICQoJ2JvZHknKSxcblx0XHRwZXJjZW50c1RvdGFsID0gMDsgLy/RgdC60L7Qu9GM0LrQviDQutCw0YDRgtC40L3QvtC6INC30LDQs9GA0YPQttC10L3QvlxuXG5cdC8vLdCf0L7QvdCw0LTQvtCx0Y/RgtGB0Y8tOlxuXHRcdC8vMS7QvNC10YLQvtC0LCDQutC+0YLQvtGA0YvQuSDQsdGD0LTQtdGCINCy0YvRh9C70LXQvdGP0YLRjCDQv9GD0YLQuCDQtNC+INC60LDRgNGC0LjQvdC+0Log0Lgg0YTQvtGA0LzQuNGA0L7QstCw0YLRjCDQvNCw0YHRgdC40LJcblx0XHQvLzIu0LzQtdGC0L7QtCwg0LrQvtGC0YDRi9C5INGB0YfQuNGC0LDQtdGCINC4INCy0YvRgdGC0LDQstC70Y/QtdGCINC60L7Quy3QstC+INC30LDQs9GA0YPQttC10L3QvdGL0YUg0L/RgNC+0YbQtdC90YLQvtCyXG5cdFx0Ly8zLtC80LXRgtC+0LQg0LLRgdGC0LDQstC60Lgg0LrQsNGA0YLQuNC90LrQuCDQuCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0Y3RgtC+0LPQviDQstGL0YHRh9C40YLRi9Cy0LDQvdC40Y8g0L/RgNC+0YbQtdC90YLQvtCyXG5cblx0Ly8xLtC90LDQsdC+0YAg0LrQsNGA0YLQuNC90L7QulxuXHR2YXIgX2ltZ1BhdGggPSAkKCcqJykubWFwKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG5cdFx0dmFyIGJhY2tncm91bmRJbWcgPSAkKGVsZW1lbnQpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxuXHRcdFx0aW1nID0gJChlbGVtZW50KS5pcygnaW1nJyksXG5cdFx0XHRwYXRoID0gJyAnOyAvL9GH0LXQvCDQt9Cw0L/QvtC70L3Rj9GC0YxcblxuXHRcdC8v0LXRgdC70Lgg0LHRjdC60LPRgNCw0YPQvdC0INC60LDRgNGC0LjQvdC60LAg0YHRg9GJ0LXRgdGC0LLRg9C10YJcblx0XHRpZiAoYmFja2dyb3VuZEltZyAhPSAnbm9uZScpIHtcblx0XHRcdHBhdGggPSBiYWNrZ3JvdW5kSW1nLnJlcGxhY2UoJ3VybChcIicsICcnKS5yZXBsYWNlKCdcIiknLCAnJyk7IC8v0LTQtdC70LDQtdC8INGH0LjRgdGC0YvQuSDQv9GD0YLRjCDQtNC+INC60LDRgNGC0LjQvdC60Lhcblx0XHR9XG5cblx0XHQvL9C10YHQu9C4INC10YHRgtGMINC60LDRgNGC0LjQvdC60LBcblx0XHRpZiAoaW1nKSB7XG5cdFx0XHRwYXRoID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKTtcblx0XHR9XG5cblx0XHQvL9C10YHQu9C4INC90LDQv9C+0LvQvdC10L3QuNC1INC90LUg0L/Rg9GB0YLQvtC1XG5cdFx0aWYgKHBhdGgpIHJldHVybiBwYXRoXG5cdH0pO1xuXG5cdC8vMi7Qv9C+0YHRh9C40YLQsNGC0Ywg0L/RgNC+0YbQtdC90YJcblx0dmFyIF9zZXRQZXJjZW50cyA9IGZ1bmN0aW9uKHRvdGFsUGVyY2VudCwgY3VycmVudFBlcmNlbnQpIHtcblx0XHR2YXIgcGVyY2VudHMgPSBNYXRoLmNlaWwoY3VycmVudFBlcmNlbnQgLyB0b3RhbFBlcmNlbnQgKiAxMDApOyAvL9GH0YLQvtCx0Ysg0L7QutGA0YPQs9C70Y/Qu9C+0YHRjCDQsiDQsdC+0LvRjNGI0YPRjiDRgdGC0L7RgNC+0L3RgyDQuCDQtNC+0YXQvtC00LjQu9C+INC00L4gMTAwJVxuXHRcdFxuXHRcdCQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50cyArICclJyk7XG5cblx0XHQvL9C10YHQu9C4IDEwMCDQuCDQsdC+0LvQtdC1ICUsINGC0L4g0L/RgNGP0YfQtdC8INC/0YDQtdC70L7QsNC00LXRgFxuXHRcdGlmIChwZXJjZW50cyA+PSAxMDApIHtcblx0XHRcdHByZWxvYWRlci5kZWxheSg1MDApO1xuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoJ3Nsb3cnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnYm9keS1wcmVsb2FkJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0Ly8zLtC30LDQs9GA0YPQt9C40YLRjCDQutCw0YDRgtC40L3QutGDINC4INCy0YHRgtCw0LLQuNGC0Ywg0L/RgNC+0YbQtdC90YJcblx0dmFyIF9sb2FkSW1hZ2VzID0gZnVuY3Rpb24oaW1hZ2VzKSB7XG5cblx0XHQvL9C10YHQu9C4INC60LDRgNGC0LjQvdC+0Log0L3QtdGCINCy0L7QvtCx0YnQtSwg0YLQviDQv9GA0Y/Rh9C10Lwg0L/RgNC10LvQvtCw0LTQtdGAXG5cdFx0aWYgKCFpbWFnZXMubGVuZ3RoKSB7XG5cdFx0XHRwcmVsb2FkZXIuZGVsYXkoNTAwKTtcblx0XHRcdHByZWxvYWRlci5mYWRlT3V0KCdzbG93JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGJvZHkucmVtb3ZlQ2xhc3MoJ2JvZHktcHJlbG9hZCcpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly/QtdGB0LvQuCDQutCw0YDRgtC40L3QutC4INC10YHRgtGMLCDRgtC+INC40YHQv9C+0LvRjNC30YPQtdC8INGB0YLQsNC90LTQsNGA0YLQvdGL0Lkg0LzQtdGC0L7QtCDQtNC70Y8g0LzQsNGB0YHQuNCy0L7QslxuXHRcdGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltYWdlLCBpbmRleCwgaW1hZ2VzQXJyYXkpIHtcblxuXHRcdFx0Ly/RgdC+0LfQtNCw0LXQvCDQutCw0YDRgtC40L3QutGDINC30LDQvdC+0LLQviAo0YTQtdC50LrQvtCy0L4pXG5cdFx0XHR2YXIgZmFrZUltYWdlID0gJCgnPGltZz4nLCB7XG5cdFx0XHRcdGF0dHIgOiB7XG5cdFx0XHRcdFx0c3JjIDogaW1hZ2Vcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8v0L/RgNC+0LLQtdGA0Y/QtdC8INC30LDQs9GA0YPQt9C40LvQvtGB0Ywg0LvQuCDQuNC30L7QsdGA0LDQttC10L3QuNC1XG5cdFx0XHQvL2Vycm9yIC0g0LXRgdC70Lgg0L7RiNC40LHQutCwINCyINC/0YPRgtC4INC60LDRgNGC0LjQvdC60LgsINGC0L4g0LLRgdC1INGA0LDQstC90L4g0LfQsNCz0YDRg9C30LjRgtGMXG5cdFx0XHRmYWtlSW1hZ2Uub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cGVyY2VudHNUb3RhbCsrO1xuXHRcdFx0XHRfc2V0UGVyY2VudHMoaW1hZ2VzQXJyYXkubGVuZ3RoLCBwZXJjZW50c1RvdGFsKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdGJvZHkuYWRkQ2xhc3MoJ2JvZHktcHJlbG9hZCcpO1xuXG5cdFx0XHQvL9GCLtC6LiDQvNC10YLQvtC0IC5tYXAoKSDQstC+0LfQstGA0LDRidCw0LXRgiDQvtCx0YrQtdC60YIsINGC0L4g0L/RgNC10L7QsdGA0LDQt9GD0LXQvCDQtdCz0L4g0LIg0LzQsNGB0YHQuNCyXG5cdFx0XHR2YXIgaW1nc0FycmF5ID0gX2ltZ1BhdGgudG9BcnJheSgpO1xuXG5cdFx0XHRfbG9hZEltYWdlcyhpbWdzQXJyYXkpO1xuXHRcdH1cblx0fVxufSkoKTtcbiIsIi8vICDRgdC+0YXRgNCw0L3Rj9C10Lwg0LLRgdGOINGB0YbQtdC90YMg0L/QsNGA0LDQu9C70LDQutGB0LBcclxudmFyIGxheWVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhcmFsbGF4X19sYXllcicpO1xyXG5cclxuLy/Qv9C10YDQtdC00LDQtdC8INGE0YPQvdC60YbQuNGOINC+0LHRgNCw0LHQvtGC0YfQuNC6XHJcblxyXG52YXIgIG1vdmVMYXllcnMgPSBmdW5jdGlvbiAoZSkge1xyXG5cclxuICAgIHZhciBpbml0aWFsWCA9ICh3aW5kb3cuaW5uZXJXaWR0aC8yKSAtIGUucGFnZVgsICAvL9C90LDRhdC+0LTQuNC8INGG0LXQvdGC0YAg0L3QsNGI0LXQs9C+INGN0LrRgNCw0L3QsCDQv9C+INC+0YHQuCBYLCDQstGL0YfQuNGC0LDQtdC8INC/0L7Qu9C+0LbQtdC90LjQtSDQvNGL0YjQutC4INC/0L4g0L7RgdC4IFhcclxuICAgICAgICBpbml0aWFsWSA9ICh3aW5kb3cuaW5uZXJIZWlnaHQvMikgLSBlLnBhZ2VZO1xyXG5cclxuICAgIFtdLnNsaWNlLmNhbGwobGF5ZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChsYXllciwgaSkgeyAgICAgICAgLy8g0LIg0LzQtdGC0L7QtCDQvNCw0YHRgdC40LLQsCBzbGljZSDQv9C10YDQtdC00LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUgdGhpcyDQvdCw0YjQuCDRgdC70L7QuCAo0L/RgdC10LLQtNC+0LzQsNGB0YHQuNCyKNC60L7Qu9C70LXQutGG0LjRjiksINGH0YLQvtCx0Ysg0LzQvtC20L3QviDQsdGL0LvQviDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LzQtdGC0L7QtNGLINC80LDRgdGB0LjQstCwXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGRpdmlkZXIgPSBpLzEwMCxcclxuICAgICAgICAgICAgcG9zaXRpb25YID0gaW5pdGlhbFggKiBkaXZpZGVyLFxyXG4gICAgICAgICAgICBwb3NpdGlvblkgPSBpbml0aWFsWSAqIGRpdmlkZXIsXHJcbiAgICAgICAgICAgIGxheWVyU3R5bGUgPSBsYXllci5zdHlsZSwgICAgICAgICAgICAgICAgICAgICAgIC8v0LDQvdC40LzQuNGA0YPQtdC8INGB0LvQvtC5LCDRgdC+0YXRgNCw0L3Rj9C10Lwg0YHRgtC40LvRjCDRgdC70L7Rj1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgPSAndHJhbnNsYXRlM2QoJysgcG9zaXRpb25YICsncHgsICcrIHBvc2l0aW9uWSArJ3B4LCAwKSc7IC8v0LjQt9C80LXQvdGP0LXQvCDQsiDRgdGC0LjQu9C1INGB0LLQvtC50YHRgtCy0L4g0YLRgNCw0L3RgdGE0L7RgNC8INC/0L4g0L7RgdGP0LwgKFgsIFksIFopIGIg0Lgg0YHQvtGF0YDQsNC90Y/QtdC8XHJcblxyXG4gICAgICAgIGxheWVyU3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG4gICAgICAgIGxheWVyU3R5bGUuYm90dG9tID0gJy0nICsgJ3B4JztcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuLy8g0L/QuNGI0LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjQuVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZUxheWVycyk7IiwiLy8tLS0gTWFpbiBNZW51IE1vZHVsZSAtLS0tLS0tLS0tLS0tLy9cblxudmFyIE1haW5NZW51ID0gKGZ1bmN0aW9uKCkge1xuXHR2YXIgX2NsaWNrSGFtYnVyZ2VyID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5hdiA9ICQoJy5uYXZpZ2F0aW9uJyk7XG5cblx0XHQkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ2JvZHktYWN0aXZlJyk7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkKCcubWFpbi1tZW51JykudG9nZ2xlQ2xhc3MoJ21haW4tbWVudS1hY3RpdmUnKTtcblx0XHR9LCAzMDApO1xuXHRcdG5hdi50b2dnbGVDbGFzcygnbmF2aWdhdGlvbi1hY3RpdmUnKTtcblxuXHRcdCQoJy5oYW1idXJnZXInKS50b2dnbGVDbGFzcygnb24nKTtcblx0XHQkKCcuaGFtYnVyZ2VyLW1lbnUnKS50b2dnbGVDbGFzcygnYW5pbWF0ZScpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdCQoJy5oYW1idXJnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRfY2xpY2tIYW1idXJnZXIoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufSkoKTtcbiIsIi8vLS0tLS1TTElERVIgTU9EVUxFLS0tLS0vL1xuXG52YXIgU2xpZGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBzbGlkZXJDb250YWluZXIgPSAkKCcud29ya3NfX3NsaWRlcl9fY29udGFpbmVyJyksXG5cdFx0cHJldkJ0biA9IHNsaWRlckNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19uYXZfX2xpbmtfcHJldicpLFxuXHRcdG5leHRCdG4gPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9fbmF2X19saW5rX25leHQnKSxcblx0XHRwcmV2U2xpZGVySXRlbXMgPSBwcmV2QnRuLmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpLFxuXHRcdG5leHRTbGlkZXJJdGVtcyA9IG5leHRCdG4uZmluZCgnLnNsaWRlcl9fbmF2X19pdGVtJyksXG5cdFx0aXRlbXNMZW5ndGggPSBwcmV2U2xpZGVySXRlbXMubGVuZ3RoLFxuXHRcdGRpc3BsYXkgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW1nJyksXG5cdFx0YmlnSW1nID0gZGlzcGxheS5maW5kKCcuc2xpZGVyX19pbWdfYmlnJyksXG5cdFx0dGl0bGUgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW5mb19fc3VidGl0bGUnKSxcblx0XHR0ZWNobm9sb2d5ID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2luZm9fX3RlY2gnKSxcblx0XHRsaW5rID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2luZm9fX2J0bicpLFxuXHRcdGR1cmF0aW9uID0gNTAwLFxuXHRcdGlzQW5pbWF0ZSA9IGZhbHNlLFxuXHRcdGNvdW50ZXIgPSAwO1xuXG5cdHZhciBfRGVmYXVsdHMgPSBmdW5jdGlvbigpIHtcblx0XHQvLyBsZWZ0IGJ0blxuXHRcdHByZXZCdG5cblx0XHRcdC5maW5kKCcuc2xpZGVyX19uYXZfX2l0ZW0nKVxuXHRcdFx0LmVxKGNvdW50ZXIgLSAxKVxuXHRcdFx0LmFkZENsYXNzKCcuc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XG5cblx0XHQvLyByaWdodCBidG5cblx0XHRuZXh0QnRuXG5cdFx0XHQuZmluZCgnLnNsaWRlcl9fbmF2X19pdGVtJylcblx0XHRcdC5lcShjb3VudGVyICsgMSlcblx0XHRcdC5hZGRDbGFzcygnLnNsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xuXHR9O1xuXG5cdHZhciBfcHJldlNsaWRlQW5pbWF0ZSA9IGZ1bmN0aW9uKHNsaWRlckNvdW50ZXJQcmV2KSB7XG5cdFx0dmFyIHJlcUl0ZW1QcmV2ID0gcHJldlNsaWRlckl0ZW1zLmVxKHNsaWRlckNvdW50ZXJQcmV2IC0gMSksXG5cdFx0XHRhY3RpdmVJdGVtUHJldiA9IHByZXZTbGlkZXJJdGVtcy5maWx0ZXIoJy5zbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcblxuXHRcdGFjdGl2ZUl0ZW1QcmV2LmFuaW1hdGUoe1xuXHRcdFx0J3RvcCc6ICcxMDAlJyAvLycxMDAlJyBwcmV2XG5cdFx0fSwgZHVyYXRpb24pO1xuXG5cdFx0cmVxSXRlbVByZXYuYW5pbWF0ZSh7XG5cdFx0XHQndG9wJzogMFxuXHRcdH0sIGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcblx0XHRcdGFjdGl2ZUl0ZW1QcmV2LnJlbW92ZUNsYXNzKCdzbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKVxuXHRcdFx0XHQuY3NzKCd0b3AnLCAnLTEwMCUnKTsgLy8gJy0xMDAlJyBwcmV2XG5cdFx0XHRcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3NsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xuXG5cdFx0XHRpc0FuaW1hdGUgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgX25leHRTbGlkZUFuaW1hdGUgPSBmdW5jdGlvbihzbGlkZXJDb3VudGVyTmV4dCkge1xuXHRcdHZhciByZXFJdGVtTmV4dEluZGV4ID0gc2xpZGVyQ291bnRlck5leHQgKyAxLFxuXHRcdFx0YWN0aXZlSXRlbU5leHQgPSBuZXh0U2xpZGVySXRlbXMuZmlsdGVyKCcuc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XG5cblx0XHRpZiAocmVxSXRlbU5leHRJbmRleCA+IGl0ZW1zTGVuZ3RoIC0gMSkge1xuXHRcdFx0cmVxSXRlbU5leHRJbmRleCA9IDA7XG5cdFx0fVxuXG5cdFx0dmFyIHJlcUl0ZW1OZXh0ID0gbmV4dFNsaWRlckl0ZW1zLmVxKHJlcUl0ZW1OZXh0SW5kZXgpO1xuXG5cdFx0YWN0aXZlSXRlbU5leHQuYW5pbWF0ZSh7XG5cdFx0XHQndG9wJzogJy0xMDAlJyAvLyctMTAwJScgbmV4dFxuXHRcdH0sIGR1cmF0aW9uKTtcblxuXHRcdHJlcUl0ZW1OZXh0LmFuaW1hdGUoe1xuXHRcdFx0J3RvcCc6IDBcblx0XHR9LCBkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRhY3RpdmVJdGVtTmV4dC5yZW1vdmVDbGFzcygnc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJylcblx0XHRcdFx0LmNzcygndG9wJywgJzEwMCUnKTsgLy8gJzEwMCUnIG5leHRcblx0XHRcdFxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XG5cblx0XHRcdGlzQW5pbWF0ZSA9IGZhbHNlO1xuXHRcdH0pO1xuXG5cdH07XG5cblx0dmFyIF9nZXREYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRhdGFPYmogPSB7XG5cdFx0XHRpbWFnZXMgOiBbXSxcblx0XHRcdHRpdGxlcyA6IFtdLFxuXHRcdFx0dGVjaG5vbG9neXMgOiBbXSxcblx0XHRcdGxpbmtzIDogW11cblx0XHR9O1xuXG5cdFx0cHJldlNsaWRlckl0ZW1zLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpOyAvL2VhY2ggZnJvbSAncHJldlNsaWRlckl0ZW1zJ1xuXG5cdFx0XHRkYXRhT2JqLmltYWdlcy5wdXNoKCR0aGlzLmRhdGEoJ3NyYycpKTtcblx0XHRcdGRhdGFPYmoudGl0bGVzLnB1c2goJHRoaXMuZGF0YSgndGl0bGUnKSk7XG5cdFx0XHRkYXRhT2JqLnRlY2hub2xvZ3lzLnB1c2goJHRoaXMuZGF0YSgndGVjaCcpKTtcblx0XHRcdGRhdGFPYmoubGlua3MucHVzaCgkdGhpcy5kYXRhKCdsaW5rJykpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGRhdGFPYmo7XG5cdH07XG5cblx0dmFyIF9jaGFuZ2VEYXRhID0gZnVuY3Rpb24oY2hhbmdlRGF0YUNvdW50ZXIpIHtcblx0XHR2YXIgX2RhdGEgPSBfZ2V0RGF0YSgpO1xuXG5cdFx0YmlnSW1nXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxuXHRcdFx0LmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLmF0dHIoJ3NyYycsIF9kYXRhLmltYWdlc1tjaGFuZ2VEYXRhQ291bnRlcl0pO1xuXHRcdFx0fSlcblx0XHRcdC5mYWRlSW4oZHVyYXRpb24pO1xuXG5cdFx0dGl0bGVcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXG5cdFx0XHQuZmFkZU91dChkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykudGV4dChfZGF0YS50aXRsZXNbY2hhbmdlRGF0YUNvdW50ZXJdKVxuXHRcdFx0fSlcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXG5cdFx0XHQuZmFkZUluKGR1cmF0aW9uKTtcblxuXHRcdHRlY2hub2xvZ3lcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXG5cdFx0XHQuZmFkZU91dChkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykudGV4dChfZGF0YS50ZWNobm9sb2d5c1tjaGFuZ2VEYXRhQ291bnRlcl0pXG5cdFx0XHR9KVxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcblx0XHRcdC5mYWRlSW4oZHVyYXRpb24pO1xuXG5cdFx0bGluay5hdHRyKCdocmVmJywgX2RhdGEubGlua3NbY2hhbmdlRGF0YUNvdW50ZXJdKTtcblx0fTtcblxuXHR2YXIgX21vdmVTbGlkZSA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuXHRcdHZhciBkaXJlY3Rpb25zID0ge1xuXHRcdFx0bmV4dCA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoY291bnRlciA8IGl0ZW1zTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdGNvdW50ZXIrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb3VudGVyID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHByZXYgOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKGNvdW50ZXIgPiAwKSB7XG5cdFx0XHRcdFx0Y291bnRlci0tO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvdW50ZXIgPSBpdGVtc0xlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0ZGlyZWN0aW9uc1tkaXJlY3Rpb25dKCk7XG5cblxuXHRcdGlmKCFpc0FuaW1hdGUpIHtcblxuXHRcdFx0aXNBbmltYXRlID0gdHJ1ZTtcblxuXHRcdFx0X25leHRTbGlkZUFuaW1hdGUoY291bnRlcik7XG5cdFx0XHRfcHJldlNsaWRlQW5pbWF0ZShjb3VudGVyKTtcblx0XHRcdF9jaGFuZ2VEYXRhKGNvdW50ZXIpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0X0RlZmF1bHRzKCk7XG5cblx0XHRcdCQoJy5zbGlkZXJfX25hdl9fbGlua19wcmV2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0X21vdmVTbGlkZSgncHJldicpO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQoJy5zbGlkZXJfX25hdl9fbGlua19uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0X21vdmVTbGlkZSgnbmV4dCcpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59KSgpOyIsIi8vLS0tLS0gQ29udGFjdC1Gb3JtIE1vZHVsZSAtLS0tLS0vL1xuXG52YXIgQ29udGFjdEZvcm0gPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIGZvcm0gPSAkKCcuY29udGFjdC1mb3JtX19pbnB1dC1ncm91cCcpLFxuXHRcdGlucHV0TmFtZSA9ICQoJyNjb250YWN0LWZvcm1fX2lucHV0X19uYW1lJyksXG5cdFx0aW5wdXRFbWFpbCA9ICQoJyNjb250YWN0LWZvcm1fX2lucHV0X19lbWFpbCcpLFxuXHRcdGlucHV0TWVzc2FnZSA9ICQoJyNjb250YWN0LWZvcm1fX2lucHV0X19tZXNzYWdlJyksXG5cdFx0YnRuU3VibWl0ID0gZm9ybS5maW5kKCcuYnRuX3N1Ym1pdCcpLFxuXHRcdGJ0blJlc2V0ID0gZm9ybS5maW5kKCcuYnRuX3Jlc2V0JyksXG5cdFx0cG9wVXAgPSAkKCcucG9wdXAnKSxcblx0XHRwb3BVcFRleHQgPSAkKCcucG9wdXBfdGV4dCcpLFxuXHRcdHBvcFVwQ2xvc2UgPSAkKCcucG9wdXBfY2xvc2UnKTtcblxuXHR2YXIgX2NsaWNrU3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgbmFtZVZhbHVlID0gaW5wdXROYW1lLnZhbCgpLFxuXHRcdFx0ZW1haWxWYWx1ZSA9IGlucHV0RW1haWwudmFsKCksXG5cdFx0XHRtZXNzYWdlVmFsdWUgPSBpbnB1dE1lc3NhZ2UudmFsKCk7XG5cblx0XHRpZiAoIW5hbWVWYWx1ZSA9PT0gdHJ1ZSB8fCAhZW1haWxWYWx1ZSA9PT0gdHJ1ZSB8fCAhbWVzc2FnZVZhbHVlID09PSB0cnVlKSB7XG5cblx0XHRcdHBvcFVwVGV4dC5odG1sKCfQl9Cw0L/QvtC70L3QuNGC0LUg0LLRgdC1INC/0L7Qu9GPIScpO1xuXHRcdFx0cG9wVXAuYWRkQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXHRcdFxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHZhciBlbWFpbF9yZWcgPSAvXihbYS16MC05X1xcLi1dKStAW2EtejAtOS1dK1xcLihbYS16XXsyLDR9XFwuKT9bYS16XXsyLDR9JC9pO1xuXG5cdFx0XHRpZiAoIWVtYWlsX3JlZy50ZXN0KGlucHV0RW1haWwudmFsKCkpKSB7XG5cblx0XHQgICAgICAgIGlucHV0RW1haWwuY3NzKCdib3JkZXItY29sb3InLCAncmVkJyk7XG5cdFx0ICAgICAgICBwb3BVcFRleHQuaHRtbCgnRS1tYWlsINCy0LLQtdC00ZHQvSDQvdC10LLQtdGA0L3QviEnKTtcblx0XHQgICAgICAgIHBvcFVwLmFkZENsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblx0XHQgICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHBvcFVwLnJlbW92ZUNsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblx0XHRcdFx0fSwgMTAwMDApO1xuXG5cdFx0ICAgIH0gZWxzZSB7XG5cdFx0ICAgIFx0JC5hamF4KHtcblx0XHRcdFx0XHR1cmw6ICcuLi9hc3NldHMvcGhwL2NvbnRhY3QtZm9ybS5waHAnLFxuXHRcdFx0XHRcdG1ldGhvZDogJ3Bvc3QnLFxuXHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdG5hbWU6IG5hbWVWYWx1ZSxcblx0XHRcdFx0XHRcdGVtYWlsOiBlbWFpbFZhbHVlLFxuXHRcdFx0XHRcdFx0bWVzc2FnZTogbWVzc2FnZVZhbHVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KS5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2RvbmUnKTtcblx0XHRcdFx0XHRwb3BVcFRleHQuaHRtbCgn0KHQvtC+0LHRidC10L3QuNC1INC+0YLQv9GA0LDQstC70LXQvdC+IScpO1xuXHRcdFx0XHRcdHBvcFVwLmFkZENsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblx0XHRcdFx0XHRfcmVzZXQoKTtcblx0XHRcdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHBvcFVwLnJlbW92ZUNsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblx0XHRcdFx0XHR9LCAxMDAwMCk7XG5cdFx0XHRcdH0pLmZhaWwoZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3InKTtcblx0XHRcdFx0XHRwb3BVcFRleHQuaHRtbCgn0J/RgNC+0LjQt9C+0YjQu9CwINC+0YjQuNCx0LrQsCEnKTtcblx0XHRcdFx0XHRwb3BVcC5hZGRDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cdFx0XHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cdFx0XHRcdFx0fSwgMTAwMDApO1xuXHRcdFx0XHR9KTtcdFxuXHRcdCAgICB9XG5cdFx0fVx0XHRcblx0fTtcblxuXHR2YXIgX3Jlc2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0aW5wdXROYW1lLnZhbCgnJyk7XG5cdFx0aW5wdXRFbWFpbC52YWwoJycpO1xuXHRcdGlucHV0TWVzc2FnZS52YWwoJycpO1xuXHRcdHBvcFVwLnJlbW92ZUNsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmJ0bl9zdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRfY2xpY2tTdWJtaXQoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKCcucG9wdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuXHQgICAgICAgIFx0cG9wVXAucmVtb3ZlQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXG5cdCAgICAgICAgXHRfcmVzZXQoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKCcuYnRuX3Jlc2V0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0X3Jlc2V0KCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxufSkoKTsiLCIvLyAtLS0tIE1PRFVMRVMgSU5JVElBTElaQVRJT04gLS0tLS0gLy9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cdFByZWxvYWRlci5pbml0KCk7XG5cblx0aWYgKCQoJyNoYW1idXJnZXInKS5sZW5ndGgpIHtcblx0XHRNYWluTWVudS5pbml0KCk7XG5cdH1cblxuXHRpZiAoJCgnLmFycm93LWRvd24nKS5sZW5ndGgpIHtcblx0XHRUZXN0LmluaXQoKTtcblx0fVxuXG5cdGlmICgkKCcjd29ya3NfX3NsaWRlcicpLmxlbmd0aCkge1xuXHRcdFNsaWRlci5pbml0KCk7XG5cdH1cblxuXHRpZigkKCcud29ya3NfX2Zvcm0nKS5sZW5ndGgpIHtcblx0XHRDb250YWN0Rm9ybS5pbml0KCk7XG5cdH1cblxuXHRpZiAoJCgnI2Jsb2cnKS5sZW5ndGgpIHtcblx0XHRCbG9nTWVudS5pbml0KCk7XG5cdH1cbn0pOyJdfQ==
