
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      App.web3Provider = new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/152ce57163154c3eb74ae1fcc2c07c78`);
      web3 = new Web3(App.web3Provider);
    }
    return App.initVoting();
  },

  initVoting: function() {
    $.getJSON("Voting.json", function(voting) {
      App.contracts.Voting = TruffleContract(voting);
      App.contracts.Voting.setProvider(App.web3Provider);

      App.eventListener();

      return App.render();
    });
  },


  eventListener: function() {
    App.contracts.Voting.deployed().then(function(instance) {
      instance.voteEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // App.render();
      });
    });
  },

  render: function() {
    var votingInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html(account);
      }
    });

    // Load smart contract data
    App.contracts.Voting.deployed().then(function(instance) {
      votingInstance = instance;
      return votingInstance.optionCount();
    }).then(function(optionCount) {
      var optionResults = $("#optionResults");
      optionResults.empty();

      var optionSelect = $('#optionSelect');
      optionSelect.empty();
      console.log(optionCount)
      for (var i = 1; i <= optionCount; i++) {
        votingInstance.options(i).then(function(option) {
          var name = option[1];
          var id = option[0];
          var voteCount = option[2];

          // Render option Result
          var optionTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          optionResults.append(optionTemplate);

          // Render option ballot option
          var optionOption = "<option value='" + id + "' >" + name + "</ option>"
          optionSelect.append(optionOption);
        });
      }
      return votingInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote if he has voted
      if(hasVoted) {
        $('form').hide();
      }
      return votingInstance.votedFor(App.account);
    }).then(function(votedOption) {
      // Show voted for which option
      if(votedOption) {
        if(votedOption == 0){
          $("#votedForOption").html("");
        }else{
          $("#votedForOption").html("You Voted for: Option " + votedOption);
          $('#thankyoutext').html("Thank you for Voting!");
        }
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var optionId = $('#optionSelect').val();
    App.contracts.Voting.deployed().then(function(instance) {
      return instance.vote(optionId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

const ethereumButton = document.querySelector('.enableEthereumButton');
ethereumButton.addEventListener('click', () => {
 //Will Start the metamask extension
 ethereum.request({ method: 'eth_requestAccounts' });
});


$(function() {
  $(window).load(function() {
    App.init();
  });
});
