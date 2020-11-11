/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/


function openUserCollection(){
  socket.emit('requestCollectedHomebrewBundles');
}

socket.on("returnCollectedHomebrewBundles", function(hBundles){
  $('#tabContent').html('');
  $('#tabContent').addClass('is-hidden');
  $('#tabContent').load("/templates/homebrew/display-user-collection.html");
  $.ajax({ type: "GET",
    url: "/templates/homebrew/display-user-collection.html",
    success : function(text)
    {

      let foundBundle = false;
      for (const hBundle of hBundles) {
        if(!foundBundle){
          foundBundle = true;
        } else {
          $('#bundlesContainer').append('<hr class="mx-5 my-1">');
        }

        let homebrewBundle = hBundle.homebrewBundle;

        let bundleViewID = 'bundle-'+homebrewBundle.id+'-view';
        let bundleRemoveID = 'bundle-'+homebrewBundle.id+'-remove';

        $('#bundlesContainer').append('<div class="columns is-marginless"><div class="column is-6 text-center"><span class="is-size-5">'+homebrewBundle.name+'</span></div><div class="column is-6"><div class="buttons are-small is-centered"><button id="'+bundleViewID+'" class="button is-outlined is-success">View</button><button id="'+bundleRemoveID+'" class="button is-outlined is-danger">Remove</button></div></div></div>');

        $('#'+bundleViewID).click(function() {
          openBundleView(homebrewBundle);
        });

        $('#'+bundleRemoveID).click(function() {
          socket.on("returnBundleChangeCollection", function(){
            socket.off('returnBundleChangeCollection');
            openUserCollection();
          });
          socket.emit('requestBundleChangeCollection', homebrewBundle.id, false);
        });

      }

      if(!foundBundle){
        $('#bundlesContainer').html('<p class="has-text-centered is-italic is-size-7">Your collection is empty. Go browse and find some homebrew to use with your characters!</p>');
      }

      $('#tabContent').removeClass('is-hidden');
    }
  });
});

