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
      var btnClass = "btn-mini";
      if (Session.get('proposal_id'))
        var btnClass = "btn-large";

      if (proposal) { // has joined one hack or is owner
        if (proposal.userId != Meteor.user()._id) { // if not owner
          // show Joined button
          return new Handlebars.SafeString('<td><button type="button" \
                  class="btn ' + btnClass + ' btn-success join_no">Joined</button></td>');
        } else {
          return new Handlebars.SafeString('<td><button type="button" \
                  class="btn ' + btnClass + ' btn-disable">Proposed</button></td>');
        }
      } else { // not joined any hacks. show all Join button
        return new Handlebars.SafeString('<td><button type="button" \
                class="btn ' + btnClass + ' btn-warning join_yes">Join</button></td>');
      }
    });

    Handlebars.registerHelper('list', function(hackers, owner, handle) {
      var names = _.pluck(hackers, 'name');
      var handles = _.pluck(hackers, 'handle');
      var joined = _.object(names, handles);
      if (_.size(joined)) {
        joined = _.map(joined, function(handle, name){
                         return '<a href="http://twitter.com/' + handle + '">' + name + '</a>';
        }).join(", ");
        return new Handlebars.SafeString(joined);
      }
      return "Be the first to join!";
    });
