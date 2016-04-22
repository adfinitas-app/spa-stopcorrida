$(document).foundation();

function extractUrlParams(){
  var t = document.location.search.substring(1).split('&'); var f = [];
  for (var i=0; i<t.length; i++){
    var x = t[ i ].split('=');
    f[x[0]]=decodeURIComponent(x[1]);
  }
  return f;
};

var p = extractUrlParams();

var merciPath = '/merci.html';
var sourceParam = 'BDD';

if (p['origine'] === "orixa")
{
  var merciPath = '/merci-orixa.html';
  var sourceParam = 'Orixa';
}

if ('email' in p) {
  $("input[name=email]").val(p['email']);
}

if ('firstname' in p) {
  $("input[name=firstname]").val(p['firstname']);
}

if ('lastname' in p) {
  $("input[name=lastname]").val(p['lastname']);
}

if ('phone' in p) {
  $("input[name=phone]").val(p['phone']);
}

/*
 * Woopra tag
 */

(function(){
  var t,i,e,n=window,o=document,a=arguments,s="script",r=["config","track","identify","visit","push","call","trackForm","trackClick"],c=function(){var t,i=this;for(i._e=[],t=0;r.length>t;t++)(function(t){i[t]=function(){return i._e.push([t].concat(Array.prototype.slice.call(arguments,0))),i}})(r[t])};for(n._w=n._w||{},t=0;a.length>t;t++)n._w[a[t]]=n[a[t]]=n[a[t]]||new c;i=o.createElement(s),i.async=1,i.src="//static.woopra.com/js/w.js",e=o.getElementsByTagName(s)[0],e.parentNode.insertBefore(i,e)
})("woopra");

woopra.config({
  domain: 'spa.asso.fr',
  cookie_domain:'.spa.asso.fr'
});

if ('email' in p) {
  if ('lastname' in p && 'firstname' in p) {
    woopra.identify({
      email: p['email'],
      name: p['firstname'] + ' ' + p['lastname']
    });
  } else {woopra.identify({email: p['email']})}
}

woopra.track();

$(function() {
  $('a[href*="#"]:not([href="#"])').on("click", function(e) {
    e.preventDefault();
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html, body').animate({
	scrollTop: target.offset().top
      }, 1000);
    }
  }
  });
});

/*
 * Debut de la lib
*/

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}
function makeCorsRequest(data) {
  var url = 'https://form-to-db.herokuapp.com/';
  var body = JSON.stringify(data);
  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }
  xhr.setRequestHeader('Content-Type', 'application/json');
  // Response handlers.
  xhr.onload = function() {
    //var text = xhr.responseText;
    //alert('Response from CORS request to ' + url + ': ' + text);
    document.location.href = merciPath + "?email=" + data.db.email;
  };
  // Error Handler
  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };
  xhr.send(body);
}

/*
 * Fin de la lib
*/

function pureField(string) {
  return (string.replace(/'/g, "%27").replace(/"/g, "&quot;"));
}

function submitForm() {
  var infos = {};
  /* Si il y a un champ OPTIN sur le formulaire, et qu'il n'est pas coché,
     l'utilisateur ne doit surement pas remonter sur threads (voir avec le chef de projet).
     Pour effectuer ça, laisser le champ threads à undefined
   */
  var data = {
    "schema": "spa",
    "db": {
      "firstname": pureField($("input[name='firstname']").val()),
      "lastname": pureField($("input[name='lastname']").val()),
      "email": pureField($("input[name='email']").val()),
      "phone": pureField($("input[name='phone']").val()),
      //"optin": pureField($("input[name='optin']:checked").val()),
      "event": "petitioncorrida",
      "source": sourceParam,
    },
    "woopra" : {
      "host": "spa.asso.fr",
      "cookie": getCookie("wooTracker"),
      "cv_firstname": pureField($("input[name='firstname']").val()),
      "cv_lastname": pureField($("input[name='lastname']").val()),
      "cv_email": pureField($("input[name='email']").val()),
      "cv_phone": pureField($("input[name='phone']").val()),
      //"cv_optin": pureField($("input[name='optin']:checked").val()),
      "event": "petitioncorrida",
      //"ce_optin": pureField($("input[name='optin']:checked").val()),
      "ce_source": sourceParam,
    }
  }
  makeCorsRequest(data);
}

function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function removeClass()
{
  if ($(this).attr("type") == "radio") {
    $("input[name=" + $(this).attr("name") + "]").parent().removeClass("error");
  } else {
    $(this).parent().removeClass("error");
  }
  $(this).off("change");
}

function showError(elem) {
  if (elem.attr("type") == "radio" || elem.attr("type") == "checkbox") {
    $("input[name=" + elem.attr("name") + "]").parent().addClass("error");
    $("input[name=" + elem.attr("name") + "]").on("change", removeClass);
  } else if (elem.prop("tagName") == "SELECT") {
    elem.parent().parent().addClass("error");
    elem.on("change", removeClass);
  } else {
    elem.parent().addClass("error");
    elem.on("change", removeClass);
  }
}

function isValid() {
  var status = true;
  $(".error").removeClass("error");;
  $("#mainForm input").each(function() {
    if ($(this).attr("required") && $(this).attr != "submit") {
      if ($(this).attr("type") == "radio" || $(this).attr("type") == "checkbox") {
	if ($("input[name=" + $(this).attr("name") + "]:checked").length == 0) {
	  showError($(this));
	  status = false;
	}
      } else {
	if ($(this).val() == "" || $(this).val() == null ||
	    ($(this).attr("type") == "email" && isValidEmail($(this).val()) == false) ||
	    ($(this).attr("name") == "phone" && isNaN($(this).val()) == true)) {
	  showError($(this));
	  status = false;
	}
      }
    }
  });
  return (status);
}

$(".deployer-ensemble").on("mouseover", function() {
  var htmlId = $(this).attr("id");
  $("#" + htmlId + " .plus-text").show();
  console.log("#" + htmlId + " .plus");
  $("#" + htmlId + " .plus").hide();
});

$('.deployer-ensemble').on("mouseleave", function() {
  var htmlId = $(this).attr("id");
  $("#" + htmlId + " .plus-text").hide();
  console.log("#" + htmlId + " .plus");
  $("#" + htmlId + " .plus").show();
});

function launch() {
  $("#submit").on("click", function(e) {
    e.preventDefault();
    if (isValid()) {
      submitForm();
    }
  });
}

$(document).ready(launch);
