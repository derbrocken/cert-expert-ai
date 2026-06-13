var flag_tablet=0;
var flag_mobil=0;
function save_to_ls() {}

  var hauptkap=0;
  var u_kap=0;
  var uu_kap=0;   
  var ga_nr=-1;
  var bereich="";
  parent.nicht_merken_flag=0;
  dc=document.cookie.split("; ");
  for(var i=0; i<dc.length; i++) {
  	if (dc[i].substring(0,9)=="hauptkap=") hauptkap=dc[i].substring(9)-0;
  	if (dc[i].substring(0,6)=="u_kap=") u_kap=dc[i].substring(6)-0;
  	if (dc[i].substring(0,7)=="uu_kap=") uu_kap=dc[i].substring(7)-0;
  	if (dc[i].substring(0,8)=="bereich=") bereich=dc[i].substring(8);
  	if (dc[i].substring(0,6)=="ga_nr=") ga_nr=dc[i].substring(6)-0;
       }   
 
 last_kap_nr=new Array(1,0,0,0);
 hauptkap_merk=0;
 var relpath2;
 
 if (typeof f_bereichwechsel_pruefen!="undefined") bereich=f_bereichwechsel_pruefen;
 else {
 	if (bereich=='') { bereich="hochbau"; document.cookie="bereich="+bereich; }
 }

//---
if (typeof var_94!="undefined") {
  x=document.all.tags("link")[0].href;
  path=x.substring(0,x.length-9);  // für CD-ROM Version
  if (x.substring(x.length-11,x.length-9)=="//") path=x.substring(0,x.length-10);
  path2=document.all.tags("script")[1].src;  
  path2=path2.substring(0,path2.lastIndexOf("/")+1);
  if (path2.substring(path2.length-2,path2.length)=='//') path2=path2.substring(0,path2.length-1);
  x8="x-s8:///";
  i=rpath.toLowerCase().lastIndexOf("/daten/")+7;
  path=rpath.substring(0,i).toLowerCase();
  dateiname=(rpath.substring(i)+"/"+datei_name).toLowerCase();
  if (dateiname.charAt(0)=='/') dateiname=dateiname.substring(1);
  relpath=rpath.substring(i)+"/"+datei_name;
  relpath2=rpath.substring(i);

  if (path.substring(0,2)=='//') path="file:///"+path;
  }
else { // für Intranet-Version
   var rpath1=location.href;
   i=rpath1.toLowerCase().lastIndexOf("daten/")+6;
   path=rpath1.substring(0,i);

   relpath=rpath1.substring(i);
   relpath=relpath.toLowerCase();
   if (relpath.charAt(0)=='/') relpath=relpath.substring(1);
   xpath=path;

  rpath=rpath1;
  datei_name=rpath1.substring(rpath1.lastIndexOf("/")+1);

  dateiname=(rpath.substring(i)+"/"+datei_name).toLowerCase();
  if (dateiname.charAt(0)=='/') dateiname=dateiname.substring(1);
  relpath=rpath.substring(i)+"/"+datei_name;
  relpath2=rpath.substring(i);
  x8='';
  }

xpath=x8+path;
xpath=xpath.replace("x-s8:///file://///","x-s8://///");
//---
 // Gegen den 'Leerzeichen im Pfad / Kopieren nach Word" Bug
if (path.indexOf(" ")!=-1 && path.indexOf("file://")==-1) {
	path="file:///"+path.replace(/ /g, "%20");
	}
//---

  pf=new Array(); z=0;
  document.write('<script type="text/javascript" src="'+path+'pfade.js"></script>');

  var struktur1=new Array();

  if (bereich=="gebrein" ||bereich=="fm" ||bereich=="schornsteinfeger" ||bereich=="klett"  ||bereich=="taucher" ||bereich=="boot")  document.write('<script type="text/javascript" src="'+path+'struktur_anfang2.js"></script>');
  else document.write('<script type="text/javascript" src="'+path+'struktur_anfang.js"></script>');

  document.write('<script type="text/javascript" src="'+path+'struktur_'+bereich+'.js"></script>');

  if (bereich.indexOf("_k")!=-1) // bei kurzhh auch die Struktur der kpl. GA einladen
      document.write('<script type="text/javascript" src="'+path+'struktur_'+bereich.split("_k")[0]+'.js"></script>');

  document.write('<script type="text/javascript" src="'+path+'struktur_ende.js"></script>');

  document.write('<script type="text/javascript" src="'+path+'buttons_inc.js"></script>');

