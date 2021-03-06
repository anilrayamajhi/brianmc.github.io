var requestEditor, responseEditor, codeEditorsID=[],transactionkey,loginid;

var sURL = "https://apitest.authorize.net/xml/v1/request.api";

var timer

$(document).ready(function() {
   if($("#navigationbarID li.active a").attr("id")==="SGuideTabID")loadGettingStartedGuidePages();
   else initAPI()
  initializelightBox();

  // to check if API login id and Transaction key exist in cookie
  var cookieId = getCredCookie('loginId'),
      cookieKey = getCredCookie('transactionKey');

  if(cookieId && cookieKey) {
    applyCredential('main', cookieId, cookieKey);

    $('#populateKeyForm-main').find('.btn-primary').text('Repopulate Sample Requests')
  }


});

function initAPI(){



  $(".authenticationDiv").hide();
  $("textarea.sample-request, textarea.sample-response").each(function(ind, ele){
    var id = $(ele).attr('id');
    codeEditorsID[id] =  CodeMirror.fromTextArea(document.getElementById(id), { mode: 'xml',lineNumbers: true});
  });
  // Sample API readonly code mirror
  codeEditorsID['authentication-sample-Code'] = CodeMirror.fromTextArea(document.getElementById('authentication-sample-Code-Xml'), { mode: 'xml',lineNumbers: true,readOnly:true});
  codeEditorsID['authentication-sample-Code'].setSize(null,85);

  $('a').click(function(event){ 
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh')
    })
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



}



function loadGettingStartedGuidePages(){
  //$("#StartingGuide-recurring-billing").load("recurringBilling.html");
  //$("#customerInfoManagerID").load("customerInformationManager.html");
  
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

  this.connect = function( sPostData, fnDone, isJSON)
  { 
    try {
      
      bComplete = false;
      xmlhttp.open(method, sURL, true);
      xmlhttp.setRequestHeader("method", "POST "+sURL+" HTTP/1.1");
      
      if(isJSON){
        xmlhttp.setRequestHeader("content-type", "application/json");
        //xmlhttp.setRequestHeader("content-type", "text/xml");
        
      }else{
        xmlhttp.setRequestHeader("content-type", "text/xml");
      }
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
      //oXML is the whole xmlhttp object 
       $("#txtRespLoader"+genericId).hide();
      if (oXML.status && oXML.status != "200") {
        document.getElementById("spnStatusCode"+genericId).innerHTML = "HTTP status code: " + oXML.status.toString().replace(/</g, "&lt;");
      }
       if(oXML.responseText.indexOf("Error")>-1){
          if(!$("#txtReqXml"+genericId).data("isJSON")){
            var errorTxt = oXML.responseText.split("text>");
            $("#spnStatusCode"+genericId).text(errorTxt[1].substring(0,errorTxt[1].length-2));
            $("#spnStatusCode"+genericId).show(200);
          }
        }
        else{
          $("#spnStatusCode"+genericId).text('');
        }
      var txt = oXML.responseText;
      txt = txt.replace(/></g, "> <").replace(/&amp;/, "&");
	 
     if($("#txtReqXml"+genericId).data("isJSON")){
	       respObj = JSON.parse(txt);
		   txt = JSON.stringify(respObj, null, 4);
		   codeEditorsID["txtRespXml"+genericId].setValue(txt);
		   codeEditorsID["txtRespXml"+genericId].setOption("mode", "javascript");
		   codeEditorsID["txtRespXml"+genericId].setOption("json", "true");
           codeEditorsID["txtRespXml"+genericId].refresh();
	  }
	  else{
		codeEditorsID["txtRespXml"+genericId].setValue(txt);
		reFormatCodeMirror("txtRespXml"+genericId);
	  }

      document.getElementById("btnSend"+genericId).disabled = false;
  };

  var theRealValueToSend = stripCodeMirrorIndenting(codeEditorsID["txtReqXml"+genericId].getValue());
  g_xc.connect(theRealValueToSend , fnWhenDone, $("#txtReqXml"+genericId).data("isJSON"));
}

function btnReset_onclick(id){
  genericId = id.substring(8,id.length);
    if($("#txtReqXml"+genericId).data("isJSON")){
      if(loginid && transactionkey) {
        codeEditorsID["txtReqXml"+genericId].setValue($("#txtReqJsn"+genericId).val().replace("API_LOGIN_ID",loginid).replace("API_TRANSACTION_KEY",transactionkey));
        codeEditorsID["txtReqXml"+genericId].refresh();
      }
      codeEditorsID["txtRespXml"+genericId].setValue($("#txtRespJsn"+genericId).val());
      codeEditorsID["txtRespXml"+genericId].refresh();
    }
    else{
      if(loginid && transactionkey) {
        codeEditorsID["txtReqXml"+genericId].setValue($("#txtReqXml"+genericId).val().replace("API_LOGIN_ID",loginid).replace("API_TRANSACTION_KEY",transactionkey));
        codeEditorsID["txtReqXml"+genericId].refresh();
      }
      codeEditorsID["txtRespXml"+genericId].setValue($("#txtRespXml"+genericId).val());
      codeEditorsID["txtRespXml"+genericId].refresh();
    }
    $("#spnStatusCode"+genericId).hide('easeIn', function(){
    $("#spnStatusCode"+genericId).text('');
  })
}

function reFormatCodeMirror(id){
    var totalLines = codeEditorsID[id].lineCount();
    var totalChars = codeEditorsID[id].getTextArea().value.length;
    codeEditorsID[id].autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});

    CodeMirror.commands['goPageUp'](codeEditorsID[id]);
