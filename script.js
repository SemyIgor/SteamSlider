/* Вашей задачей является создание веб-слайдера для отображения изображений на веб-странице. Слайдер должен 
   позволять переключаться между изображениями и отображать их в центре экрана.

1. Создайте интерфейс веб-страницы, который включает в себя следующие элементы:
   a. Контейнер для отображения текущего изображения.
   b. Кнопки "Предыдущее изображение" и "Следующее изображение" для переключения между изображениями.
   c. Навигационные точки (индикаторы) для быстрого переключения между изображениями.

2. Используйте HTML для создания элементов интерфейса.

3. Используйте JavaScript для обработки событий:
   a. При клике на кнопку "Предыдущее изображение" должно отображаться предыдущее изображение.
   b. При клике на кнопку "Следующее изображение" должно отображаться следующее изображение.
   c. При клике на навигационные точки, слайдер должен переключаться к соответствующему изображению.
 */

const catsImgs = [
	// './img/image00.jpg',
	// './img/image01.jpg',
	// './img/image02.jpg',
	// './img/image03.jpg',
	// './img/image04.jpg',
	'https://masterpiecer-images.s3.yandex.net/f616c1126d3311eea1474659bdca6a39:upscaled',
	'https://masterpiecer-images.s3.yandex.net/e57dcdfa6acc11ee8e2992669a1675b3:upscaled',
	'https://masterpiecer-images.s3.yandex.net/b0dff703878211ee9c683abd0be4d755:upscaled',
	'https://masterpiecer-images.s3.yandex.net/8e120d2a9d9111ee8d617a83974e0feb:upscaled',
	'https://avatars.mds.yandex.net/get-shedevrum/9283310/b133a531b24311eeb2ebd6f07e64960d/orig',
];

const arrowRight = document.querySelector('.arrow-right path');
const arrowLeft = document.querySelector('.arrow-left path');

const imagesQueue = document.querySelector('.images-queue');
const frameSet = document.querySelector('.frame');

const paginationEl = document.querySelector('.pagination');

// Объявляем индексы массива, определяющие номера трёх картинок
let imageIndex = 1;
let imageIndexBefore;
let imageIndexAfter;
// По индексу средней из трёх картинок, вычисляем индексы соседних с ней
neighborIndexes(imageIndex);

// Навешиваем события на кнопки слайдера
arrowRight.addEventListener('click', () => moveLeft());
arrowLeft.addEventListener('click', () => moveRight());

// Выводим в DOM тройку картинок и пагинацию
putInDOMImagesSet();
putInDOMPagination();

// Получаем NodeList элементов пагинации
const paginationSet = document.querySelectorAll('.pagin-item');

// Подвешиваем событие 'click' на каждый элемент пагинации
paginationSet.forEach((elem) => {
	elem.addEventListener('click', (event) => paginEventActivate(event));
});

// Функция обнуления признака "текущий" для всех эелементов пагинации
function clearCurrentPagination() {
	paginationSet.forEach((el) => {
		if (el.classList.contains('pagin-item_current'))
			el.classList.remove('pagin-item_current');
	});
}

function paginEventActivate(event) {
	const pagIndex = parseInt(event.target.dataset.pag);
	const compareIndexes = pagIndex - imageIndex;
	// Если кликнули не по номеру картинки, которая уже на экране
	// (Иначе ничего не происходит)
	if (compareIndexes != 0) {
		// Удаляем признак текущей пагинации (сбрасываем точки)
		clearCurrentPagination();

		// Делаем "текущим" элемент пагинации, на который кликнули
		imageIndex = pagIndex;
		paginationSet[imageIndex].classList.add('pagin-item_current');

		// Определяем индексы новой тройки картинок !!!!
		neighborIndexes(imageIndex);

		if (compareIndexes > 0) {
			// Заменяем в "паровозике" последнюю картинку в тройке на выбранную по номеру пагинации
			imagesQueue.lastElementChild.attributes.src.value = catsImgs[imageIndex];

			// Плавный скроллинг всей тройки картинок влево, выбранная картинка "выплывает" на экран
			imagesQueueMoveLeft();

			setTimeout(imagesQueueReturnRight, 500);
			// Загружаем в DOM новую тройку картинок
			setTimeout(putInDOMImagesSet, 500);
		} else {
			// Заменяем в "паровозике" первую картинку в тройке на выбранную по номеру пагинации
			imagesQueue.firstElementChild.attributes.src.value = catsImgs[imageIndex];

			// Плавный скроллинг всей тройки картинок вправо, выбранная картинка "выплывает" на экран
			imagesQueueMoveRight();

			setTimeout(imagesQueueReturnLeft, 500);
			// Загружаем в DOM новую тройку картинок
			setTimeout(putInDOMImagesSet, 500);
		}
	}
}

// Функция изначальной загрузки в DOM блока пагинации
function putInDOMPagination() {
	paginationEl.innerHTML = '';
	let paginItems = ``;
	catsImgs.forEach((value, index) => {
		if (index === imageIndex) {
			paginItems += `<div class="pagin-item pagin-item_current" data-pag="${index}"></div>`;
		} else {
			paginItems += `<div class="pagin-item" data-pag="${index}"></div>`;
		}
	});

	paginationEl.insertAdjacentHTML('afterbegin', paginItems);
}

// Функция определения индексов элементов, соседних к данному
function neighborIndexes(imageIndex) {
	imageIndexBefore = imageIndex - 1 < 0 ? catsImgs.length - 1 : imageIndex - 1;
	imageIndexAfter = imageIndex + 1 >= catsImgs.length ? 0 : imageIndex + 1;
}

