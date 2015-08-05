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
    self.user.exerciseTypes().forEach(function(item){
        dataArray.push(item.name());
    }
            
                )
return dataArray;
    }, self);
 

    // console.log(self.user.events());
    self.user.chosenExerciseType = ko.observableArray([self.user.exerciseTypes()[0]]);

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
                return stringStartsWith(item.type().toLowerCase(), exname);
            });
            a.push(o);
        })
        // dbg(a);
        return a;
    }, self);

    self.addExercise = function () {
        var event = {
            'time': ko.observable(Date()),
            'type': ko.observable(self.user.chosenExerciseType()[0]),
            'quantity': ko.observable(self.user.chosenQuantity()[0])
        }
        dbg(self.user.events());
        self.user.events.push(event);
    }

// Code related to creating new exercise definitions:
    self.newExerciseName = ko.observable("New amazing exercise");
    self.addExerciseDefinition = function () {
        // Here is how new exercises are handled for now: For each new exercise
        // an empty event is created, i.e. an event with quantity zero. Events 
        // with zero quantity are not displayed in the exercise list
    }

}

// View model for page layout:
function MainPageViewModel() {
    var self = this;
    // Data model:
    self.signinPageVisible = ko.observable(false);
    self.userPageVisible = ko.observable(true);
}

function stringStartsWith(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
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