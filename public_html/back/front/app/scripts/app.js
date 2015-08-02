var isauthenticated = true;

// This function injects the appropriate html pages into the user container:
$(document).ready(function onloadfcn() {
    if (userisauthenticated()) {
        $("#container").load("user.html");
    }
    else{
        $("#container").load("signin.html");
    }
    ko.applyBindings(new TaskListViewModel());
});

function userisauthenticated(number) {
    return isauthenticated;
}

// View model for user list:
function TaskListViewModel() {
    // Data
    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() && !task._destroy });
    });

    // Operations
    self.addTask = function() {
        self.tasks.push(new Task({ title: this.newTaskText() }));
        self.newTaskText("");
    };
    self.removeTask = function(task) { self.tasks.destroy(task) };
    self.save = function() {
        $.ajax("/tasks", {
            data: ko.toJSON({ tasks: self.tasks }),
            type: "post", contentType: "application/json",
            success: function(result) { alert(result) }
        });
    };

    // Load initial state from server, convert it to Task instances, then populate self.tasks
    $.getJSON("/alluserdata", function(allData) {
        var mappedTasks = $.map(allData, function(item) { return new Task(item) });
        self.tasks(mappedTasks);
    });    
}