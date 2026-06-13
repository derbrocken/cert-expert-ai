//document.write('<div id="xx99" style="position:absolute;top:0;left:0">xx99</div>');
document.write('<div id="dropdown" style="position:absolute;visibility:hidden"></div>');

document.write('</div>');
document.write('</div>'); <!-- ende content/content_padd -->

if (relpath.indexOf("ga/mitarbeiter.htm")==-1) {
   document.write('<div id="navi" style="position:absolute;top:215px;left:753px;width:260px;background-color:#E5EDF4;padding:5px;z-index:1" onmouseover="zuklapp(1);">');
   
   if (!document.form_pre) {
     document.write('<form name="form_pre" style="margin:0"><h3>Gefährdungsbeurteilung   <a href="'+xpath+'ga_bau/f_iop/iop0000.htm" title="Hinweise zur Durchführung der Gefährdungsbeurteilung"> <i><b>i</b></i></a>  </h3> <table border="0" cellpadding="0" cellspacing="0">');
     inp11=parent.inp11;
     document.write('<tr><td>Firma</td><td><input size=35 style="width:152px" name=1 value="'+repl_anf(inp11[1])+'"></td></tr>');
     document.write('<tr><td>Stra&szlig;e</td><td><input size=35 style="width:152px" name=9 value="'+repl_anf(inp11[9])+'"></td></tr>')
     document.write('<tr><td>Plz/Ort</td><td><input size=35 style="width:152px" name=10 value="'+repl_anf(inp11[10])+'"></td></tr>')
     document.write('<tr><td>Arbeitsbereich</td><td><input size=35 style="width:152px" name=2 value="'+repl_anf(inp11[2])+'"></td></tr>')
     document.write('<tr><td>bearbeitet von</td><td><input size=35 style="width:152px" name=5 value="'+repl_anf(inp11[5])+'"></td></tr>')
     document.write('<tr><td>Datum</td><td><input size=10 style="width:152px" name=6 value="'+repl_anf(inp11[6])+'"></td></tr>');
     document.write('</table></form>');
     }
   document.write('<hr />');
   if (typeof flag_bearbeiten=="undefined")
       document.write('<!-- <div style="background-color:#B2C900;padding-top:16px;padding-bottom:16px;color:black;text-align:center;cursor:pointer" onclick="go_weitere_t()">Weitere Tätigkeiten ergänzen</div> -->');
   else 
       document.write('<div style="background-color:#618FBC;padding-top:16px;padding-bottom:16px;color:white;text-align:center;cursor:pointer" onclick="go_weitere_t()">Zurück zum Bearbeiten der Gefährdungsbeurteilung</div>');
   document.write('<hr /><h3>Umsetzungshilfen</h3>\
   <table cellpadding="0" cellspacing="0" border="0" class="uh_nav border2" style="border:0;width:100%" onmouseover="aufklapp_fkt(0)">\
   <tr><td><a href="'+xpath+'ga/hintergrundinfo.htm">Praxishilfen</a></td><td><a href="'+xpath+'ga_bau/checklisten.htm">Checklisten</a></td></tr>\
   </table>\
   <table cellpadding="0" cellspacing="0" border="0" class="uh_nav border2" style="border:0;width:100%">   \
   <tr><td><a href="'+xpath+'ga/hintergrundinfo.htm#bausteine">Bausteine</a></td><td><a href="'+xpath+'ga/hintergrundinfo.htm#vorschriften">&nbsp;§§&nbsp;</a></td><td><a href="'+xpath+'ga_bau/formular/ba.htm">Betriebsanweisungen</a></td></tr>\
   </table><hr />');

   var laden_dateiname='laden_speichern';
   if (typeof var_94=="undefined") laden_dateiname='laden';

   document.write('<h3>Funktionen</h3>\
   <div id="menu_r1" onmouseover="aufklapp_fkt(1)" class="menu_r">Gefährdungsbeurteilung öffnen/speichern</div>\
<div id="fkt1" class="aufklappmenu schatten2" style="right:0;left:auto">\
<div class="item itembl" onclick="ga_neu();">Neu</div>');
   if (!flag_mobil) document.write('\
<div class="item itembl" onclick="go_href(\'ga/'+laden_dateiname+'.htm\');" title="Öffnen einer vorhandenen Gefährdungsbeurteilung">Öffnen </div>\
<div class="item itembl" onclick="go_href(\'ga/laden_speichern.htm?speichern\');" title="Speichern der Gefährdungsbeurteilung">Speichern unter...</div>');
   else
   document.write('\
<div class="item itembl" onclick="export_gb()" title="Gefährdungsbeurteilung per Mail senden">per Mail senden</div>');
   document.write('\
</div>\
   <div id="menu_r2" onmouseover="aufklapp_fkt(2)" class="menu_r">Ergebnislisten</div>\
<div id="fkt2" class="aufklappmenu schatten2" style="right:0;left:auto">\
<div class="item itembl" onclick="go_href(\'ga'+(flag_kurzhh?'_kurzhh':'')+'/ga.htm?erglist\');">Ergebnis Gefährdungs&shy;beurteilung</div>\
<div class="item itembl" onclick="go_href(\'ga'+(flag_kurzhh?'_kurzhh':'')+'/ga.htm?maengel\');">Handlungsbedarf</div>\
<div class="item itembl" onclick="go_href(\'ga'+(flag_kurzhh?'_kurzhh':'')+'/ga.htm?kontroll\');">Kontrollliste</div>\
<div class="item itembl" onclick="go_href(\'ga'+(flag_kurzhh?'_kurzhh':'')+'/ga.htm?risikobewertung\');">Liste Risiko</div>\
<div class="item itembl" onclick="go_href(\'ga/planungslisten.htm\');">Ergebnis Liste Beschäftigte/Geräte</div>\
</div>');
   if (typeof drucklink!="undefined") document.write('\
   <div id="menu_r3" onmouseover="aufklapp_fkt(3)" class="menu_r">Drucken/Exportieren</div>\
<div id="fkt3" class="aufklappmenu schatten2" style="right:0;left:auto">\
<div class="item itembl" onclick="go_href(\'ga'+(flag_kurzhh?'_kurzhh':'')+'/'+drucklink+'\');">Druckversion erstellen</div>\
<div class="item itembl" onclick="go_href(\'ga'+(flag_kurzhh?'_kurzhh':'')+'/'+drucklink.replace("&print","&clipbrd")+'\');">Export in die Textverarbeitung</div>\
</div>');
   document.write('<div id="menu_r4" onmouseover="aufklapp_fkt(4)" class="menu_r">Datenbank</div>\
<div id="fkt4" class="aufklappmenu schatten2" style="right:0;left:auto">\
<div class="item itembl" onclick="go_href(\'ga/db.htm\');">Datenbank Beschäftigte</div>\
<div class="item itembl" onclick="go_href(\'ga/db_arbeitsmittel.htm\');">Datenbank Arbeitsmittel</div>\
</div>\
<form action="'+xpath+'ga/suche_faktor.htm" method="get" style="margin:0;margin-top:10px" onmouseover="aufklapp_fkt(0)">\
Suche im Gewerk '+bereichtxt+':<br /><input type="text" size="15" name="qu" value="" style="width:180px" /> <input type="submit" value="&gt;" style="height:21px" /></form>\
<br>');

// Link auf Kurzhh anzeigen, wenn kurzhh für das aktuelle Gewerk vorhanden sind:
if (typeof txts[bereich+'_k']!="undefined"
 && datei_name.indexOf("ga_")!=-1
) document.write('<table cellpadding="0" cellspacing="0" border="0" class="uh_nav border2" style="border:0;width:100%">\
<tr><td style="background-color:#ccc"><a href="'+xpath+'ga_kurzhh/ga_'+bereich+'_k.htm">Kurzhandlungshilfen '+bereichtxt+' einbinden</a></td></tr>\
</table>');

// Im Bereich Kurzhh: Hier den Link zum Übernehmen zeigen
if (flag_kurzhh)
document.write('<div style="background-color:#618FBC;padding-top:26px;padding-bottom:26px;text-align:center;"><strong><a href="'+xpath+'ga_kurzhh/uebernehmen.htm" style="color:white;text-decoration:none">In die <span style="font-size:120%">Handlungshilfen</span> übernehmen</strong></a></div>');


var bflag=move(99);

document.write('<div id="unten_blaetternx" style="'+(flag_tablet?'position:absolute;top:-100px;left:-650px':'text-align:right;margin-top:10px')+'">\
<a href="javascript:goback()" class="linksw" title="Zurück"><img src="'+path+'ga/img/pfeil_zur.gif" style="margin-left:5px" width="21" height="17" /></a>');
document.write('<a href="javascript:move1(-1);"  title="Rückwärts blättern"><img src="'+path+''+((bflag==1||bflag==2)?'ga/img/pfeil1.gif':'grafik/space.gif')+'"  style="margin-left:5px" width="21" height="17" /></a> \
<a href="javascript:move1(1);" title="Vorwärts blättern"><img src="'+path+''+((bflag==1||bflag==0)?'ga/img/pfeil2.gif':'grafik/space.gif')+'"    style="margin-left:3px" width="21" height="17" /></a>');
document.write('</div>');

   document.write('</div>');
}

