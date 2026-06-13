if (typeof datei_name=="undefined") datei_name=location.href.substring(location.href.lastIndexOf("/")+1);

function buttons(path)
{
document.write("<A HREF='javascript:submitform(\"save\")'><IMG src='"+path+"/logos/Save.Gif' align=center border=0></A> <A HREF='javascript:submitform(\"save\")'>Eingaben speichern </A> ");
document.write("<A HREF='formdata://load'><IMG src='"+path+"/logos/Laden.gif' align=center border=0></A> <A HREF='formdata://load'>Eingaben laden</A><br>");
document.write("<A HREF='javascript:form.reset();'><IMG src='"+path+"/logos/loesch.gif' align=center border=0></A> <A HREF='javascript:form.reset();'>Eintr&auml;ge l&ouml;schen</A><p>");
}

function submitform(befehl)
{
   if (befehl=="print") {if (window.print) { window.print(); } else alert("Bitte benutzen Sie die Druck-Funktion Ihres Webbrowsers."); return;}
   /*erg="";
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
      }*/
   if (document.title=="Checkliste") {
   	   var b=cl_titel.substring(0,30);
   	   if (document.form.i_1.value!="") b+=' '+filter2(document.form.i_1.value);
   	   if (document.form.i_3.value!="") b+=' '+filter2(document.form.i_3.value);
   	   //alert(b);
   	   location.href="formdata://"+befehl+"_@filename="+b;
   }
   else location.href="formdata://"+befehl;
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

function filter2(x)
{
   x=""+x;
   var whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-()!äüößÄÜÖ ";
   var erg="";
   for(var i=0;i<x.length;i++) {
       var c=x.charAt(i);
       if (whitelist.indexOf(c)!=-1 || x.charCodeAt(i)>128) erg+=c;
       }
   return erg;
}
