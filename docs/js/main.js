//загрузка из localStorage
loadLS();

// 0. форма добавления новой задачи_________________________________________________

//нажатие на кнопку "сохранить"
$('#submitForm').on('click', function(e){ 
	e.preventDefault();
	addTask();
	hideForm();
});

//нажатие на кнопу "закрыть"
$('#closeForm').on('click', function(e){
	hideForm();
});

//отображение поля заполения новой задачи
function showForm() {	
	$('.form').removeClass('form--hidden');
	$('.navigation').addClass('navigation--hidden');
};

function hideForm() {
	$('.form').addClass('form--hidden');
	$('.navigation').removeClass('navigation--hidden');
	$('#newTaskForm')[0].reset();
}

// 1. функцтя которая создает task _________________________________________________
function addTask() {	
	var tasks = document.getElementById('tasks');
	var title =  document.getElementById('form__taskTitle').value;
	var project = document.getElementById('form__taskProject').value;
	var priority = document.getElementById('form__taskPriority').value;
	var description = document.getElementById('form__description').value;
	var newTime =  Date.now();

	// валидация формы.
	if(title == '' || project == '' || priority == '' || description == '') return alert('не все поля заполнены');

	//функция которая проверяет менять существующую заметку или создать новуюа
	checkDate(document.getElementById('form__createTime').value);

	function checkDate(date){
		var taskList = document.querySelectorAll('.task');
		for (var i = 0; i < taskList.length; i++) {
			if(date == taskList[i].querySelector('.task__createDate').innerHTML) return editTask(taskList[i]);
		}
		return createNewTask();
	};
	
	//функция которая редактирует существующий task
	function editTask(task) {
		task.querySelector('.task__title').innerHTML = title;
		task.querySelector('.task__projectValue').innerHTML = project;
		task.querySelector('.task__priorityValue').innerHTML = priority;
		task.querySelector('.task__descriptionValue').innerHTML = description;

		hideForm();

		return updateSelector()
	}

	//функция которая создает новый таск
	function createNewTask(){
		var taskNew = document.createElement('article');
		taskNew.className = 'task';
		taskNew.innerHTML = '<header class="task__title">' + title + '</header> \
							<div class="task__createDate">' + newTime + '</div>\
							<div class="task__project">Проэкт: <span class="task__projectValue">' + project + '</span></div>\
							<div class="task__priority">priority: <span class="task__priorityValue">' + priority + '</span></div>\
							<div class="task__description">Описание задачи: <span class="task__descriptionValue">' + description + '</span></div>\
							<nav class="task__navigation">\
							<button class="btn btn__edit">Изменить</button>\
							<button class="btn btn__close">Закрыть</button>\
							<button class="btn btn__state">Развернуть</button></nav>';
		
		tasks.appendChild(taskNew);
		hideForm();

		return updateSelector()
	}	
}


// 2. удаление по нажатию на "Закрыть"______________________________________________
$('.tasks').on('click', '.btn__close', function(e){
	$(this).closest('.task').remove();
	updateSelector();
});


// 3. показать детали при нажатии "Развернуть"______________________________________
$('.tasks').on('click', '.btn__state', function(e){
	if(this.innerHTML == 'Развернуть'){
		this.innerHTML = 'Свернуть'
	} else {
		this.innerHTML = 'Развернуть'
	}
	$(this).closest('.task').toggleClass('task--open');
});


// 4. редактирование task-а_________________________________________________________
// по нажатию происходит перенос даных из таска в форму редактирования далее передается в ф-ю addTask();
$('.tasks').on('click', '.btn__edit', function(e){
	editForm(this.closest('.task'));
});

function editForm(task){
	showForm();

	var titleForm =  document.getElementById('form__taskTitle');
	var projectForm = document.getElementById('form__taskProject');
	var priorityForm = document.getElementById('form__taskPriority');
	var descriptionForm = document.getElementById('form__description');
	var createTimeForm =  document.getElementById('form__createTime');

	titleForm.value = task.querySelector('.task__title').innerHTML;
	projectForm.value = task.querySelector('.task__projectValue').innerHTML;
	priorityForm.value = task.querySelector('.task__priorityValue').innerHTML;
	descriptionForm.value  = task.querySelector('.task__descriptionValue').innerHTML;
	createTimeForm.value = task.querySelector('.task__createDate').innerHTML;
}


// 5. фильтрация(по времени создания или по приоритету)_________________________________

// Автоматическая сортировка по времени создания при загрузке страницы
filterData();

$('.navigation').on('click', '#filterPriority__check', function(e){	
	if($('#filterPriority__check').prop("checked")) {
		filterPriority();
	} else {
		filterData();
	}			
});

function filterData(){
	return function() {
		var taskList = document.querySelectorAll('.task');
		var dataArr = [];
		var tasks = taskList[0].parentNode;

		for(var i = 0; i < taskList.length; i++) {
			dataArr.push(tasks.removeChild(taskList[i]));
		}

		dataArr.sort(function(nodeA, nodeB){
			var timeA = nodeA.querySelector('.task__createDate').innerHTML;
			var timeB = nodeB.querySelector('.task__createDate').innerHTML;
			return timeB - timeA;
		})

		dataArr.forEach(function(node){
			tasks.appendChild(node);
		});
	}();
}

