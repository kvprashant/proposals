Meteor.startup(function () {

  Meteor.methods({
    // handle create new proposal
    createProposal: function(options) {
      options = options || {};
      // required parameter checks here
      if (! (typeof options.title === "string" && options.title.length &&
          typeof options.description === "string" &&
          options.description.length &&
          typeof options.track.length && typeof options.track === "string"))
           throw new Meteor.Error(400, "Hack proposals require Title, Description and Hack Track.");
      // TODO length, userId, checks
      if (! (this.userId && options.name ))
        throw new Meteor.Error(401, "You're not logged in");
      options.joined = { count : 1, users : [ { "name" : Meteor.user().profile.name, "userId" : Meteor.user()._id } ] }
      return Proposals.insert(options);
    },
    // handle proposal join
    joinProposal: function(options) {
      options = options || {};
      if (!Meteor.user()) {
        throw new Meteor.Error(402, "You must be logged in to join a proposal");
      }
      // required parameter checks here
      if (!options.proposalId)
           throw new Meteor.Error(400, "Unable to update. Refresh the page and try again");

      // check if exists
      if (Proposals.findOne({ _id : options.proposalId, "joined.users.userId" : Meteor.user()._id }))
           throw new Meteor.Error(409, "User already joined");

      return Proposals.update( { _id : options.proposalId }, 
                  {
                    $inc : { "joined.count" : 1 }, 
                    $push: { "joined.users" : { "name" : Meteor.user().profile.name, "userId" : Meteor.user()._id } }
                  }
             );
    },
    // handle proposal unjoin
    unjoinProposal: function(options) {
      options = options || {};
      if (!Meteor.user()) {
        throw new Meteor.Error(402, "You must be logged in to join a proposal");
      }
      // required parameter checks here
      if (!options.proposalId)
           throw new Meteor.Error(400, "Unable to update. Refresh the page and try again");

      // check if exists
      if (Proposals.findOne({ _id : options.proposalId, "joined.users.userId" : Meteor.user()._id }) === undefined)
           throw new Meteor.Error(409, "User has not joined this hack yet");

      return Proposals.update( { _id : options.proposalId }, 
                  {
                    $inc : { "joined.count" : -1 }, 
                    $pull: { "joined.users" : { name : Meteor.user().profile.name } }
                  }
                 );
    }
  });  
});