function getClientHeight()
{
  if (self.innerHeight) // all except Explorer
	return self.innerHeight;
  else if (document.documentElement && document.documentElement.clientHeight)	// Explorer 6 Strict Mode
	return document.documentElement.clientHeight;
  else if (document.body) // other Explorers
       return document.body.clientHeight;
  return 0;	
}

function getClientWidth()
{
  if (self.innerWidth) // all except Explorer
	return self.innerWidth;
  else if (document.documentElement && document.documentElement.clientWidth)	// Explorer 6 Strict Mode
	return document.documentElement.clientWidth;
  else if (document.body) // other Explorers
       return document.body.clientWidth;
  return 0;	
}

function zurga()
{
  if (document.cookie=="" || ga_nr==-1) {history.back();return;}
  ga_id=struktur[ga_nr].split("#")[0];
  location.href=xpath+"ga/ga.htm?f"+ga_id;
}

/* ========== feststehende köpfe =============== */
var kopf_ys;
var kopf_ypos2;
var kopfgroesse_tr1;
var kopfpos_tr1;
var _tr_anzahl=0;
var td_xs=new Array();
var tab_id="tab_body";
var anz_td;

function move_tab_head()
{
    tr=document.getElementsByTagName("tr");
    if (kopfgroesse_tr1!=tr[0].offsetHeight) init_tab_kopf_fest();
    if (kopfpos_tr1!=document.getElementById(tab_id).offsetTop) init_tab_kopf_fest();

    document.getElementById("tab_head").style.top=( getScrollTop() )+"px";
    y=getScrollTop()+kopf_ys;
    //alert(y);
    y2=kopf_ypos2;
    if (y2>y) y=y2;
    y-=15;
    document.getElementById("tab_head2").style.top=y+"px";
    w=document.getElementById(tab_id).offsetWidth+"px";
    //document.getElementById("whitegif").style.width=
if (!document.getElementById("whitegif2")) return;
    document.getElementById("whitegif2").style.width=w;
    
    td=document.getElementById("tab_head2").getElementsByTagName("td");
    for(i=0;i<anz_td;i++) {td[i].style.width=td_xs[i]+"px"; /*alert(td_xs[i]+"px");*/}
    setTimeout("move_tab_head()", 20);
}

function init_tab_kopf_fest()
{
   tr=document.getElementsByTagName("tr");
   kopfgroesse_tr1=tr[0].offsetHeight;
//alert("x");
   kopfpos_tr1=document.getElementById(tab_id).offsetTop;
//alert("x2");
   x='';
   x2='';
   kopf_ys=0;
   kopf_ypos2=0;
   flag=1;
   tr_anzahl=0;
   tr_fest2=0;
   for(i=_tr_anzahl;i<tr.length;i++) {
   	   if (tr[i].id=="fest") {x=x+tr[i].outerHTML; kopf_ys+=tr[i].clientHeight; tr_anzahl++;}
   	   if (tr[i].id=="fest2") {x2=x2+tr[i].outerHTML; flag=0; tr_anzahl++;tr_fest2=i;}
   	   if (flag==1) kopf_ypos2+=tr[i].clientHeight;
   	   }
   if (_tr_anzahl==0) _tr_anzahl=tr_anzahl;
   
   td=tr[tr_fest2-1].getElementsByTagName("td");
   for(i=0;i<td.length;i++) td_xs[i]=td[i].offsetWidth-5;
   td=tr[tr_fest2].getElementsByTagName("td");
   for(i=0;i<td.length;i++) td_xs.push(td[i].offsetWidth-5);
   //alert(td_xs);

   table=document.getElementsByTagName("table")[tab_id];
   if (!table.outerHTML) return;
   table_html=table.outerHTML.split(">")[0]+' bgcolor="white">';
   table_html=table_html.replace(tab_id, tab_id+"_body");
   if (typeof cl_ausgeben=="undefined")  kopf_ypos2=table.offsetTop;
   else kopf_ypos2=table.offsetTop+table.getElementsByTagName("tr")[0].offsetHeight-1;

	if (document.getElementById("tab_head2").innerHTML!='') {
		return; // init_tab_kopf_fest() wurde schon mal aufgerufen
		}

/*   document.getElementById("tab_head").innerHTML=
   '<img src="'+path+'grafik/white.gif" height="15" width="100%" id="whitegif"><br>'+
    table_html+
    x+
    '</table>';*/
   document.getElementById("tab_head2").innerHTML=
    '<img src="'+path+'grafik/space.gif" height="15" width="100%" id="whitegif2"><br>'+
    table_html+
    x2+
    '</table>';
}

