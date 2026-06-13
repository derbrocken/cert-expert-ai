function worddoc()
{
   f=filename.substring(filename.lastIndexOf("/")+1);
   f=f.replace(".htm", "");
   if (typeof formular_docname!="undefined") {
   	   formular_docname=formular_docname.replace("$.", f+".");
       if (typeof rpath!="undefined") location.href="x-s8:///"+rpath+"/"+formular_docname;
       else window.open(formular_docname);
   }
   else alert("Zu diesem Formular ist kein Word-Dokument vorhanden.");
}

function pdfdoc()
{
   f=filename.substring(filename.lastIndexOf("/")+1);
   f=f.replace(".htm", "");
   if (typeof formular_pdfname!="undefined") {
   	   formular_pdfname=formular_pdfname.replace("$.", f+".");
       if (typeof rpath!="undefined") location.href="x-s8:///"+rpath+"/"+formular_pdfname;
       else window.open(formular_pdfname);
   }
    else alert("Zu diesem Formular ist kein PDF-Dokument vorhanden.");
}

function form_neu()
{
	if (typeof rpath=="undefined" && confirm("Ihre Eingaben in diesem Formular werden gelöscht. Fortfahren?")==false) return;
	form.reset();
}

function load_form()
{
  if (top.frames.length==0) location.href="formdata://load";
  else load_applet(1);
}

function buttons(path)
{
//document.write("<A HREF='javascript:submitform(\"save\")'><IMG src='"+path+"/logos/Save.Gif' align=center border=0></A> <A HREF='javascript:submitform(\"save\")'>Eingaben speichern </A> ");
//document.write("<A HREF='formdata://load'><IMG src='"+path+"/logos/Laden.gif' align=center border=0></A> <A HREF='formdata://load'>Eingaben laden</A><br>");
//document.write("<A HREF='javascript:document.form.reset();'><IMG src='"+path+"/logos/loesch.gif' align=center border=0></A> <A HREF='javascript:document.form.reset();'>Eintr&auml;ge l&ouml;schen</A><p>");
}

function submitform(befehl)
{
   if (befehl=="print") {if (window.print) { window.print(); } else alert("Bitte benutzen Sie die Druck-Funktion Ihres Webbrowsers."); return;}
   if (top.frames.length!=0) {load_applet(2);return;}
   
   erg="";
/*   for(i=0; i<document.form.elements.length; i++) {
      if (document.form.elements[i].type=="checkbox" ||
       document.form.elements[i].type=="radio") {
           erg+="&="+(document.form.elements[i].checked? "1" : "0");
           }
      else 
      if (document.form.elements[i].type=="text" ||
       document.form.elements[i].type=="textarea") {
           erg+="&="+escape(document.form.elements[i].value);
           }
      }*/
   location.href="formdata://"+befehl+erg;
}

function setformdata(parameter)
{
   werte=parameter.split("&");
   for(i=0; i<werte.length; i++) {
      if (document.form.elements[i].type=="radio" ||
          document.form.elements[i].type=="checkbox")
          document.form.elements[i].checked= werte[i]=="1"?true:false;
      else document.form.elements[i].value=unescape(werte[i]);
      }
}

var html;

function gethtml()
{
   html=document.body.innerHTML;
   
   // 1. pfad auf document.form.js korrigieren (nur beim 1. Aufruf nötig)
   l=location.href;
   l=l.substring(0,l.lastIndexOf("/"));
   html=html.replace("../form.js", l+"/../form.js");
   html=html.replace(">buttons(", ">dummy=(");
   html=html.replace(/<.script>/ig," -->"); 
   html=html.replace(/<script /ig,"<!-- ");
   html=html.replace(/onmouseover/ig,"_onmouseover");
   html=html.replace(/onmouseout/ig,"_onmouseout");
   html=html.replace(/onclick/ig,"_onclick");
   html=html.replace(/<div id=vd/ig,"<div style='display:none' ");   
   
   //else 
   css_pfad="";
   
   html=html.replace(/<input/gi,"<input");
   html=html.replace(/ value=/gi," value=");
   html=html.replace(/<textarea /gi,"<textarea");

   html=html.replace(/<a href/gi,"<a name");
   
   // 2. den Head-Bereich einbauen
   html='\
<html>\
<head>\
<meta name="Copyright" content="Copyright 2005 BC GmbH, Wiesbaden">\
<title>Formular</title>\
<link rel="stylesheet" type="text/css" href="'+css_pfad+document.getElementsByTagName('link')[0].href+'">\
</head>\
<body>'+html+'</body>';
}

function print_intra()
{
if (typeof form=="undefined") {s_drucken(); return;}
print_intra2(form);
}

function print_intra_pre()
{
print_intra2(form_pre);
}

