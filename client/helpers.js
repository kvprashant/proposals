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

    Handlebars.registerHelper('hasJoined', function(userId) {
      var hasJoined = Proposals.findOne({ "_id" : this._id, "joined.users.userId" : userId });
      if (hasJoined) {
        return '<td><button id="joinProposal" type="button" \
                class="btn btn-mini btn-success">Join</button></td>';
      } else {
        return '<td><button id="unjoinProposal" type="button" \
                class="btn btn-mini btn-warning">Joined</button></td>';
      }
    });