window.focus();
document.onkeydown = keydown;
if(!window.onunload) window.onunload=merke_inp;
     
function go_href(x)
{
	location.href=xpath+x;
}

/*
document.write('\
<div style="position:absolute;bottom:25px;left:650px;width:128px;background-color:#F9FAFC;visibility:hidden" id="menu_ergebnisse">\
<table cellpadding="8" cellspacing="0" width="128" border="0">\
<tr><td style="border:1px solid #C2D1E4;border-bottom:0px;font-size:13px"><a href="'+xpath+'ga/ga.htm?erglist" class="linksw">&gt; Ergebnis Gefährdungs&shy;beurteilung</a></td></tr>\
<tr><td style="border:1px solid #C2D1E4;border-bottom:0px;font-size:13px"><a href="'+xpath+'ga/ga.htm?maengel" class="linksw">&gt; Handlungsbedarf nach Gefährdungs&shy;beurteilung</a></td></tr>\
<tr><td style="border:1px solid #C2D1E4;border-bottom:0px;font-size:13px"><a href="'+xpath+'ga/ga.htm?kontroll" class="linksw">&gt; Kontrollliste</a></td></tr>\
<tr><td style="border:1px solid #C2D1E4;border-bottom:0px;font-size:13px"><a href="'+xpath+'ga/planungslisten.htm" class="linksw">&gt; Ergebnis Liste Mitarbeiter/Geräte</a></td></tr>\
</table>\
</div>\r\n');

document.write('\
<div style="position:absolute;bottom:25px;left:550px;width:128px;background-color:#F9FAFC;visibility:hidden" id="menu_speichern">\
<table cellpadding="8" cellspacing="0" width="128" border="0">\
<tr><td style="border:1px solid #C2D1E4;border-bottom:0px;font-size:13px"><a href="'+xpath+'ga/laden_speichern.htm?speichern1" class="linksw" title="Speichern der Gefährdungsbeurteilung">&gt; speichern</a></td></tr>\
<tr><td style="border:1px solid #C2D1E4;border-bottom:0px;font-size:13px"><a href="'+xpath+'ga/laden_speichern.htm?speichern" class="linksw" title="Speichern der Gefährdungsbeurteilung">&gt; speichern unter...</a></td></tr>\
</table>\
</div>\r\n');

if (typeof drucklink!="undefined") document.write('\
<div style="position:absolute;bottom:25px;left:770px;width:128px;background-color:#F9FAFC;visibility:hidden" id="menu_export">\
<table cellpadding="8" cellspacing="0" width="128" border="0">\
<tr><td style="border:1px solid #C2D1E4;border-bottom:0px;font-size:13px"><a href="'+x8+rpath+"/"+drucklink+'" class="linksw">&gt; Druckversion erstellen</a></td></tr>\
<tr><td style="border:1px solid #C2D1E4;border-bottom:0px;font-size:13px"><a href="'+x8+rpath+"/"+drucklink.replace("&print","&clipbrd")+'" class="linksw">&gt; Export in die Textverarbeitung</a></td></tr>\
</table>\
</div>\r\n');
*/
   if (flag_tablet==0) move_content_mozilla();
       	var xmerk=0,ymerk=0;

