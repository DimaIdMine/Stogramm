  const peopleData = [
            { id: 1, name: "Алексей Иванов", username: "alex_ivanov", online: true, inContacts: false },
            { id: 2, name: "Мария Петрова", username: "maria_p", online: true, inContacts: false },
            { id: 3, name: "Иван Сидоров", username: "ivan_s", online: false, inContacts: false },
            { id: 4, name: "Екатерина Смирнова", username: "kate_smirnova", online: true, inContacts: false },
            { id: 5, name: "Дмитрий Козлов", username: "dima_kozlov", online: false, inContacts: false },
            { id: 6, name: "Анна Волкова", username: "anna_v", online: true, inContacts: false },
            { id: 7, name: "Сергей Новиков", username: "serg_nov", online: true, inContacts: false },
            { id: 8, name: "Ольга Морозова", username: "olga_m", online: false, inContacts: false },
            { id: 9, name: "Павел Захаров", username: "pavel_z", online: true, inContacts: false },
            { id: 10, name: "Наталья Орлова", username: "nataly_o", online: false, inContacts: false }
        ];

        // Мои контакты
        let myContacts = [];

        // Открыть модальное окно поиска
        function openSearchModal() {
            const modal = document.getElementById('searchModal');
            const overlay = document.getElementById('modalOverlay');
            
            modal.style.display = 'block';
            overlay.style.display = 'block';
            
            // Загрузить данные
            displayAllPeople();
            updateContactsList();
            updateContactsCount();
            
            // Сфокусироваться на поле поиска
            setTimeout(() => {
                document.getElementById('peopleSearch').focus();
            }, 100);
        }

        // Закрыть модальное окно поиска
        function closeSearchModal() {
            const modal = document.getElementById('searchModal');
            const overlay = document.getElementById('modalOverlay');
            
            modal.style.display = 'none';
            overlay.style.display = 'none';
            
            // Очистить поле поиска
            document.getElementById('peopleSearch').value = '';
        }

        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSearchModal();
            }
        });

        // Инициализация поиска
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('peopleSearch');
            if (searchInput) {
                searchInput.addEventListener('input', searchPeople);
            }
        });

        // Поиск людей
        function searchPeople() {
            const searchInput = document.getElementById('peopleSearch');
            const searchTerm = searchInput.value.toLowerCase().trim();
            const peopleResults = document.getElementById('peopleResults');
            const resultsCount = document.getElementById('resultsCount');
            const contactsContainer = document.getElementById('contactsContainer');
            const peopleContainer = document.getElementById('peopleContainer');
            
            peopleResults.innerHTML = '';
            
            if (searchTerm === '') {
                displayAllPeople();
                contactsContainer.style.display = 'block';
                return;
            }
            
            // Скрываем контакты при поиске
            contactsContainer.style.display = 'none';
            
            const filteredPeople = peopleData.filter(person => 
                person.username.toLowerCase().includes(searchTerm) || 
                person.name.toLowerCase().includes(searchTerm)
            );
            
            resultsCount.textContent = `найдено ${filteredPeople.length}`;
            
            if (filteredPeople.length === 0) {
                peopleResults.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🔍</div>
                        <div class="empty-text">Люди не найдены</div>
                        <div class="empty-hint">Попробуйте другой запрос</div>
                    </div>
                `;
            } else {
                filteredPeople.forEach(person => {
                    const personElement = createPersonElement(person);
                    peopleResults.appendChild(personElement);
                });
            }
        }

        // Показать всех людей
        function displayAllPeople() {
            const peopleResults = document.getElementById('peopleResults');
            const resultsCount = document.getElementById('resultsCount');
            const contactsContainer = document.getElementById('contactsContainer');
            
            peopleResults.innerHTML = '';
            resultsCount.textContent = `найдено ${peopleData.length}`;
            contactsContainer.style.display = 'block';
            
            peopleData.forEach(person => {
                const personElement = createPersonElement(person);
                peopleResults.appendChild(personElement);
            });
        }

        // Создать элемент человека
        function createPersonElement(person) {
            const personItem = document.createElement('div');
            personItem.className = 'user-item';
            personItem.dataset.id = person.id;
            
            const firstLetter = person.name.charAt(0);
            const isInContacts = myContacts.includes(person.id);
            
            personItem.innerHTML = `
                <div class="user-avatar">${firstLetter}</div>
                <div class="user-info">
                    <div class="user-name">${person.name}</div>
                    <div class="user-username">@${person.username}</div>
                </div>
                <div class="user-status ${person.online ? 'status-online' : 'status-offline'}">
                    ${person.online ? 'online' : 'offline'}
                </div>
                <button class="add-btn ${isInContacts ? 'added' : ''}" onclick="toggleContact(${person.id}, this)">
                    ${isInContacts ? '✓ В контактах' : '+ Добавить'}
                </button>
            `;
            
            // Клик по всей строке для начала чата
            personItem.addEventListener('click', function(e) {
                if (!e.target.closest('.add-btn')) {
                    startChat(person.id);
                }
            });
            
            return personItem;
        }

        // Обновить список контактов
        function updateContactsList() {
            const contactsList = document.getElementById('myContactsList');
            const contactsInData = peopleData.filter(p => myContacts.includes(p.id));
            
            if (contactsInData.length === 0) {
                contactsList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">👤</div>
                        <div class="empty-text">У вас пока нет контактов</div>
                        <div class="empty-hint">Добавьте людей из списка ниже</div>
                    </div>
                `;
            } else {
                contactsList.innerHTML = contactsInData.map(person => `
                    <div class="user-item" onclick="startChat(${person.id})">
                        <div class="user-avatar">${person.name.charAt(0)}</div>
                        <div class="user-info">
                            <div class="user-name">${person.name}</div>
                            <div class="user-username">@${person.username}</div>
                        </div>
                        <div class="user-status ${person.online ? 'status-online' : 'status-offline'}">
                            ${person.online ? 'online' : 'offline'}
                        </div>
                        <button class="add-btn added" onclick="removeContact(${person.id}, event)">
                            ✕
                        </button>
                    </div>
                `).join('');
            }
        }

        // Добавить/удалить из контактов
        function toggleContact(personId, button) {
            event.stopPropagation(); // Остановить всплытие
            
            if (myContacts.includes(personId)) {
                // Удалить из контактов
                myContacts = myContacts.filter(id => id !== personId);
                button.classList.remove('added');
                button.textContent = '+ Добавить';
                
                // Обновить в данных
                const person = peopleData.find(p => p.id === personId);
                if (person) person.inContacts = false;
            } else {
                // Добавить в контакты
                myContacts.push(personId);
                button.classList.add('added');
                button.textContent = '✓ В контактах';
                
                // Обновить в данных
                const person = peopleData.find(p => p.id === personId);
                if (person) person.inContacts = true;
                
                showNotification(`@${person.username} добавлен в контакты`);
            }
            
            updateContactsList();
            updateContactsCount();
            
            // Обновить поиск если есть текст
            const searchInput = document.getElementById('peopleSearch');
            if (searchInput.value.trim() !== '') {
                searchPeople();
            }
        }

        // Удалить контакт
        function removeContact(personId, event) {
            event.stopPropagation(); // Остановить всплытие
            
            myContacts = myContacts.filter(id => id !== personId);
            
            // Обновить в данных
            const person = peopleData.find(p => p.id === personId);
            if (person) person.inContacts = false;
            
            updateContactsList();
            updateContactsCount();
            
            // Обновить основной список
            displayAllPeople();
            
            showNotification('Контакт удален');
        }

        // Обновить счетчик контактов
        function updateContactsCount() {
            const contactsCount = document.getElementById('contactsCount');
            contactsCount.textContent = `${myContacts.length} контактов`;
        }

        // Начать чат
        function startChat(personId) {
            const person = peopleData.find(p => p.id === personId);
            if (person) {
                showNotification(`Начинаем чат с @${person.username}`);
                
                // Закрываем модальное окно
                setTimeout(() => {
                    closeSearchModal();
                    
                    // Здесь можно добавить переход в чат
                    // window.location.href = `chat.html?user=${personId}`;
                }, 1000);
            }
        }

        // Показать уведомление
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #0095f6;
                color: white;
                padding: 16px 24px;
                border-radius: 10px;
                font-weight: 600;
                z-index: 1002;
                animation: slideIn 0.3s ease-out;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            `;
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Автодополнение @
        document.getElementById('peopleSearch').addEventListener('keydown', function(e) {
            if (e.key === '@') {
                if (!this.value.includes('@') || this.selectionStart === 0) {
                    e.preventDefault();
                    this.value = '@' + this.value;
                    this.selectionStart = this.selectionEnd = 1;
                }
            }
            
            // Поиск по Enter
            if (e.key === 'Enter') {
                searchPeople();
            }
        });