const btn = document.querySelector('.main-modal-btn');
const modal = document.querySelector('.modal');
const btnCancel = document.querySelector('.modal-cancel');
const modalInput = document.querySelector('.modal-field');
const modalApply = document.querySelector('.modal-submit');
const themeBtn = document.querySelector('.settings-theme');
const list = document.querySelector('.main-list');
const modalForm = document.querySelector('.modal-form');
const searchInput = document.querySelector('.settings-search');
const main = document.querySelector('.main');
const select = document.querySelector('.settings-select');
const options = document.querySelectorAll('.settings-select-option');

let editedTask;
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((item) => renderTask(item));
};

if (localStorage.getItem('select')) {
    options.forEach((element) => element.selected = element.textContent.toLocaleUpperCase() === localStorage.getItem('select'));
};

checkEmptyList();
filterList();

// Change theme

function changeTheme() {
    document.body.classList.toggle('night-theme');
    localStorage.getItem('theme') ? localStorage.setItem('theme', '') : localStorage.setItem('theme', 'night-theme');
};

themeBtn.addEventListener('click', changeTheme);

// Modal

function setAutofocusInModal() {
    setTimeout(() => {
        modalInput.focus();
    }, 0);
};

function openModal() {
    setAutofocusInModal();
    getApplyActive();
    modal.classList.add('open');
    document.body.classList.add('open-modal');
};

function closeModal() {
    modal.classList.remove('open');
    modalInput.value = '';
    document.body.classList.remove('open-modal');
    modalApply.classList.remove('edit');
};

function closeModalByArea(evt) {
    if (!evt.target.closest('.modal-wrapper')) {
        closeModal();
    }
};

function getApplyActive() {
    modalApply.disabled = !modalInput.value.trim();
};

btn.addEventListener('click', openModal);
btnCancel.addEventListener('click', closeModal);
modalInput.addEventListener('input', getApplyActive);
modal.addEventListener('click', closeModalByArea);

// Add tasks

function renderTask(task) {
    const newClass = task.done ? 'main-list-item checked' : 'main-list-item';

    const taskHTML = `<li id='${task.id}' class='${newClass}'>
    <button class="main-list-item-btn btn-done btn"></button>
    <span class="main-list-item-text">${task.text}</span>
    <div class="main-list-item-btn-wrapper">
        <button class="main-list-item-btn-edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"
                fill="none">
                <path class="main-list-item-path"
                    d="M7.67272 3.99106L1 10.6637V14H4.33636L11.0091 7.32736M7.67272 3.99106L10.0654 1.59837L10.0669 1.59695C10.3962 1.26759 10.5612 1.10261 10.7514 1.04082C10.9189 0.986392 11.0993 0.986392 11.2669 1.04082C11.4569 1.10257 11.6217 1.26735 11.9506 1.59625L13.4018 3.04738C13.7321 3.37769 13.8973 3.54292 13.9592 3.73337C14.0136 3.90088 14.0136 4.08133 13.9592 4.24885C13.8974 4.43916 13.7324 4.60414 13.4025 4.93398L13.4018 4.93468L11.0091 7.32736M7.67272 3.99106L11.0091 7.32736"
                    stroke="#CDCDCD" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
        <button class="main-list-item-btn-delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                fill="none">
                <path class="main-list-item-path"
                    d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z"
                    stroke="#CDCDCD" />
                <path class="main-list-item-path" d="M14.625 3.75H3.375" stroke="#CDCDCD"
                    stroke-linecap="round" />
                <path class="main-list-item-path"
                    d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z"
                    stroke="#CDCDCD" />
                <path class="main-list-item-path" d="M10.5 9V12.75" stroke="#CDCDCD"
                    stroke-linecap="round" />
                <path class="main-list-item-path" d="M7.5 9V12.75" stroke="#CDCDCD"
                    stroke-linecap="round" />
            </svg>
        </button>
    </div>
</li>`;
    list.insertAdjacentHTML("beforeend", taskHTML);
}

