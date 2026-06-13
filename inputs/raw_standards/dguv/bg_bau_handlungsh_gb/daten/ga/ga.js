var kopf='';
risiko_txt=new Array();
risiko_txt["Absturz"]='Prellungen; Verrenkungen; Knochenbrüche;  Verletzungen des Gehirns und der Wirbelsäule';
risiko_txt["Arbeiten in Zwangshaltung"]='Überlastung einzelner Muskelgruppen und Gelenke; Gelenks- und Sehnenentzündungen; Behinderung der Durchblutung';
risiko_txt["Biologische Arbeitsstoffe"]='Infektionen; Allergien';
risiko_txt["Brand und Explosion"]='Verbrennungen I.-III. Grades; Personenschäden durch Druckeinwirkung; Vergiftungen';
risiko_txt["Elektrischer Strom"]='Herzrhythmusstörungen; Herzstillstand; Verkochung von Muskulatur; Verbrennungen I.-III. Grades';
risiko_txt["Elektromagnetische Felder"]='Reizungen von Muskeln und Nerven; Teilkörper- Körperkerntemperaturerhöhung; Linsentrübung; Herzschrittmacherfehlfunktion';
risiko_txt["Erfasst und getroffen werden"]='Quetschungen; Prellungen; Verrenkungen; Knochenbrüche; Amputationen; Verletzungen des Gehirns und der Wirbelsäule ';
risiko_txt["Gefahrstoffe"]='Vergiftungen; Erkrankungen (auch Krebs) der Haut, der Lunge,  des Nervensystems, andere Organschäden ; Allergien; Verbrennungen I.-III. Grades; Fruchtschädigungen';
risiko_txt["Hautgefährdung"]='Abnutzungsekzem; Kontaktallergie; Eindringen von Gefahrstoffen';
risiko_txt["Hitze, Klima"]='Konzentrationsmängel; Leistungsabfall; Zunahme von Arbeitsfehlern und -unfällen; Herzkreislaufbelastung; Hitzekrämpfe; Hitzekollaps; Hitzschlag;  Verbrennungen I.-III. Grades';
risiko_txt["Kälte, Klima"]='Unterkühlung; Erfrierungen; Taubheitsgefühl;Konzentrationsmängel; Leistungsabfall; Zunahme von Arbeitsfehlern - unfällen';
risiko_txt["Körperliche Belastung"]='Übersteigt die körperliche Belastung die individuelle Belastbarkeit, so kommt es zu akuten Ermüdungserscheinungen und langfristig chronischen degenerativen Veränderungen und Beschwerden an Gelenken, Muskeln und Sehnen.';
risiko_txt["Lärm"]='Lärmschwerhörigkeit; Stress; Schlafstörungen; Knalltrauma; Erhöhtes Unfallrisiko';
risiko_txt["Mängel in der Arbeitsorganisation"]='Erhöhtes Unfall-, Erkrankungs- und Kostenrisiko durch vermeidbare Gefährdungen';
risiko_txt["Psychische Belastungen"]='Stress; psychosomatische Erkrankungen; erhöhter Alkohol-, Nikotin- und Medikamentenkonsum; Resignation; nachlassende Konzentration: steigende Fehler- und Unfallhäufigkeit';
risiko_txt["Spitze und scharfkantige Gegenstände"]='Schnitt- Stich- und Pfählungsverletzungen';
risiko_txt["Stäube"]='Chron. Bronchitis, Lungenfibrose; Krebserkrankungen der Lunge, des Kehlkopfes, des Rippenfells, der Nasen- Rachenräume; Allergien; Hautekzeme';
risiko_txt["Stolpern, Rutschen, Stürzen"]='Prellungen; Verrenkungen; Knochenbrüche; Verletzungen des Gehirns und der Wirbelsäule';
risiko_txt["Sturz ins Wasser"]='Ertrinken; Unterkühlen; Ersticken';
risiko_txt["Strahlung"]='Akute Strahlenschäden; Krebserkrankungen; Gefährdung der Haut; Gefährdung der Augen; Grauer Star; Reizung von Muskeln und Nerven';
risiko_txt["Ungeschützt bewegte Maschinenteile"]='Schnittverletzungen; Quetschungen; Knochenbrüche; Amputationen';
risiko_txt["Unkontrolliert bewegte Teile"]='Schnittverletzungen; Quetschungen; Verrenkungen; Knochenbrüche; Amputationen; Verletzungen des Gehirns und der Wirbelsäule; Verschüttet werden';
risiko_txt["Vibration"]='degenerative Veränderungen der Handknochen, der Hand-,  Ellenbogen- oder Schultergelenke; Durchblutungsstörungen an den Fingern; bei Ganzkörperschwingungen - Schäden der Wirbelsäule';

risiko_link=new Array();
risiko_link["Absturz"]='ga_bau/f_a/a10062.htm';
/*risiko_link["Arbeiten in Zwangshaltung"]='ga_bau/f_ku/ku80095.htm';   */
risiko_link["Biologische Arbeitsstoffe"]='ga_bau/f_i/i12016.htm';
risiko_link["Brand und Explosion"]='ga_bau/f_bue/BuE9002.htm';
risiko_link["Elektrischer Strom"]='ga_bau/f_ea/ea5002.htm';
risiko_link["Elektromagnetische Felder"]='ga_bau/f_s/s13101.htm';
risiko_link["Erfasst und getroffen werden"]='ga_bau/f_eg/eg11000.htm';
risiko_link["Sturz ins Wasser"]='ga_bau/f_a/a1009.htm';
risiko_link["Gefahrstoffe"]='ga_bau/f_g/g6002.htm';
risiko_link["Hautgefährdung"]='ga_bau/f_all/all0096.htm';
risiko_link["Hitze, Klima"]='ga_bau/f_f/f17014.htm';
risiko_link["Infektionsgefahr"]='ga_bau/f_i/i12001.htm';
risiko_link["Körperliche Belastung"]='ga_bau/f_ku/ku8002.htm';
risiko_link["Lärm"]='ga_bau/f_l/l7001.htm';
risiko_link["Mängel in der Arbeitsorganisation"]='ga_bau/f_iop/iop0002.htm';
/*risiko_link["Mikroorganismen"]='ga_bau/f_g/gxx3.htm';   */
/*risiko_link["Motoremissionen"]='tr/trgs554/titel.htm';  */
risiko_link["Psychische Belastungen"]='ga_bau/f_all/all01034.htm';
risiko_link["Stäube"]='ga_bau/f_g/g6041.htm';
risiko_link["Spitze und scharfkantige Gegenstände"]='ga_bau/f_ssg/ssg14001.htm';
risiko_link["Stolpern, Rutschen, Stürzen"]='ga_bau/f_srs/srs20021.htm';
risiko_link["Strahlung"]='ga_bau/f_s/s13001.htm';
risiko_link["Ungeschützt bewegte Maschinenteile"]='ga_bau/f_ubm/ubm4002.htm';
risiko_link["Unkontrolliert bewegte Teile"]='ga_bau/f_ubt/ubt3002.htm';
risiko_link["unzureichende Beleuchtung"]='ga_bau/f_srs/srs2045.htm';
risiko_link["Vibration"]='ga_bau/f_vib/v10001.htm';

var anz1=0; // Anzahl der ausgegebenen Faktoren
var pfad_pos;
var pfad_nr;
var pp_merk=0;
var aenderungsliste='';

if (location.search.indexOf("?preview_")!=-1) flag_bearbeiten=1;

