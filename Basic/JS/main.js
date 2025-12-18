const countries = [
     "Asperkss", "Marlboro"
];

const input = document.getElementById('myInput');
let currentFocus;

// Обработчик ввода
input.addEventListener('input', function(e) {
    const val = this.value;
    closeAllLists();
    
    if (!val) return;
    
    currentFocus = -1;
    
    // Создаем контейнер для вариантов
    const list = document.createElement('div');
    list.setAttribute('id', this.id + '-autocomplete-list');
    list.setAttribute('class', 'autocomplete-items');
    
    this.parentNode.appendChild(list);
    
    // Фильтруем варианты
    countries.forEach(country => {
        if (country.toLowerCase().includes(val.toLowerCase())) {
            // Создаем элемент варианта
            const item = document.createElement('div');
            item.innerHTML = country.replace(
                new RegExp(val, 'gi'),
                '<strong>$&</strong>'
            );
            
            // Добавляем обработчик клика
            item.addEventListener('click', function() {
                input.value = country;
                closeAllLists();
            });
            
            list.appendChild(item);
        }
    });
});

// Обработчик клавиш
input.addEventListener('keydown', function(e) {
    let items = document.getElementById(this.id + '-autocomplete-list');
    if (items) items = items.getElementsByTagName('div');
    
    if (e.keyCode == 40) { // Стрелка вниз
        currentFocus++;
        addActive(items);
    } else if (e.keyCode == 38) { // Стрелка вверх
        currentFocus--;
        addActive(items);
    } else if (e.keyCode == 13) { // Enter
        e.preventDefault();
        if (currentFocus > -1 && items) {
            items[currentFocus].click();
        }
    }
});

// Функция для выделения активного элемента
function addActive(items) {
    if (!items) return false;
    
    removeActive(items);
    
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    
    items[currentFocus].classList.add('autocomplete-active');
}

// Функция для снятия выделения
function removeActive(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('autocomplete-active');
    }
}

// Закрыть все списки автодополнения
function closeAllLists(element) {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        if (element != items[i] && element != input) {
            items[i].parentNode.removeChild(items[i]);
        }
    }
}

// Закрыть список при клике вне его
document.addEventListener('click', function(e) {
    closeAllLists(e.target);
});



document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('nav a');
    const animation = document.querySelector('.animation');
    
    // Устанавливаем начальную позицию анимации
    animation.style.width = '147px';
    animation.style.left = '0px';
    animation.style.backgroundColor = '#1abc9c';
    
    // Добавляем обработчики событий для каждой ссылки
    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function(e) {
            // Рассчитываем положение для анимации
            const left = index * 147;
            animation.style.left = `${left}px`;
        });
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Обновляем класс для активного состояния
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Рассчитываем положение для клика
            const left = index * 147;
            animation.style.left = `${left}px`;
        });
    });
});