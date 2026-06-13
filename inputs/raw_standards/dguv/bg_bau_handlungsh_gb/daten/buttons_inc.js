   if (typeof f_bereichwechsel_pruefen!="undefined") bereichwechsel_pruefen(f_bereichwechsel_pruefen);
   if (parent.eigene_struktur==null) init_eigene_struktur(bereich);
   var struktur=parent.eigene_struktur;

   var span1="";
   var span2="";
   var pfad;
   var txts=new Array;

   txts["abbruch_k"]="Abbrucharbeiten";
   txts["bautenschutz_k"]="Bautenschutz";
   txts["beton_k"]="Betonbohren/-sägen";
   txts["steinhersteller_k"]="Betonstein-/Terrazzohersteller";
   txts["brunnen_k"]="Brunnenbau";
   txts["dach_k"]="Dacharbeiten";
   txts["deko_k"]="Dekorationsarbeiten";
   txts["raumausstatter_k"]="Raumausstatter";
   txts["estrichleger_k"]="Estrichverlegearbeiten";
   txts["feuerfest_k"]="Feuerfestbau";
   txts["fliesenleger_k"]="Fliesen-/Plattenlegearbeiten";
   txts["gebrein_k"]="Gebäudereinigung";
   txts["gebaeudetech_k"]="Gebäudetechnik";
   txts["geruest_k"]="Gerüstbau";
   txts["glaser_k"]="Glaserarbeiten";
   txts["hochbau_k"]="Hochbau";
   txts["isolierer_k"]="Technische Isolierarbeiten";
   txts["maler_lack_k"]="Maler- und Lackierarbeiten";
   txts["messebau_k"]="Messebau";
   txts["parkett_boden_k"]="Parkett-/Bodenlegearbeiten";
   txts["pflasterer_k"]="Pflasterarbeiten";
   txts["schornsteinfeger_k"]="Schornsteinfegearbeiten";
   txts["steinmetz_k"]="Steinmetzarbeiten";
   txts["strassenbau_k"]="Straßenbau";
   txts["stuck_verputz_k"]="Stuckateur-/Verputzerarbeiten";
   txts["tiefbau_k"]="Tief- und Straßenbau";
   txts["trock_montage_k"]="Trockenbau/Montage";
   txts["zimmerer_k"]="Zimmererarbeiten";

   txts["abbruch"]="Abbrucharbeiten";
   txts["dach"]="Dacharbeiten";
   txts["fertigteil"]="Fertigteilmontage/-werke";
   txts["geruest"]="Gerüstbau";
   txts["gleisbau"]="Gleisbau";
   txts["hochbau"]="Hochbau";
   txts["rohr"]="Rohrleitungsbau";
   txts["steinmetz"]="Steinmetzarbeiten";
   txts["tiefbau"]="Tief- und Straßenbau";
   txts["zimmerer"]="Zimmererarbeiten";
   txts["beton"]="Betonbohren/-sägen";
   txts["feuerfest"]="Feuerfestbau";
   txts["schornstein"]="Schornsteinbau";
   txts["pflasterer"]="Pflasterarbeiten";

   txts["bautenschutz"]="Bautenschutz";
   txts["estrichleger"]="Estrichverlegearbeiten";
   txts["fliesenleger"]="Fliesen-/Plattenlegearbeiten";
   txts["gebaeudetech"]="Gebäudetechnik";
   txts["glaser"]="Glaserarbeiten";
   txts["maler_lack"]="Maler- und Lackierarbeiten";
   txts["parkett_boden"]="Parkett-/Bodenlegearbeiten";
   txts["stuck_verputz"]="Stuckateur-/Verputzerarbeiten";
   txts["trock_montage"]="Trockenbau/Montage";
   txts["isolierer"]="Technische Isolierarbeiten";
   txts["korrosion"]="Korrosionsschutz";
   txts["steinhersteller"]="Betonstein-/Terrazzohersteller";

   txts["gebrein"]="Gebäudereinigung";
   txts["fm"]="Gebäudemanagement";
   txts["schornsteinfeger"]="Schornsteinfegearbeiten";
   txts["messebau"]="Messebau";
   txts["deko"]="Dekorationsarbeiten";
   txts["klett"]="Industriekletterarbeiten";
   txts["taucher"]="Taucherarbeiten";
   txts["boot"]="Bootsbau und -service";

   txts["alles"]="Alle Tätigkeiten und Bereiche";
   txts["eigene"]="Selbst zusammengestellt";
   txts["basis"]="Selbst zusammengestellt";

   bereichtxt=txts[bereich];
   pfad='<a href="'+xpath+'ga/ga_'+bereich+'.htm">'+bereichtxt+'</a>';
   //if (bereich=="eigene"||bereich=="alles") bereichtxt='<span style="foxnt-size:30px">'+bereichtxt+'</span>';

   var hauptkap_pfadjs=0;

   pfad_html=pfad1(relpath);
   if (hauptkap_pfadjs==2) pfad=pfad+pfad_html;

   if (typeof flag_bearbeiten!="undefined") document.write('\
   <style type="text/css">\
#hauptnav .td_hover { background-color:#D6E278 }\
#hauptnav td { background-color:#F0F4CC;  }\
.aufklappmenu { ;background-color:#F0F4CC; }\
</style>');

   var ga_pfad='ga';
   var flag_kurzhh=0;
   if (bereich.indexOf("_k")!=-1) {
   	   ga_pfad='ga_kurzhh';
   	   flag_kurzhh=1;
   	   document.write('<style type="text/css">\
   	   #navi { background-color: #e0e0e0 !important; }\
   	   .uh_nav td { background-color: #b7b7b7; } \
   	   .menu_r { background-color: #b7b7b7; } \
   	   input[type=text] { background-image:url("'+path+'ga_kurzhh/images/input_bg.gif"); }\
   	   .itembl {  background-color: #e0e0e0 }\
   	   #hauptnav { display: none; }\
   	   #navi { top:138px!important }\
   	   #content { top:138px!important }\
       </style>');
       pfad=pfad.replace("ga/ga_", "ga_kurzhh/ga_");
   }
   
   document.write('<div id="oben" '+(flag_kurzhh?'class="oben_kurzhh"':'')+'>');
   document.write('<img src="'+path+ga_pfad+'/img/oben_'+bereich+'.jpg" width="151" height="116" alt="" />');
   document.write('<div style="position:absolute;top:27px;left:177px;width:620px;font-family:arial;font-weight:bold;'+
      'font-size:36px;color:white"><span style="font-size:24px;font-weight:normal">'+(bereich.indexOf("_k")==-1?'GEFÄHRDUNGSBEURTEILUNG':'KURZHANDLUNGSHILFEN')+'</span><br />'+
      '<a href="'+xpath+'ga/ga_'+bereich+'.htm" class="linkws" title="&gt; Zur Startseite: '+
      txts[bereich]+'">'+bereichtxt+'</a></div>');
   document.write('<div style="position:absolute;top:10px;left:0px;width:794px;text-align:right;font-size:14px;color:white;font-weight:normal;"><a href="'+xpath+'ga/titel.htm" class="linkws">&gt; Gewerkeauswahl</a></div>');
   //document.write('<div style="position:absolute;top:110px;left:205px;width:590px;font-size:12px;color:white;font-weight:normal;"><a href="'+xpath+'ga/ga-bearb.htm" class="linkws"><u>Arbeitsbereich/Baustelle/Objekt</u>: </a>'+parent.inp11[2]+'</div>');
   document.write('</div>');

   document.write('<div id="bglogo" style="position:absolute;top:0px;left:0px;">');
   document.write('<img src="'+path+'ga/img/links_oben.gif" alt="BG BAU Berufsgenossenschaft der Bauwirtschaft">');
   document.write('</div>');

   if (!flag_kurzhh) document.write('<div id="pfad1"><a href="'+xpath+'ga/titel.htm">Home</a></div>');
   document.write('<div id="pfad">');
   document.write(pfad);
   document.write('</div>');
   var mittelblau='789FC6';
   if (typeof flag_bearbeiten!="undefined") mittelblau='D6E278';

   document.write('<div id="hauptnav">\
     <table width="100%" callpadding="0" border="0" cellspacing="0" style="border:0;height:70px" >\
     <tr>\
     <td width="200" style="'+(hauptkap==1?' background-color:#'+mittelblau:'')+';border-right:2px solid white" onmouseover="aufklapp(1,this)">Organisation im Betrieb</td>\
     </td>\
     <td id="td2" style="vertical-align:middle; border-right:2px solid white;margin:0;padding:0;" onmouseover="hnav(2)"><div style="line-height:32px">Arbeitsvorbereitung / Tätigkeiten beim Kunden</div>\
     <table callpadding="0" cellspacing="0" border="0" id="hauptnav2" style="'+((hauptkap<2||hauptkap>6)?'display:none;':'')+'height:35px;width:100%" ><tr>\
     <tr>\
     <td style="border-top:2px solid white;border-right:2px solid white; '+(hauptkap==2?'background-color:#'+mittelblau+'"':'')+'" onmouseover="aufklapp(2,this)">Organisation Baustelle/Objekt</td>\
     <td style="border-top:2px solid white;border-right:2px solid white; '+(hauptkap==3?'background-color:#'+mittelblau+'"':'')+'" onmouseover="aufklapp(3,this)"><nobr>Verkehrswege,&nbsp;Arbeits-</nobr><br />plätze und Transport</td>\
     <td style="border-top:2px solid white;border-right:2px solid white; '+(hauptkap==4?'background-color:#'+mittelblau+'"':'')+'" onmouseover="aufklapp(4,this)">Allgemeine Tätigkeiten</td>\
     <td style="border-top:2px solid white;border-right:2px solid white; '+(hauptkap==5?'background-color:#'+mittelblau+'"':'')+'" onmouseover="aufklapp(5,this)">Tätigkeiten mit Gefahrstoffen</td>\
     <td style="border-top:2px solid white; '+(hauptkap==6?'background-color:#'+mittelblau+'"':'')+'" onmouseover="aufklapp(6,this)">Ergänzende Tätigkeiten</td>\
     </tr></table>\
     </td>\
     <td width="200" '+(hauptkap==7?' style="background-color:#'+mittelblau+'"':'')+'onmouseover="aufklapp(7,this)">stationäre Arbeitsplätze</td>\
     </tr>\
     </table></div>');

   var end_li='';
   var xx='',xx3='';
   var l=0;
   struktur=struktur.split("\n");
   var f_gruenen_kasten_einfuegen=0;
   var einfueg_pos=0;

   var e1=0;
   var e2=0;
   var e3=0;
   var ergaenzend_flag=0;

   for(var i=0; i<struktur.length-1; i++) {
       s=struktur[i].split("#");
       if (s[0].charAt(0)=='\t') continue;
       if (s.length<3) ergaenzend_flag=0;
       if (s.length==3 && s[2]!="") {
     	      if (ergaenzend_flag==1) {document.write('<div class="item"><b>'+s[2]+'</b></div>');continue;}
     	      if (s[2].charAt(0)=='$') ergaenzend_flag=1;
     	      e2++;e3=0;
       	      if (e2>0) { weitere_taetig(e2,i); document.write('</div>'); }
       	      document.write('<div id="aufklappmenu'+e2+'" class="aufklappmenu schatten" style="max-height:'+(getClientHeight()-209)+'px;overflow-y:auto">');
       	      //if (e2==u_kap && hauptkap_pfadjs==1) pfad+=' > <a href="javascript:toggle2('+e1+','+e2+')">'+s[2]+'</a>';
       	   }
       if (s.length>=5 && s[3]!="") {
           e3++;
           if (s[4].substring(0,4)=="f_cl")
               document.write('<div id="e3'+(e3==uu_kap?"_aktiv":"")+'"><a href="javascript:checkliste(\''+s[4]+'\')">'+s[3]+'</a></div>\r\n');
           else {
               var f_loesch='',f_einfueg='';
                   // wenn die anzuzeigende GA-Tabelle noch nicht in parent.ga_daten drin ist, dann jetzt
                   // einen Leereintrag dafür machen!
                   if (typeof parent.ga_daten!="undefined" && (typeof parent.ga_daten['f'+s[0]]=="undefined" || parent.ga_daten['f'+s[0]]==null))
                       parent.ga_daten['f'+s[0]]=s[4];
                   var blanko_titel="";
                   if (s[4].substring(0,8)=='f_blanko') {blanko_titel=hole_blanko_titel('f'+s[0]);}
           	       if (typeof flag_bearbeiten=="undefined")
           	           document.write('<div class="item" id="e3'+((e3==uu_kap&&e2==hauptkap)?"_aktiv":"")+'"'+((e3==uu_kap&&e2==hauptkap)?' style="color:#004B93"':'')+' onclick="toggle1('+e2+');go_ga('+e3+','+i+',\''+s[4]+'\')">'+f_einfueg+
           	                      s[3]+blanko_titel+''+f_loesch+
           	                      '</div>\r\n');
           	       else document.write('<div class="item item_disabled">'+s[3]+blanko_titel+'</div>\r\n');
       	       }
       	   }
       }