function ga_ausgeben(zeile, medium)
{
   if (zeile=="erglist" || zeile=="maengel" || zeile=="kontroll" || zeile=="risikobewertung") {
       inp11=parent.inp11;
       document.write('<form name="form_pre"><table width="640" id="t1"><tr><td bgcolor="#4F81BD" style="color:white" colspan="2" id="td1">');
       if (inp11[8]) document.write("<img src='"+repl_anf(inp11[8])+"' align='right' id='logo_id' />");
       if (zeile=="erglist") document.write('<h3>Ergebnisse der<br>Gefährdungsbeurteilung</h3><p>nach §§ 5 und 6 des Arbeitsschutzgesetzes</p>');
       if (zeile=="maengel") document.write('<h3>Handlungsbedarf</h3>');
       if (zeile=="kontroll") document.write('<h3>Kontrollliste</h3>');
       if (zeile=="risikobewertung") document.write('<h3>Liste sortiert nach Risikoabschätzung (rot, gelb, grün)</h3>');
       document.write('</td></tr>');
       if (medium=="monitor"){
           document.write('<tr><td width="320">Firma:</td><td><input size=35 name=1 value="'+repl_anf(inp11[1])+'"></td></tr>');
           document.write('<tr><td>Straße:</td><td><input size=35 name=9 value="'+repl_anf(inp11[9])+'"></td></tr>')
           document.write('<tr><td>PLZ/Ort:</td><td><input size=35 name=10 value="'+repl_anf(inp11[10])+'"></td></tr>')
           document.write('<tr><td>Arbeitsbereich / Baustelle / Objekt:</td><td><input size=35 name=2 value="'+repl_anf(inp11[2])+'"></td></tr>')
           document.write('<tr><td>Verantwortlicher /<br>Aufsichtsführender:</td><td><input size=35 name=7 value="'+repl_anf(inp11[7])+'"></td></tr>')
           document.write('<tr><td>Zeitraum der Arbeiten</td><td>vom <input size=10 name=3 value="'+repl_anf(inp11[3])+'"> bis <input size=10 name=4 value="'+repl_anf(inp11[4])+'"></td></tr>')
           document.write('<tr><td>bearbeitet von</td><td><input size=35 name=5 value="'+repl_anf(inp11[5])+'"></td></tr>')
           document.write('<tr><td>Bearbeitungsstand<br>Datum</td><td><input size=10 name=6 value="'+repl_anf(inp11[6])+'"></td></tr>')
       }
       else {
           document.write('<tr><td width="320">Firma:</td><td>'+repl_anf(inp11[1])+'</td></tr>');
           document.write('<tr><td>Straße:</td><td>'+repl_anf(inp11[9])+'</td></tr>');
           document.write('<tr><td>Plz/Ort:</td><td>'+repl_anf(inp11[10])+'</td></tr>');
           document.write('<tr><td>Arbeitsbereich / Baustelle / Objekt:</td><td>'+repl_anf(inp11[2])+'</td></tr>')
           document.write('<tr><td>Verantwortlicher /<br>Aufsichtsführender:</td><td>'+repl_anf(inp11[7])+'</td></tr>')
           document.write('<tr><td>Zeitraum der Arbeiten</td><td>vom '+repl_anf(inp11[3])+' bis '+repl_anf(inp11[4])+'</td></tr>')
           document.write('<tr><td>bearbeitet von</td><td>'+repl_anf(inp11[5])+'</td></tr>')
           document.write('<tr><td>Bearbeitungsstand<br>Datum</td><td>'+repl_anf(inp11[6])+'</td></tr>')
       }
      	
       document.write('</table></form><div id="aenderungen"></div><div style="page-break-after:always">&nbsp;</div>');
   }

   if (medium=="monitor") document.write('<form id="form_ga" name="form_ga">'); else document.write('<div id="form_ga">');

   if (zeile!="erglist" && zeile!="maengel" && zeile!="kontroll" && zeile!="risikobewertung"&& zeile!="kurzhh"&& zeile!="print"&& zeile!="clipbrd") {
   	   faktor_ausgeben(zeile, '', medium, faktortitel_suchen(zeile));
   }
   else if (zeile=="kurzhh") {
       document.write('<h2>Kurzhandlungshilfen</h2>');
       for(var i=0; i<struktur.length; i++) {
           var faktorname='f'+struktur[i].split("#")[0];
           var faktortitel=struktur[i].split("#")[3];
           if (struktur[i].split("#").length>=6) {
             	  var bausteinlink=struktur[i].split("#")[5];
           	}
           kurzhh_nur_zeilen=null;
           if (struktur[i].split("#").length>=7) {
               kurzhh_nur_zeilen=","+struktur[i].split("#")[6].split(",")+",";
           }
       	   faktor_ausgeben(faktorname, 'kurzhh', medium, faktortitel);
       }
   }
   else {
   	   // für die Funktion: "bei jedem Faktor den Pfad ausgeben" muss die Struktur in ein Array
       pfad_pos=new Array();
       pfad_nr=new Array();
       pfad_i=new Array();
       pfad_e3=new Array();
       var schon_ausgegebene_faktoren=new Array();
       
       var risiko_count=1; 
       if (zeile=="risikobewertung") risiko_count=3;
       
       for(j=risiko_count; j>=1; j--) { // Für Risiko-Liste: die Struktur 3x durchgehen. Sonst nur 1x durchgehen.

           var u1=0; u2=0, i1=0, i2=0, e3=0;
           for(var i=0; i<struktur.length; i++) {
           	    // offx soll die Position des ersten # in der strukturzeile enthalten. Normalerweise 4, außer bei eigenen Faktoren
           	    var offx=struktur[i].indexOf("#")+1;
           	    if (offx<4) offx=4;
           	    //       	           	    
           	    if (struktur[i].substring(offx,offx+2)=="##") ;
           	    else if (struktur[i].charAt(offx)=="#") {u2=i;i2++;}
           	    else {u1=i;i1++;i2=0;}
           	    	
                var s=struktur[i].split("#");
                if (s[0].charAt(0)=='\t') ;
                else if (s.length==5 && s[3]!="") e3++;
                else e3=0;
           	    	
           	    pfad_pos[struktur[i].substring(0,offx-1)]=u1*1000 + u2;
           	    pfad_nr[struktur[i].substring(0,offx-1)]=i1*1000 + i2;
           	    pfad_i[struktur[i].substring(0,offx-1)]=i;
           	    pfad_e3[struktur[i].substring(0,offx-1)]=e3;
           	    
           	    // NEU: Die Faktoren in der Reihenfolge ausgeben, wie in der Struktur.
           	    var faktorname='f'+struktur[i].split("#")[0];
           	    var faktortitel=struktur[i].split("#")[3];
           	    schon_ausgegebene_faktoren[faktorname]=1;
           	    if (zeile=="risikobewertung") faktor_ausgeben(faktorname, zeile+j, medium, faktortitel);
           	    else faktor_ausgeben(faktorname, zeile, medium, faktortitel);
           	    //
           	    }


          // NEU: jetzt die restlichen Faktoren ausgeben, die nicht in der Struktur sind.
           for (var i in parent.ga_daten) { 
           	  if (typeof schon_ausgegebene_faktoren[i]=="undefined") {
              	 if (zeile=="risikobewertung") {
               	    faktor_ausgeben(i, zeile+j, medium, '');
               	 }
               	 else
               	    faktor_ausgeben(i, zeile, medium, '');}
           }

       }
       
   	   
   	   if (anz1==0) {
   	   	   if (zeile=="erglist") document.write('Es wurden bislang keine Maßnahmen ausgewählt.');
   	   	   else document.write('Keine Einträge vorhanden.');
   	   	}
       if (aenderungsliste) document.getElementById("aenderungen").innerHTML='<p style="background-color:red;color:white;padding:2px">Hinweis auf ungültige Auswahlbögen:<br />'+aenderungsliste+
          '<br /><br />Nach Überprüfung der Maßnahmen können Sie die verbliebenen Hinweise <a href="javascript:hinweise_ausblenden()" style="color:white"><b>hier</b></a> endgültig löschen.</p>';
   	   }
   document.write('<div id="dropdown" style="position:absolute;visibility:hidden"></div>\r\n');
   document.write('<div id="umh_div" style="position:absolute;visibility:hidden;border:1px solid black;padding:5px;background-color:white;font-size:14px"></div>\r\n');
   if (medium=="monitor") document.write('</form>'); else document.write('</div>');
   if (zeile=="kontroll") document.write('<p><br><br>___________________________________<br>Datum und Unterschrift</p>');
}

