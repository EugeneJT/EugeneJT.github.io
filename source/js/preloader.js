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