function move_content_mozilla()
{
	if (document.getElementById("content")) {
	  y=getClientHeight()-211;
	  //x=getClientWidth()-268;
	  //x=750;
	  if (y<100) y=100;
	  //if (x<100) x=100;
	  if (ymerk!=y) { document.getElementById("content").style.height=  y+"px"; ymerk=y; }
	  //if (xmerk!=x) { document.getElementById("content").style.width= x+"px"; xmerk=x; }
	  
	  if(document.getElementsByTagName("html")[0].scrollTop!=0) document.getElementsByTagName("html")[0].scrollTop=0;	
	  if(document.getElementsByTagName("body")[0].scrollTop!=0) document.getElementsByTagName("body")[0].scrollTop=0;	
//	  document.getElementById("xx99").innerHTML=document.getElementsByTagName("body")[0].scrollTop;
	  
      }
	setTimeout("move_content_mozilla()", 50);
}

function keydown (e) 
{
  if (!e) e = window.event;
  if (e.which) Tastencode = e.which; 
  else if (e.keyCode) Tastencode = e.keyCode;
  if (relpath.substring(0,4)=="help" || hauptkap_pfadjs==2) { // nur im HTML-Teil blättern per Cursor-Tasten erlauben
     if (Tastencode==39) move(1);
     if (Tastencode==37) move(-1);
    }
  else if (typeof grid_keydown!="undefined") grid_keydown();
}