function dropdown(x) 
{ 
	if (flag_tablet) return '';
   return '<a href="javascript:ondropdn('+(document.forms['form_ga'].length+x)+')">\
<img src="'+path+'grafik/dropdown.gif" border="0" style="position:relative;top:4px;left:0;" /><\/a>'; 
}

var massn_z=1;

function faktor_ausgeben(zeile, typ, medium, faktortitel)
{
   var erg='';
   var bereich_farbe='004B93', bereich_farbe_hell='7FA5C9';
   var f_preview=0;

   var ga;
   if (zeile.substring(0,8)!='preview_') {
      if (typeof parent.ga_daten[zeile]=="undefined") return;      // GA-Tabelle normal anzeigen
      ga=parent.ga_daten[zeile];
   }
   else {   // vorschaufunktion
   	  medium='print';  // Keine Eingabefelder anzeigen
   	  zeile=zeile.substring(8);
   	  if (zeile.charAt(0)!='f') {
   	      faktornr='f'+zeile;medium='print'; 
   	      faktortitel=faktortitel_suchen('f'+zeile);
   	      ga=parent.ga_daten[faktornr];
   	  }
   	  else {
   	  	ga=zeile;
   	  	faktortitel=faktortitel_suchen(zeile);
   	  }
   	  erg+='<div style="float:right;border:2px solid #004B93;padding:8px;margin-right:15px;font-weight:bold;font-size:16px;color:#004B93">Nur zur Ansicht</div>';
   	  bereich_farbe='B2C900'; bereich_farbe_hell='B2C900';
   	  f_preview=1;
   	  }

   if (ga==null) { document.write('<p>Faktor '+ zeile+ ' nicht gefunden.</p>'); return; }
   var g=ga.split("|");
   var dateiname=g[0];
   if (dateiname.substring(0,5)=="f_cl_") return;
   var checkboxen=new Array();
   if (g.length>1) checkboxen=g[1].split(",");
   // inputfelder=ab g[2]
   
   if (g.length<2 && typ!="") return;
   
   var nr=ga_dateien[dateiname];
   if (""+nr=="undefined" && dateiname.substring(dateiname.length-6)>0) nr=ga_dateien[dateiname.substring(0,dateiname.length-6)];
   if (""+nr=="undefined") { alert("Datei "+dateiname+ " nicht in faktoren.js enthalten."); return; }
   
   //if (fz==30) alert("Mehr als 30 Gefährdungsfaktoren können nicht angezeigt werden.");
   //if (fz>=30) return;

   if (dateiname.substring(0,6)=="f_org_")
   mass_txt='Basisprozesse und –maßnahmen auswählen,<br></b><small>die generell im Unternehmen zu regeln sind</small>';
   else
   mass_txt='Maßnahmen auswählen<br /></b><small>(nur die Maßnahmen auswählen, die für Ihre Arbeit relevant sind)</small><br /><br /><br /><br /><br /><br />';

   if (medium=="monitor") erg='<input type="hidden" name="zeile" value="'+zeile+'" />';
   if (anz1>=1) erg+='<div style="page-break-after:always"></div>';

   gef=gefahr[nr];
   i=gef.indexOf(": ");
   gef0=gef.substring(0,i)+": ";
   gef=gef.substring(i+2).split("; ");
   var risiko_drucktext='';
   for(i=0;i<gef.length;i++) {
       if (i>0) gef0+=';</span> ';
       gef0+=''+risikolink(gef[i]);
       if (""+risiko_txt[gef[i]]!="undefined") {
       	   gef0+='<span style="white-space:nowrap"> <a href="#" onclick="risiko(\''+gef[i]+'\',\''+zeile+'\');return false"><img src="'+path+'grafik/icon_r.jpg" alt="Mögliche Folgen" /></a>';
       	  risiko_drucktext+='<b>Mögliche Folgen – '+gef[i]+':</b> '+risiko_txt[gef[i]]+'<br>';
       	   }
       }
   if (i>0) gef0+='</span>';

   var m=massnahmen[nr];
   var nr_cb1=0;
   var nr_cb2=1;
   var nr_cb3=2;   
   var cb_z=3;
   var nr1=0;
   var nr2=1;
   var nr3=2;
   var nr4=3;
   var nr5=4;
   var nr6=5;
   var inp_z=6;
   var anz_input=(m.length)*6;
   var displ="";
   var aenderung='';
   
   for(var i=0; i<anz_input; i++) if (""+g[2+nr1+i]=="undefined") g[2+nr1+i]="";
   
   if (dateiname=="f_blanko") {
   	   for(var i=anz_input; i<anz_input+3; i++) if (""+g[2+nr1+i]=="undefined") g[2+nr1+i]="";
   	   
   	     // zur Kompatibilität mit alten GAs: Früher konnte man beim Leerformular einen Bereich/Tätigkeit eingeben. Wenn es dort einen Eintrag gibt, dann hier anzeigen:
   	   if (g[2+anz_input]) faktortitel+=/*titel[nr]=*/', Bereich/Tätigkeit:<br /><input type="text" size="50" style="width:600px" name="i'+(anz_input)+'" value="'+repl_anf(g[2+anz_input])+'" />';
   	   
   	   gef0='Gefährdung:<br /><input type="text" size="50" style="width:600px" name="i'+(anz_input+1)+'" value="'+repl_anf(g[2+anz_input+1])+'" />';
   	   fragen[nr]='Ziel/Frage:<br /><input type="text" size="50" style="width:710px" name="i'+(anz_input+2)+'" value="'+repl_anf(g[2+anz_input+2])+'" />';
   	   if (medium!="monitor") {titel[nr]=g[2+anz_input]; gef0=g[2+anz_input+1]; fragen[nr]=g[2+anz_input+2];}
   	   }

   if (typeof pfad_pos=="object") {
       var pp=pfad_pos[zeile.substring(1)];
       var pn=pfad_nr[zeile.substring(1)];
       var pi=pfad_i[zeile.substring(1)];
       var p_e3=pfad_e3[zeile.substring(1)];
       try{
           erg+='<p><b>'+/*<a href="javascript:toggle2('+Math.floor(pn/1000)+','+(pn%1000)+')">'+*/struktur[pp%1000].substring(5);//+'</a>';
           if (titel[nr].substring(0,19)=="Bereich/Tätigkeit:<") erg+=' > Gefährdungsfaktor (blanko)</b></p>';
           else erg+=' > <a href="javascript:go_ga('+p_e3+','+pi+',\''+dateiname+'\')">'+faktortitel/*titel[nr]*/+ ' <span class="vd" title="vollständigen Auswahlbogen aufrufen">&#x270E;</span></a></b></p>';
       }catch(e) { faktortitel=titel[nr]; /*erg+='<p><br>Der nachfolgende Auswahlbogen wurde in der Struktur gelöscht. Um ihn vollständig zu löschen, entfernen Sie alle Eingaben.</p>';*/ }
       pp_merk=pp;
       }   
   erg+='<h2 style="color:#'+bereich_farbe+'">'+ faktortitel+ /*titel[nr]+*/'</h2>\
<p>'+gef0+'</p>';
// erg+='<p>Letzte Änderung: '+(datum[nr]==""?"":(datum[nr].substring(4,6)+'.'+datum[nr].substring(2,4)+'.'+datum[nr].substring(0,2)))+'</p>';

   if (!f_preview) {
       erg+='<p class="vd" id="p_risiko'+zeile+'" style="display:none; border:1px solid black; padding:3px"></p>';
       if (risiko_drucktext) erg+='<p class="vb" style="border:1px solid black; padding:3px">'+risiko_drucktext+'</p>';
       var r=parent.risiko_daten[zeile];
       var r_col=new Array("ffffff","00ff00","ffff00","ff0000");
       erg+='<p style="font-size:13px"><a href="'+xpath+'ga_bau/risiko/betriebsrisiko.htm?'+zeile+'"><b>Risikoabsch&auml;tzung</b></a>';
       if (r!="undefined" && r>=1 && r<=7) erg+=': <span style="font-weight:bold;background-color:#'+r_col[r]+ (r==3?';color:white':'') +' ">&nbsp; &nbsp; '+" ABC".charAt(r)+' &nbsp; &nbsp;</span> '+risikoeinschaetzung_txt[r];
       erg+='</p>';
   }

   kopf='\
<table border="0" cellspacing="0" cellpadding="2" id="table_faktor">\
<tr id="fest2" bgcolor="#'+bereich_farbe_hell+'">\
<td rowspan="2" style="font-size:13px;color:white"><b>'+mass_txt+'</td>\
<td colspan="2" style="font-size:13px;color:white"><b>festgelegte Maßnahmen</b></td>\
<td colspan="2" style="font-size:13px;color:white"><b>Maßnahmen&nbsp;kontrollieren</b>&nbsp;</td>\
<td rowspan="2" style="font-size:13px;color:white">\
<img src="'+path+'grafik/bemerkungen.gif" width="18" height="94" alt="Bemerkungen" /></td>\
</tr>\
<tr id="fest2" bgcolor="#'+bereich_farbe_hell+'">\
<td style="font-size:13px;color:white">Umgesetzt<br /><br />\
<small>&nbsp;</small><br />\
<small>(evtl. unter <img border="0" width="10" height="10" src="'+path+'grafik/stern.gif" /> dokumen-<br />\
tieren)</small></td>\
<td style="font-size:13px;color:white">Handlungsbedarf<br />zur Umsetzung<br />\
<small>&nbsp;</small><br />\
<small>(unter <img border="0" width="10" height="10" src="'+path+'grafik/stern.gif" /> festlegen)&nbsp;</small>\
<br /><br />\
<b>Wer<br />\
Bis wann</b></span></td>\
<td style="font-size:13px;color:white">\
Durchführung/<br />\
Wirksamkeit\
<small>&nbsp;</small><br />\
<small>&nbsp;<br /><br /></small><br />\
<b>Wer<br />\
Bis wann</b></td>\
<td style="font-size:13px;color:white"><br />\
&nbsp;<br />\
<small>&nbsp;<br /><br /></small><br />\
<br />\
ok</td>\
</tr>\r\n';
   erg+='<h4>'+repl(fragen[nr])+'</h4>';

   warnflag_alteversion=0;
   if (parent.f_alte_version_geladen==1 && hinweis_neu[nr]) {
       erg+='<a name="fakt_'+dateiname+'"></a>';
       erg+='<p style="background-color:red;color:white;padding:2px">Hinweis auf überarbeitete Auswahlbögen: '+hinweis_neu[nr]+'</p>'; warnflag_alteversion=1; 
       aenderung='<a href="#fakt_'+dateiname+'" style="color:white">'+titel[nr]+'</a><br />';
       }

   erg+=kopf;
   //
   // Ausgabemdium: Monitor (mit Eingabefeldern)
   //   
   var ueberschrift1=ueberschrift2="";
   if (medium=="monitor") {
    var naechste_leerzeile='';
    for(var i1=0;i1<m.length;i1++) {
      var i=m[i1].substring(0,2)-0;         // Nummer der Maßnahme z.B. 01
      var ii=i*inp_z;
      var ic=i*cb_z;
      for(var j=i*6; j<i*6+6; j++) if (""+g[2+j]=="undefined") g[2+j]=""; // ggf. initialisieren

      massn=repl(m[i1].substring(3)); // Text der Maßnahme z.B. 'Sachkundige benennen'
      if (massn.charAt(0)=='$') ueberschrift1=massn.substring(1);
      if (massn.charAt(0)=='%') ueberschrift2=massn.substring(1);
      else if (massn.indexOf('•')==-1) ueberschrift2="";
      	
      var r=parent.risiko_daten[zeile];

   	  // festgelegt: nr_cb1  / umgesetzt:  nr_cb2  / kontrolle:  nr_cb3  // Handlungsbedarf nr2,nr3 / Kontrolle: nr4,nr5 / bemerk: nr6
   	  if (typ=="erglist" && (checkboxen[nr_cb1+ic]!="1"&&checkboxen[nr_cb2+ic]!="1"&&checkboxen[nr_cb3+ic]!="1"&&
   	     g[2+nr1+ii]==""&&g[2+nr2+ii]==""&&g[2+nr3+ii]==""&&g[2+nr4+ii]==""&&g[2+nr5+ii]==""&&g[2+nr6+ii]=="")) continue;
   	  if (typ=="maengel" && (  // nicht in Handlungsbedarf-Liste, wenn ...:
   	      (g[2+nr2+ii]==""&&g[2+nr3+ii]=="")&&  // Handlungsbedarf Name!="" oder Datum!=""
   	      (checkboxen[nr_cb1+ic]!="1"||checkboxen[nr_cb2+ic]=="1")&&  // festgelegt, nicht umgesetzt
   	      (g[2+nr6+ii]==""||checkboxen[nr_cb2+ic]=="1")  // bemerkung!="", nicht umgesetz, nicht OK
   	      )) continue;	  	
   	  if (typ=="kontroll" && g[2+nr4+ii]=="") continue;
   	  if ((typ=="risikobewertung1"||typ=="risikobewertung2"||typ=="risikobewertung3") && (  // nicht in Risikobewertung-Liste, wenn ...:
   	      (g[2+nr2+ii]==""&&g[2+nr3+ii]=="")&&  // Handlungsbedarf Name!="" oder Datum!=""
   	      (checkboxen[nr_cb1+ic]!="1"||checkboxen[nr_cb2+ic]=="1")  // festgelegt, nicht umgesetzt
   	      )) continue;	  	
   	  if (typ=="risikobewertung1" && (typeof r=="undefined" || r!=1)) continue; // Risikobewertung ist vergeben und rot
   	  if (typ=="risikobewertung2" && (typeof r=="undefined" || r!=2)) continue; // Risikobewertung ist vergeben und gelb
   	  if (typ=="risikobewertung3" && (typeof r=="undefined" || r!=3)) continue; // Risikobewertung ist vergeben und grün

      var f_geloescht=0;
      if (massn.indexOf("(Gelöscht)")!=-1) { f_geloescht=1; massn=massn.replace('(Gelöscht)', '<span style="background-color:#ff8888">(Gelöscht)</span>');  warnflag_alteversion=1; aenderungsliste+=aenderung; aenderung=''; }
      if (massn.indexOf("Hinweis_")!=-1) { f_geloescht=1; massn=massn.replace('Hinweis_', '<span style="background-color:#ff8888">Hinweis ')+'</span>';  warnflag_alteversion=1;  aenderungsliste+=aenderung; aenderung='';}
   	    if (f_geloescht && (typ==""||parent.f_alte_version_geladen==0)) { // Die Zeilen mit Hinweis_X nur in der Ergebnisliste anzeigen
   	  	    if ( massn.indexOf("Hinweis 4")!=-1) { // neu: hinweis_4 immer anzeigen; aber ohne Hinweistext
   	  	        f_geloescht=0; massn=massn.replace('<span style="background-color:#ff8888">','<span style="display:none">');
   	  	        }
   	  	    else continue;
   	  	   }

   	  anz1++;
   	  document.write(erg); erg='';

      if (typ=="erglist"&&parent.f_alte_version_geladen==1&&warnflag_alteversion && !parent.p_warnflag_alteversion) { alert("Diese Gefährdungsbeurteilung enthält Daten aus einer älteren Programmversion. Diese Daten sind in der Ergebnisliste rot gekennzeichnet."); parent.p_warnflag_alteversion=1;save_to_ls(); }

      f_blanko=0;
      if (i==0 || massn=="") displ="";
      if (massn=="") { 
           // Blanko-Maßnahme: Dann ein Eingabefeld anstelle der Maßnahme anzeigen
           massn='<input type="text" style="width:280px" size="26" name="i'+(nr1+ii)+'" value="'+repl_anf(g[2+nr1+ii])+'" />';
           f_blanko=1;
           // prüfen, ob diese Blanko-Maßnahme komplett leer ist
           if (checkboxen[nr_cb1+ic]!="1" && g[2+nr1+ii]=="" &&
               checkboxen[nr_cb2+ic]!="1" && g[2+nr2+ii]=="" &&
               g[2+nr3+ii]=="" && g[2+nr4+ii]=="" && g[2+nr5+ii]=="" &&
               checkboxen[nr_cb3+ic]!="1" && g[2+nr6+ii]=="") {
                 if (naechste_leerzeile=='') { naechste_leerzeile+='-'; }
                 else {naechste_leerzeile+=';'+massn_z; displ=' style="display:none"'; }
               }
           }
      if (ueberschrift1!="") {document.write('<tr><td bgcolor="#ecf1f7">'+ueberschrift1+'</td><td colspan="5" bgcolor="#ecf1f7">&nbsp;</td></tr>\r\n');ueberschrift1="";}
      if (ueberschrift2!="") {document.write('<tr><td>'+ueberschrift2+'</td><td colspan="5">&nbsp;</td></tr>\r\n');ueberschrift2="";}
      if (massn.charAt(0)=='%' || massn.charAt(0)=='$') ;
      else if (massn.substring(0,8)=='#weitere') {document.write('<tr><td><a href="javascript:weitere_an_aus('+massn_z+')">Weitere mögliche Prozesse und Maßnahmen</a></td><td colspan="5">&nbsp;</td></tr>\r\n');
        displ=' style="display:none"';}
      else
      document.write('\
<tr id="massn'+(massn_z++)+'"'+displ+'>\
<td><input type="checkbox" style="float:left" value="'+(nr_cb1+ic)+'" '+(checkboxen[nr_cb1+ic]=="1"?"checked":"")+' /><div style="margin-left:21px;margin-top:2px">'+massn+'</div></td>\
<td><input type="checkbox" value="'+(nr_cb2+ic)+'" '+(checkboxen[nr_cb2+ic]=="1"?"checked":"")+' /></td>\
<td><input type="text" size="15" name="i'+(nr2+ii)+'" value="'+repl_anf(g[2+nr2+ii])+'" /><br />\
<input size="10" type="text" name="i'+(nr3+ii)+'" value="'+repl_anf(g[2+nr3+ii])+'" />'+dropdown(3+f_blanko)+'</td>\
<td><input type="text" size="15" name="i'+(nr4+ii)+'" value="'+repl_anf(g[2+nr4+ii])+'" /><br />\
<input type="text" size="10" name="i'+(nr5+ii)+'" value="'+repl_anf(g[2+nr5+ii])+'" />'+dropdown(5+f_blanko)+'</td>\
<td><input type="checkbox" value="'+(nr_cb3+ic)+'" '+(checkboxen[nr_cb3+ic]=="1"?"checked":"")+' /></td>\
<td align="center"><a href="javascript:show_tr(\''+i1+zeile+'\')"><img border="0" width="19" height="21" src="'+path+'grafik/stern.gif" alt="Bemerkungsfeld anzeigen" /></a></td>\
</tr>\
<tr>\
<td colspan="6" id="tr'+i1+zeile+'" style="display:'+(g[2+nr6+ii]==""?"none":"")+'">\
<textarea rows="3" cols="80" name="i'+(nr6+ii)+'">' +g[2+nr6+ii]+ '</textarea>\
</td>\
</tr>\r\n');
      }
   document.write('</table>');
   if (typ==""&&naechste_leerzeile!=-1) document.write('<a href="javascript:plus(\''+naechste_leerzeile+'\')"><img src="'+path+'images/plus_bl.gif" border="0" width="13" height="11" title="Zeile einfügen" style="margin-top:5px" //></a>');
   }

   // 
   // Ausgabemedium: Drucker (ohne Eingabefelder)
   //   
   if (medium!="monitor") { 
     for(var i1=0;i1<m.length;i1++) {
      var i=m[i1].substring(0,2)-0;         // Nummer der Maßnahme z.B. 01
      var ii=i*inp_z;
      var ic=i*cb_z;
      for(var j=i*6; j<i*6+6; j++) if (""+g[2+j]=="undefined") g[2+j]=""; // ggf. initialisieren

      massn=repl(m[i1].substring(3)); // Text der Maßnahme z.B. 'Sachkundige benennen'

      var f_geloescht=0;
      if (massn.indexOf("(Gelöscht)")!=-1) { f_geloescht=1; }
      if (massn.indexOf("Hinweis_")!=-1) { f_geloescht=1; }
   	  if (f_geloescht && typ=="") {
   	  	    if ( massn.indexOf("Hinweis_4")!=-1) { // neu: hinweis_4 immer anzeigen; aber ohne Hinweistext
   	  	        f_geloescht=0; massn=massn.split('Hinweis_4:')[0];
   	  	        }
   	  	    else continue; 
   	  	    }

      if (massn.charAt(0)=='$') ueberschrift1=massn.substring(1);
      if (massn.charAt(0)=='%') ueberschrift2=massn.substring(1);
      else if (massn.indexOf('•')==-1) ueberschrift2="";

   	  // festgelegt: nr_cb1  / umgesetzt:  nr_cb2  / kontrolle:  nr_cb3  // Handlungsbedarf nr2,nr3 / Kontrolle: nr4,nr5 / bemerk: nr6
   	  if (typ=="erglist" && (checkboxen[nr_cb1+ic]!="1"&&checkboxen[nr_cb2+ic]!="1"&&checkboxen[nr_cb3+ic]!="1"&&
   	     g[2+nr1+ii]==""&&g[2+nr2+ii]==""&&g[2+nr3+ii]==""&&g[2+nr4+ii]==""&&g[2+nr5+ii]==""&&g[2+nr6+ii]=="")) continue;
   	  if (typ=="maengel" && (  // nicht in Handlungsbedarf-Liste, wenn ...:
   	      (g[2+nr2+ii]==""&&g[2+nr3+ii]=="")&&  // Handlungsbedarf Name!="" oder Datum!=""
   	      (checkboxen[nr_cb1+ic]!="1"||checkboxen[nr_cb2+ic]=="1")&&  // festgelegt, nicht umgesetzt
   	      (g[2+nr6+ii]==""||checkboxen[nr_cb2+ic]=="1")  // bemerkung!="", nicht umgesetz, nicht OK
   	      )) continue;	  	
   	  if (typ=="kontroll" && g[2+nr4+ii]=="") continue;
   	  if ((typ=="risikobewertung1"||typ=="risikobewertung2"||typ=="risikobewertung3") && (  // nicht in Risikobewertung-Liste, wenn ...:
   	      (g[2+nr2+ii]==""&&g[2+nr3+ii]=="")&&  // Handlungsbedarf Name!="" oder Datum!=""
   	      (checkboxen[nr_cb1+ic]!="1"||checkboxen[nr_cb2+ic]=="1")  // festgelegt, nicht umgesetzt
   	      )) continue;	  	
   	  if (typ=="risikobewertung1" && (typeof r=="undefined" || r!=1)) continue; // Risikobewertung ist vergeben und rot
   	  if (typ=="risikobewertung2" && (typeof r=="undefined" || r!=2)) continue; // Risikobewertung ist vergeben und gelb
   	  if (typ=="risikobewertung3" && (typeof r=="undefined" || r!=3)) continue; // Risikobewertung ist vergeben und grün

      var f_geloescht=0;
      if (massn.indexOf("(Gelöscht)")!=-1) { f_geloescht=1; massn=massn.replace('(Gelöscht)', '<span style="background-color:#ff8888">(Gelöscht)</span>');  warnflag_alteversion=1; aenderungsliste+=aenderung; aenderung=''; }
      if (massn.indexOf("Hinweis_")!=-1) { f_geloescht=1; massn=massn.replace('Hinweis_', '<span style="background-color:#ff8888">Hinweis ')+'</span>';  warnflag_alteversion=1;  aenderungsliste+=aenderung; aenderung='';}
   	    if (f_geloescht && (typ==""||parent.f_alte_version_geladen==0)) { // Die Zeilen mit Hinweis_X nur in der Ergebnisliste anzeigen
   	  	    if ( massn.indexOf("Hinweis 4")!=-1) { // neu: hinweis_4 immer anzeigen; aber ohne Hinweistext
   	  	        f_geloescht=0; massn=massn.replace('<span style="background-color:#ff8888">','<span style="display:none">');
   	  	        }
   	  	    else continue; 
   	  	   }

   	  anz1++;
   	  document.write(erg); erg='';   	

      i=m[i1].substring(0,2)-0;         // Nummer der Maßnahme z.B. 01
      f_blanko=0;

      if (massn=="") massn=g[2+nr1+ii];
    if (ueberschrift1!="") {document.write('<tr><td bgcolor="#ecf1f7">'+ueberschrift1+'</td><td colspan="5" bgcolor="#ecf1f7">&nbsp;</td></tr>\r\n');ueberschrift1="";}
      if (ueberschrift2!="") {document.write('<tr><td>'+ueberschrift2+'</td><td colspan="5">&nbsp;</td></tr>\r\n');ueberschrift2="";}
      if (massn.charAt(0)=='%' || massn.charAt(0)=='$') ;      
      else if (massn.substring(0,8)=='#weitere') document.write('<tr><td>Weitere mögliche Prozesse und Maßnahmen</td><td colspan="5">&nbsp;</td></tr>\r\n');
      else {
          document.write('\
<tr>\
<td><div style="float:left">'+img_cb(checkboxen[nr_cb1+ic])+'</div><div style="margin-left:23px;margin-top:2px;text-indent:-3px">'+massn+'</div></td>\
<td>'+img_cb(checkboxen[nr_cb2+ic])+'</td>\
<td>'+g[2+nr2+ii]+'<br />\
'+g[2+nr3+ii]+'</td>\
<td>'+g[2+nr4+ii]+'<br />\
'+g[2+nr5+ii]+'</td>\
<td>'+img_cb(checkboxen[nr_cb3+ic])+'</td>\
<td align="center"><img border="0" width="19" height="21" src="'+path+'grafik/stern.gif" alt="Bemerkungsfeld anzeigen" /></td>\
</tr>');
          if (g[2+nr6+ii]!="") document.write('\
<tr>\
<td colspan="6" id="tr'+i+'">\
<div style="margin-left: 20px;background-color:#e0f0ff;">' +g[2+nr6+ii].replace(/\n/g,"<br />")+ '</div>\
</td>\
</tr>\r\n');
          }
      }
    document.write('</table>');
    }
}