e2++;
weitere_taetig(e2,i);
document.write('</div>');
/*
maxheight=getClientHeight()-295-28;
k="kap2";
if (bereich=="eigene") {k="kap1";maxheight+=50;}
try{
if (document.getElementById(k).offsetHeight>maxheight) document.getElementById(k).style.height=maxheight;
   if (bereich!="eigene" && document.getElementById("kap3").offsetHeight>maxheight) document.getElementById("kap3").style.height=maxheight;
}catch(e){}

document.write('<div id="linksunten" style="position:absolute;bottom:0px;left:0px;">');
document.write('    <img src="'+path+'ga/img/links_unten.gif" alt="">');
document.write('</div>');
document.write('<div id="linksunten_schrift" style="position:absolute;bottom:9px;left:31px;font-size:16px"><b><a href="'+xpath+'ga/hintergrundinfo.htm" class="linksw">Umsetzungshilfen</a></b></div>');

document.write('<div id="unten" style="position:absolute;bottom:0px;left:265px;">');
document.write('    <img src="'+path+'ga/img/unten.gif" alt="">');
document.write('</div>');
document.write('<div id="unten_schrift" style="position:absolute;bottom:10px;left:280px;width:704px;font-size:13px;color:#5C8FAE">\
<b>Gefährdungsbeurteilung: </b>\
&nbsp; <a href="javascript:ga_neu();" class="linksw">&gt; neu</a> \
&nbsp; <a href="'+xpath+'ga/laden_speichern.htm" class="linksw" title="Öffnen einer vorhandenen Gefährdungsbeurteilung">&gt; öffnen </a> \
&nbsp; <a href="#" onmouseover="show_menu_erg(3)" class="linksw" title="Speichern der Gefährdungsbeurteilung">&gt; speichern</a> \
&nbsp; <a href="#" onmouseover="show_menu_erg(1)" class="linksw">&gt; Ergebnisse</a>');
if (typeof drucklink!="undefined") document.write(' &nbsp; <a href="#" onmouseover="show_menu_erg(2)" class="linksw" title="Erstellt eine Version der Gefährdungsbeurteilung, die für den Ausdruck oder das Kopieren in die Zwischenablage optimiert ist.">&gt; Drucken/Exportieren</a>');

document.write('</div>');

var bflag=move(99);
document.write('<div id="unten_blaettern">\
<a href="javascript:goback()" class="linksw" title="Zurück"><img src="'+path+'grafik/space.gif" width="31" height="17" /></a> \
<a href="javascript:move1(-1);"  title="Rückwärts blättern"><img src="'+path+''+((bflag==1||bflag==2)?'ga/img/pfeil1.gif':'grafik/space.gif')+'"  style="margin-left:5px" width="21" height="17" /></a> \
<a href="javascript:move1(1);" title="Vorwärts blättern"><img src="'+path+''+((bflag==1||bflag==0)?'ga/img/pfeil2.gif':'grafik/space.gif')+'"    style="margin-left:3px" width="21" height="17" /></a></div>');
*/

