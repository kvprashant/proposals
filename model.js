Proposals = new Meteor.Collection("proposals");

Proposals.allow({
  insert: function(userId, proposal) {
    return false; // no cowboy inserts -- use createProposal method
  },
  update: function(userId, proposals, fields, modifier) {
    return _.all(proposals, function (proposal) {
      if (!userId) // update not allowed if not logged in
        return false; 

      if (userId != proposal.userId) {
        var allowed = ["joined"]
        if (_.difference(fields, allowed).length)
          return false; // tried to write to forbidden field
      }

      return true;
    });
  },
  remove: function(userId, parties) {
    return false; // update not allowed at this point of time
  }
});
