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

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIiwicGFyYWxsYXguanMiLCJtYWluLW1lbnUuanMiLCJzbGlkZXIuanMiLCJjb250YWN0LWZvcm0uanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLS0tLS0tLSBUZXN0IE1vZHVsZSAtLS0tLS0tLS8vXG5cbnZhciBUZXN0ID0gKGZ1bmN0aW9uKCkge1xuXHR2YXIgX2Zyb21UZXN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YWxlcnQoXCJIaSB0aGVyZSEgSSdtIGluc2lkZSBUZXN0IE1vZHVsZVwiKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcuYXJyb3ctZG93bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdChlKTtcblx0XHRcdFx0X2Zyb21UZXN0KCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXHRcbn0pKCk7XG4iLCIvLy0tLS0tLSBQcmVsb2FkZXIgTW9kdWxlIC0tLS0tLS0vL1xuXG52YXIgUHJlbG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuXHRcblx0dmFyIHByZWxvYWRlciA9ICQoJy5wcmVsb2FkZXInKSxcblx0XHRib2R5ID0gJCgnYm9keScpLFxuXHRcdHBlcmNlbnRzVG90YWwgPSAwOyAvL9GB0LrQvtC70YzQutC+INC60LDRgNGC0LjQvdC+0Log0LfQsNCz0YDRg9C20LXQvdC+XG5cblx0Ly8t0J/QvtC90LDQtNC+0LHRj9GC0YHRjy06XG5cdFx0Ly8xLtC80LXRgtC+0LQsINC60L7RgtC+0YDRi9C5INCx0YPQtNC10YIg0LLRi9GH0LvQtdC90Y/RgtGMINC/0YPRgtC4INC00L4g0LrQsNGA0YLQuNC90L7QuiDQuCDRhNC+0YDQvNC40YDQvtCy0LDRgtGMINC80LDRgdGB0LjQslxuXHRcdC8vMi7QvNC10YLQvtC0LCDQutC+0YLRgNGL0Lkg0YHRh9C40YLQsNC10YIg0Lgg0LLRi9GB0YLQsNCy0LvRj9C10YIg0LrQvtC7LdCy0L4g0LfQsNCz0YDRg9C20LXQvdC90YvRhSDQv9GA0L7RhtC10L3RgtC+0LJcblx0XHQvLzMu0LzQtdGC0L7QtCDQstGB0YLQsNCy0LrQuCDQutCw0YDRgtC40L3QutC4INC4INCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDRjdGC0L7Qs9C+INCy0YvRgdGH0LjRgtGL0LLQsNC90LjRjyDQv9GA0L7RhtC10L3RgtC+0LJcblxuXHQvLzEu0L3QsNCx0L7RgCDQutCw0YDRgtC40L3QvtC6XG5cdHZhciBfaW1nUGF0aCA9ICQoJyonKS5tYXAoZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcblx0XHR2YXIgYmFja2dyb3VuZEltZyA9ICQoZWxlbWVudCkuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXG5cdFx0XHRpbWcgPSAkKGVsZW1lbnQpLmlzKCdpbWcnKSxcblx0XHRcdHBhdGggPSAnICc7IC8v0YfQtdC8INC30LDQv9C+0LvQvdGP0YLRjFxuXG5cdFx0Ly/QtdGB0LvQuCDQsdGN0LrQs9GA0LDRg9C90LQg0LrQsNGA0YLQuNC90LrQsCDRgdGD0YnQtdGB0YLQstGD0LXRglxuXHRcdGlmIChiYWNrZ3JvdW5kSW1nICE9ICdub25lJykge1xuXHRcdFx0cGF0aCA9IGJhY2tncm91bmRJbWcucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTsgLy/QtNC10LvQsNC10Lwg0YfQuNGB0YLRi9C5INC/0YPRgtGMINC00L4g0LrQsNGA0YLQuNC90LrQuFxuXHRcdH1cblxuXHRcdC8v0LXRgdC70Lgg0LXRgdGC0Ywg0LrQsNGA0YLQuNC90LrQsFxuXHRcdGlmIChpbWcpIHtcblx0XHRcdHBhdGggPSAkKGVsZW1lbnQpLmF0dHIoJ3NyYycpO1xuXHRcdH1cblxuXHRcdC8v0LXRgdC70Lgg0L3QsNC/0L7Qu9C90LXQvdC40LUg0L3QtSDQv9GD0YHRgtC+0LVcblx0XHRpZiAocGF0aCkgcmV0dXJuIHBhdGhcblx0fSk7XG5cblx0Ly8yLtC/0L7RgdGH0LjRgtCw0YLRjCDQv9GA0L7RhtC10L3RglxuXHR2YXIgX3NldFBlcmNlbnRzID0gZnVuY3Rpb24odG90YWxQZXJjZW50LCBjdXJyZW50UGVyY2VudCkge1xuXHRcdHZhciBwZXJjZW50cyA9IE1hdGguY2VpbChjdXJyZW50UGVyY2VudCAvIHRvdGFsUGVyY2VudCAqIDEwMCk7IC8v0YfRgtC+0LHRiyDQvtC60YDRg9Cz0LvRj9C70L7RgdGMINCyINCx0L7Qu9GM0YjRg9GOINGB0YLQvtGA0L7QvdGDINC4INC00L7RhdC+0LTQuNC70L4g0LTQviAxMDAlXG5cdFx0XG5cdFx0JCgnLnByZWxvYWRlcl9fcGVyY2VudHMnKS50ZXh0KHBlcmNlbnRzICsgJyUnKTtcblxuXHRcdC8v0LXRgdC70LggMTAwINC4INCx0L7Qu9C10LUgJSwg0YLQviDQv9GA0Y/Rh9C10Lwg0L/RgNC10LvQvtCw0LTQtdGAXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xuXHRcdFx0cHJlbG9hZGVyLmRlbGF5KDUwMCk7XG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgnc2xvdycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRib2R5LnJlbW92ZUNsYXNzKCdib2R5LXByZWxvYWQnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHQvLzMu0LfQsNCz0YDRg9C30LjRgtGMINC60LDRgNGC0LjQvdC60YMg0Lgg0LLRgdGC0LDQstC40YLRjCDQv9GA0L7RhtC10L3RglxuXHR2YXIgX2xvYWRJbWFnZXMgPSBmdW5jdGlvbihpbWFnZXMpIHtcblxuXHRcdC8v0LXRgdC70Lgg0LrQsNGA0YLQuNC90L7QuiDQvdC10YIg0LLQvtC+0LHRidC1LCDRgtC+INC/0YDRj9GH0LXQvCDQv9GA0LXQu9C+0LDQtNC10YBcblx0XHRpZiAoIWltYWdlcy5sZW5ndGgpIHtcblx0XHRcdHByZWxvYWRlci5kZWxheSg1MDApO1xuXHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoJ3Nsb3cnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnYm9keS1wcmVsb2FkJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvL9C10YHQu9C4INC60LDRgNGC0LjQvdC60Lgg0LXRgdGC0YwsINGC0L4g0LjRgdC/0L7Qu9GM0LfRg9C10Lwg0YHRgtCw0L3QtNCw0YDRgtC90YvQuSDQvNC10YLQvtC0INC00LvRjyDQvNCw0YHRgdC40LLQvtCyXG5cdFx0aW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1hZ2UsIGluZGV4LCBpbWFnZXNBcnJheSkge1xuXG5cdFx0XHQvL9GB0L7Qt9C00LDQtdC8INC60LDRgNGC0LjQvdC60YMg0LfQsNC90L7QstC+ICjRhNC10LnQutC+0LLQvilcblx0XHRcdHZhciBmYWtlSW1hZ2UgPSAkKCc8aW1nPicsIHtcblx0XHRcdFx0YXR0ciA6IHtcblx0XHRcdFx0XHRzcmMgOiBpbWFnZVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly/Qv9GA0L7QstC10YDRj9C10Lwg0LfQsNCz0YDRg9C30LjQu9C+0YHRjCDQu9C4INC40LfQvtCx0YDQsNC20LXQvdC40LVcblx0XHRcdC8vZXJyb3IgLSDQtdGB0LvQuCDQvtGI0LjQsdC60LAg0LIg0L/Rg9GC0Lgg0LrQsNGA0YLQuNC90LrQuCwg0YLQviDQstGB0LUg0YDQsNCy0L3QviDQt9Cw0LPRgNGD0LfQuNGC0Yxcblx0XHRcdGZha2VJbWFnZS5vbignbG9hZCBlcnJvcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XG5cdFx0XHRcdF9zZXRQZXJjZW50cyhpbWFnZXNBcnJheS5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ym9keS5hZGRDbGFzcygnYm9keS1wcmVsb2FkJyk7XG5cblx0XHRcdC8v0YIu0LouINC80LXRgtC+0LQgLm1hcCgpINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LHRitC10LrRgiwg0YLQviDQv9GA0LXQvtCx0YDQsNC30YPQtdC8INC10LPQviDQsiDQvNCw0YHRgdC40LJcblx0XHRcdHZhciBpbWdzQXJyYXkgPSBfaW1nUGF0aC50b0FycmF5KCk7XG5cblx0XHRcdF9sb2FkSW1hZ2VzKGltZ3NBcnJheSk7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiLy8gINGB0L7RhdGA0LDQvdGP0LXQvCDQstGB0Y4g0YHRhtC10L3RgyDQv9Cw0YDQsNC70LvQsNC60YHQsFxyXG52YXIgbGF5ZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFyYWxsYXhfX2xheWVyJyk7XHJcblxyXG4vL9C/0LXRgNC10LTQsNC10Lwg0YTRg9C90LrRhtC40Y4g0L7QsdGA0LDQsdC+0YLRh9C40LpcclxuXHJcbnZhciAgbW92ZUxheWVycyA9IGZ1bmN0aW9uIChlKSB7XHJcblxyXG4gICAgdmFyIGluaXRpYWxYID0gKHdpbmRvdy5pbm5lcldpZHRoLzIpIC0gZS5wYWdlWCwgIC8v0L3QsNGF0L7QtNC40Lwg0YbQtdC90YLRgCDQvdCw0YjQtdCz0L4g0Y3QutGA0LDQvdCwINC/0L4g0L7RgdC4IFgsINCy0YvRh9C40YLQsNC10Lwg0L/QvtC70L7QttC10L3QuNC1INC80YvRiNC60Lgg0L/QviDQvtGB0LggWFxyXG4gICAgICAgIGluaXRpYWxZID0gKHdpbmRvdy5pbm5lckhlaWdodC8yKSAtIGUucGFnZVk7XHJcblxyXG4gICAgW10uc2xpY2UuY2FsbChsYXllcnMpLmZvckVhY2goZnVuY3Rpb24gKGxheWVyLCBpKSB7ICAgICAgICAvLyDQsiDQvNC10YLQvtC0INC80LDRgdGB0LjQstCwIHNsaWNlINC/0LXRgNC10LTQsNGC0Ywg0LIg0LrQsNGH0LXRgdGC0LLQtSB0aGlzINC90LDRiNC4INGB0LvQvtC4ICjQv9GB0LXQstC00L7QvNCw0YHRgdC40LIo0LrQvtC70LvQtdC60YbQuNGOKSwg0YfRgtC+0LHRiyDQvNC+0LbQvdC+INCx0YvQu9C+INC40YHQv9C+0LvRjNC30L7QstCw0YLRjCDQvNC10YLQvtC00Ysg0LzQsNGB0YHQuNCy0LBcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgZGl2aWRlciA9IGkvMTAwLFxyXG4gICAgICAgICAgICBwb3NpdGlvblggPSBpbml0aWFsWCAqIGRpdmlkZXIsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uWSA9IGluaXRpYWxZICogZGl2aWRlcixcclxuICAgICAgICAgICAgbGF5ZXJTdHlsZSA9IGxheWVyLnN0eWxlLCAgICAgICAgICAgICAgICAgICAgICAgLy/QsNC90LjQvNC40YDRg9C10Lwg0YHQu9C+0LksINGB0L7RhdGA0LDQvdGP0LXQvCDRgdGC0LjQu9GMINGB0LvQvtGPXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUzZCgnKyBwb3NpdGlvblggKydweCwgJysgcG9zaXRpb25ZICsncHgsIDApJzsgLy/QuNC30LzQtdC90Y/QtdC8INCyINGB0YLQuNC70LUg0YHQstC+0LnRgdGC0LLQviDRgtGA0LDQvdGB0YTQvtGA0Lwg0L/QviDQvtGB0Y/QvCAoWCwgWSwgWikgYiDQuCDRgdC+0YXRgNCw0L3Rj9C10LxcclxuXHJcbiAgICAgICAgbGF5ZXJTdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XHJcbiAgICAgICAgbGF5ZXJTdHlsZS5ib3R0b20gPSAnLScgKyAncHgnO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG4vLyDQv9C40YjQtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNC5XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlTGF5ZXJzKTsiLCIvLy0tLSBNYWluIE1lbnUgTW9kdWxlIC0tLS0tLS0tLS0tLS0vL1xuXG52YXIgTWFpbk1lbnUgPSAoZnVuY3Rpb24oKSB7XG5cdHZhciBfY2xpY2tIYW1idXJnZXIgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmF2ID0gJCgnLm5hdmlnYXRpb24nKTtcblxuXHRcdCQoJ2JvZHknKS50b2dnbGVDbGFzcygnYm9keS1hY3RpdmUnKTtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdCQoJy5tYWluLW1lbnUnKS50b2dnbGVDbGFzcygnbWFpbi1tZW51LWFjdGl2ZScpO1xuXHRcdH0sIDMwMCk7XG5cdFx0bmF2LnRvZ2dsZUNsYXNzKCduYXZpZ2F0aW9uLWFjdGl2ZScpO1xuXG5cdFx0JCgnLmhhbWJ1cmdlcicpLnRvZ2dsZUNsYXNzKCdvbicpO1xuXHRcdCQoJy5oYW1idXJnZXItbWVudScpLnRvZ2dsZUNsYXNzKCdhbmltYXRlJyk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmhhbWJ1cmdlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdF9jbGlja0hhbWJ1cmdlcigpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59KSgpO1xuIiwiLy8tLS0tLVNMSURFUiBNT0RVTEUtLS0tLS8vXG5cbnZhciBTbGlkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIHNsaWRlckNvbnRhaW5lciA9ICQoJy53b3Jrc19fc2xpZGVyX19jb250YWluZXInKSxcblx0XHRwcmV2QnRuID0gc2xpZGVyQ29udGFpbmVyLmZpbmQoJy5zbGlkZXJfX25hdl9fbGlua19wcmV2JyksXG5cdFx0bmV4dEJ0biA9IHNsaWRlckNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19uYXZfX2xpbmtfbmV4dCcpLFxuXHRcdHByZXZTbGlkZXJJdGVtcyA9IHByZXZCdG4uZmluZCgnLnNsaWRlcl9fbmF2X19pdGVtJyksXG5cdFx0bmV4dFNsaWRlckl0ZW1zID0gbmV4dEJ0bi5maW5kKCcuc2xpZGVyX19uYXZfX2l0ZW0nKSxcblx0XHRpdGVtc0xlbmd0aCA9IHByZXZTbGlkZXJJdGVtcy5sZW5ndGgsXG5cdFx0ZGlzcGxheSA9IHNsaWRlckNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pbWcnKSxcblx0XHRiaWdJbWcgPSBkaXNwbGF5LmZpbmQoJy5zbGlkZXJfX2ltZ19iaWcnKSxcblx0XHR0aXRsZSA9IHNsaWRlckNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19pbmZvX19zdWJ0aXRsZScpLFxuXHRcdHRlY2hub2xvZ3kgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW5mb19fdGVjaCcpLFxuXHRcdGxpbmsgPSBzbGlkZXJDb250YWluZXIuZmluZCgnLnNsaWRlcl9faW5mb19fYnRuJyksXG5cdFx0ZHVyYXRpb24gPSA1MDAsXG5cdFx0aXNBbmltYXRlID0gZmFsc2UsXG5cdFx0Y291bnRlciA9IDA7XG5cblx0dmFyIF9EZWZhdWx0cyA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIGxlZnQgYnRuXG5cdFx0cHJldkJ0blxuXHRcdFx0LmZpbmQoJy5zbGlkZXJfX25hdl9faXRlbScpXG5cdFx0XHQuZXEoY291bnRlciAtIDEpXG5cdFx0XHQuYWRkQ2xhc3MoJy5zbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcblxuXHRcdC8vIHJpZ2h0IGJ0blxuXHRcdG5leHRCdG5cblx0XHRcdC5maW5kKCcuc2xpZGVyX19uYXZfX2l0ZW0nKVxuXHRcdFx0LmVxKGNvdW50ZXIgKyAxKVxuXHRcdFx0LmFkZENsYXNzKCcuc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XG5cdH07XG5cblx0dmFyIF9wcmV2U2xpZGVBbmltYXRlID0gZnVuY3Rpb24oc2xpZGVyQ291bnRlclByZXYpIHtcblx0XHR2YXIgcmVxSXRlbVByZXYgPSBwcmV2U2xpZGVySXRlbXMuZXEoc2xpZGVyQ291bnRlclByZXYgLSAxKSxcblx0XHRcdGFjdGl2ZUl0ZW1QcmV2ID0gcHJldlNsaWRlckl0ZW1zLmZpbHRlcignLnNsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpO1xuXG5cdFx0YWN0aXZlSXRlbVByZXYuYW5pbWF0ZSh7XG5cdFx0XHQndG9wJzogJzEwMCUnIC8vJzEwMCUnIHByZXZcblx0XHR9LCBkdXJhdGlvbik7XG5cblx0XHRyZXFJdGVtUHJldi5hbmltYXRlKHtcblx0XHRcdCd0b3AnOiAwXG5cdFx0fSwgZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xuXHRcdFx0YWN0aXZlSXRlbVByZXYucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9fbmF2X19pdGVtX2FjdGl2ZScpXG5cdFx0XHRcdC5jc3MoJ3RvcCcsICctMTAwJScpOyAvLyAnLTEwMCUnIHByZXZcblx0XHRcdFxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnc2xpZGVyX19uYXZfX2l0ZW1fYWN0aXZlJyk7XG5cblx0XHRcdGlzQW5pbWF0ZSA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBfbmV4dFNsaWRlQW5pbWF0ZSA9IGZ1bmN0aW9uKHNsaWRlckNvdW50ZXJOZXh0KSB7XG5cdFx0dmFyIHJlcUl0ZW1OZXh0SW5kZXggPSBzbGlkZXJDb3VudGVyTmV4dCArIDEsXG5cdFx0XHRhY3RpdmVJdGVtTmV4dCA9IG5leHRTbGlkZXJJdGVtcy5maWx0ZXIoJy5zbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcblxuXHRcdGlmIChyZXFJdGVtTmV4dEluZGV4ID4gaXRlbXNMZW5ndGggLSAxKSB7XG5cdFx0XHRyZXFJdGVtTmV4dEluZGV4ID0gMDtcblx0XHR9XG5cblx0XHR2YXIgcmVxSXRlbU5leHQgPSBuZXh0U2xpZGVySXRlbXMuZXEocmVxSXRlbU5leHRJbmRleCk7XG5cblx0XHRhY3RpdmVJdGVtTmV4dC5hbmltYXRlKHtcblx0XHRcdCd0b3AnOiAnLTEwMCUnIC8vJy0xMDAlJyBuZXh0XG5cdFx0fSwgZHVyYXRpb24pO1xuXG5cdFx0cmVxSXRlbU5leHQuYW5pbWF0ZSh7XG5cdFx0XHQndG9wJzogMFxuXHRcdH0sIGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcblx0XHRcdGFjdGl2ZUl0ZW1OZXh0LnJlbW92ZUNsYXNzKCdzbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKVxuXHRcdFx0XHQuY3NzKCd0b3AnLCAnMTAwJScpOyAvLyAnMTAwJScgbmV4dFxuXHRcdFx0XG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdzbGlkZXJfX25hdl9faXRlbV9hY3RpdmUnKTtcblxuXHRcdFx0aXNBbmltYXRlID0gZmFsc2U7XG5cdFx0fSk7XG5cblx0fTtcblxuXHR2YXIgX2dldERhdGEgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGF0YU9iaiA9IHtcblx0XHRcdGltYWdlcyA6IFtdLFxuXHRcdFx0dGl0bGVzIDogW10sXG5cdFx0XHR0ZWNobm9sb2d5cyA6IFtdLFxuXHRcdFx0bGlua3MgOiBbXVxuXHRcdH07XG5cblx0XHRwcmV2U2xpZGVySXRlbXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7IC8vZWFjaCBmcm9tICdwcmV2U2xpZGVySXRlbXMnXG5cblx0XHRcdGRhdGFPYmouaW1hZ2VzLnB1c2goJHRoaXMuZGF0YSgnc3JjJykpO1xuXHRcdFx0ZGF0YU9iai50aXRsZXMucHVzaCgkdGhpcy5kYXRhKCd0aXRsZScpKTtcblx0XHRcdGRhdGFPYmoudGVjaG5vbG9neXMucHVzaCgkdGhpcy5kYXRhKCd0ZWNoJykpO1xuXHRcdFx0ZGF0YU9iai5saW5rcy5wdXNoKCR0aGlzLmRhdGEoJ2xpbmsnKSk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gZGF0YU9iajtcblx0fTtcblxuXHR2YXIgX2NoYW5nZURhdGEgPSBmdW5jdGlvbihjaGFuZ2VEYXRhQ291bnRlcikge1xuXHRcdHZhciBfZGF0YSA9IF9nZXREYXRhKCk7XG5cblx0XHRiaWdJbWdcblx0XHRcdC5zdG9wKHRydWUsIHRydWUpXG5cdFx0XHQuZmFkZU91dChkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQodGhpcykuYXR0cignc3JjJywgX2RhdGEuaW1hZ2VzW2NoYW5nZURhdGFDb3VudGVyXSk7XG5cdFx0XHR9KVxuXHRcdFx0LmZhZGVJbihkdXJhdGlvbik7XG5cblx0XHR0aXRsZVxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcblx0XHRcdC5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKS50ZXh0KF9kYXRhLnRpdGxlc1tjaGFuZ2VEYXRhQ291bnRlcl0pXG5cdFx0XHR9KVxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcblx0XHRcdC5mYWRlSW4oZHVyYXRpb24pO1xuXG5cdFx0dGVjaG5vbG9neVxuXHRcdFx0LnN0b3AodHJ1ZSwgdHJ1ZSlcblx0XHRcdC5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCh0aGlzKS50ZXh0KF9kYXRhLnRlY2hub2xvZ3lzW2NoYW5nZURhdGFDb3VudGVyXSlcblx0XHRcdH0pXG5cdFx0XHQuc3RvcCh0cnVlLCB0cnVlKVxuXHRcdFx0LmZhZGVJbihkdXJhdGlvbik7XG5cblx0XHRsaW5rLmF0dHIoJ2hyZWYnLCBfZGF0YS5saW5rc1tjaGFuZ2VEYXRhQ291bnRlcl0pO1xuXHR9O1xuXG5cdHZhciBfbW92ZVNsaWRlID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cdFx0dmFyIGRpcmVjdGlvbnMgPSB7XG5cdFx0XHRuZXh0IDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChjb3VudGVyIDwgaXRlbXNMZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0Y291bnRlcisrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvdW50ZXIgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0cHJldiA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoY291bnRlciA+IDApIHtcblx0XHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y291bnRlciA9IGl0ZW1zTGVuZ3RoIC0gMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRkaXJlY3Rpb25zW2RpcmVjdGlvbl0oKTtcblxuXG5cdFx0aWYoIWlzQW5pbWF0ZSkge1xuXG5cdFx0XHRpc0FuaW1hdGUgPSB0cnVlO1xuXG5cdFx0XHRfbmV4dFNsaWRlQW5pbWF0ZShjb3VudGVyKTtcblx0XHRcdF9wcmV2U2xpZGVBbmltYXRlKGNvdW50ZXIpO1xuXHRcdFx0X2NoYW5nZURhdGEoY291bnRlcik7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRfRGVmYXVsdHMoKTtcblxuXHRcdFx0JCgnLnNsaWRlcl9fbmF2X19saW5rX3ByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRfbW92ZVNsaWRlKCdwcmV2Jyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JCgnLnNsaWRlcl9fbmF2X19saW5rX25leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRfbW92ZVNsaWRlKCduZXh0Jyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn0pKCk7IiwiLy8tLS0tLSBDb250YWN0LUZvcm0gTW9kdWxlIC0tLS0tLS8vXG5cbnZhciBDb250YWN0Rm9ybSA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgZm9ybSA9ICQoJy5jb250YWN0LWZvcm1fX2lucHV0LWdyb3VwJyksXG5cdFx0aW5wdXROYW1lID0gJCgnI2NvbnRhY3QtZm9ybV9faW5wdXRfX25hbWUnKSxcblx0XHRpbnB1dEVtYWlsID0gJCgnI2NvbnRhY3QtZm9ybV9faW5wdXRfX2VtYWlsJyksXG5cdFx0aW5wdXRNZXNzYWdlID0gJCgnI2NvbnRhY3QtZm9ybV9faW5wdXRfX21lc3NhZ2UnKSxcblx0XHRidG5TdWJtaXQgPSBmb3JtLmZpbmQoJy5idG5fc3VibWl0JyksXG5cdFx0YnRuUmVzZXQgPSBmb3JtLmZpbmQoJy5idG5fcmVzZXQnKSxcblx0XHRwb3BVcCA9ICQoJy5wb3B1cCcpLFxuXHRcdHBvcFVwVGV4dCA9ICQoJy5wb3B1cF90ZXh0JyksXG5cdFx0cG9wVXBDbG9zZSA9ICQoJy5wb3B1cF9jbG9zZScpO1xuXG5cdHZhciBfY2xpY2tTdWJtaXQgPSBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBuYW1lVmFsdWUgPSBpbnB1dE5hbWUudmFsKCksXG5cdFx0XHRlbWFpbFZhbHVlID0gaW5wdXRFbWFpbC52YWwoKSxcblx0XHRcdG1lc3NhZ2VWYWx1ZSA9IGlucHV0TWVzc2FnZS52YWwoKTtcblxuXHRcdGlmICghbmFtZVZhbHVlID09PSB0cnVlIHx8ICFlbWFpbFZhbHVlID09PSB0cnVlIHx8ICFtZXNzYWdlVmFsdWUgPT09IHRydWUpIHtcblxuXHRcdFx0cG9wVXBUZXh0Lmh0bWwoJ9CX0LDQv9C+0LvQvdC40YLQtSDQstGB0LUg0L/QvtC70Y8hJyk7XG5cdFx0XHRwb3BVcC5hZGRDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cdFx0XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIGVtYWlsX3JlZyA9IC9eKFthLXowLTlfXFwuLV0pK0BbYS16MC05LV0rXFwuKFthLXpdezIsNH1cXC4pP1thLXpdezIsNH0kL2k7XG5cblx0XHRcdGlmICghZW1haWxfcmVnLnRlc3QoaW5wdXRFbWFpbC52YWwoKSkpIHtcblxuXHRcdCAgICAgICAgaW5wdXRFbWFpbC5jc3MoJ2JvcmRlci1jb2xvcicsICdyZWQnKTtcblx0XHQgICAgICAgIHBvcFVwVGV4dC5odG1sKCdFLW1haWwg0LLQstC10LTRkdC9INC90LXQstC10YDQvdC+IScpO1xuXHRcdCAgICAgICAgcG9wVXAuYWRkQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXHRcdCAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cG9wVXAucmVtb3ZlQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXHRcdFx0XHR9LCAxMDAwMCk7XG5cblx0XHQgICAgfSBlbHNlIHtcblx0XHQgICAgXHQkLmFqYXgoe1xuXHRcdFx0XHRcdHVybDogJy4uL2Fzc2V0cy9waHAvY29udGFjdC1mb3JtLnBocCcsXG5cdFx0XHRcdFx0bWV0aG9kOiAncG9zdCcsXG5cdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0bmFtZTogbmFtZVZhbHVlLFxuXHRcdFx0XHRcdFx0ZW1haWw6IGVtYWlsVmFsdWUsXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiBtZXNzYWdlVmFsdWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnZG9uZScpO1xuXHRcdFx0XHRcdHBvcFVwVGV4dC5odG1sKCfQodC+0L7QsdGJ0LXQvdC40LUg0L7RgtC/0YDQsNCy0LvQtdC90L4hJyk7XG5cdFx0XHRcdFx0cG9wVXAuYWRkQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXHRcdFx0XHRcdF9yZXNldCgpO1xuXHRcdFx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cG9wVXAucmVtb3ZlQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXHRcdFx0XHRcdH0sIDEwMDAwKTtcblx0XHRcdFx0fSkuZmFpbChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicpO1xuXHRcdFx0XHRcdHBvcFVwVGV4dC5odG1sKCfQn9GA0L7QuNC30L7RiNC70LAg0L7RiNC40LHQutCwIScpO1xuXHRcdFx0XHRcdHBvcFVwLmFkZENsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblx0XHRcdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHBvcFVwLnJlbW92ZUNsYXNzKCdwb3B1cF9hY3RpdmUnKTtcblx0XHRcdFx0XHR9LCAxMDAwMCk7XG5cdFx0XHRcdH0pO1x0XG5cdFx0ICAgIH1cblx0XHR9XHRcdFxuXHR9O1xuXG5cdHZhciBfcmVzZXQgPSBmdW5jdGlvbigpIHtcblx0XHRpbnB1dE5hbWUudmFsKCcnKTtcblx0XHRpbnB1dEVtYWlsLnZhbCgnJyk7XG5cdFx0aW5wdXRNZXNzYWdlLnZhbCgnJyk7XG5cdFx0cG9wVXAucmVtb3ZlQ2xhc3MoJ3BvcHVwX2FjdGl2ZScpO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcuYnRuX3N1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdF9jbGlja1N1Ym1pdCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQoJy5wb3B1cCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG5cdCAgICAgICAgXHRwb3BVcC5yZW1vdmVDbGFzcygncG9wdXBfYWN0aXZlJyk7XG5cblx0ICAgICAgICBcdF9yZXNldCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQoJy5idG5fcmVzZXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRfcmVzZXQoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG59KSgpOyIsIi8vIC0tLS0gTU9EVUxFUyBJTklUSUFMSVpBVElPTiAtLS0tLSAvL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0UHJlbG9hZGVyLmluaXQoKTtcblxuXG5cdGlmICgkKCcjaGFtYnVyZ2VyJykubGVuZ3RoKSB7XG5cdFx0TWFpbk1lbnUuaW5pdCgpO1xuXHR9XG5cblx0aWYgKCQoJy5hcnJvdy1kb3duJykubGVuZ3RoKSB7XG5cdFx0VGVzdC5pbml0KCk7XG5cdH1cblxuXHRpZiAoJCgnI3dvcmtzX19zbGlkZXInKS5sZW5ndGgpIHtcblx0XHRTbGlkZXIuaW5pdCgpO1xuXHR9XG5cblx0aWYoJCgnLndvcmtzX19mb3JtJykubGVuZ3RoKSB7XG5cdFx0Q29udGFjdEZvcm0uaW5pdCgpO1xuXHR9XG5cbn0pOyJdfQ==