h_merk=h=getClientHeight();
document.write('<style type="text/css">\r\n\
@media screen { #content { height:'+(h-208)+'px;overflow:auto } }\r\n\
</style>');
document.write('<div id="content" onmouseover="zuklapp(0);">');
document.write('<div id="content_padd">');

function toggle(x)
{
	if (document.getElementById(x).style.display=="none") document.getElementById(x).style.display="block";
	else document.getElementById(x).style.display="none";
}

function toggle1(h)
{
	//if (hauptkap) toggle("kap"+hauptkap);
	//if (u_kap) toggle("kap"+hauptkap+"_"+u_kap);

	if (hauptkap==h) return;

	//toggle("kap"+h);
	hauptkap=h;
	u_kap=uu_kap=0;
	document.cookie="hauptkap="+hauptkap;
	document.cookie="u_kap="+u_kap;
	document.cookie="uu_kap="+uu_kap;
	//location.href=xpath+'ga/ga_'+bereich+'.htm';
}

function toggle2(h,u)
{
	if (u_kap) toggle("kap"+hauptkap+"_"+u_kap);
	if (hauptkap==h && u_kap==u) return;
	toggle("kap"+h+"_"+u);
	hauptkap=h;
	u_kap=u;
	uu_kap=0;
	document.cookie="hauptkap="+hauptkap;
	document.cookie="u_kap="+u_kap;
	document.cookie="uu_kap="+uu_kap;
	location.href=xpath+'ga/ga_'+bereich+'.htm';
}