function addTask(evt) {
    if (!modalApply.classList.contains('edit')) {
        evt.preventDefault();
        const taskText = modalInput.value.trim();

        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false,
        }

        tasks.push(newTask);
        saveToLocalStorage();
        renderTask(newTask);
        closeModal();
        checkEmptyList();
        filterList();
    }
};

modalForm.addEventListener('submit', addTask);

// Delete tasks

function deleteTask(evt) {
    if (evt.target.closest('.main-list-item-btn-delete')) {
        const parentNode = evt.target.closest('.main-list-item');
        const id = parentNode.id;
        const index = tasks.findIndex((item) => item.id == id);
        tasks.splice(index, 1);
        saveToLocalStorage();
        parentNode.remove();
    }
    checkEmptyList();
};

list.addEventListener('click', deleteTask);

// Edit tasks

function editTask(evt) {
    if (evt.target.closest('.main-list-item-btn-edit')) {
        editedTask = evt.target.closest('.main-list-item')
        openModal();
        modalInput.value = evt.target.closest('.main-list-item').textContent.trim();
        modalApply.disabled = false;
        modalApply.classList.add('edit');
    }
};

function saveChangesTask(evt) {
    if (modalApply.classList.contains('edit')) {
        evt.preventDefault();
        const editedText = editedTask.querySelector('.main-list-item-text');
        editedText.textContent = modalInput.value;
        const id = editedTask.id;
        const index = tasks.findIndex((item) => item.id == id);
        tasks[index].text = modalInput.value;
        saveToLocalStorage();
        closeModal();
    }
};

list.addEventListener('click', editTask);
modalForm.addEventListener('submit', saveChangesTask);

// Mark finished tasks

function setTaskMark(evt) {
    if (evt.target.closest('.btn-done')) {
        const parentNode = evt.target.closest('.main-list-item');
        const id = parentNode.id;
        const task = tasks.find((item) => item.id == id);
        task.done = !task.done;
        saveToLocalStorage()
        parentNode.classList.toggle('checked');
        filterList();
    }
};

list.addEventListener('click', setTaskMark);

// Show icon for empty list

function checkEmptyList() {
    const emptyTextHTML = `<div class="main-empty">
<img class="main-empty-icon" src="img/detective.png" alt="Список пуст" width="221" height="174">
<span class="main-empty-text">Empty...</span>
</div>`;
    const listItems = document.querySelectorAll('.main-list-item');
    if (listItems.length === 0) {
        main.insertAdjacentHTML('afterbegin', emptyTextHTML);
    } else {
        const mainEmpty = document.querySelector('.main-empty');
        mainEmpty ? mainEmpty.remove() : null;
    }
};

// Search

function search() {
    const listItemsText = document.querySelectorAll('.main-list-item-text');
    const value = searchInput.value.trim();

    if (value !== '') {
        listItemsText.forEach((item) => {
            if (item.textContent.toUpperCase().indexOf(value.toUpperCase()) === -1) {
                item.closest('.main-list-item').classList.add('hide');
            } else item.closest('.main-list-item').classList.remove('hide');
        })
    } else document.querySelectorAll('.main-list-item').forEach((item) => item.classList.remove('hide'));
};

searchInput.addEventListener('input', search);

// Filter

function filterList() {
    const checkedItems = document.querySelectorAll('.main-list-item.checked');
    const uncheckedItems = document.querySelectorAll('.main-list-item:not(.checked)');
    const value = select.value.toUpperCase();

    function changeDisplay(elem, value) {
        elem.forEach((item) => {
            item.style.display = value;
        });
    };

    switch (value) {
        case 'COMPLETE':
            changeDisplay(uncheckedItems, 'none');
            changeDisplay(checkedItems, '');
            break;
        case 'INCOMPLETE':
            changeDisplay(checkedItems, 'none');
            changeDisplay(uncheckedItems, '');
            break;
        case 'ALL':
            document.querySelectorAll('.main-list-item').forEach((item) => item.style.display = '');
            break;
    }
    localStorage.setItem('select', value);
};

select.addEventListener('change', filterList);

// Save data to localStorage

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};