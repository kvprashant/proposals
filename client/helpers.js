    Handlebars.registerHelper('isSession', function(page, options) {
      if (Session.get(PAGE_ID) == page) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper('isOwner', function(currentUser, proposalOwner, options) {
      return currentUser == proposalOwner;
    });

    Handlebars.registerHelper('proposalStatusButton', function (isOpen) {
      var button = isOpen ? "success" : "danger";
      return button;
    });

    Handlebars.registerHelper('proposalStatus', function (isOpen) {
      var status = isOpen ? "OPEN" : "CLOSED";
      return status;
    });

    Handlebars.registerHelper('join_button', function(proposalId) {
      // first check if user has joined any proposal
      var hasJoined = Proposals.findOne({ "joined.users.userId" : Meteor.user()._id });
      if (hasJoined) { // has joined one hack
        if (hasJoined._id == proposalId) { // check if same proposal
          // show Joined button
          return new Handlebars.SafeString('<td><button type="button" \
                  class="btn btn-mini btn-success join_no">Joined</button></td>');
        }
      } else { // not joined any hacks. show all Join button
        return new Handlebars.SafeString('<td><button type="button" \
                class="btn btn-mini btn-warning join_yes">Join</button></td>');
      }
    });
