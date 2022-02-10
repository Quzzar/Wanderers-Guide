/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openPageChoose(){

  $('#section-generated-inventory').addClass('is-hidden');

  $('#section-shop-customize').addClass('is-hidden');
  $('#section-shop-generate').addClass('is-hidden');
  $('#section-shop-choose').removeClass('is-hidden');


  // Shop Presets
  $('#shop-type').html('<option value="chooseDefault">Choose a Shop</option>');
  for(const [presetID, shopPreset] of g_shopPresets){
    $('#shop-type').append(`<option value="${presetID}">${shopPreset.name}</option>`);
  }

  $('#shop-type').off();
  $('#shop-type').change(function(){
    let presetID = $(this).val();
    if(presetID != 'chooseDefault'){
      
      setShop(presetID);

      openPageGenerate();
    }
  });

  shopInitImport();

}

function openPageGenerate(){

  $('#section-generated-inventory').addClass('is-hidden');

  $('#section-shop-choose').addClass('is-hidden');
  $('#section-shop-customize').addClass('is-hidden');
  $('#section-shop-generate').removeClass('is-hidden');

  $('#shop-name').text(g_shop.name);

  $('#exit-shop-btn').off();
  $('#exit-shop-btn').click(function(){
    
    if(isShopEdited()){
      new ConfirmMessage('Lose Shop Changes', '<p class="has-text-centered">Exiting this shop will undo any changes you\'ve made to it. To save your changes, you can export this shop.</p><p class="has-text-centered">Are you sure you want to continue?</p>', 'Exit Shop', 'modal-exit-shop', 'modal-exit-shop-btn');
      $('#modal-exit-shop-btn').click(function() {
        deleteShop();
        openPageChoose();
      });
    } else {
      deleteShop();
      openPageChoose();
    }

  });

  $('#customize-shop-btn').off();
  $('#customize-shop-btn').click(function(){
    openPageCustomize();
  });

  $('#export-shop-btn').off();
  $('#export-shop-btn').click(function() {
    shopExport();
  });


  // Books
  $('#input-books').html('');
  for(const bookCodeName of g_all_books){
    $('#input-books').append(`<option value="${bookCodeName}">${g_all_names_books[g_all_books.indexOf(bookCodeName)]}</option>`);
  }
  for(const bookCodeName of g_enabled_books){
    $('#input-books').find(`option[value=${bookCodeName}]`).attr('selected','selected');
  }

  $('#input-books').off();
  $('#input-books').chosen();
  $('#input-books').chosen().change(function(){
    g_enabled_books = $(this).find('option:selected').toArray().map(option => option.value);
  });

  // Homebrew Bundles
  $('#input-homebrew').html('');
  for(const homebrewID of g_all_homebrew){
    $('#input-homebrew').append(`<option value="${homebrewID}">${g_all_names_homebrew[g_all_homebrew.indexOf(homebrewID)]}</option>`);
  }
  for(const homebrewID of g_enabled_homebrew){
    $('#input-homebrew').find(`option[value=${homebrewID}]`).attr('selected','selected');
  }

  $('#input-homebrew').off();
  $('#input-homebrew').chosen();
  $('#input-homebrew').chosen().change(function(){
    g_enabled_homebrew = $(this).find('option:selected').toArray().map(option => option.value);
  });


  $('.chosen-container .chosen-choices').addClass('use-custom-scrollbar');


  $('#inventory-size').off();
  $('#inventory-size').ionRangeSlider();
  $('#inventory-size').change(function() {
    g_inv_size = parseInt($(this).val());
  });

  $('#price-markup').off();
  $('#price-markup').ionRangeSlider();
  $('#price-markup').change(function() {
    g_price_markup = parseInt($(this).val());
  });

  $('#generate-shop-btn').off();
  $('#generate-shop-btn').click(function() {
    generateItems();
  });

}

function openPageCustomize(){

  startSpinnerSubLoader();

  setTimeout(() => {

    $('#section-generated-inventory').addClass('is-hidden');

    $('#section-shop-choose').addClass('is-hidden');
    $('#section-shop-generate').addClass('is-hidden');
    $('#section-shop-customize').removeClass('is-hidden');

    loadItemProfiles();

    $('#customize-back-btn').off();
    $('#customize-back-btn').click(function(){
      openPageGenerate();
    });

    $('#customize-shop-name').val(g_shop.name);
    $('#customize-shop-name').off();
    $('#customize-shop-name').change(function(){
      g_shop.name = $(this).val();
    });

    stopSpinnerSubLoader();

  }, 50);// After 0.05 second

}