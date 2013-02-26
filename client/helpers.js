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
      var hasJoined = Proposals.findOne({ "_id" : proposalId, "joined.users.userId" : Meteor.user()._id });
      if (!hasJoined) {
        return new Handlebars.SafeString('<td><button type="button" \
                class="btn btn-mini btn-warning join_yes">Join</button></td>');
      } else {
        return new Handlebars.SafeString('<td><button type="button" \
                class="btn btn-mini btn-success join_no">Joined</button></td>');
      }
    });