function filterPriority(){
	return function() {
		var taskList = document.querySelectorAll('.task');
		var priorityArr = [];
		var tasks = taskList[0].parentNode;

		for(var i = 0; i < taskList.length; i++) {
			priorityArr.push(tasks.removeChild(taskList[i]));
		}

		priorityArr.sort(function(nodeA, nodeB) {
			var priorityA = nodeA.querySelector('.task__priorityValue').innerHTML;
			var priorityB = nodeB.querySelector('.task__priorityValue').innerHTML;
			return priorityA - priorityB;
		});

		priorityArr.forEach(function(node){
			tasks.appendChild(node);
		});
	}();
}


// 6. селектор по проэкту___________________________________________________________

// 6.1 изменение селектора проэкта
$('.filterProjects').change(function(e){
	var project = $('option:selected').val();
	filterSelect(project);
});

function filterSelect(project){
	return function() {
		var taskList = document.querySelectorAll('.task');

		for (var i = 0; i < taskList.length; i++){
			var taskProject = taskList[i].querySelector('.task__projectValue').innerHTML;
			
			if (project == 'All') {
				taskList[i].classList.remove('task--hidden');
			} else if(taskProject == project) {
				taskList[i].classList.remove('task--hidden');
			} else {
				taskList[i].classList.add('task--hidden');
			}
		}
	}();
}

// 6.2 отслеживание существующих проэктов и добавление в список селект
function updateSelector(){
	return function() {
		var filterProjects = document.querySelector('.filterProjects');
		var selectorList = document.querySelectorAll('.selector');
		var taskList = document.querySelectorAll('.task');

		//удаление ненужного селектора задач для которого нету
		for (var i = 1; i < selectorList.length; i++) {
			var important = false;		

			for (var j = 0; j < taskList.length; j++) {
				if (selectorList[i].innerHTML == taskList[j].querySelector('.task__projectValue').innerHTML) {
					important = true;
				}
			}
			if (!important) {
				filterProjects.removeChild(selectorList[i]);
			}
		}

		//добавление селектора в список.
		for (var i = 0; i < taskList.length; i++) {
			var isSelectorNeed = true;

			for (var j = 1; j < selectorList.length; j++) {
				if (selectorList[j].innerHTML == taskList[i].querySelector('.task__projectValue').innerHTML) {
					isSelectorNeed = false;
				}
			}

			if (isSelectorNeed) {			
				var newSelector = document.createElement('option');
				newSelector.className = 'selector';
				newSelector.innerHTML = taskList[i].querySelector('.task__projectValue').innerHTML;
				filterProjects.appendChild(newSelector);
			}
		}

		updateLS(); // после всех изменений обновляем локальное хранилище
	}();
}

//синхронизация селекторов при загрузке страницы
updateSelector();


// 7. работа с LocalStorage__________________________________________________________________

//обновление вызывается после выполнения функции 6.2 updateSelector();
function updateLS() {
	localStorage.clear();

	var tasks = document.querySelectorAll('.task');
	var obj = [];

	for (var i = 0; i < tasks.length; i++) {
		obj[i] = {
			title: tasks[i].querySelector('.task__title').innerHTML,
			date: tasks[i].querySelector('.task__createDate').innerHTML,
			project: tasks[i].querySelector('.task__projectValue').innerHTML,
			priority: tasks[i].querySelector('.task__priorityValue').innerHTML,
			description: tasks[i].querySelector('.task__descriptionValue').innerHTML
		}
		localStorage.setItem('task' + obj[i].date, obj[i].title + ';' + obj[i].date + ';' + obj[i].project + ';' + obj[i].priority + ';' + obj[i].description);
	}
}

function loadLS() {
	var newObj = [];
	var keys = [];
	var storageLength = localStorage.length;
	
	for (var i = 0; i < storageLength; i++) {
		keys[i] = localStorage.key(i);
	}

	for (var j = 0; j < keys.length; j++) {
		if(keys[j].substring(0, 4) == 'task') {
			newObj[j] = localStorage.getItem(keys[j]);
		}
	}

	var obj = [];
	for (var i = 0; i < newObj.length; i++) {
		obj[i] = newObj[i].split(';');
	}
	
	return function() {
		var tasks = document.getElementById('tasks');
		for (var i = 0; i < obj.length; i++) {
			currentTask = obj[i];
			var taskNew = document.createElement('article');
			taskNew.className = 'task';
			taskNew.innerHTML = '<header class="task__title">' + currentTask[0] + '</header> \
								<div class="task__createDate">' + currentTask[1] + '</div>\
								<div class="task__project">Проэкт: <span class="task__projectValue">' + currentTask[2] + '</span></div>\
								<div class="task__priority">priority: <span class="task__priorityValue">' + currentTask[3] + '</span></div>\
								<div class="task__description">Описание задачи: <span class="task__descriptionValue">' + currentTask[4] + '</span></div>\
								<nav class="task__navigation">\
								<button class="btn btn__edit">Изменить</button>\
								<button class="btn btn__close">Закрыть</button>\
								<button class="btn btn__state">Развернуть</button></nav>';
			
			tasks.appendChild(taskNew);
		}

		return updateSelector()
	}();
}