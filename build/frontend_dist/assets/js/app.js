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

var preloader = (function () {

    var init = function () {
        _setUpListeners();
        _viewPreloader();
        // то, что должно произойти сразу
    };

    var _setUpListeners = function () {
        // прослушка событий...
    };

    var _viewPreloader = function () {

        if($(window).width() < 1200) {
            return false;
        }

        $('.preloader').show();

        // определяем массив для хранения картинок
        var imgs = [];

        // проходим по всем элементам страницы, где находим все картинки
        $.each($('*'), function() {
            var
                $this = $(this),
                background = $this.css('background-image'), // значение фона каждого элемента
                img = $this.is('img'); // картинка, вставленная через тег <img>

            // задаем условие наличия фоновой картинки
            if (background != 'none') {
                // создаем path, где храним путь картинки в виде http://img_1.jpg
                var path = background.replace('url("', '').replace('")', '');
                imgs.push(path); // добавляем путь картинки в массив imgs

            }

            // в случае с картинкой, заданной через тег <img>, в path кладем значение атрибута src
            if (img) {
                var path = $this.attr('src');

                if (path) {
                    imgs.push(path);
                }
            }

        });

        var percentsTotal = 1;

        // определяем загрузилась ли каждая картинка с путем из массива imgs
        for (var i = 0; i < imgs.length; i++) {
            // для этого создаем image, куда кладем тег img c атрибутом src
            // таким образом эмулируем, как будто все картинки (в т.ч. и фоновые) заданы через <img>
            var image = $('<img>', {
                attr: {
                    src: imgs[i]
                }
            });

            image.on({
                load : function () {
                    setPercents(imgs.length, percentsTotal);
                    percentsTotal++;
                },

                error : function () {
                    percentsTotal++;
                }
            });

        }

        function setPercents (total, current) {
            var percent = Math.ceil(current / total * 100);

            if (percent >= 10) {
                $('.preloader').css({
                    'background-image': 'url(assets/img/bg_preload.jpg)',
                    'background-size': 'cover'
                });
            }

            if (percent >= 100) {
                $('.preloader').fadeOut();
            }

            $('.preloader__percents').text(percent + '%');
        };

    };

    return {
        init: init
    };

})();