function go_ga(uu, i, dateiname)
{
   if (uu==0) { // für Funktion "Suche in Faktoren: Die zugehörige Kapitelnummer finden
      i=-1;
      var e1=0, e2=0, e3=0;
      for(var j=0; j<struktur.length-1; j++) {
         s=struktur[j].split("#");
         if (s[1]!="") {
         	   e1++;e2=0;e3=0;
         	   }
         if (s.length==3 && s[2]!="") {
         	   if (s[2].charAt(0)!='$') {  e2++;e3=0; }
         	   }
         if (s.length>=5 && s[3]!="") {
             e3++;

            if (s[4]==dateiname) {
              if (s[0].charCodeAt(0)==9) { // Dieser Faktor ist ein optionaler Faktor -> Muss erst aktiviert werden (dazu das TAB-Zeichen am Anfang löschen)
                  parent.eigene_struktur=parent.eigene_struktur.replace(s[0]+'#', s[0].substring(1)+'#'); // z.B. \tK01# -> K01#
                  }
              if (i==-1) i=j;
              document.cookie="hauptkap="+e1;
       	      document.cookie="u_kap="+e2;
       	      uu=e3;
       	     j=struktur.length;
       	     }
       	    }
         }
      if (i==-1) {
      	  var xx='';
      	  try{
      	     var z=ga_dateien[dateiname];
      	     xx="'"+titel[z]+"' ";
      	     xx=xx.replace("&gt;", ">");
      	     } catch(e){}
      	  alert("Diese Tätigkeit ist in der aktuellen Struktur nicht vorhanden. Bitte zunächst "+xx+"in die Struktur einfügen.");
      	  return;
      	  }
      }

	document.cookie="uu_kap="+uu;
	document.cookie="ga_nr="+i;
    var k="kap2";
    if (bereich=="eigene") k="kap1";
    ga_id=struktur[i].split("#")[0];
	location.href=xpath+"ga/ga.htm?f"+ga_id+"&monitor&y2=0";
}