function tab_kopf_fest_onload()
{
	if (!document.getElementById(tab_id)) return;
   init_tab_kopf_fest();
   move_tab_head();
}

function tab_kopf_fest(x)
{
   if (!document.all) return; // Diese Funktion ist nur für IE
   if (getClientWidth()<640) return; // und erst ab 1024x768
   s=navigator.userAgent;
   if (s.indexOf("MSIE 5.")!=-1) return; // nicht mit IE5

   if (typeof x!="undefined") tab_id=x;
   document.write('<div style="position:absolute;top:5px;left:10px" id="tab_head"></div>');
   document.write('<div style="position:absolute;top:5px;left:10px" id="tab_head2"></div>');
   window.onload=tab_kopf_fest_onload;
}

function tab_kopf_fest_ga(x)
{
   if (!document.all) return; // Diese Funktion ist nur für IE
   if (getClientWidth()<640) return; // und erst ab 1024x768
   s=navigator.userAgent;
   if (s.indexOf("MSIE 5.")!=-1) return; // nicht mit IE5

   if (typeof x!="undefined") tab_id=x;
   document.write('<div style="position:absolute;top:0px;left:10px" id="tab_head"></div>');
   document.write('<div style="position:absolute;top:0px;left:10px;z-index:1" id="tab_head2"></div>');
   anz_td=8;
   if (dateiname.indexOf("/checklisten/")!=-1)  anz_td=5;
   window.onload=tab_kopf_fest_onload;
}

function getScrollTop()
{
   return document.getElementById("content").scrollTop;
}

/* ========== ende: feststehende köpfe =============== */

risikoeinschaetzung_txt=new Array(
"",

"Das Risiko ist gering. \
Handlungsbedarf zur Risikominderung ist nicht zwingend vorhanden.",

"Das Risiko ist vorhanden. Sie sollten Maßnahmen auswählen, um das Risiko zu mindern. \
Nutzen Sie dazu gegebenenfalls auch die leeren Felder am Ende der Gefährdungsbeurteilung \
auch die leeren Felder am Ende der Gefährdungsbeurteilung beziehungsweise die Blanko-\
beziehungsweise die Blanko-Gefährdungsfaktoren.",

"Das Risiko ist hoch. Maßnahmen zur Risikominimierung sind dringend erforderlich. \
Nutzen Sie dazu gegebenenfalls auch die leeren Felder am Ende der Gefährdungsbeurteilung \
beziehungsweise die Blanko-Gefährdungsfaktoren.");

function copy_clp()
{
   // erst alle Links entfernen
   var content=document.getElementById("content");
   var hrefs=content.getElementsByTagName("a");
   for(var i=0; i<hrefs.length; i++)  hrefs[i].removeAttribute("href");

   //
   if (document.selection)  document.selection.empty();
   else if (window.getSelection) window.getSelection().removeAllRanges();
   if (document.selection) 
   {
      var range = document.body.createTextRange();
      range.moveToElementText(document.getElementById("content"));
      range.select();
      range.execCommand('copy'); 
   }
   else if (window.getSelection) 
   {
      var range = document.createRange();
      range.selectNode(document.getElementById("content"));
      window.getSelection().addRange(range);
   }
}

function set_target(obj)
{
   if (typeof rpath!="undefined") obj.target='_self';
   else  obj.target='_blank';
}

function repl_anf(x)
{
	if (typeof x=="undefined") x='';
	return x.replace(/\"/g,"\'");
}

function go_titel()
{
	location.href=xpath+"ga/titel.htm";
}
function make2(x)
{
if (x<10) return "0"+x; else return x;
}