CodeMirror.commands['indentAuto'](codeEditorsID[id]);



    $("#"+id).trigger({type: 'keypress', which: 13});
}

function btnPopulateKeys_onclick(object) {

   var id = object.id.split("populateKeyForm-")[1];
   loginid = document.getElementById("txtLoginID-"+id).value;
   transactionkey = document.getElementById("txtTransactionKey-"+id).value;

   // store loginid and transactionkey into cookie
   setCredCookie('loginId', loginid);
   setCredCookie('transactionKey', transactionkey);  

   if(loginid==="" || transactionkey==="" ){
    $("#"+object.id+" div").addClass("has-error");
    $("form .required").show();
    return false;
   } 

   applyCredential(id, loginid, transactionkey);
	
   $(object).find(".btn-primary").attr("disabled","disabled").addClass("btn-success").removeClass("btn-primary").text("Done!!");
   $(".authenticationDiv").hide("slow");
   $("form .required").hide();
   $("#"+object.id+" div").removeClass("has-error");
   $("#txtLoginID-"+id).val('');
   $("#txtTransactionKey-"+id).val('');
   return false;
}

function applyCredential(id, loginid, transactionkey) {
  var allSamples = document.getElementsByClassName("sample-request");

  for (var i = 0; i < allSamples.length; i++) {
    var sampleRequest = codeEditorsID[allSamples[i].id],
        sampleRequestValue = sampleRequest.getValue(),
        existingLoginId = ($(sampleRequestValue).find('merchantAuthentication > name').text()), // look for existing credential loginId
        existingKey = ($(sampleRequestValue).find('merchantAuthentication > transactionKey').text()); // looking for existing credential Key
    sampleRequest.setValue(sampleRequestValue.replace(existingLoginId, loginid).replace(existingKey, transactionkey));
    sampleRequest.refresh();
  }
}

function setCredCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}

function getCredCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
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

// this is to pull out the indenting in the CodeMirror XML
function stripCodeMirrorIndenting(code){
  var arrIndentedCode = code.split(">");
  var arrScrunchedCode = [];
  arrIndentedCode.forEach(function(entry) {
      //  this should be a regex
      entry = entry.replace("\n          ", "");
      entry = entry.replace("\n         ", "");
      entry = entry.replace("\n        ", "");
      entry = entry.replace("\n       ", "");
      entry = entry.replace("\n      ", "");
      entry = entry.replace("\n     ", "");
      entry = entry.replace("\n    ", "");
      entry = entry.replace("\n   ", "");
      entry = entry.replace("\n  ", "");
      entry = entry.replace("\n ", "");
      arrScrunchedCode.push(entry.trim());
  });
  return arrScrunchedCode.join(">");
}