function checkliste(dateiname)
{
/*	var y2=0;
	try{ y2=document.getElementById("kap2").scrollTop; } catch(e){}
	location.href=xpath+"ga/checkliste.htm?"+dateiname+"&monitor&y2="+y2;*/
	location.href=xpath+"ga/checklisten/"+dateiname.substring(2)+".htm";
}

function move1(off) { move(off); }

function move(off)
{
   if (hauptkap_pfadjs==1 && ga_nr!=-1) { // Funktion: blättern in GA
   	    if (off==99) {
   	    	if (!struktur[ga_nr+1]) { if (uu_kap==1) return -1; else return 2; }
            var i=1;
            var s;
            do{ s=struktur[ga_nr+i].split("#"); i++; } while(s[0].charAt(0)=='\t');
            if (uu_kap<=1 && (s.length<4 || s[4]=="")) return -1;
            if (uu_kap==1) return 0;
            if (s.length<4 || s[4]=="") return 2;
   	    	return 1;
   	    }
   	    var add=0;
   	    if (off==-1 && uu_kap>1) add=-1;
   	    if (off==1) add=1;
   	    var s;
   	    var i=0;
        do{ i=i+add; s=struktur[ga_nr+i].split("#"); } while(s[0].charAt(0)=='\t');
        add=i;
   	    if (s.length>=4 && s[4]!="" && add!=0)  go_ga(uu_kap+add, ga_nr+add, s[4]);
   	    return -1;
		}

		// normales Blättern
   if (typeof ord=="undefined" || ord.length<2) return -1;
   vgl=dateiname.substring(dateiname.lastIndexOf("/")+1).toLowerCase();
   for(i=0; i<ord.length; i++){
      if (vgl==ord[i].toLowerCase()) {
          if (off==-1 && i>0) {location.href=x8+rpath+"/"+ord[i-1];return;}
          if (off==1 && i<ord.length-1)  {location.href=x8+rpath+"/"+ord[i+1];return;}
          if (off==99) {
              if (ord.length==1) return -1;
              if (i==0) return 0;
              else if (i==ord.length-1) return 2;
              else return 1;
              }
          }
      }
   if (off==99) return -1;
}