function show_tr(j)
{
if (document.getElementById('tr'+j).style.display=="none") document.getElementById('tr'+j).style.display="";
 else document.getElementById('tr'+j).style.display="none";
}

function img_cb(x)
{
   if (x=="1") return '<img src="'+path+'grafik/check1.gif" alt="X" hspace="3" vspace="3" align="left" />';
   else return '<img src="'+path+'grafik/check0.gif" alt="-" hspace="3" vspace="3" align="left" />';
}

//--------- dropdownmenü --------
var dropdown_flag=0;
function ondropdn(feldnr)
{
	 if (dropdown_flag!=0) {
	 	  document.getElementById("dropdown").style.visibility="hidden";
	 	  dropdown_flag=0;
	 	  return;
	 	  }
   d=new Date();
   m=d.getMonth()+1;
   y=d.getFullYear();
   s='<option>'+d.getDate()+'.'+(m)+'.'+y+'</option>';
   m+=1; if (m>=13) {m-=12;y++;}
   s+='<option>1.'+m+'.'+y+'</option>';
   m+=3; if (m>=13) {m-=12;y++;}
   s+='<option>1.'+m+'.'+y+'</option>';
   
   s='<select id="sel_dropdown" name="id_dropdown" size="3" onclick="dropdown_select(\''+feldnr+'\')">'+s;
   s+='</select>';   
   document.getElementById("dropdown").innerHTML=s;
   o=document.forms['form_ga'].elements[feldnr];
   x=0; y=o.offsetHeight; xs=80;//o.offsetWidth;
   while(o!=null) {
       x+=o.offsetLeft; y+=o.offsetTop;
       o=o.offsetParent;
     }
   x-=parseFloat(document.getElementById("content").offsetLeft);
   y-=parseFloat(document.getElementById("content").offsetTop);
   document.getElementById("dropdown").style.left=x+"px";
   document.getElementById("dropdown").style.top=y+"px";
   document.getElementById("sel_dropdown").style.width=xs+"px";
   document.getElementById("dropdown").style.visibility="visible";
   dropdown_flag=1;
}