// Функция вывода трёх картинок (текущей и двух соседних к ней) в блок "паровозик"
function putInDOMImagesSet() {
	imagesQueue.innerHTML = '';
	imagesQueue.insertAdjacentHTML(
		'afterbegin',
		`
      <img class="image-one"
         src="${catsImgs[imageIndexBefore]}" alt="cats">
      <img class="image-two"
         src="${catsImgs[imageIndex]}" alt="cats">
      <img class="image-three"
         src="${catsImgs[imageIndexAfter]}">
   `
	);
}

// Функция помещения во фрейм текущей картинки
function refreshFrame() {
	frameSet.innerHTML = `<img class="frame-img" src="${catsImgs[imageIndex]}" alt="cats">`;
}

// Функция скроллинга вправо (основная)
function moveRight() {
	// Удаляем признак текущей пагинации (сбрасываем точки)
	clearCurrentPagination();

	// Определяем индекс следующей картинки
	imageIndex = imageIndex - 1 < 0 ? catsImgs.length - 1 : imageIndex - 1;

	// Определяем индексы новой тройки картинок !!!!
	neighborIndexes(imageIndex);

	// Делаем "текущим" элемент пагинации, который соответствует новой картинке
	paginationSet[imageIndex].classList.add('pagin-item_current');

	// Заменяем в "паровозике" первую картинку в тройке на выбранную по номеру пагинации
	imagesQueue.firstElementChild.attributes.src.value = catsImgs[imageIndex];

	// Плавный скроллинг всей тройки картинок вправо, выбранная картинка "выплывает" на экран
	imagesQueueMoveRight();

	// Возвращаем на место (влево) "паровозик"
	setTimeout(imagesQueueReturnLeft, 500);
	// Загружаем в DOM новую тройку картинок
	setTimeout(putInDOMImagesSet, 500);
}

// Функция сдвига трёх картинок, загруженных в DOM, вправо
function imagesQueueMoveRight() {
	// Убираем фрейм за слайдер
	frameDown();

	// Плавно перемещаем три картинки, находящиеся в DOM-е, вправо
	queueMoveRight();

	// // Выводим картинку во фрейм
	refreshFrame();

	// Размещаем фрейм перед слайдером
	setTimeout(frameUp, 500);
}

// Ставим "прикрывающую картинку" (фрейм) перед слайдером
function frameUp() {
	frameSet.setAttribute('style', 'z-index: 10');
}

// Убираем "прикрывающую" картинку (фрейм) за слайдер
function frameDown() {
	console.log('frameSet: ', frameSet);
	frameSet.setAttribute('style', 'z-index: -10');
}

// Сдвигаем "паровозик" вправо
function queueMoveRight() {
	// Плавно перемещаем три картинки, находящиеся в DOM-е, вправо
	imagesQueue.classList.remove('images-leftmove');
	imagesQueue.classList.remove('images-queueinitial');
	imagesQueue.classList.add('images-rightmove');
}

// Сдвигаем "паровозик" влево
function queueMoveLeft() {
	// Плавно перемещаем три картинки, находящиеся в DOM-е, влево
	imagesQueue.classList.remove('images-rightmove');
	imagesQueue.classList.remove('images-queueinitial');
	imagesQueue.classList.add('images-leftmove');
}

// Функция возврата трёх картинок, загруженных в DOM, влево
function imagesQueueReturnLeft() {
	// Возвращаем тройку картинок на исходную под прикрытием фрейма
	returnLeft();
}

// Функция возврата тройки картинок на исходную
function returnLeft() {
	// Возвращаем тройку картинок на исходную под прикрытием фрейма
	imagesQueue.classList.remove('images-rightmove');
	// imagesQueue.classList.remove('images-leftmove');
	imagesQueue.classList.add('images-queueinitial');
}

// Функция скроллинга влево (основная)
function moveLeft() {
	// Удаляем признак текущей пагинации (сбрасываем точки)
	clearCurrentPagination();

	console.log('imageIndex: ', imageIndex);
	// Определяем индекс следующей картинки
	imageIndex = imageIndex + 1 > catsImgs.length - 1 ? 0 : imageIndex + 1;

	// Определяем индексы новой тройки картинок !!!!
	neighborIndexes(imageIndex);

	console.log('paginationSet[imageIndex]: ', paginationSet[imageIndex]);
	// Делаем "текущим" элемент пагинации, который соответствует новой картинке
	paginationSet[imageIndex].classList.add('pagin-item_current');

	// Заменяем в "паровозике" последнюю картинку в тройке на выбранную по номеру пагинации
	imagesQueue.lastElementChild.attributes.src.value = catsImgs[imageIndex];

	// Плавный скроллинг всей тройки картинок влево, выбранная картинка "выплывает" на экран
	imagesQueueMoveLeft();

	// Возвращаем на место (влево) "паровозик"
	setTimeout(imagesQueueReturnRight, 500);

	// Загружаем в DOM новую тройку картинок
	setTimeout(putInDOMImagesSet, 500);
}

// Функция сдвига трёх картинок, загруженных в DOM, влево
function imagesQueueMoveLeft() {
	// Убираем фрейм за слайдер
	frameDown();

	// Плавно перемещаем три картинки, находящиеся в DOM-е, вправо
	queueMoveLeft();

	// // Выводим картинку во фрейм
	refreshFrame();

	// Размещаем фрейм перед слайдером
	setTimeout(frameUp, 500);
}

// Функция возврата трёх картинок, загруженных в DOM, вправо
function imagesQueueReturnRight() {
	// Возвращаем тройку картинок на исходную под прикрытием фрейма
	returnRight();
}

// Функция возврата тройки картинок на исходную
function returnRight() {
	// Возвращаем тройку картинок на исходную под прикрытием фрейма
	imagesQueue.classList.remove('images-leftmove');
	// imagesQueue.classList.remove('images-rightmove');
	imagesQueue.classList.add('images-queueinitial');
}
