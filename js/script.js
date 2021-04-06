//CREATE TABS
window.addEventListener('DOMContentLoaded', () => {

    const tabsParent = document.querySelector('.tabheader__items'),
          tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent');
          
    //1.Скриваємо таби
    function hideTabContent () {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
    
        //1.1 Коли скриваємо всі таби то забираємо також клас active
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    };
    
    //2.Функція яка показує таби
    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    };
    
    hideTabContent();
    showTabContent();
    
    
    //3.Використовую делегирование на предка для того щоб в майбутньому якщо додасться ще один таб він теж був робочим
    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
    
        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
    


    // CREATE TIMER
    //1. Встановлюємо першу відправну точку
    const deadline = '2021-03-11';

    //2.Створюю функцію яка буде рахувати різницю між дедлайном і теперішнім часом
    function getTimeRemaining (endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor( (t/(1000*60*60*24)) ),
              hours = Math.floor( (t/(1000*60*60) % 24) );
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        //Щоб можна було користуватися цими variables за межами функції є спосіб з використанням return і виведенням їх як об*єкта
        return {
             'total': t,
             'days': days,
             'hours': hours,
             'minutes': minutes,
             'seconds': seconds
        }
    }


    //5. Функцыя яка буде провіряти і добавляти нулик
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }   

    //3. Створюється функція яка буде вставляти наш час на сторінку
    function setClock (selector, endtime) {
        const timer = document.querySelector(selector),
              days = document.querySelector('#days'),
              hours = document.querySelector('#hours'),
              minutes = document.querySelector('#minutes'),
              seconds = document.querySelector('#seconds'),
              //3.2 Наступна дія це запускати функцію updateClock кожну секунду
              timeInterval = setInterval(updateClock, 1000);

        //Виправлення бага, запускаю функцію для того щоб одразу запускався час і не чекав 1 секунду
        updateClock();
        //3.1 функція буде обновляти таймер кожну секунду
        function updateClock () {
            //Розрахунок того часу який в нас лишився тобто визиваємо функцію і там є дані для поміщення сторінку
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            //3.3. Інтервал є і в майбутньому функцію потрібно буде зупиняти
            if (t.total <= 0 ) {
                clearInterval(timeInterval);
            }
        }
    }    
    setClock('.timer', deadline);
    });

    //Create modal window(і назначення на всі кнопки відкривалось те саме вікно)

    //Коли ми знаємо що на кнопки мають бути задіяні ті самі операції то в html до елементу краще додати data atribute
    //Атрибут data-modal а також на якись елемент треба буде поставити data-close

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          closeModal = document.querySelector('[data-close]');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(timeModal);
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closesModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        //modal.classList.toggle('show');
        //Приклад з toogle, але домавляємо клас hide, це означає шо він зразу скритий
    };

    closeModal.addEventListener('click', closesModal);
    //Клік збоку щоб вікно закривалось
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closesModal();
        }
    });

    //При нажиманні на клавішу ESC модальне вікно закривається

    document.addEventListener('keydown', (e) => {
        if(e.code === "Escape") {
            closesModal();
        }
    });


    //Для того щоб модальне вікно відкривалось через заданий проміжок часу

    const timeModal = setTimeout(openModal, 5000);

    //Коли користувач долистав сторінку до самого кінця показати модальне вікно

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    //Using classes/ використання класів для карточок

    class MenuCard {
        constructor (src, alt, title, description, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.transfer = 28;
            this.parent = document.querySelector(parentSelector);
            this.changeToUAH();
            this.classes = classes;
        }

        changeToUAH() {
            this.price = +this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            };
            
            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.description}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vagy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item',
        'big'
    ).render();

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vagy",
        'Меню "Постное""',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        9,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vagy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item'
    ).render();

    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка',
        success: 'Спасибо, скоро ми с ввами свяжемся',
        fail: 'Ошибка'
    };

    forms.forEach(item => {
        postData(item);
    });

    //Функція яка відповідає за постинг даних з допомогою new FormData
/*
    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); //Відключаємо при нажиманні кнопки щоб сторінка не перезагружалась

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php'); 

            //request.setRequestHeader('Content-type', 'multipart/form-data'); через це можна отримати помилку
            //Використовуємо form data для передачі даних
            const formData = new FormData(form);
            request.send(formData);

            request.addEventListener('load', () => {
                if(request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.fail;
                }
            });
        });
    }
*/
    //Використовуємо JSON для передачі даних ,залежить з яким бекендщиком працюємо

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); //Відключаємо при нажиманні кнопки щоб сторінка не перезагружалась

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php'); 

            request.setRequestHeader('Content-type', 'aplication/json'); 
            //Використовуємо form data для передачі даних
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });

            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if(request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.fail;
                }
            });
        });
    }