function ga_neu()
{
	ga_neu1();
}

function ga_neu1()
{
  var z=0;
	for (var i in parent.ga_daten) z++;
	if (parent.eigene_struktur!="") z++;
	if (z>0 || parent.db_daten.length>0 || parent.inp11.join(";").substring(0,9)!=";;;;;;;;;")
	  if (bereich=="alles") {if (!confirm("Ihre bisherigen Eingaben werden gelöscht. Fortfahren?")) return 0;}
	  else {if (!confirm("Eingaben löschen?")) return 0;}
    parent.neu_ga();
    parent.nicht_merken_flag=1;
    if (typeof var_94!="undefined") location.href=xpath+'m1.bc6';
    else parent.location.reload();
    return 1;
}

function ga_oeffnen()
{
}

function ga_speichern()
{
}

function pfad1(akt_datei)
{
   if (location.hash!="") akt_datei=akt_datei+location.hash;
   akt_datei=akt_datei.toLowerCase();
   kap_nr=new Array(0,0,0,0,0);
	 m=new Array(-1,-1,-1,-1,-1,-1);
	 treffer_m=new Array(-1,-1,-1,-1,-1);
	 hauptkaps_m=new Array(); hz=1;
	 treffer_kap_nr=new Array(5);
	 treffer_i=-1;

	 for(j=0; j<z; j++){
	     ebene=0;
	     while(pf[j].charAt(ebene)==' ') {  ebene++; }
	     if (ebene<5) { kap_nr[ebene]++; for(i=ebene+1;i<5;i++) kap_nr[i]=0; m[ebene]=j; m[ebene+1]=-1; }
	     if (ebene==0) hauptkaps_m[hz++]=j;

	     s=pf[j].split("=");
	     if (s[1].toLowerCase()==akt_datei.substring(0,s[1].length)) { // gefunden!
   	 	   	  for(i=0; i<5; i++) if (kap_nr[i]!=last_kap_nr[i]) break; // testen, wieviele Übereinstimmungen zur letzten Kapitelnummer da sind
			      if (i>treffer_i) { treffer_i=i; for(i=0; i<5; i++) {treffer_kap_nr[i]=kap_nr[i]; treffer_m[i]=m[i];} }
   	 	   	  }
   	 	 }

   for(i=0; i<5; i++) {last_kap_nr[i]=treffer_kap_nr[i]; }

	 // Pfad zusammenbauen. in treffer_m[0..4] stehen die einzelnen Teile, bis zu 5 Ebenen tief.
  erg="";
  for(i=0; i<5; i++) {
   	  nr=treffer_m[i];
   	  if (i==0) nr=hauptkaps_m[1];
   	  if (nr!=-1) {
   	     s=pf[nr].split("=");
   	     link=s[1];
   	     for(q=0;q<6;q++) if (s[0].charAt(q)!=' ' && s[0].charAt(q)!='+') break;
 	       linktext=s[0].substring(q,s[0].length);
 	       if (linktext=="%t") {
 	           linktext=document.title;

 	           off=linktext.indexOf(", "); if (off!=-1) linktext=linktext.substring(0,off);
 	           else { off=linktext.indexOf(" - "); if (off!=-1) linktext=linktext.substring(0,off); }

 	           link=akt_datei;
 	           if (typeof ord!="undefined" && ord.length>0) {
 	                off=link.lastIndexOf("/")+1;
 	                link=link.substring(0,off)+ord[0];
 	                }
 	           }
   	     if (i>0) erg+=" &gt; ";
   	     erg+="<a class='pfad"+treffer_kap_nr[0]+"' href='"+xpath+link+"'>"+linktext+"</a>";
   	     }
   	  else i=99;
   	  }

   hauptkap_pfadjs=treffer_kap_nr[0];
   return erg;
}