function dropdown_select(feldnr)
{
	var i,t,o;
	
	i=document.form_ga.id_dropdown.selectedIndex;
	if (i!=-1) {
	    t=document.form_ga.id_dropdown.options[i].text;
	    if ((o=t.indexOf(" | "))!=-1) t=t.substring(0,o);
	    if (i>=0) document.forms['form_ga'].elements[feldnr].value=t;
        }
	ondropdn(feldnr);
}
//------------------------------------

parent.nicht_merken_flag=0;
// ============= 

txtpopup=new Array();
txtpopup[1]= 'umstürzen oder abrollen|Unter anderem darauf achten: <ul> <li>Hilfsmittel zum standsicheren Lagern (zum Beispiel Keile, Zwischenhölzer) verwenden, <li>auf tragfähigen Untergrund achten,  <li>Schutzbereiche (zum Beispiel bei Flüssiggaslagerung) und Sicherheitsabstände einhalten) </ul>  ';
txtpopup[2]= 'Abbrucharbeiten|Zu Maßnahmen bei Abbrucharbeiten gehören zum Beispiel:<br> <ul> <li>schriftliche Abbruchanweisung auf der Baustelle <li>Untersuchung des baulichen Zustandes, Konstruktionsanalyse<br> - Statik<br> - Art und Zustand der Bauteile und Baustoffe<br> - Art und Lage von Ver- und Entsorgungsleitungen<br> <li>Unterhöhlen oder Einschlitzen von Bauwerksteilen verbieten </ul> <br>  ';
txtpopup[3]= 'Montagearbeiten|Zu Maßnahmen bei Montagearbeiten gehören zum Beispiel:<br> <ul> <li>schriftliche Montageanweisung für die Baustelle<br> - Gewicht <br>- Lage der Anschlagpunkte (Transportlage beachten) <br>- Reihenfolge der Montage<br>- Hilfskonstruktionen (zum Beispiel Abspannungen, Aussteifungen) <li>Befestigungsmöglichkeiten für Seitenschutzbauteile an Absturzkanten <li>Verankerungen für Standgerüste <li>Befestigungsmöglichkeiten für Auffangnetze <li>ebene, befestigte Untergründe schaffen (Einsatz von Gerüsten) <li>Anschlagpunkte für Anseilschutz (nur für kurzfristige Arbeiten) </li> <br> Praxishilfen der INQA-Bauen-Partner';
txtpopup[4]= 'Ersten Hilfe-Maßnahmen|Zu erforderlichen Erste-Hilfe-Maßnahmen gehört zum Beispiel:<br> <ul> <li>Ersthelfer in ausreichender Anzahl <li>Aushang Anleitung zur Ersten Hilfe <li>Erste Hilfe Material (Verbandkasten) </ul> Bei großen Baustellen: <ul> <li>Notfallplan (Rettungsübungen anordnen)          <li>Flucht- und Rettungswege kennzeichnen <li>Anweisung, Flucht- und Rettungswege freizuhalten <li>Notbeleuchtung <li>Meldeeinrichtung <li>Rettungsgeräte und Transportmittel <li>Sanitätsraum </ul>  ';
txtpopup[5]= 'Brandschutz-Maßnahmen|Zu notwendigen Brandschutz-Maßnahmen gehört zum Beispiel:<br> <ul> <li>Feuerlöscheinrichtungen/Feuer­löscher in ausreichender Anzahl einplanen </ul> Bei größeren Baustellen:<br> <ul> <li>Brandschutzordnung <li>Absprache mit Brandschutzbeauftragten <li>Flucht- und Rettungsplan <li>Unterweisung der Mitarbeiter im Umgang mit Feuerlöschern organisieren </ul>  ';
txtpopup[6]= 'Verträgen mit den Nachunternehmern|Vereinbart sind unter anderem: <ul> <li>Nachunternehmer auf Qualitäts- und Sicherheitsstandards (inklusive Vorschriften und Regeln zum Arbeitsschutz) verpflichtet  <li>die Leistungen sind eindeutig beschrieben und quantifiziert  <li>die Anforderungen an die Befähigungen der Beschäftigten des Nachunternehmers <li>die Nutzung der vorhandenen sicherheitstechnischen Einrichtungen (Gerüste, Bauaufzüge, Hebezeuge, Sanitäreinrichtungen usw.) <li>Weisungsbefugnisse und Informationen über Koordinator </ul>  ';
txtpopup[7]= 'Maßnahmen des Arbeitsschutzes|Mindestens folgende Maßnahmen dokumentieren: <ul> <li>Pflichtenübertragungen <li>Ergebnisse der Gefährdungsbeurteilungen <li>Durchgeführte Unterweisungen <li>Arbeitsanweisungen <li>Eingesetzte Betriebsanweisungen <li>Durchgeführte Prüfungen und Wartungen <li>Anzeigen und Genehmigungen <li>Notwendige und durchgeführte arbeitsmedizinische Vorsorgeuntersuchungen  <li>Gefahrstoffverzeichnis </ul>  ';
txtpopup[8]= 'Vorerkundung|Erkundet wurde zum Beispiel: <ul> <li>Baugrund <li>Gewässer <li>Altlasten <li>Hochspannungs-, Erdleitungen, Sendeanlagen <li>Zufahrten und Fläche für Baustelleneinrichtungen <li>Parkmöglichkeiten <li>Gefährdung durch/von Nachbarobjekte(n) <li>Lärmschutz der Nachbarn </ul>  ';
txtpopup[9]= 'Vorerkundung|Bei der Vorerkundung wird unter anderem  untersucht: <ul> <li>Baugrund <li>Gewässer <li>Altlasten <li>biologische Belastungen (zum Beispiel Taubenkot) <li>Hochspannungs-, Erdleitungen, Sendeanlagen <li>Zufahrten und Fläche für Baustelleneinrichtungen <li>Parkmöglichkeiten <li>Gefährdung durch/von Nachbarobjekte(n) <li>Lärmschutz der Nachbarn <li>Bauliche Gegebenheit <li>Vorhandene Maschinen bzw. Betriebsmittel im Objekt </ul>  ';
txtpopup[10]='Maßnahmen|Unter anderem können folgende Gefährdungen durch bauliche Zustände auftreten, bei denen spezielle Maßnahmen festzulegen sind: <ul> <li>elektrische Freileitungen <li>Rohrleitungen, Schächte, Kanäle <li>Anlagen mit Explosionsgefahren <li>maschinelle Anlagen <li>Kran- und Förderanlagen <li>nicht begehbare Flächen (Wellplatten, Lichtplatten)  <li>Straßen- und Schienenverkehr <li>Anzeigen über Umgang mit bestimmten Stoffen (zum Beispiel Asbest) </ul>  ';
txtpopup[12]='Baustelleneinrichtungsplan|Im Baustelleinrichtungsplan wird unter anderem berücksichtigt: <ul> <li>Transportabläufe <li>Zeitpunkte der Anlieferung (keine langen Warte- und Lagerzeiten) <li>Lagerflächen <li>innerbetrieblicher Transport (zum Beispiel Krankoordination, Personenaufnahmemittel, Bauaufzüge, Sicherheitsabstände für Fahrzeuge <li>Standorte für Hebezeuge, Silos und andere Einrichtungen <li>Sicherheitsabstände für Fahrzeuge  <li>Sicherer Zugang zur Baustelle und sichere Verkehrswege  <li>Werkstattbereich (Gerätewartung und -reparatur) <li>Stromversorgung <li>Beleuchtung <li>Tagesunterkünfte, Waschräume, Toiletteneinrichtungen, Schlafunterkünfte auf der Baustelle <li>Notfalleinrichtungen </ul>   ';
txtpopup[13]='Einrichtungen und Geräte|zum Beispiel: <ul> <li>Absturzsicherungen (zum Beispiel Seitenschutz, Abdeckungen, Gerüste,) <li>Hebezeuge, Hubarbeitsbühnen, Personenaufnahmemittel <li>Lärmgeminderte Geräte und Maschinen <li>Geräte und Maschinen mit Staubabsaugung <li>Vibrationsarme Handmaschinen und Baumaschinen </ul>';
txtpopup[14]='xxx';
txtpopup[15]='yyy';
txtpopup[16]='zzz';