function print_intra2(form_obj)
{
   if (!document.all) {
   	s_drucken();
   	return;
   	}
	
   gethtml();  // HTML-Source inkl. head in die var. html einlesen; script-Tags korr.

   // Input-Tags durch den Inhalt ersetzen  
   off=0;
   for(i=0;i<form_obj.elements.length;i++) {
       if (form_obj.elements[i].type=="textarea") {
       	    anf_i=html.indexOf("<textarea",off);
       	    end_i=html.indexOf(">",anf_i);
       	    end_i++;
       	    end_i=html.indexOf(">",end_i);
       	    value=form_obj.elements[i].value; if (value=="") value="&nbsp;";
       	    value=value.replace(/\r\n/g, "<br>");
       	    html=html.substring(0,anf_i)+"<b class='inp'>"+value+"</b>"+html.substring(end_i+1);
       	    off=anf_i+1;
            }
       if (form_obj.elements[i].type=="text" || form_obj.elements[i].type=="hidden") {
       	    anf_i=html.indexOf("<input",off);
       	    end_i=html.indexOf(">",anf_i);
       	    value=form_obj.elements[i].value; if (value=="") value="&nbsp;";
       	    html=html.substring(0,anf_i)+"<b class='inp'>"+value+"</b>"+html.substring(end_i+1);
       	    off=anf_i+1;
            }
       if (form_obj.elements[i].type=="radio" || form_obj.elements[i].type=="checkbox") {
       	    anf_i=html.indexOf("<input",off);
       	    off=anf_i+1;
            }
       }

   q=window.open("","saveframe");
   q.document.open("text/html");
   q.document.write(html);
   q.document.close();
   q.window.print();
}

///////////--------------ab hier: Funktionen für Java-Version (Mac/Linux/Internet/Intranet)
var l_text="";

function load_applet(param)
{
  s=navigator.userAgent;
  if (s.indexOf("; Mac")!=-1 && s.indexOf("MSIE 5.")!=-1) {alert("Fehler: Diese Funktion kann mit dem Internet Explorer 5 nicht verwendet werden.");return;}
  if (s.indexOf("Safari/312")!=-1) {alert("Fehler: Diese Funktion kann mit dem Safari 1.3 nicht verwendet werden.");return;}
  
  try{
     v=ver=java.lang.System.getProperty('java.version');  //1.5.xxx
     ver=ver.substring(0,4);
     if (ver=="1.1." || ver=="1.2." || ver=="1.3.") {alert("Fehler: Für diese Funktion wird mindestens die Version 1.4 der Java Runtime benötigt. Derzeit installiert ist die Version "+v+".");return;}
  }  
  catch(e) {}

  	h=parent.applet.location.href; // ggf. das Applet laden
  	if (h.substring(h.length-9)=="_leer.htm") parent.applet.location.href=h.substring(0,h.length-9)+".htm";  	
  	wait_applet(param);
}

function wait_applet(param)
{
  	if (typeof parent.applet.applet_geladen=="undefined" || parent.applet.applet_geladen==0) {setTimeout("wait_applet("+param+")", 100);return;}

    setTimeout("wait_applet2("+param+")", 1000);
}

function wait_applet2(param)
{
  	if (parent.applet.test_applet()==0) {
    if (param==1) alert("Bitte suchen Sie im folgenden Dialog den Dateinamen aus, aus dem die Formulardaten gelesen werden sollen.");
    if (param==2) alert("Bitte geben Sie im folgenden Dialog den Dateinamen an, unter dem die Formulardaten gespeichert werden sollen.");
                 load_applet(param);return;}
  	
    if (param==1) {
    	    parent.applet.laden();
    	  }
    if (param==2) {
        erg="";
        for(i=0; i<document.form.elements.length; i++) {
            if (document.form.elements[i].type=="checkbox" ||
             document.form.elements[i].type=="radio") {
                 erg+=(document.form.elements[i].checked? "1" : "0")+"&";
                 }
            else 
            if (document.form.elements[i].type=="text" ||
             document.form.elements[i].type=="textarea") {
                 erg+=escape(document.form.elements[i].value)+"&";
                 }
            }
    	 	l_text=erg;
    	    parent.applet.speichern();
    	}
    if (param==5) { //5 bedeutet: GA-Daten speichern
        erg="";
        for(i=0;i<800;i++) erg+=escape(parent.inp11_merk[i])+"&";
        for(i=0;i<600;i++) erg+=escape(parent.cb11_merk[i])+"&";
   	 	l_text=erg;
   	 	parent.applet.speichern();
    	}
    if (param==6) {
    	    parent.applet.mode=6;
    	    parent.applet.laden();
    	  }
}

function laden_ok()
{
	  daten=l_text.split("&");
    for(i=0; i<document.form.elements.length; i++) {
    	   if (daten.length<i) return;
            if (document.form.elements[i].type=="checkbox" ||
             document.form.elements[i].type=="radio") {
                 document.form.elements[i].checked=daten[i]=="1";
                 }
            else 
            if (document.form.elements[i].type=="text" ||
             document.form.elements[i].type=="textarea") {
                 document.form.elements[i].value=unescape(daten[i]);
                 }
            }
}

function limit(field)
{
	if ( field.value.length > 199 ) {
		    field.value = field.value.substring( 0, 198 );
		    alert("Es können maximal 200 Zeichen pro Eingabefeld gespeichert werden.");
		    return false;
		  }
}	