function suche_freie_ga_id()
{
  // nächste freie GA-ID-Nummer suchen
  var testarray=new Array();
  var es=parent.eigene_struktur.split("\n");
  for(var j=0; j<es.length; j++) {
  	  var id=es[j].substring(0,3);
  	  if (!isNaN(id)) testarray[id-0]=true;
  	  }
  for(nr=1;i<999 && typeof testarray[nr]!="undefined";nr++);
  return (""+(1000+nr)).substring(1);
}

function  ga_eigene_add(i)
{
   var ga_id_nr=suche_freie_ga_id();
   parent.eigene_struktur+= ga_id_nr +	struktur[i].substring(3) +"\n";
   location.href=xpath+"ga/ga_alles.htm?sel";
}

function hole_blanko_titel(zeile)
{
   try{
       var ga=parent.ga_daten[zeile];
       var g=ga.split("|");
       var anz_input=6*6;
       if (g.length<anz_input+2) return '';
       return '<br /><i>'+repl_anf(g[2+anz_input])+'</i>';
   }catch(e){ return ''; }
}

// ein Element aus der struktur (parent.eigene_struktur) löschen
function loesch(loesch_pos)
{
   var s=parent.eigene_struktur.split("\n");
   var t='';
   for (var i=0; i<loesch_pos; i++) t+=s[i]+'\n';
   i++;
   for (; i<s.length-1; i++) t+=s[i]+'\n';
   parent.eigene_struktur=t;

   // reload
   location.href=xpath+'ga/struktur_bearbeiten.htm';
}

function cancelEvent()
{
   window.event.returnValue = false;
}

function faktor_drop()
{
   var drag_id=event.srcElement.id;
   if (drag_id.substring(0,5)=='ziel_') {
       var einfueg_pos=drag_id.substring(5);
       var s=parent.eigene_struktur.split("\n");
       var t='';
       for (var i=0; i<einfueg_pos; i++) t+=s[i]+'\n';
       var ga_id=suche_freie_ga_id();
       delete parent.ga_daten['f'+ga_id];
       t+=ga_id + zeile_einfueg.substring(3) + "\n";
       for (; i<s.length-1; i++) t+=s[i]+'\n';
       parent.eigene_struktur=t;
       location.href=xpath+'ga/struktur_bearbeiten.htm';
       }
}