preloader.init();
//  сохраняем всю сцену параллакса
var parallaxContainer = document.getElementById('parallax'),
    layers = parallaxContainer.children;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIiwicGFyYWxsYXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy0tLS0tLS0gVGVzdCBNb2R1bGUgLS0tLS0tLS0vL1xuXG52YXIgVGVzdCA9IChmdW5jdGlvbigpIHtcblx0dmFyIF9mcm9tVGVzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFsZXJ0KFwiSGkgdGhlcmUhIEknbSBpbnNpZGUgVGVzdCBNb2R1bGVcIik7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmFycm93LWRvd24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoZSk7XG5cdFx0XHRcdF9mcm9tVGVzdCgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblx0XG59KSgpO1xuIiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgX3ZpZXdQcmVsb2FkZXIoKTtcclxuICAgICAgICAvLyDRgtC+LCDRh9GC0L4g0LTQvtC70LbQvdC+INC/0YDQvtC40LfQvtC50YLQuCDRgdGA0LDQt9GDXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8g0L/RgNC+0YHQu9GD0YjQutCwINGB0L7QsdGL0YLQuNC5Li4uXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBfdmlld1ByZWxvYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgaWYoJCh3aW5kb3cpLndpZHRoKCkgPCAxMjAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJy5wcmVsb2FkZXInKS5zaG93KCk7XHJcblxyXG4gICAgICAgIC8vINC+0L/RgNC10LTQtdC70Y/QtdC8INC80LDRgdGB0LjQsiDQtNC70Y8g0YXRgNCw0L3QtdC90LjRjyDQutCw0YDRgtC40L3QvtC6XHJcbiAgICAgICAgdmFyIGltZ3MgPSBbXTtcclxuXHJcbiAgICAgICAgLy8g0L/RgNC+0YXQvtC00LjQvCDQv9C+INCy0YHQtdC8INGN0LvQtdC80LXQvdGC0LDQvCDRgdGC0YDQsNC90LjRhtGLLCDQs9C00LUg0L3QsNGF0L7QtNC40Lwg0LLRgdC1INC60LDRgNGC0LjQvdC60LhcclxuICAgICAgICAkLmVhY2goJCgnKicpLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kID0gJHRoaXMuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksIC8vINC30L3QsNGH0LXQvdC40LUg0YTQvtC90LAg0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsFxyXG4gICAgICAgICAgICAgICAgaW1nID0gJHRoaXMuaXMoJ2ltZycpOyAvLyDQutCw0YDRgtC40L3QutCwLCDQstGB0YLQsNCy0LvQtdC90L3QsNGPINGH0LXRgNC10Lcg0YLQtdCzIDxpbWc+XHJcblxyXG4gICAgICAgICAgICAvLyDQt9Cw0LTQsNC10Lwg0YPRgdC70L7QstC40LUg0L3QsNC70LjRh9C40Y8g0YTQvtC90L7QstC+0Lkg0LrQsNGA0YLQuNC90LrQuFxyXG4gICAgICAgICAgICBpZiAoYmFja2dyb3VuZCAhPSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgIC8vINGB0L7Qt9C00LDQtdC8IHBhdGgsINCz0LTQtSDRhdGA0LDQvdC40Lwg0L/Rg9GC0Ywg0LrQsNGA0YLQuNC90LrQuCDQsiDQstC40LTQtSBodHRwOi8vaW1nXzEuanBnXHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTtcclxuICAgICAgICAgICAgICAgIGltZ3MucHVzaChwYXRoKTsgLy8g0LTQvtCx0LDQstC70Y/QtdC8INC/0YPRgtGMINC60LDRgNGC0LjQvdC60Lgg0LIg0LzQsNGB0YHQuNCyIGltZ3NcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vINCyINGB0LvRg9GH0LDQtSDRgSDQutCw0YDRgtC40L3QutC+0LksINC30LDQtNCw0L3QvdC+0Lkg0YfQtdGA0LXQtyDRgtC10LMgPGltZz4sINCyIHBhdGgg0LrQu9Cw0LTQtdC8INC30L3QsNGH0LXQvdC40LUg0LDRgtGA0LjQsdGD0YLQsCBzcmNcclxuICAgICAgICAgICAgaWYgKGltZykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSAkdGhpcy5hdHRyKCdzcmMnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZ3MucHVzaChwYXRoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIHBlcmNlbnRzVG90YWwgPSAxO1xyXG5cclxuICAgICAgICAvLyDQvtC/0YDQtdC00LXQu9GP0LXQvCDQt9Cw0LPRgNGD0LfQuNC70LDRgdGMINC70Lgg0LrQsNC20LTQsNGPINC60LDRgNGC0LjQvdC60LAg0YEg0L/Rg9GC0LXQvCDQuNC3INC80LDRgdGB0LjQstCwIGltZ3NcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLy8g0LTQu9GPINGN0YLQvtCz0L4g0YHQvtC30LTQsNC10LwgaW1hZ2UsINC60YPQtNCwINC60LvQsNC00LXQvCDRgtC10LMgaW1nIGMg0LDRgtGA0LjQsdGD0YLQvtC8IHNyY1xyXG4gICAgICAgICAgICAvLyDRgtCw0LrQuNC8INC+0LHRgNCw0LfQvtC8INGN0LzRg9C70LjRgNGD0LXQvCwg0LrQsNC6INCx0YPQtNGC0L4g0LLRgdC1INC60LDRgNGC0LjQvdC60LggKNCyINGCLtGHLiDQuCDRhNC+0L3QvtCy0YvQtSkg0LfQsNC00LDQvdGLINGH0LXRgNC10LcgPGltZz5cclxuICAgICAgICAgICAgdmFyIGltYWdlID0gJCgnPGltZz4nLCB7XHJcbiAgICAgICAgICAgICAgICBhdHRyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBpbWdzW2ldXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaW1hZ2Uub24oe1xyXG4gICAgICAgICAgICAgICAgbG9hZCA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRQZXJjZW50cyhpbWdzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudHNUb3RhbCsrO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICBlcnJvciA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwZXJjZW50c1RvdGFsKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldFBlcmNlbnRzICh0b3RhbCwgY3VycmVudCkge1xyXG4gICAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBlcmNlbnQgPj0gMTApIHtcclxuICAgICAgICAgICAgICAgICQoJy5wcmVsb2FkZXInKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ3VybChhc3NldHMvaW1nL2JnX3ByZWxvYWQuanBnKScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtc2l6ZSc6ICdjb3ZlcidcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocGVyY2VudCA+PSAxMDApIHtcclxuICAgICAgICAgICAgICAgICQoJy5wcmVsb2FkZXInKS5mYWRlT3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50ICsgJyUnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9O1xyXG5cclxufSkoKTtcclxuXHJcbnByZWxvYWRlci5pbml0KCk7IiwiLy8gINGB0L7RhdGA0LDQvdGP0LXQvCDQstGB0Y4g0YHRhtC10L3RgyDQv9Cw0YDQsNC70LvQsNC60YHQsFxyXG52YXIgcGFyYWxsYXhDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFyYWxsYXgnKSxcclxuICAgIGxheWVycyA9IHBhcmFsbGF4Q29udGFpbmVyLmNoaWxkcmVuO1xyXG5cclxuLy/Qv9C10YDQtdC00LDQtdC8INGE0YPQvdC60YbQuNGOINC+0LHRgNCw0LHQvtGC0YfQuNC6XHJcblxyXG52YXIgIG1vdmVMYXllcnMgPSBmdW5jdGlvbiAoZSkge1xyXG5cclxuICAgIHZhciBpbml0aWFsWCA9ICh3aW5kb3cuaW5uZXJXaWR0aC8yKSAtIGUucGFnZVgsICAvL9C90LDRhdC+0LTQuNC8INGG0LXQvdGC0YAg0L3QsNGI0LXQs9C+INGN0LrRgNCw0L3QsCDQv9C+INC+0YHQuCBYLCDQstGL0YfQuNGC0LDQtdC8INC/0L7Qu9C+0LbQtdC90LjQtSDQvNGL0YjQutC4INC/0L4g0L7RgdC4IFhcclxuICAgICAgICBpbml0aWFsWSA9ICh3aW5kb3cuaW5uZXJIZWlnaHQvMikgLSBlLnBhZ2VZO1xyXG5cclxuICAgIFtdLnNsaWNlLmNhbGwobGF5ZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChsYXllciwgaSkgeyAgICAgICAgLy8g0LIg0LzQtdGC0L7QtCDQvNCw0YHRgdC40LLQsCBzbGljZSDQv9C10YDQtdC00LDRgtGMINCyINC60LDRh9C10YHRgtCy0LUgdGhpcyDQvdCw0YjQuCDRgdC70L7QuCAo0L/RgdC10LLQtNC+0LzQsNGB0YHQuNCyKNC60L7Qu9C70LXQutGG0LjRjiksINGH0YLQvtCx0Ysg0LzQvtC20L3QviDQsdGL0LvQviDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0LzQtdGC0L7QtNGLINC80LDRgdGB0LjQstCwXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIGRpdmlkZXIgPSBpLzEwMCxcclxuICAgICAgICAgICAgcG9zaXRpb25YID0gaW5pdGlhbFggKiBkaXZpZGVyLFxyXG4gICAgICAgICAgICBwb3NpdGlvblkgPSBpbml0aWFsWSAqIGRpdmlkZXIsXHJcbiAgICAgICAgICAgIGxheWVyU3R5bGUgPSBsYXllci5zdHlsZSwgICAgICAgICAgICAgICAgICAgICAgIC8v0LDQvdC40LzQuNGA0YPQtdC8INGB0LvQvtC5LCDRgdC+0YXRgNCw0L3Rj9C10Lwg0YHRgtC40LvRjCDRgdC70L7Rj1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgPSAndHJhbnNsYXRlM2QoJysgcG9zaXRpb25YICsncHgsICcrIHBvc2l0aW9uWSArJ3B4LCAwKSc7IC8v0LjQt9C80LXQvdGP0LXQvCDQsiDRgdGC0LjQu9C1INGB0LLQvtC50YHRgtCy0L4g0YLRgNCw0L3RgdGE0L7RgNC8INC/0L4g0L7RgdGP0LwgKFgsIFksIFopIGIg0Lgg0YHQvtGF0YDQsNC90Y/QtdC8XHJcblxyXG4gICAgICAgIGxheWVyU3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG4gICAgICAgIGxheWVyU3R5bGUuYm90dG9tID0gJy0nICsgJ3B4JztcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuLy8g0L/QuNGI0LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjQuVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZUxheWVycyk7Il19
