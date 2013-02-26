    Handlebars.registerHelper('isSession', function(page, options) {
      if (Session.get(PAGE_ID) == page) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper('isOwner', function(currentUser, proposalOwner, options) {
      return currentUser == proposalOwner;
    });

    Handlebars.registerHelper('proposalStatus', function (isOpen) {
      Session.set("status", isOpen);
      if (!isOpen) {
        return new Handlebars.SafeString('Proposals status: <span class="btn btn-danger">CLOSED</span>');
      } else {
        return new Handlebars.SafeString('<a href="/proposal/new"' 
                                       + 'class="btn btn-large btn-inverse">' 
                                       + '<span>+ Propose Hack</span></a>');
      }
    });

    Handlebars.registerHelper('join_button', function(proposalId) {
      // Disable button if logged in user is current proposal owner
      // if user has already joined the current proposal, show Joined button
      // if user has not yet joined the current proposal, show Join button

      // check if logged in user has joined current proposal
      var proposal = Proposals.findOne({ _id: proposalId, "joined.users.userId" : Meteor.user()._id });
      if (proposal) { // has joined one hack or is owner
        if (proposal.userId != Meteor.user()._id) { // if not owner
          // show Joined button
          return new Handlebars.SafeString('<td><button type="button" \
                  class="btn btn-mini btn-success join_no">Joined</button></td>');
        } else {
          return new Handlebars.SafeString('<td><button type="button" \
                  class="btn btn-mini btn-disable">Joined</button></td>');
        }
      } else { // not joined any hacks. show all Join button
        return new Handlebars.SafeString('<td><button type="button" \
                class="btn btn-mini btn-warning join_yes">Join</button></td>');
      }
    });

    Handlebars.registerHelper('list', function(hackers, owner) {
      var names = _.pluck(hackers, 'name');
      var joined = _.without(names, owner).join(", ");
      return joined || "None";
    });