function init_eigene_struktur(neuer_bereich)
{
   parent.eigene_struktur=struktur1[neuer_bereich];
   if (neuer_bereich.indexOf("_k")!=-1) return;
   
   if (neuer_bereich!='alles') parent.eigene_struktur=struktur1["anfang"]+parent.eigene_struktur;
   if (neuer_bereich!='deko' && neuer_bereich!='dach' && neuer_bereich!='stuck_verputz' && neuer_bereich!='parkett_boden' && neuer_bereich!='maler_lack' && neuer_bereich!='glaser' && neuer_bereich!='gebaeudetech' && neuer_bereich!='fertigteil' && neuer_bereich!='steinmetz' && neuer_bereich!='zimmerer' && bereich!='messebau' && bereich!='klett' && neuer_bereich!='schornsteinfeger' && neuer_bereich!='gebrein' && neuer_bereich!='fm' && neuer_bereich!='korrosion' && neuer_bereich!='steinhersteller'  && neuer_bereich!='pflasterer' && neuer_bereich!='tätigkeiten' && neuer_bereich!='alles' && neuer_bereich!='eigene') parent.eigene_struktur+=struktur1["ende"];
}


var obj_merk=null, nr_merk;

function aufklapp(nr, obj)
{
	zuklapp(0);
	obj_merk=obj;
	nr_merk=nr;
	obj.className='td_hover';
	var menu=document.getElementById("aufklappmenu"+nr);
	if (!menu) return;

	var x=obj.offsetLeft;
	if (nr==2||nr==3||nr==4||nr==5||nr==6) x+=document.getElementById("td2").offsetLeft;

	var w=obj.offsetWidth;
	if (w<230) w=230;
	if (x+w>1023) x=1023-w;
	menu.style.left=x+"px";
	menu.style.width=w+"px";
	menu.style.display="block";
}

function zuklapp(flag_nur_menu_oben)
{
	if (obj_merk) {
	    obj_merk.className='';
	    var menu=document.getElementById("aufklappmenu"+nr_merk);
	    if (menu) menu.style.display="none";
	    obj_merk=null;
	}
	if (!flag_nur_menu_oben) aufklapp_fkt(0);
}

function aufklapp_fkt(nr)
{
   if (nr!=0) zuklapp(1);
   for(var i=1;i<=4; i++) if (document.getElementById("fkt"+i)) document.getElementById("fkt"+i).style.display='none';
   if (nr==0)return;

   var obj=document.getElementById("menu_r"+nr);
   var d=document.getElementById("fkt"+nr);
   d.style.top=(obj.offsetTop-20)+"px";
   d.style.left="-164px";
   d.style.width="165px";
   d.style.display='block';
}

function weitere_taetig(nr, i)
{
//if (nr==hauptkap) alert('nr='+nr+'; i='+i+'; hauptkap='+hauptkap+'; struktur[i]='+struktur[i]);
   if (nr-1==hauptkap) einfueg_pos=i;
   var txt_weitere='Ergänzen/ändern';
   if (nr==2) txt_weitere='Ausführliche Betriebsorganisation<br />inkl. psychischer Belastung';
   if (nr==3) txt_weitere='Ausführliche Organisation Baustelle/Objekt inkl. psychischer Belastung';
   if (nr>1) document.write('<div class="item itemgruen" onclick="location.href=\''+xpath+'ga/weitere_taetigk.htm?kap='+(nr-1)+'\'">'+txt_weitere+'</div>');
}

function go_weitere_t()
{
	if (typeof flag_bearbeiten=="undefined") location.href=xpath+'ga/weitere_taetigk.htm?kap='+hauptkap;
	else location.href=xpath+'ga/ga_'+bereich+'.htm';
}
function hnav(nr)
{
//	document.getElementById("hauptnav1").style.display="none";
	document.getElementById("hauptnav2").style.display="none";
	document.getElementById("hauptnav"+nr).style.display="";
}
