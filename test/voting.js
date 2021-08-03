var Voting = artifacts.require("./Voting.sol");

contract("Voting", function(accounts) {
  var votingInstance;

  it("initialize 5 options", function() {
    return Voting.deployed().then(function(instance) {
      return instance.optionCount();
    }).then(function(count) {
      assert.equal(count, 5);
    });
  });

  it("initializes the options with the correct values", function() {
    return Voting.deployed().then(function(instance) {
      votingInstance = instance;
      return votingInstance.options(1);
    }).then(function(option1) {
      assert.equal(option1[0], 1, "CORRECT:: id");
      assert.equal(option1[1], "Option 1", "CORRECT:: name");
      assert.equal(option1[2], 0, "CORRECT:: vote count");
      return votingInstance.options(5);
    }).then(function(option5) {
      assert.equal(option5[0], 5, "CORRECT:: id");
      assert.equal(option5[1], "Option 5", "CORRECT:: name");
      assert.equal(option5[2], 0, "CORRECT:: vote count");
    });
  });

  it("allows voters to cast votes", function() {
    return Voting.deployed().then(function(instance) {
      votingInstance = instance;
      optionId = 1;
      return votingInstance.vote(optionId, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "CORRECT:: event was triggered");
      assert.equal(receipt.logs[0].event, "voteEvent", "CORRECT:: event type");
      assert.equal(receipt.logs[0].args._optionId.toNumber(), optionId, "CORRECT:: option id");
      return votingInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "CORRECT:: voter marked as voted");
      return votingInstance.options(optionId);
    }).then(function(option) {
      var voteCount = option[2];
      assert.equal(voteCount, 1, "CORRECT:: option's vote count increses 1 ");
    })
  });

  it("throws an exception for invalid options", function() {
    return Voting.deployed().then(function(instance) {
      votingInstance = instance;
      return votingInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      return votingInstance.options(1);
    }).then(function(option1) {
      var voteCount = option1[2];
      assert.equal(voteCount, 1, "option 1 did not receive any votes");
      return votingInstance.options(5);
    }).then(function(option5) {
      var voteCount = option5[2];
      assert.equal(voteCount, 0, "option 2 did not receive any votes");
    });
  });

  it("throws an exception for double voting", function() {
    return Voting.deployed().then(function(instance) {
      votingInstance = instance;
      optionId = 2;
      votingInstance.vote(optionId, { from: accounts[1] });
      return votingInstance.options(optionId);
    }).then(function(option) {
      var voteCount = option[2];
      assert.equal(voteCount, 1, "option 2 accepts first vote");
      // try double vote
      return votingInstance.vote(optionId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      return votingInstance.options(1);
    }).then(function(option1) {
      var voteCount = option1[2];
      assert.equal(voteCount, 1, "option 1 only has 1 vote");
      return votingInstance.options(2);
    }).then(function(option2) {
      var voteCount = option2[2];
      assert.equal(voteCount, 1, "option 2 only has 1 vote");
    });
  });
});
