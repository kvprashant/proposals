Meteor.startup(function () {

  function getHandle(_id) {
    return Meteor.users.findOne({"_id" : Meteor.user()._id}).services.twitter.screenName;
  }

  Meteor.methods({
    // get handle
    getHandle: function(_id) {
      return getHandle(_id);
    },
    // get profile name
    getName: function(_id) {
      return Meteor.users.findOne({"_id" : Meteor.user()._id}).profile.name;
    },
    // handle create new proposal
    createProposal: function(options) {
      options = options || {};
      // required parameter checks here
      if (! (typeof options.title === "string" && options.title.length &&
          typeof options.description === "string" &&
          options.description.length &&
          typeof options.track.length && typeof options.track === "string"))
           throw new Meteor.Error(400, "Hack proposals require Title, Description and Hack Track.");

      if ( options.title.length > 50 || options.description.length > 200 ) {
        throw new Meteor.Error(413, "Title/Summary is not within the limit");
      }
      
      // TODO length, userId, checks
      if (! (this.userId && options.name ))
        throw new Meteor.Error(401, "You're not logged in");

      options.handle = getHandle(Meteor.user()._id);
      options.joined = { count : 1, users : [ {
                                                "name" : Meteor.user().profile.name, 
                                                "userId" : Meteor.user()._id, 
                                                "handle" : getHandle(Meteor.user()._id)
                                              }
                                            ] 
                        }
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
                    $push: { "joined.users" : { "name" : Meteor.user().profile.name, 
                                                "userId" : Meteor.user()._id,
                                                "handle" : getHandle(Meteor.user()._id)
                                              } 
                            }
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

      if (!options.owner)
           throw new Meteor.Error(401, "Cannot perform operation without relevant data");

      if (options.owner == Meteor.user()._id)
           throw new Meteor.Error(403, "Owner cannot unjoin own proposal");

      // check if exists
      if (Proposals.findOne({ _id : options.proposalId, "joined.users.userId" : Meteor.user()._id }) === undefined)
           throw new Meteor.Error(409, "User has not joined this hack yet");

      return Proposals.update( { _id : options.proposalId }, 
                  {
                    $inc : { "joined.count" : -1 }, 
                    $pull: { "joined.users" : { name : Meteor.user().profile.name } }
                  }
                 );
    },
    createComment: function(options) {
      options = options || {};

      // required parameter checks here
      if (!Meteor.user()) {
        throw new Meteor.Error(402, "You must be logged in to comment");
      }

      if (!options.proposalId)
           throw new Meteor.Error(400, "Unable to update. Refresh the page and try again");

      if (!options.commentId)
           throw new Meteor.Error(400, "Comment ID is not generated");

      options.user = Meteor.userId();
      options.name = Meteor.user().profile.name;
      options.handle = getHandle(Meteor.userId());

      return Proposals.update( { _id : options.proposalId }, 
                               { $push: { "comments" : _.omit(options, 'proposalId') } }
             );
    },
    deleteComment: function(options) {
      if (!options.proposalId)
           throw new Meteor.Error(400, "Proposal ID is not generated");

      if (!options.commentId)
           throw new Meteor.Error(400, "Comment ID is not generated");
       
      if (!options.user)
           throw new Meteor.Error(412, "Owner ID required");

      if (options.user != Meteor.userId())
           throw new Meteor.Error(401, "Unauthorized user trying to delete comment");

      return Proposals.update({_id: options.proposalId}, { $pull: { comments: { commentId: options.commentId }}});
    }
  });  
});
