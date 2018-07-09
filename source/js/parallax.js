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