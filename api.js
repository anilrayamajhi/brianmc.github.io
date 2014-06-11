var requestEditor, responseEditor, codeEditorsID=[],transactionkey,loginid;
var sURL = "https://apitest.authorize.net/xml/v1/request.api";
var timer
$(document).ready(function() {
   loadAllPages();
    timer = setInterval(function(){initAPI()}, 500);
  
   
});

var tabWasxClicked = "false";
$(window).bind('hashchange', function() {
  changeHash();
});

function changeHash(){ 
    if(tabWasxClicked == "true"){
      tabWasxClicked = "false";  // dont call the tab click function twice when 
  }else{
    tabWasxClicked = "fakeclick";
    var tab = window.location.hash!=="" ? window.location.hash : "#APIRefTabID";// if index.html is the page send that.
    changeTab($(tab)); // the hash changed without a tab click
    currTab.addClass('active'); // re-highlight the current tab
  }
}

var currTab = "";
function changeTab(element){
  if(tabWasxClicked == "fakeclick"){
   tabWasxClicked = "false";
  }else{
    tabWasxClicked = "true";
  }
 
  $("#navigationbarID ul li").removeClass('active');
  $(element).parent().addClass('active');

  var myElID = element.id;
  if(myElID == undefined){
    myElID = element.attr('id');
  }
   if(myElID === 'clientLibTabID')
  {
     $("#APIRefPageID").show();
    $("#GettingStatedGuidePageID").hide();
    $("#clientLibPageID").hide();
    currTab = $(element).parent();


    $("#clientLibPageID").show();
    $("#clientLibPageID").show();
    $("#GettingStatedGuidePageID").hide();
    $("#APIRefPageID").hide();
    
    currTab = $(element).parent();

  }
  else if(myElID === 'SGuideTabID'){
     $("#APIRefPageID").show();
    $("#GettingStatedGuidePageID").hide();
    $("#clientLibPageID").hide();
    currTab = $(element).parent();

    $("#GettingStatedGuidePageID").show();
    $("#APIRefPageID").hide();
    $("#clientLibPageID").hide();
   // $('body').scrollspy({ target: '#gettingStartedGuideNav'})
   // $('body').data('target','#gettingStartedGuideNav');
   // $('body').scrollspy('refresh');
    currTab = $(element).parent();
  }
  else if(myElID==="APIRefTabID") {
    $("#APIRefPageID").show();
    $("#GettingStatedGuidePageID").hide();
    $("#clientLibPageID").hide();
    currTab = $(element).parent();
  }


  $('[data-spy="scroll"]').each(function () {
    var $spy = $(this).scrollspy('refresh')
  })
}



function initAPI(){
 clearInterval(timer);


  $(".authenticationDiv").hide();
  $("textarea.sample-request, textarea.sample-response").each(function(ind, ele){
    var id = $(ele).attr('id');
    codeEditorsID[id] =  CodeMirror.fromTextArea(document.getElementById(id), { mode: 'xml',lineNumbers: true});
  });
  // Sample API readonly code mirror
  codeEditorsID['authentication-sample-Code'] = CodeMirror.fromTextArea(document.getElementById('authentication-sample-Code'), { mode: 'xml',lineNumbers: true,readOnly:true});
  codeEditorsID['authentication-sample-Code'].setSize(null,85);

  $('a').click(function(event){ 
    if($(event.currentTarget).html()==="Try it")
    {
      var id = this.id.toString();
      id = id.substring(0,id.length-5);
       setTimeout(function() {  redrawEditors('txtReqXml-'+id); redrawEditors('txtRespXml-'+id) }, 250);
    } 
    else if($(event.currentTarget).html() == 'Sample')
    {
      setTimeout(function() {  redrawEditors('authentication-sample-Code'); }, 250);
    }
  });

 
  $('button').click(function(event){ 
    if($(event.currentTarget).attr('name')==="btnSend")
    {
      btnSend_onclick(this.id);
    } 
     if($(event.currentTarget).attr('name')==="btnReset")
    {
      btnReset_onclick(this.id);
    }

  });

    initializelightBox();
     var tab = window.location.hash!=="" ? window.location.hash : "#APIRefTabID";
      changeTab($(tab));


      $(window).scroll(function () { 
        //You've scrolled this much:
          
           if($(window).scrollTop()>100){
              $("#gettingStartedGuideNav").css('top',"50px");
           }
           else{
             $("#gettingStartedGuideNav").css('top',"80px");
           };
    });


}

function loadAllPages(){
  $("#clientLibPageID").load("clientlibTmp.html");
  $("#GettingStatedGuidePageID").load("gettingStartedGuide.html","",loadGettingStartedGuidePages);
  
}

function loadGettingStartedGuidePages(){
  $("#StartingGuide-recurring-billing").load("recurringBilling.html");
  $("#customerInfoManagerID").load("customerInformationManager.html");
  
}

function initializelightBox(){
    var fsLightbox1687734 = new FSLightbox({form: 1687734,handle: "feedbackLinkID" });
    getInternetExplorerVersion();
}

function redrawEditors(id) {
  codeEditorsID[id].refresh();
}