//--------------------------------------------------------
// für HTML-Version: Inputfelder in JScript-Variablen im Hauptframe speichern
function merke_inp()
{
	if (parent.nicht_merken_flag) {parent.nicht_merken_flag=0; save_to_ls(); return;}
	var flag_nur_aenderungen=0;
	//if (location.search=="?erglist"||location.search=="?maengel"||location.search=="?kontroll") flag_nur_aenderungen=1;

	if (document.form_ga) {
	    var zeile="";
	    var checkboxen=new Array();
	    var inpus=new Array();
	    for(i=0;i<document.form_ga.length;i++) {
	    	f=document.form_ga.elements[i];
	    	if (f.name=="zeile") { 
  	    	    if (zeile!="") parent.ga_daten[zeile]=parent.ga_daten[zeile].split("|")[0]+"|"+checkboxen.join(",")+"|"+inpus.join("|");
  	    	    zeile=f.value;
  	    	    
  	    	    // 17.06.08: flag_nur_aenderungen war manchmal falsch; dann waren Eingaben weg. Deshalb jetzt immer
  	    	    //           nur die Änderungen speichern und vorhandene Daten nicht löschen

  	    	    /*if (flag_nur_aenderungen==1) { var p=parent.ga_daten[zeile].split("|"); checkboxen=p[1].split(","); inpus=parent.ga_daten[zeile].substring(p[0].length+p[1].length+2).split("|"); }
  	    	    else { checkboxen=new Array(); inpus=new Array(); }*/

  	    	    var p=parent.ga_daten[zeile].split("|"); 
  	    	    if (p.length>1) { checkboxen=p[1].split(","); inpus=parent.ga_daten[zeile].substring(p[0].length+p[1].length+2).split("|"); }
  	    	    else { checkboxen=new Array(); inpus=new Array(); }
 	    	
	   	    	//  	    	    
	    		}
	    	if (f.type=="text" || f.type=="textarea") {
	    		v=f.value.replace(/\|/g, "/");
	    		nr=f.name.substring(1);
	    		inpus[nr-0]=v;
	    	}
	    	if (f.type=="checkbox" || f.type=="radio") checkboxen[f.value-0]=f.checked? "1":"0";
	    }
        if (zeile!="") parent.ga_daten[zeile]=parent.ga_daten[zeile].split("|")[0]+"|"+checkboxen.join(",")+"|"+inpus.join("|");
	 }
	 if (document.form_pre) {
	    for(i=0;i<document.form_pre.length;i++) {
	    	f=document.form_pre.elements[i];
	    	if (f.type=="text") parent.inp11[f.name-0]=f.value;
	    }
	 }
	 if (document.form) {
	    parent.form_cb_merk="";
	    parent.form_inp_merk=new Array();
	    parent.form_dateiname=datei_name;
	    for(i=0,z2=0;i<document.form.length;i++) {
	    	f=document.form.elements[i];
	    	if (f.type=="text") parent.form_inp_merk[z2++]=f.value;
	    	if (f.type=="checkbox") parent.form_cb_merk+=f.checked?1:0;
	    }
	 }
    save_to_ls();
}

