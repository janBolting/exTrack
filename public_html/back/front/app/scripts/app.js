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
    // console.log(self.user.events());

    // Iterate over events, extract exercise types, create array of computed 
    // observables for each exercise type to be able to display them separately.
    var events = self.user.events();
    var types = [];
    events.forEach(function (s) {
        var alreadythere = $.inArray(s.type(), types) > -1;
        if (!alreadythere) {
            types.push(s.type());
        }
    });

    self.user.structuredEvents = ko.computed(function () {
        // Build array of objects, one object per exercise type. The object 
        // holds the type and the corresponding events.
        a = [];
        types.forEach(function (item, i) {
            var type = types[i];
            var o = {
            'type': type,
            'events': []
                    };
            // Extract events that have this exercise type:
            o.events = ko.utils.arrayFilter(self.user.events(), function (item, i) {
                return stringStartsWith(item.type().toLowerCase(), type);
            });
            a.push(o);
        })
        // dbg(a);
        return a;
    }, self);

    /*
     self.user.structuredEvents = ko.computed(function() {
     return self.user.events();
     }, self);
     */
    // console.log(self);
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

function dbg(what){
    console.log(what);
}

function upload(){
    var unmapped = ko.mapping.toJSON(viewmodel.userpage);
    console.log(unmapped);
     $.ajax("/userdata/"+user, {
            data: unmapped,
            type: "post", contentType: "application/json",
            success: function(result) { alert(result) }
        });
}