function popup(nr)
{                 
	t=txtpopup[nr].split("|");
  x=window.open("","","status=no,scrollbars=yes,width=340,height=300,top=100");
  x.document.write('<!-- saved from url=(0014)about:internet -->\r\n<html><head>\r\n<title>'+t[0]+'</title>\r\n<link rel="stylesheet" type="text/css" href="'+path+'../daten.css"></head><body style="margin:10px;overflow:auto">');
  x.document.write(t[1]);
//  x.document.write('<p><a href="#" onClick="window.close()">Fenster schließen</a></body></html>');
  x.document.write('</body></html>');
}

umh_div_flag=0;
function umh(x, obj)
{
   h='<ul style="margin-top:0;margin-bottom:0">';
   x=x.split("_");
   for(i=0;i<x.length;i++){
       if (x[i]!="") {
           xx=um[x[i]-0].split("#");
       	   h+="<li>"+xx[0];
   	   links=xx[1].split(";");
   	   for(j=0;j<links.length;j++){
   	      if (links[j].indexOf(".htm")!=-1) h+=' <a href="'+path+"ga/"+links[j]+'">HTM</a>';
   	      if (links[j].indexOf(".doc")!=-1) h+=' <a href="'+path+"ga/"+links[j]+'">DOC</a>';
   	      if (links[j].indexOf(".pdf")!=-1) h+=' <a href="'+path+"ga/"+links[j]+'">PDF</a>';
   	      }
   	   h+="</li>";
   	   }
      }
   obj.innerHTML="<a href=\"#\">Umsetzungshilfen:</a><br>"+h+"</ul>";
}

