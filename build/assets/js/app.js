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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QxLmpzIiwicHJlbG9hZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy0tLS0tLS0gVGVzdCBNb2R1bGUgLS0tLS0tLS0vL1xuXG52YXIgVGVzdCA9IChmdW5jdGlvbigpIHtcblx0dmFyIF9mcm9tVGVzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFsZXJ0KFwiSGkgdGhlcmUhIEknbSBpbnNpZGUgVGVzdCBNb2R1bGVcIik7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmFycm93LWRvd24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoZSk7XG5cdFx0XHRcdF9mcm9tVGVzdCgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblx0XG59KSgpO1xuIiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XG4gICAgICAgIF92aWV3UHJlbG9hZGVyKCk7XG4gICAgICAgIC8vINGC0L4sINGH0YLQviDQtNC+0LvQttC90L4g0L/RgNC+0LjQt9C+0LnRgtC4INGB0YDQsNC30YNcbiAgICB9O1xuXG4gICAgdmFyIF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g0L/RgNC+0YHQu9GD0YjQutCwINGB0L7QsdGL0YLQuNC5Li4uXG4gICAgfTtcblxuICAgIHZhciBfdmlld1ByZWxvYWRlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZigkKHdpbmRvdykud2lkdGgoKSA8IDEyMDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5wcmVsb2FkZXInKS5zaG93KCk7XG5cbiAgICAgICAgLy8g0L7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQsNGB0YHQuNCyINC00LvRjyDRhdGA0LDQvdC10L3QuNGPINC60LDRgNGC0LjQvdC+0LpcbiAgICAgICAgdmFyIGltZ3MgPSBbXTtcblxuICAgICAgICAvLyDQv9GA0L7RhdC+0LTQuNC8INC/0L4g0LLRgdC10Lwg0Y3Qu9C10LzQtdC90YLQsNC8INGB0YLRgNCw0L3QuNGG0YssINCz0LTQtSDQvdCw0YXQvtC00LjQvCDQstGB0LUg0LrQsNGA0YLQuNC90LrQuFxuICAgICAgICAkLmVhY2goJCgnKicpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhclxuICAgICAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kID0gJHRoaXMuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksIC8vINC30L3QsNGH0LXQvdC40LUg0YTQvtC90LAg0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsFxuICAgICAgICAgICAgICAgIGltZyA9ICR0aGlzLmlzKCdpbWcnKTsgLy8g0LrQsNGA0YLQuNC90LrQsCwg0LLRgdGC0LDQstC70LXQvdC90LDRjyDRh9C10YDQtdC3INGC0LXQsyA8aW1nPlxuXG4gICAgICAgICAgICAvLyDQt9Cw0LTQsNC10Lwg0YPRgdC70L7QstC40LUg0L3QsNC70LjRh9C40Y8g0YTQvtC90L7QstC+0Lkg0LrQsNGA0YLQuNC90LrQuFxuICAgICAgICAgICAgaWYgKGJhY2tncm91bmQgIT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgLy8g0YHQvtC30LTQsNC10LwgcGF0aCwg0LPQtNC1INGF0YDQsNC90LjQvCDQv9GD0YLRjCDQutCw0YDRgtC40L3QutC4INCyINCy0LjQtNC1IGh0dHA6Ly9pbWdfMS5qcGdcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTtcbiAgICAgICAgICAgICAgICBpbWdzLnB1c2gocGF0aCk7IC8vINC00L7QsdCw0LLQu9GP0LXQvCDQv9GD0YLRjCDQutCw0YDRgtC40L3QutC4INCyINC80LDRgdGB0LjQsiBpbWdzXG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0LIg0YHQu9GD0YfQsNC1INGBINC60LDRgNGC0LjQvdC60L7QuSwg0LfQsNC00LDQvdC90L7QuSDRh9C10YDQtdC3INGC0LXQsyA8aW1nPiwg0LIgcGF0aCDQutC70LDQtNC10Lwg0LfQvdCw0YfQtdC90LjQtSDQsNGC0YDQuNCx0YPRgtCwIHNyY1xuICAgICAgICAgICAgaWYgKGltZykge1xuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gJHRoaXMuYXR0cignc3JjJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBpbWdzLnB1c2gocGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBwZXJjZW50c1RvdGFsID0gMTtcblxuICAgICAgICAvLyDQvtC/0YDQtdC00LXQu9GP0LXQvCDQt9Cw0LPRgNGD0LfQuNC70LDRgdGMINC70Lgg0LrQsNC20LTQsNGPINC60LDRgNGC0LjQvdC60LAg0YEg0L/Rg9GC0LXQvCDQuNC3INC80LDRgdGB0LjQstCwIGltZ3NcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyDQtNC70Y8g0Y3RgtC+0LPQviDRgdC+0LfQtNCw0LXQvCBpbWFnZSwg0LrRg9C00LAg0LrQu9Cw0LTQtdC8INGC0LXQsyBpbWcgYyDQsNGC0YDQuNCx0YPRgtC+0Lwgc3JjXG4gICAgICAgICAgICAvLyDRgtCw0LrQuNC8INC+0LHRgNCw0LfQvtC8INGN0LzRg9C70LjRgNGD0LXQvCwg0LrQsNC6INCx0YPQtNGC0L4g0LLRgdC1INC60LDRgNGC0LjQvdC60LggKNCyINGCLtGHLiDQuCDRhNC+0L3QvtCy0YvQtSkg0LfQsNC00LDQvdGLINGH0LXRgNC10LcgPGltZz5cbiAgICAgICAgICAgIHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xuICAgICAgICAgICAgICAgIGF0dHI6IHtcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBpbWdzW2ldXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGltYWdlLm9uKHtcbiAgICAgICAgICAgICAgICBsb2FkIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRQZXJjZW50cyhpbWdzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnRzVG90YWwrKztcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZXJyb3IgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnRzVG90YWwrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UGVyY2VudHMgKHRvdGFsLCBjdXJyZW50KSB7XG4gICAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xuXG4gICAgICAgICAgICBpZiAocGVyY2VudCA+PSAxMCkge1xuICAgICAgICAgICAgICAgICQoJy5wcmVsb2FkZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoYXNzZXRzL2ltZy9iZ19wcmVsb2FkLmpwZyknLFxuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1zaXplJzogJ2NvdmVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGVyY2VudCA+PSAxMDApIHtcbiAgICAgICAgICAgICAgICAkKCcucHJlbG9hZGVyJykuZmFkZU91dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCcucHJlbG9hZGVyX19wZXJjZW50cycpLnRleHQocGVyY2VudCArICclJyk7XG4gICAgICAgIH07XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogaW5pdFxuICAgIH07XG5cbn0pKCk7XG5cbnByZWxvYWRlci5pbml0KCk7Il19
