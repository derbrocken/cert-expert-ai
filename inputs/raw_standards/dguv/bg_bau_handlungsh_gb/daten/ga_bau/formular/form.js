function buttons(path)
{
document.write("<A HREF='javascript:submitform(\"save\")'><IMG src='"+path+"/logos/Save.Gif' align=center border=0></A> <A HREF='javascript:submitform(\"save\")'>Eingaben speichern </A> ");
document.write("<A HREF='formdata://load'><IMG src='"+path+"/logos/Laden.gif' align=center border=0></A> <A HREF='formdata://load'>Eingaben laden</A><br>");
document.write("<A HREF='javascript:form.reset();'><IMG src='"+path+"/logos/loesch.gif' align=center border=0></A> <A HREF='javascript:form.reset();'>Eintr&auml;ge l&ouml;schen</A><p>");
}

function submitform(befehl)
{
   if (befehl=="print") {if (window.print) { window.print(); } else alert("Bitte benutzen Sie die Druck-Funktion Ihres Webbrowsers."); return;}
   erg="";
   for(i=0; i<form.elements.length; i++) {
      if (form.elements[i].type=="checkbox" ||
       form.elements[i].type=="radio") {
           erg+="&="+(form.elements[i].checked? "1" : "0");
           }
      else 
      if (form.elements[i].type=="text" ||
       form.elements[i].type=="textarea") {
           erg+="&="+escape(form.elements[i].value);
           }
      }
   location.href="formdata://"+befehl+erg;
}

function setformdata(parameter)
{
   werte=parameter.split("&");
   for(i=0; i<werte.length; i++) {
      if (form.elements[i].type=="radio" ||
          form.elements[i].type=="checkbox")
          form.elements[i].checked= werte[i]=="1"?true:false;
      else form.elements[i].value=unescape(werte[i]);
      }
}

