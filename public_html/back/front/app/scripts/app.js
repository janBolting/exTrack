var isauthenticated = true;
var user = "bob";

function userisauthenticated(number) {
    return isauthenticated;
}

function ViewModel() {
    var self = this;
    // Data model:
    self.mainpagelayout = new MainPageViewModel();
    self.userpage = new UserPageViewModel();
    console.log(self.userpage.user);
}

function UserPageViewModel() {
    var self = this;
    // Data model:
    // self.events = ko.observableArray([]);
    // self.name = ko.observable("Jim-Bob");
    // Load user data from server and populate the view model:
    $.getJSON("/userdata/"+user, function (receivedData) {
        self.user = ko.mapping.fromJS(receivedData);
         console.log(self.user.name());
    });
}

// View model for page layout:
function MainPageViewModel() {
    var self = this;
    // Data model:
    self.signinPageVisible = ko.observable(false);
    self.userPageVisible = ko.observable(true);    
}

ko.applyBindings(new ViewModel()); 