function neu_ga(x)
{
   flag=0;
   for(var i in parent.ga_daten) {
       var g=ga.split("|");
       if (g[1].indexOf("1")!=-1) flag=1;
       for(j=2;j<g.length;j++) if (g[j]!="") flag=1;
   	}
   if (flag) if (confirm("Möchten Sie Ihre Eingaben wirklich löschen?")==0) return;

	parent.neu_ga();
   parent.nicht_merken_flag=1;
	location.href=xpath+x;
}

/*function neu_ga(x)
{
	parent.neu_ga1();
   parent.nicht_merken_flag=1;
	location.href=xpath+x;
}*/

function speichern_ga()
{
	merke_inp();
	load_applet(5);
}

function oeffnen_ga()
{
	load_applet(6);
}

function goback()
{
	if (typeof var_94=="undefined") history.back();
	else location.href="x-s8:///"+rpath+"/goback";
}

function export_gb(flag_sp_unter) 
{
var version_datum=201007; // für Versionsvergleich von geladenen GA's.  Format: JJJJMM
	
   window.onunload();

   var eingaben="x-filename:\\ga\\laden_speichern.htm\r\n";
   eingaben+='"'+bereich+'";';
   if (parent.version_datum_merk) eingaben+='"'+"gahochtief_1.1."+parent.version_datum_merk+'";';
   else eingaben+='"'+"gahochtief_1.1."+version_datum+'";';
   eingaben+='"xx";';
   eingaben+='"'+myjoin(parent.ga_daten)+'";';
   eingaben+='"'+myjoin(parent.db_daten)+'";';
   eingaben+='"'+myjoin(parent.risiko_daten)+'";';
   eingaben+='"'+myjoin(parent.inp11)+'";';
   eingaben+='"'+parent.eigene_struktur+'";';
   eingaben+='"'+myjoin(parent.mitarbeiter_db)+'";';

   var b=bereich.substring(0,1).toUpperCase()+bereich.substring(1);
   if (b=="Alles") b="Eigene";
   if (b=="Fm") b="GebMan";
   b=filter2(b+" "+parent.inp11[2]+" "+parent.inp11[6]);
   while (b.charAt(b.length-1)==' ') b=b.substring(0,b.length-1);

   document.frm2.eingaben.value=""+eingaben;
   document.frm2.name1.value=b+".ga1";
//   document.frm2.action="/gb/php/gb-mailen.php";
   document.frm2.action="/test_gb/php/gb-mailen.php";
   document.frm2.submit();
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
