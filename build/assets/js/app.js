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
            divider = i/50,
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

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIiwicGFyYWxsYXguanMiLCJtYWluLW1lbnUuanMiLCJzbGlkZXIuanMiLCJjb250YWN0LWZvcm0uanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLS0tLS0tLSBUZXN0IE1vZHVsZSAtLS0tLS0tLS8vXG5cbnZhciBUZXN0ID0gKGZ1bmN0aW9uKCkge1xuXHR2YXIgX2Zyb21UZXN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YWxlcnQoXCJIaSB0aGVyZSEgSSdtIGluc2lkZSBUZXN0IE1vZHVsZVwiKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcuYXJyb3ctZG93bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdChlKTtcblx0XHRcdFx0X2Zyb21UZXN0KCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXHRcbn0pKCk7XG4iLCIvLy0tLS0tLSBQcmVsb2FkZXIgTW9kdWxlIC0tLS0tLS0vL1xuXG52YXIgUHJlbG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuXHRcblx0dmFyIHByZWxvYWRlciA9ICQoJy5wcmVsb2FkZXInKSxcblx0XHRib2R5ID0gJCgnYm9keScpLFxuXHRcdHBlcmNlbnRzVG90YWwgPSAwOyAvL9GB0LrQvtC70YzQutC+INC60LDRgNGC0LjQvdC+0Log0LfQsNCz0YDRg9C20LXQvdC+XG5cblx0Ly8t0J/QvtC90LDQtNC+0LHRj9GC0YHRjy06XG5cdFx0Ly8xLtC80LXRgtC+0LQsINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LLRi9GH0LvQtdC90Y/RgtGMINC/0YPRgtC4INC00L4g0LrQsNGA0YLQuNC90L7QuiDQuCDRhNC+0YDQvNC40YDQvtCy0LDRgtGMINC80LDRgdGB0LjQslxuXHRcdC8vMi7QvNC10YLQvtC0LCDQutC+0YLRgNGL0Lkg0YHRh9C40YLQsNC10YIg0Lgg0LLRi9GB0YLQsNCy0LvRj9C10YIg0LrQvtC7LdCy0L4g0LfQsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0L7RhtC10L3RgtC+0LJcblx0XHQvLzMu0LzQtdGC0L7QtCDQstGB0YLQsNCy0LrQuCDQutCw0YDRgtC40L3QutC4INC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDRjdGC0L7Qs9C+INCy0YvRgdGH0LjRgtGL0LLQsNC90LjRjyDQv9GA0L7RhtC10L3RgtC+0LJcblxuXHQvLzEu0L3QsNCx0L7RgCDQutCw0YDRgtC40L3QvtC6XG5cdHZhciBfaW1nUGF0aCA9ICQoJyonKS5tYXAoZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcblx0XHR2YXIgYmFja2dyb3VuZEltZyA9ICQoZWxlbWVudCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXG5cdFx0XHRpbWcgPSAkKGVsZW1lbnQpLmlzKCdpbWcnKSxcblx0XHRcdHBhdGggPSAnICc7IC8v0YfQtdC8INC30LDQv9C+0LvQvdGP0YLRjFxuXG5cdFx0Ly/QtdGB0LvQuCDQsdGN0LrQs9GA0LDRg9C90LQg0LrQsNGA0YLQuNC90LrQsCDRgdGD0YnQtdGB0YLQstGD0LXRglxuXHRcdGlmIChiYWNrZ3JvdW5kSW1nICE9ICdub25lJykge1xuXHRcdFx0cGF0aCA9IGJhY2tncm91bmRJbWcucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTsgLy/QtNC10LvQsNC10Lwg0YfQuNGB0YLRi9C5INC/0YPRgtGMINC00L4g0LrQsNGA0YLQuNC90LrQuFxuXHRcdH1cblxuXHRcdC8v0LXRgdC70Lgg0LXRgdGC0Ywg0LrQsNGA0YLQuNC90LrQsFxuXHRcdGlmIChpbWcpIHtcblx0XHRcdHBhdGggPSAkKGVsZW1lbnQpLmF0dHIoJ3NyYycpO1xuXHRcdH1cblxuXHRcdC8v0LXRgdC70Lgg0L3QsNC/0L7Qu9C90LXQvdC40LUg0L3QtSDQv9GD0YHRgtC+0LVcblx0XHRpZiAocGF0aCkgcmV0dXJuIHBhdGhcblx0fSk7XG5cblx0Ly8yLtC/0L7RgdGH0LjRgtCw0YLRjCDQv9GA0L7RhtC10L3RglxuXHR2YXIgX3NldFBlcmNlbnRzID0gZnVuY3Rpb24odG90YWxQZXJjZW50LCBjdXJyZW50UGVyY2VudCkge1xuXHRcdHZhciBwZXJjZW50cyA9IE1hdGguY2VpbChjdXJyZW50UGVyY2VudCAvIHRvdGFsUGVyY2VudCAqIDEwMCk7IC8v0YfRgtC+0LHRiyDQvtC60YDRg9Cz0LvRj9C70L7RgdGMINCyINCx0L7Qu9GM0YjRg9GOINGB0YLQvtGA0L7QvdGDINC4INC00L7RhdC+0LTQuNC70L4g0LTQviAxMDAlXG5cdFx0XG5cdFx0JCgnLnByZWxvYWRlcl9fcGVyY2VudHMnKS50ZXh0KHBlcmNlbnRzICsgJyUnKTtcblxuXHRcdC8v0LXRgdC70LggMTAwINC4INCx0L7Qu9C10LUgJSwg0YLQviDQv9GA0Y/Rh9C10Lwg0L/RgNC10LvQvtCw0LTQtdGAXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xuXHRcdFx0cHJlbG9hZGVyLmRlbGF5KDUwMCk7XG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgnc2xvdycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRib2R5LnJlbW92ZUNsYXNzKCdib2R5LXByZWxvYWQnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHQvLzMu0LfQsNCz0YDRg9C30LjRgtGMINC60LDRgNGC0LjQvdC60YMg0Lgg0LLRgdGC0LDQstC40YLRjCDQv9GA0L7RhtC10L3RglxuXHR2YXIgX2xvYWRJbWFnZXMgPSBmdW5jdGlvbihpbWFnZXMpIHtcblxuXHRcdC8v0LXRgdC70Lgg0LrQsNGA0YLQuNC90L7QuiDQvdC10YIg0LLQvtC+0LHRidC1LCDRgtC+INC/0YDRj9GH0LXQvCDQv9GA0LXQu9C+0LDQtNC10YBcblx0XHRpZiAoIWltYWdlcy5sZW5ndGgpIHtcblx0XHRcdHByZWxvYWRlci5kZWxheSg1MDApO1xuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoJ3Nsb3cnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnYm9keS1wcmVsb2FkJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL9C10YHQu9C4INC60LDRgNGC0LjQvdC60Lgg0LXRgdGC0YwsINGC0L4g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0YHRgtCw0L3QtNCw0YDRgtC90YvQuSDQvNC10YLQvtC0INC00LvRjyDQvNCw0YHRgdC40LLQvtCyXG5cdFx0aW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1hZ2UsIGluZGV4LCBpbWFnZXNBcnJheSkge1xuXG5cdFx0XHQvL9GB0L7Qt9C00LDQtdC8INC60LDRgNGC0LjQvdC60YMg0LfQsNC90L7QstC+ICjRhNC10LnQutC+0LLQvilcblx0XHRcdHZhciBmYWtlSW1hZ2UgPSAkKCc8aW1nPicsIHtcblx0XHRcdFx0YXR0ciA6IHtcblx0XHRcdFx0XHRzcmMgOiBpbWFnZVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly/Qv9GA0L7QstC10YDRj9C10Lwg0LfQsNCz0YDRg9C30LjQu9C+0YHRjCDQu9C4INC40LfQvtCx0YDQsNC20LXQvdC40LVcblx0XHRcdC8vZXJyb3IgLSDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LIg0L/Rg9GC0Lgg0LrQsNGA0YLQuNC90LrQuCwg0YLQviDQstGB0LUg0YDQsNCy0L3QviDQt9Cw0LPRgNGD0LfQuNGC0Yxcblx0XHRcdGZha2VJbWFnZS5vbignbG9hZCBlcnJvcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XG5cdFx0XHRcdF9zZXRQZXJjZW50cyhpbWFnZXNBcnJheS5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ym9keS5hZGRDbGFzcygnYm9keS1wcmVsb2FkJyk7XG5cblx0XHRcdC8v0YIu0LouINC80LXRgtC+0LQgLm1hcCgpINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LHRitC10LrRgiwg0YLQviDQv9GA0LXQvtCx0YDQsNC30YPQtdC8INC10LPQviDQsiDQvNCw0YHRgdC40LJcblx0XHRcdHZhciBpbWdzQXJyYXkgPSBfaW1nUGF0aC50b0FycmF5KCk7XG5cblx0XHRcdF9sb2FkSW1hZ2VzKGltZ3NBcnJheSk7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiLy8gINGB0L7RhdGA0LDQvdGP0LXQvCDQstGB0Y4g0YHRhtC10L3RgyDQv9Cw0YDQsNC70LvQsNC60YHQsFxyXG52YXIgbGF5ZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFyYWxsYXhfX2xheWVyJyk7XHJcblxyXG4vL9C/0LXRgNC10LTQsNC10Lwg0YTRg9C90LrRhtC40Y4g0L7QsdGA0LDQsdC+0YLRh9C40LpcclxuXHJcbnZhciAgbW92ZUxheWVycyA9IGZ1bmN0aW9uIChlKSB7XHJcblxyXG4gICAgdmFyIGluaXRpYWxYID0gKHdpbmRvdy5pbm5lcldpZHRoLzIpIC0gZS5wYWdlWCwgIC8v0L3QsNGF0L7QtNC40Lwg0YbQtdC90YLRgCDQvdCw0YjQtdCz0L4g0Y3QutGA0LDQvdCwINC/0L4g0L7RgdC4IFgsINCy0YvRh9C40YLQsNC10Lwg0L/QvtC70L7QttC10L3QuNC1INC80YvRiNC60Lgg0L/QviDQvtGB0LggWFxyXG4gICAgICAgIGluaXRpYWxZID0gKHdpbmRvdy5pbm5lckhlaWdodC8yKSAtIGUucGFnZVk7XHJcblxyXG4gICAgW10uc2xpY2UuY2FsbChsYXllcnMpLmZvckVhY2goZnVuY3Rpb24gKGxheWVyLCBpKSB7ICAgICAgICAvLyDQsiDQvNC10YLQvtC0INC80LDRgdGB0LjQstCwIHNsaWNlINC/0LXRgNC10LTQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSB0aGlzINC90LDRiNC4INGB0LvQvtC4ICjQv9GB0LXQstC00L7QvNCw0YHRgdC40LIo0LrQvtC70LvQtdC60YbQuNGOKSwg0YfRgtC+0LHRiyDQvNC+0LbQvdC+INCx0YvQu9C+INC40YHQv9C+0LvRjNC30L7QstCw0YLRjCDQvNC10YLQvtC00Ysg0LzQsNGB0YHQuNCy0LBcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgZGl2aWRlciA9IGkvNTAsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uWCA9IGluaXRpYWxYICogZGl2aWRlcixcclxuICAgICAgICAgICAgcG9zaXRpb25ZID0gaW5pdGlhbFkgKiBkaXZpZGVyLFxyXG4gICAgICAgICAgICBsYXllclN0eWxlID0gbGF5ZXIuc3R5bGUsICAgICAgICAgICAgICAgICAgICAgICAvL9Cw0L3QuNC80LjRgNGD0LXQvCDRgdC70L7QuSwg0YHQvtGF0YDQsNC90Y/QtdC8INGB0YLQuNC70Ywg0YHQu9C+0Y9cclxuICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZTNkKCcrIHBvc2l0aW9uWCArJ3B4LCAnKyBwb3NpdGlvblkgKydweCwgMCknOyAvL9C40LfQvNC10L3Rj9C10Lwg0LIg0YHRgtC40LvQtSDRgdCy0L7QudGB0YLQstC+INGC0YDQsNC90YHRhNC+0YDQvCDQv9C+INC+0YHRj9C8IChYLCBZLCBaKSBiINC4INGB0L7RhdGA0LDQvdGP0LXQvFxyXG5cclxuICAgICAgICBsYXllclN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuICAgICAgICBsYXllclN0eWxlLmJvdHRvbSA9ICctJyArICdweCc7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbi8vINC/0LjRiNC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Llcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVMYXllcnMpOyIsIi8vLS0tIE1haW4gTWVudSBNb2R1bGUgLS0tLS0tLS0tLS0tLS8vXG5cbnZhciBNYWluTWVudSA9IChmdW5jdGlvbigpIHtcblx0dmFyIF9jbGlja0hhbWJ1cmdlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuYXYgPSAkKCcubmF2aWdhdGlvbicpO1xuXG5cdFx0JCgnYm9keScpLnRvZ2dsZUNsYXNzKCdib2R5LWFjdGl2ZScpO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0JCgnLm1haW4tbWVudScpLnRvZ2dsZUNsYXNzKCdtYWluLW1lbnUtYWN0aXZlJyk7XG5cdFx0fSwgMzAwKTtcblx0XHRuYXYudG9nZ2xlQ2xhc3MoJ25hdmlnYXRpb24tYWN0aXZlJyk7XG5cblx0XHQkKCcuaGFtYnVyZ2VyJykudG9nZ2xlQ2xhc3MoJ29uJyk7XG5cdFx0JCgnLmhhbWJ1cmdlci1tZW51JykudG9nZ2xlQ2xhc3MoJ2FuaW1hdGUnKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcuaGFtYnVyZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0X2NsaWNrSGFtYnVyZ2VyKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn0pKCk7XG4iLCIvLy0tLS0tU0xJREVSIE1PRFVMRS0tLS0tLy9cblxudmFyIFNsaWRlciA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgc2xpZGVyQ29udGFpbmVyID0gJCgnLndvcmtzX19zbGlkZXJfX2NvbnRhaW5lcicpLFxuXHRcdHByZXZCdG4gPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9fbmF2X19saW5rX3ByZXYnKSxcblx0XHRuZXh0QnRuID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX25hdl9fbGlua19uZXh0JyksXG5cdFx0cHJldlNsaWRlckl0ZW1zID0gcHJldkJ0bi5maW5kKCcuc2xpZGVyX19uYXZfX2l0ZW0nKSxcblx0XHRuZXh0U2xpZGVySXRlbXMgPSBuZXh0QnRuLmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpLFxuXHRcdGl0ZW1zTGVuZ3RoID0gcHJldlNsaWRlckl0ZW1zLmxlbmd0aCxcblx0XHRkaXNwbGF5ID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2ltZycpLFxuXHRcdGJpZ0ltZyA9IGRpc3BsYXkuZmluZCgnLnNsaWRlcl9faW1nX2JpZycpLFxuXHRcdHRpdGxlID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX2luZm9fX3N1YnRpdGxlJyksXG5cdFx0dGVjaG5vbG9neSA9IHNsaWRlckNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pbmZvX190ZWNoJyksXG5cdFx0bGluayA9IHNsaWRlckNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pbmZvX19idG4nKSxcblx0XHRkdXJhdGlvbiA9IDUwMCxcblx0XHRpc0FuaW1hdGUgPSBmYWxzZSxcblx0XHRjb3VudGVyID0gMDtcblxuXHR2YXIgX0RlZmF1bHRzID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8gbGVmdCBidG5cblx0XHRwcmV2QnRuXG5cdFx0XHQuZmluZCgnLnNsaWRlcl9fbmF2X19pdGVtJylcblx0XHRcdC5lcShjb3VudGVyIC0gMSlcblx0XHRcdC5hZGRDbGFzcygnLnNsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xuXG5cdFx0Ly8gcmlnaHQgYnRuXG5cdFx0bmV4dEJ0blxuXHRcdFx0LmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpXG5cdFx0XHQuZXEoY291bnRlciArIDEpXG5cdFx0XHQuYWRkQ2xhc3MoJy5zbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcblx0fTtcblxuXHR2YXIgX3ByZXZTbGlkZUFuaW1hdGUgPSBmdW5jdGlvbihzbGlkZXJDb3VudGVyUHJldikge1xuXHRcdHZhciByZXFJdGVtUHJldiA9IHByZXZTbGlkZXJJdGVtcy5lcShzbGlkZXJDb3VudGVyUHJldiAtIDEpLFxuXHRcdFx0YWN0aXZlSXRlbVByZXYgPSBwcmV2U2xpZGVySXRlbXMuZmlsdGVyKCcuc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XG5cblx0XHRhY3RpdmVJdGVtUHJldi5hbmltYXRlKHtcblx0XHRcdCd0b3AnOiAnMTAwJScgLy8nMTAwJScgcHJldlxuXHRcdH0sIGR1cmF0aW9uKTtcblxuXHRcdHJlcUl0ZW1QcmV2LmFuaW1hdGUoe1xuXHRcdFx0J3RvcCc6IDBcblx0XHR9LCBkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRhY3RpdmVJdGVtUHJldi5yZW1vdmVDbGFzcygnc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJylcblx0XHRcdFx0LmNzcygndG9wJywgJy0xMDAlJyk7IC8vICctMTAwJScgcHJldlxuXHRcdFx0XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdzbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcblxuXHRcdFx0aXNBbmltYXRlID0gZmFsc2U7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIF9uZXh0U2xpZGVBbmltYXRlID0gZnVuY3Rpb24oc2xpZGVyQ291bnRlck5leHQpIHtcblx0XHR2YXIgcmVxSXRlbU5leHRJbmRleCA9IHNsaWRlckNvdW50ZXJOZXh0ICsgMSxcblx0XHRcdGFjdGl2ZUl0ZW1OZXh0ID0gbmV4dFNsaWRlckl0ZW1zLmZpbHRlcignLnNsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xuXG5cdFx0aWYgKHJlcUl0ZW1OZXh0SW5kZXggPiBpdGVtc0xlbmd0aCAtIDEpIHtcblx0XHRcdHJlcUl0ZW1OZXh0SW5kZXggPSAwO1xuXHRcdH1cblxuXHRcdHZhciByZXFJdGVtTmV4dCA9IG5leHRTbGlkZXJJdGVtcy5lcShyZXFJdGVtTmV4dEluZGV4KTtcblxuXHRcdGFjdGl2ZUl0ZW1OZXh0LmFuaW1hdGUoe1xuXHRcdFx0J3RvcCc6ICctMTAwJScgLy8nLTEwMCUnIG5leHRcblx0XHR9LCBkdXJhdGlvbik7XG5cblx0XHRyZXFJdGVtTmV4dC5hbmltYXRlKHtcblx0XHRcdCd0b3AnOiAwXG5cdFx0fSwgZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xuXHRcdFx0YWN0aXZlSXRlbU5leHQucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpXG5cdFx0XHRcdC5jc3MoJ3RvcCcsICcxMDAlJyk7IC8vICcxMDAlJyBuZXh0XG5cdFx0XHRcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3NsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xuXG5cdFx0XHRpc0FuaW1hdGUgPSBmYWxzZTtcblx0XHR9KTtcblxuXHR9O1xuXG5cdHZhciBfZ2V0RGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkYXRhT2JqID0ge1xuXHRcdFx0aW1hZ2VzIDogW10sXG5cdFx0XHR0aXRsZXMgOiBbXSxcblx0XHRcdHRlY2hub2xvZ3lzIDogW10sXG5cdFx0XHRsaW5rcyA6IFtdXG5cdFx0fTtcblxuXHRcdHByZXZTbGlkZXJJdGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTsgLy9lYWNoIGZyb20gJ3ByZXZTbGlkZXJJdGVtcydcblxuXHRcdFx0ZGF0YU9iai5pbWFnZXMucHVzaCgkdGhpcy5kYXRhKCdzcmMnKSk7XG5cdFx0XHRkYXRhT2JqLnRpdGxlcy5wdXNoKCR0aGlzLmRhdGEoJ3RpdGxlJykpO1xuXHRcdFx0ZGF0YU9iai50ZWNobm9sb2d5cy5wdXNoKCR0aGlzLmRhdGEoJ3RlY2gnKSk7XG5cdFx0XHRkYXRhT2JqLmxpbmtzLnB1c2goJHRoaXMuZGF0YSgnbGluaycpKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBkYXRhT2JqO1xuXHR9O1xuXG5cdHZhciBfY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGNoYW5nZURhdGFDb3VudGVyKSB7XG5cdFx0dmFyIF9kYXRhID0gX2dldERhdGEoKTtcblxuXHRcdGJpZ0ltZ1xuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcblx0XHRcdC5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKS5hdHRyKCdzcmMnLCBfZGF0YS5pbWFnZXNbY2hhbmdlRGF0YUNvdW50ZXJdKTtcblx0XHRcdH0pXG5cdFx0XHQuZmFkZUluKGR1cmF0aW9uKTtcblxuXHRcdHRpdGxlXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxuXHRcdFx0LmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLnRleHQoX2RhdGEudGl0bGVzW2NoYW5nZURhdGFDb3VudGVyXSlcblx0XHRcdH0pXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxuXHRcdFx0LmZhZGVJbihkdXJhdGlvbik7XG5cblx0XHR0ZWNobm9sb2d5XG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxuXHRcdFx0LmZhZGVPdXQoZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLnRleHQoX2RhdGEudGVjaG5vbG9neXNbY2hhbmdlRGF0YUNvdW50ZXJdKVxuXHRcdFx0fSlcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXG5cdFx0XHQuZmFkZUluKGR1cmF0aW9uKTtcblxuXHRcdGxpbmsuYXR0cignaHJlZicsIF9kYXRhLmxpbmtzW2NoYW5nZURhdGFDb3VudGVyXSk7XG5cdH07XG5cblx0dmFyIF9tb3ZlU2xpZGUgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcblx0XHR2YXIgZGlyZWN0aW9ucyA9IHtcblx0XHRcdG5leHQgOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKGNvdW50ZXIgPCBpdGVtc0xlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRjb3VudGVyKys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y291bnRlciA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRwcmV2IDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChjb3VudGVyID4gMCkge1xuXHRcdFx0XHRcdGNvdW50ZXItLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb3VudGVyID0gaXRlbXNMZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGRpcmVjdGlvbnNbZGlyZWN0aW9uXSgpO1xuXG5cblx0XHRpZighaXNBbmltYXRlKSB7XG5cblx0XHRcdGlzQW5pbWF0ZSA9IHRydWU7XG5cblx0XHRcdF9uZXh0U2xpZGVBbmltYXRlKGNvdW50ZXIpO1xuXHRcdFx0X3ByZXZTbGlkZUFuaW1hdGUoY291bnRlcik7XG5cdFx0XHRfY2hhbmdlRGF0YShjb3VudGVyKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdF9EZWZhdWx0cygpO1xuXG5cdFx0XHQkKCcuc2xpZGVyX19uYXZfX2xpbmtfcHJldicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdF9tb3ZlU2xpZGUoJ3ByZXYnKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKCcuc2xpZGVyX19uYXZfX2xpbmtfbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdF9tb3ZlU2xpZGUoJ25leHQnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufSkoKTsiLCIvLy0tLS0tIENvbnRhY3QtRm9ybSBNb2R1bGUgLS0tLS0tLy9cblxudmFyIENvbnRhY3RGb3JtID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBmb3JtID0gJCgnLmNvbnRhY3QtZm9ybV9faW5wdXQtZ3JvdXAnKSxcblx0XHRpbnB1dE5hbWUgPSAkKCcjY29udGFjdC1mb3JtX19pbnB1dF9fbmFtZScpLFxuXHRcdGlucHV0RW1haWwgPSAkKCcjY29udGFjdC1mb3JtX19pbnB1dF9fZW1haWwnKSxcblx0XHRpbnB1dE1lc3NhZ2UgPSAkKCcjY29udGFjdC1mb3JtX19pbnB1dF9fbWVzc2FnZScpLFxuXHRcdGJ0blN1Ym1pdCA9IGZvcm0uZmluZCgnLmJ0bl9zdWJtaXQnKSxcblx0XHRidG5SZXNldCA9IGZvcm0uZmluZCgnLmJ0bl9yZXNldCcpLFxuXHRcdHBvcFVwID0gJCgnLnBvcHVwJyksXG5cdFx0cG9wVXBUZXh0ID0gJCgnLnBvcHVwX3RleHQnKSxcblx0XHRwb3BVcENsb3NlID0gJCgnLnBvcHVwX2Nsb3NlJyk7XG5cblx0dmFyIF9jbGlja1N1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIG5hbWVWYWx1ZSA9IGlucHV0TmFtZS52YWwoKSxcblx0XHRcdGVtYWlsVmFsdWUgPSBpbnB1dEVtYWlsLnZhbCgpLFxuXHRcdFx0bWVzc2FnZVZhbHVlID0gaW5wdXRNZXNzYWdlLnZhbCgpO1xuXG5cdFx0aWYgKCFuYW1lVmFsdWUgPT09IHRydWUgfHwgIWVtYWlsVmFsdWUgPT09IHRydWUgfHwgIW1lc3NhZ2VWYWx1ZSA9PT0gdHJ1ZSkge1xuXG5cdFx0XHRwb3BVcFRleHQuaHRtbCgn0JfQsNC/0L7Qu9C90LjRgtC1INCy0YHQtSDQv9C+0LvRjyEnKTtcblx0XHRcdHBvcFVwLmFkZENsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblx0XHRcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgZW1haWxfcmVnID0gL14oW2EtejAtOV9cXC4tXSkrQFthLXowLTktXStcXC4oW2Etel17Miw0fVxcLik/W2Etel17Miw0fSQvaTtcblxuXHRcdFx0aWYgKCFlbWFpbF9yZWcudGVzdChpbnB1dEVtYWlsLnZhbCgpKSkge1xuXG5cdFx0ICAgICAgICBpbnB1dEVtYWlsLmNzcygnYm9yZGVyLWNvbG9yJywgJ3JlZCcpO1xuXHRcdCAgICAgICAgcG9wVXBUZXh0Lmh0bWwoJ0UtbWFpbCDQstCy0LXQtNGR0L0g0L3QtdCy0LXRgNC90L4hJyk7XG5cdFx0ICAgICAgICBwb3BVcC5hZGRDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cdFx0ICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cdFx0XHRcdH0sIDEwMDAwKTtcblxuXHRcdCAgICB9IGVsc2Uge1xuXHRcdCAgICBcdCQuYWpheCh7XG5cdFx0XHRcdFx0dXJsOiAnLi4vYXNzZXRzL3BocC9jb250YWN0LWZvcm0ucGhwJyxcblx0XHRcdFx0XHRtZXRob2Q6ICdwb3N0Jyxcblx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRuYW1lOiBuYW1lVmFsdWUsXG5cdFx0XHRcdFx0XHRlbWFpbDogZW1haWxWYWx1ZSxcblx0XHRcdFx0XHRcdG1lc3NhZ2U6IG1lc3NhZ2VWYWx1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkuZG9uZShmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdkb25lJyk7XG5cdFx0XHRcdFx0cG9wVXBUZXh0Lmh0bWwoJ9Ch0L7QvtCx0YnQtdC90LjQtSDQvtGC0L/RgNCw0LLQu9C10L3QviEnKTtcblx0XHRcdFx0XHRwb3BVcC5hZGRDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cdFx0XHRcdFx0X3Jlc2V0KCk7XG5cdFx0XHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cdFx0XHRcdFx0fSwgMTAwMDApO1xuXHRcdFx0XHR9KS5mYWlsKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJyk7XG5cdFx0XHRcdFx0cG9wVXBUZXh0Lmh0bWwoJ9Cf0YDQvtC40LfQvtGI0LvQsCDQvtGI0LjQsdC60LAhJyk7XG5cdFx0XHRcdFx0cG9wVXAuYWRkQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXHRcdFx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cG9wVXAucmVtb3ZlQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXHRcdFx0XHRcdH0sIDEwMDAwKTtcblx0XHRcdFx0fSk7XHRcblx0XHQgICAgfVxuXHRcdH1cdFx0XG5cdH07XG5cblx0dmFyIF9yZXNldCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlucHV0TmFtZS52YWwoJycpO1xuXHRcdGlucHV0RW1haWwudmFsKCcnKTtcblx0XHRpbnB1dE1lc3NhZ2UudmFsKCcnKTtcblx0XHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdCQoJy5idG5fc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0X2NsaWNrU3VibWl0KCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JCgnLnBvcHVwJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cblx0ICAgICAgICBcdHBvcFVwLnJlbW92ZUNsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblxuXHQgICAgICAgIFx0X3Jlc2V0KCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JCgnLmJ0bl9yZXNldCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdF9yZXNldCgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pKCk7IiwiLy8gLS0tLSBNT0RVTEVTIElOSVRJQUxJWkFUSU9OIC0tLS0tIC8vXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHRQcmVsb2FkZXIuaW5pdCgpO1xuXG5cblx0aWYgKCQoJyNoYW1idXJnZXInKS5sZW5ndGgpIHtcblx0XHRNYWluTWVudS5pbml0KCk7XG5cdH1cblxuXHRpZiAoJCgnLmFycm93LWRvd24nKS5sZW5ndGgpIHtcblx0XHRUZXN0LmluaXQoKTtcblx0fVxuXG5cdGlmICgkKCcjd29ya3NfX3NsaWRlcicpLmxlbmd0aCkge1xuXHRcdFNsaWRlci5pbml0KCk7XG5cdH1cblxuXHRpZigkKCcud29ya3NfX2Zvcm0nKS5sZW5ndGgpIHtcblx0XHRDb250YWN0Rm9ybS5pbml0KCk7XG5cdH1cblxufSk7Il19