function XHConn()
{
  var xmlhttp, bComplete = false;
  var method = "POST";
  try { 
    xmlhttp = new XMLHttpRequest();
  }catch (e) { xmlhttp = false; }
  if (!xmlhttp) return null;

  this.connect = function( sPostData, fnDone)
  { 
    try {
      
      bComplete = false;
      xmlhttp.open(method, sURL, true);
      xmlhttp.setRequestHeader("method", "POST "+sURL+" HTTP/1.1");
      xmlhttp.setRequestHeader("content-type", "text/xml");
      xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && !bComplete)
        {
          bComplete = true;
          fnDone(xmlhttp);
        }
      };
      xmlhttp.send(sPostData);
    }
    catch(z) {
      alert(z);
      return false;
    }
    return true;
  };
  return this;
}

var g_xc;
g_xc =  new XHConn();
var genericId;

function btnSend_onclick(id) { 
  genericId = id.substring(7,id.length);
 
  if(codeEditorsID["txtReqXml"+genericId].getValue().indexOf("API_LOGIN_ID")>-1){
    $("#auth"+genericId).show('slow')  ;
    return;
  }

  $("#txtRespLoader"+genericId).show();   
  document.getElementById(id).disabled = true;
  codeEditorsID["txtRespXml"+genericId].setValue("");
  document.getElementById("spnStatusCode"+genericId).innerHTML = "";
  
  var fnWhenDone = function (oXML) {
       $("#txtRespLoader"+genericId).hide();
      if (oXML.status && oXML.status != "200") {
        document.getElementById("spnStatusCode"+genericId).innerHTML = "HTTP status code: " + oXML.status.toString().replace(/</g, "&lt;");
      }
       if(oXML.responseText.indexOf("Error")>-1){
          var errorTxt = oXML.responseText.split("text>");
          $("#spnStatusCode"+genericId).text(errorTxt[1].substring(0,errorTxt[1].length-2));
          $("#spnStatusCode"+genericId).show(200);
        }
        else{
          $("#spnStatusCode"+genericId).text('');
        }
      var txt = oXML.responseText;
      txt = txt.replace(/></g, "> <");
      codeEditorsID["txtRespXml"+genericId].setValue(txt);
      reFormatCodeMirror("txtRespXml"+genericId);
      document.getElementById("btnSend"+genericId).disabled = false;
  };
  g_xc.connect(codeEditorsID["txtReqXml"+genericId].getValue() , fnWhenDone);
}

function btnReset_onclick(id){
   genericId = id.substring(8,id.length);
   codeEditorsID["txtReqXml"+genericId].setValue($("#txtReqXml"+genericId).val().replace("API_LOGIN_ID",loginid).replace("API_TRANSACTION_KEY",transactionkey));
   codeEditorsID["txtReqXml"+genericId].refresh();
   codeEditorsID["txtRespXml"+genericId].setValue($("#txtRespXml"+genericId).val());
   codeEditorsID["txtRespXml"+genericId].refresh();
   $("#spnStatusCode"+genericId).hide('easeIn', function(){
     $("#spnStatusCode"+genericId).text('');
   })
}

function reFormatCodeMirror(id){
    var totalLines = codeEditorsID[id].lineCount();
    var totalChars = codeEditorsID[id].getTextArea().value.length;
    codeEditorsID[id].autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});
    CodeMirror.commands['goPageUp'](codeEditorsID[id]);
    $("#"+id).trigger({type: 'keypress', which: 13});
}

function btnPopulateKeys_onclick(object) {
   var id = object.id.split("populateKeyForm-")[1];
   loginid = document.getElementById("txtLoginID-"+id).value;                                 
   transactionkey = document.getElementById("txtTransactionKey-"+id).value;
   if(loginid==="" || transactionkey==="" ){
    $("#"+object.id+" div").addClass("has-error");
    $("form .required").show();
    return false;
   }   
   var allSamples = document.getElementsByClassName("sample-request");
   for (var i = 0; i < allSamples.length; i++) {
      var sampleRequest = codeEditorsID[allSamples[i].id];
      sampleRequest.setValue(sampleRequest.getValue().replace("API_LOGIN_ID",loginid).replace("API_TRANSACTION_KEY",transactionkey));
      sampleRequest.refresh();
    }
   $(object).find(".btn-primary").attr("disabled","disabled").addClass("btn-success").removeClass("btn-primary").text("Done!!");
   $(".authenticationDiv").hide("slow");
   $("form .required").hide();
   $("#"+object.id+" div").removeClass("has-error");
   $("#txtLoginID-"+id).val('');
   $("#txtTransactionKey-"+id).val('');
   return false;
}

function selUrls_onChange(obj) {
  if (document.getElementById("selUrls").value) {
    document.getElementById("txtUrl").value = document.getElementById("selUrls").value;
  }
}

// If  Browser is below IE9
// it shows a notice 
function getInternetExplorerVersion()
{
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null){
      rv = parseFloat( RegExp.$1 );
    }
    if(rv<=9){
      $('[id^="btnSend"],[id^="btnReset"]').prop('disabled', true);
      $('form .ie9msg').show();
    }
    else{
      $('form .ie9msg').hide();
    }
  }
  else{
     $('form .ie9msg').hide();
  }
}