function weitere_an_aus(z)
{
   x=document.getElementById("massn"+z);
   if (x.style.display=="none") d="block"; else d="none";
   do {
   	document.getElementById("massn"+z).style.display=d;
   	z++;
   } while (document.getElementById("massn"+z).style.display!="");
}

var gef_merk=-1;

function risiko(gef,zeile)
{
   r=""+risiko_txt[gef];
   if (r=="undefined") r="(Keine Erläuterung vorhanden)";
   if (gef==gef_merk && document.getElementById("p_risiko"+zeile).style.display!="none") { document.getElementById("p_risiko"+zeile).style.display="none"; return; }
   gef_merk=gef;
   document.getElementById("p_risiko"+zeile).innerHTML='<b style="color:white;background-color:red"><a href="moegliche_folgen.htm" style="color:white">Mögliche Folgen</a> – '+gef+':</b> '+r;
   document.getElementById("p_risiko"+zeile).style.display="block";
}

function risikolink(gef)
{
   if (gef.charAt(0)=="*") gef=gef.substring(1);
   r=""+risiko_link[gef];
   if (r=="undefined") return gef;
   else return '<a href="'+xpath+r+'">'+gef+'</a>';
}

function repl(x)
{
	x=x.replace(/img src="\.\./g, 'img src="'+path);
	return x.replace(/a href="\.\.\//g, 'a href="'+path);
}

function umbrueche_einfuegen()
{
/*
   kopf1=document.getElementsByTagName("table")[1].getElementsByTagName("tr")[0];
   kopf2=document.getElementsByTagName("table")[1].getElementsByTagName("tr")[1];
   var kopf_height=kopf1.offsetHeight+kopf2.offsetHeight;
   kopf_height=0;
   var kopfadd=0;
   var y_pos=new Array();
   var tr_merk=new Array();
   var tabs_merk=new Array();
   var sub=0;

   tabs=document.getElementsByTagName("table");
   var e="";
   for(var i=0; i<tabs.length; i++) {
       var y1=tabs[i].offsetTop-0;
       tr=tabs[i].getElementsByTagName("tr");
   	   for(var j=0; j<tr.length; j++) {
   	       var ypos=y1+tr[j].offsetTop+tr[j].offsetHeight -sub;
   	       //tr[j].getElementsByTagName("td")[0].innerHTML="tabnr="+i+";ypos="+j+";sub="+sub+";"+ypos+tr[j].getElementsByTagName("td")[0].innerHTML;
   	       if (tr[j].getElementsByTagName("td").length>1)
   	       tr[j].getElementsByTagName("td")[1].innerHTML=tr[j].getElementsByTagName("td")[1].innerHTML+ypos;
   	       
   	       // passt diese Zeile nicht mehr drauf? Dann Seitenumbruch einfügen
   	       if (ypos>904 &&j>2) { tr_merk.push(tr[j-1]); kopfadd+=kopf_height; sub=y1+tr[j-1].offsetTop+tr[j-1].offsetHeight-kopfadd; }
   	       else if (ypos>904 &&j<=2) { tabs[i].pageBreakBefore="always"; sub=tabs[i].offsetTop-kopfadd; } 
   	       
   	       // wenn Tabelle fest ganz unten aufhört->Seitenumbruch einfügen
           else if (ypos>650 && j==tr.length-1) {tabs_merk.push(tabs[i]); sub=tabs[i].offsetTop+tabs[i].offsetHeight-kopfadd; } 
   	    }
       if (i==0) sub=ypos;
   	}
 
  	for(i=0;i<tr_merk.length;i++){
   	    var neuTR = kopf1.cloneNode(true);
   	    var neuTR2 = kopf2.cloneNode(true);
   	    tr_merk[i].style.backgroundColor="yellow";
   	    tr_merk[i].style.pageBreakAfter="always";
   	    //tr_merk[i].appendChild(neuTR);
   	    //tr_merk[i].appendChild(neuTR2);   	    
   	    }
   	for(i=0;i<tabs_merk.length;i++){
   	    tabs_merk[i].style.pageBreakAfter="always";
   	    }
   	//alert(e);
   	*/
}

function skalieren(skl_wdh)
{
   var q=document.getElementById('logo_id');
   if (q && q.width>250) q.width="250";
   skl_wdh--;
   setTimeout("skalieren(3);", 100);
}

function plus(x)
{
   x=x.split(";");
   for(var i=1; i<x.length; i++) {
       if (document.getElementById("massn"+x[i]).style.display=="none")
           { document.getElementById("massn"+x[i]).style.display=""; return; }
       }
   alert("In diesem Formular sind keine weiteren Freizeilen möglich.");
}

setTimeout("skalieren(3);", 100);

function hinweise_ausblenden()
{
	parent.version_datum_merk='';
  parent.f_alte_version_geladen=0;save_to_ls();
	go_href('ga/ga.htm?erglist');
}

//
// Faktortitel in struktur suchen
//
function faktortitel_suchen(zeile)
{
	if (zeile.substring(0,8)=='preview_') zeile=zeile.substring(8);

    for(var i=0; i<struktur.length; i++) {
    	var s=struktur[i].split("#");
    	if ("f"+s[0]==zeile || s[4]==zeile) return s[3];
    }
// nicht gefunden-> in Gesamt-Struktur suchen
   var struktur_orig=struktur1["alles"];//parent.struktur_alles_merk;
   // Neu 25.5.24 / für Offlineversion:
    if (!struktur_orig) struktur_orig=parent.struktur_alles_merk;
   //
   struktur_orig=struktur_orig.split("\n");
    for(var i=0; i<struktur_orig.length; i++) {
    	var s=struktur_orig[i].split("#");
    	if (s[4]==zeile) return s[3];
    }

    return '';// Faktortitel nicht gefunden
}       	
