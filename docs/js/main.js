// 0. форма редактирования задачи_____________________________________________________

//нажатие на кнопку "сохранить"
$('#submitForm').on('click', function(e){
	e.preventDefault();
	readForm();
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


// 1 функцтя которая создает task _________________________________________________

// 1.1 сбор данных из заполненой формы
function readForm() {
					console.log('readForm();');	
	var title =  document.getElementById('form__taskTitle').value;
	var project = document.getElementById('form__taskProject').value;
	var priority = document.getElementById('form__taskPriority').value;
	var description = document.getElementById('form__description').value;
	var newTime =  Date.now();

	// валидация формы
	if(!validationForm(title, project, priority, description)) return

	// функция которая проверяет менять существующую заметку или создать новуюа
	checkDate(document.getElementById('form__createTime').value);

	function checkDate(date){
						console.log('checkDate();');	
		var taskList = document.querySelectorAll('.task');
		for (var i = 0; i < taskList.length; i++) {
			if(date == taskList[i].querySelector('.task__createDate').innerHTML) return editTask(taskList[i], title, project, priority, description);
		}
		return pasteTask(title, newTime, project, priority, description);
	}

	hideForm();
	updateSelector();
	updateLS();
	autoSort();	
}

// 1.2 функция которая редактирует существующий task
function editTask(task, title, project, priority, description) {
					console.log('editTask();');
	task.querySelector('.task__title').innerHTML = title;
	task.querySelector('.task__projectValue').innerHTML = project;
	task.querySelector('.task__priorityValue').innerHTML = priority;
	task.querySelector('.task__descriptionValue').innerHTML = description;
}

// 1.3 вставить task на страницу
function pasteTask(title, time, project, priority, description) {
					console.log('pasteTask()');
	var tasks = document.getElementById('tasks');
	var newTask = document.createElement('article');
	newTask.className = 'task';
	newTask.innerHTML = '<header class="task__title">' + title + '</header> \
							<div class="task__createDate">' + time + '</div>\
							<div class="task__project">Проэкт: <span class="task__projectValue">' + project + '</span></div>\
							<div class="task__priority">priority: <span class="task__priorityValue">' + priority + '</span></div>\
							<div class="task__description"><span class="task__descriptionValue">' + description + '</span></div>\
							<nav class="task__navigation">\
							<button class="btn btn__edit">Изменить</button>\
							<button class="btn btn__close">Закрыть</button>\
							<button class="btn btn__state">Развернуть</button></nav>';
	tasks.appendChild(newTask);
}


// 2 удаление по нажатию на "Закрыть"______________________________________________
$('.tasks').on('click', '.btn__close', function(e){
	$(this).closest('.task').remove();
	updateSelector();
	updateLS();
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


// 4 редактирование таска - заполнение формы из существующего таска________________________
// по нажатию происходит перенос даных из таска в форму редактирования далее передается в ф-ю readForm();
$('.tasks').on('click', '.btn__edit', function(e){
	editForm(this.closest('.task'));
});

function editForm(task){
	showForm();
						console.log('editForm();');
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


// 5 фильтрация(по времени создания или по приоритету)_________________________________

function autoSort(){	
	if($('#filterPriority__check').prop("checked")) {
		filterPriority();
	} else {
		filterData();
	}				
}

$('.navigation').on('click', '#filterPriority__check', function(e){	
	autoSort();			
});

// 5.1 фильтрация по дате создания
function filterData(){
						console.log('фильтрация по дате filterData();');
		var taskList = document.querySelectorAll('.task');
		var dataArr = [];
		var tasks = document.getElementById('tasks');

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
}

// 5.2 фильтрация по приоритету
function filterPriority(){		
						console.log('фильтрация по приоритету filterPriority()');	
	var taskList = document.querySelectorAll('.task');
	var priorityArr = [];
	var tasks = document.getElementById('tasks');

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
}


// 6 селектор по проэкту___________________________________________________________

// 6.1 изменение селектора проэкта по нажатию на селектор
$('.filterProjects').change(function(e){
	var project = $('option:selected').val();
	filterSelect(project);
});

$('.tasks').on('click', '.task__projectValue', function(){	
	//фильтрация по нажатию на название проэкта на карточке задания
	filterSelect(this.innerHTML);

	//изменение селектора после применения фильтрации
	var selectorList = document.querySelectorAll('.selector');
	for(var i = 0; i < selectorList.length; i++) {
		if (selectorList[i].innerHTML == this.innerHTML) {
			selectorList[i].selected = true;	
		}
	}	
})

function filterSelect(project){
						console.log('фильтрация по селектору: filterSelect(' + project + ');');
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
}

// 6.2 отслеживание существующих проэктов и добавление в список селект
function updateSelector(){		
						console.log('|обновление селектора updateSelector()');
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
							console.log('удален селектор ' + selectorList[i].innerHTML);
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
							console.log('\\__добавлен селектор: ' + taskList[i].querySelector('.task__projectValue').innerHTML);
			var selectorList = document.querySelectorAll('.selector'); // обновляем список селекторов
		}
	}
}


// 7 работа с LocalStorage__________________________________________________________________

// 7.1 обновление БД в localStorage;
function updateLS() {	
	localStorage.clear(); //перед записью БД очищаем старую

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
	
	return console.log('база даных обновлена');
}

// 7.2 загрузка из localStorage
loadLS();
function loadLS() {
	var cleanCurrentTasks = function(){
		var taskList = document.getElementById('tasks');
		var tasks = document.querySelectorAll('.task');
		for(var i = 0; i < tasks.length; i++) {
			taskList.removeChild(tasks[i]);
			console.log('удалена задача' + tasks[i].querySelector('.task__title').innerHTML);
		}
	}();

	var storageLength = localStorage.length;
	var newObj = [];
	var keys = [];
	
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
			pasteTask(currentTask[0], currentTask[1], currentTask[2], currentTask[3], currentTask[4]);
		}

		// Автоматическая сортировка по времени создания при загрузке страницы
		autoSort();
		return updateSelector()
	}();	
}


//8 валидация формы__________________________________________________________________
function validationForm(title, project, priority, description) {
	if (!title) document.getElementById('form__taskTitle').classList.add('form__input--error');
	if (!project) document.getElementById('form__taskProject').classList.add('form__input--error');
	if (!priority) document.getElementById('form__taskPriority').classList.add('form__input--error');
	if (!description) document.getElementById('form__description').classList.add('form__input--error');

	if(title == '' || project == '' || priority == '' || description == '') return false;
	else return true;
}

$('input, textarea').on('focus', function(e){
	this.classList.remove('form__input--error');
});