var isauthenticated = true;
var user = "bob";
var UserPageViewModel_json;
var viewmodel;

$.getJSON("/userdata/" + user, function (receivedData) {
    UserPageViewModel_json = receivedData;
    viewmodel = new ViewModel();
    ko.applyBindings(viewmodel);
});

function userisauthenticated(number) {
    return isauthenticated;
}

function ViewModel() {
    var self = this;
    // Data model:
    self.mainpagelayout = new MainPageViewModel();
    self.userpage = new UserPageViewModel();
}

function UserPageViewModel() {
    var self = this;
    // Create and populate the view model:
    self.user = ko.mapping.fromJS(UserPageViewModel_json);

    // Get array of available exercise types as strings:
    self.user.exerciseTypes_names = ko.computed(function () {
        var dataArray = new Array;
        self.user.exerciseTypes().forEach(function (item) {
            dataArray.push(item.name());
        }

        )
        return dataArray;
    }, self);


    // console.log(self.user.events());
    self.user.chosenExerciseType = ko.observableArray([self.user.exerciseTypes_names()[0]]);

    // Find all exercise quantities:
    var quantities = [];
    self.user.quantities = ko.computed(function () {
        var events = self.user.events();
        events.forEach(function (s) {
            var alreadythere = $.inArray(s.quantity(), quantities) > -1;
            if (!alreadythere) {
                quantities.push(s.quantity());
            }
        });
        return quantities.sort(sortNumber);
    }, self);
    self.user.chosenQuantity = ko.observableArray([quantities[0]]);

    self.user.structuredEvents = ko.computed(function () {
        // Build array of objects, one object per exercise type. Each object 
        // holds the type and the corresponding events.
        a = [];
        // Iterate over available exercise types:
        // dbg(self.user.exerciseTypes()[0].name());
        self.user.exerciseTypes().forEach(function (item, i) {
            var exname = self.user.exerciseTypes()[i].name();
            var o = {
                'type': exname,
                'events': []
            };
            // Extract events that have this exercise type:
            o.events = ko.utils.arrayFilter(self.user.events(), function (item, i) {
                return stringCompare(item.type(), exname);
            });
            a.push(o);
        })
        // dbg(a);
        return a;
    }, self);
    
    self.user.lastTotalExercises = ko.computed(function () {
        // For each exercise type, find most recent date
        a = [];
        // Iterate over available exercise types:
        // dbg(self.user.exerciseTypes()[0].name());
        self.user.exerciseTypes().forEach(function (item, i) {
            var exname = self.user.exerciseTypes()[i].name();
            var o = {
                'type': exname,
                'events': []
            };
            // Extract events that have this exercise type:
            o.events = ko.utils.arrayFilter(self.user.events(), function (item, i) {
                return stringCompare(item.type(), exname);
            });
            a.push(o);
        })
        // dbg(a);
        return a;
    }, self);

    self.addExercise = function () {
        dbg(self.user.chosenExerciseType()[0]);
        var event = {
            'time': ko.observable(Date()),
            'type': ko.observable(self.user.chosenExerciseType()[0]),
            'quantity': ko.observable(Number(self.user.chosenQuantity()))
        }
        self.user.events.push(event);
    }

    self.removeExercise = function (ex) {
        self.user.events.remove(ex);
        dbg(ex);
    }


// Code related to creating new exercise definitions:
    self.newExerciseName = ko.observable("New amazing exercise");
    self.addExerciseDefinition = function () {
        // Check if there already is the exact same exercise:
        if (!arrayContains(self.user.exerciseTypes_names(), self.newExerciseName())) {
            // Create new exercise type object:
            var ety = {
                'name': ko.observable(self.newExerciseName())
            }
            // Add new exercise to the list of exercises:
            dbg(self.user.exerciseTypes());
            self.user.exerciseTypes.push(ety)
            dbg(self.user.exerciseTypes());
        } else {
            self.errorMessage("Exercise " + self.newExerciseName() + " already exists.");
        }
    }

    self.errorMessage = ko.observable("");

}

// View model for page layout:
function MainPageViewModel() {
    var self = this;
    // Data model:
    self.signinPageVisible = ko.observable(false);
    self.userPageVisible = ko.observable(true);
}

function stringCompare(s1, s2) {
    if (s1.localeCompare(s2) === 0) {
        return true;
    }
    return false;
}

function dbg(what) {
    console.log(what);
}

function upload() {
    var unmapped = ko.mapping.toJSON(viewmodel.userpage.user);
    //console.log(unmapped);
    $.ajax("/userdata/" + user, {
        data: unmapped,
        type: "post", contentType: "application/json",
        success: function (result) {
            // alert(result);
        }
    });
}

function sortNumber(a, b) {
    return a - b;
}

function arrayContains(array, object) {
    return $.inArray(object, array) > -1;
}