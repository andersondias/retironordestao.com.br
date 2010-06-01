$(function() {
  var current_url = location.href;
  if(current_url.match(/attendants\/new/)){
    $("a#observacao_link").fancybox({
      'hideOnContentClick': true,
      'autoDimensions': false,
      'height':200,
      'onClosed': function(){
        $("#observacoes_popup").hide();
      }
    });
    $("#observacao_link").trigger('click');
    $("#observacoes_popup").show();
  }
});
