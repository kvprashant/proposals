Meteor.startup(function () {

  Meteor.methods({
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

      return Proposals.insert(options);

    }
  });  
});
