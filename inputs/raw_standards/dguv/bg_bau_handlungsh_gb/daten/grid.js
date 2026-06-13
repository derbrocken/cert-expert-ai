var readonly=0;
var anz_zeilen=new Array();
var anz_spalten=new Array();
var akt_zeile=new Array();

var typmerk=new Array();
var breitemerk=new Array();

function grid_keydown()
{
  // Funktion: mit hoch/runter zwischen den Eingabefeldern springen 
  
  if (document.activeElement.id &&
      document.activeElement.tagName.toLowerCase()=="div" &&
      document.activeElement.getAttribute("contenteditable")=="true") {
    //if (Tastencode==13) {var sel = document.selection.createRange();sel.pasteHTML('<p>');}
    if (Tastencode==38 || Tastencode==40 ||Tastencode==37 || Tastencode==39) {
     var id=document.activeElement.id;

     if ( (Tastencode==37 || Tastencode==39) && document.selection.createRange().text=="" && document.activeElement.innerHTML!="") return;

     var grid_id=id.split("_")[0];
     var x=id.split("_")[2];
     var y=id.split("_")[1];

     var obj=document.getElementById(grid_id+"_"+y+"_"+x);
     if (Tastencode==38 && y>1) y--;				// Cursor hoch
     if (Tastencode==40 && y<anz_zeilen[grid_id]-1) y++;		// Cursor runter
     if (Tastencode==37 && x>1) x--;				// Cursor links
     if (Tastencode==39 && x<anz_spalten[grid_id]) x++;		// Cursor rechts
     var obj=document.getElementById(grid_id+"_"+y+"_"+x);
     if (obj.getAttribute("contenteditable")!="true") return;
     obj.focus();
     var range = document.body.createTextRange ();
     range.moveToElementText (obj);
     range.select ();
     zeile_markieren(grid_id, y);
     return false;
     }
   }
}

function minus(grid_id)
{
   var typen=typmerk[grid_id].split(",");           // typ: 'c'=checkbox', 't'=Text oder fester Text
   if (akt_zeile[grid_id]==0) return;

   // die Zellinhalte nach oben verschieben, so dass die aktuelle Zeile gelöscht wird.
   if (akt_zeile[grid_id]>0) {
     for(var y=akt_zeile[grid_id]-0; y<anz_zeilen[grid_id]-1; y++) 
       for(var x=1;x<=anz_spalten[grid_id];x++) {
           var wert=hole_zelle(y-0+1, x, typen[x-1], grid_id);
           setze_zelle(y,x, wert, typen[x-1], grid_id);
           }
     }

   // die letzte Zeile aus der Tabelle löschen
   var tblBody = document.getElementById("grid"+grid_id).tBodies[0];
   if (tblBody.rows.length<2) return;
   tblBody.deleteRow(tblBody.rows.length-1);

   // Anzahl der Zeilen um 1 verringern
   anz_zeilen[grid_id]--;
}

var spalten_namen_a=new Array();

function plus(grid_id)
{
   var breiten=breitemerk[grid_id].split(",");      // Spaltenbreiten in Pixeln
   var typen=typmerk[grid_id].split(",");           // typ: 'c'=checkbox', 't'=Text oder fester Text (fester Text beginnt mit '{--}'  )

   // Eine Zeile unten anfügen, ohne Inhalt.
   var row=document.getElementById("grid"+grid_id).insertRow();
   var y=anz_zeilen[grid_id];
   for(var x=1; x<=anz_spalten[grid_id]; x++) {
   	   if (grid_id=='a' && x==9) row=document.getElementById("grid"+grid_id).insertRow();
   	   var txt='';
   	   if (grid_id=='a') txt='<span style="color:#808080">'+spalten_namen_a[x-1]+'</span><br />';
       var cell = row.insertCell(); 
       cell.innerHTML=txt+zelle_einfuegen(y, x, '', typen[x-1], breiten[x-1], grid_id);
       }
       
   // Anzahl der Zeilen um 1 erhöhen
   anz_zeilen[grid_id]++;

   // Zellinhalte verschieben, so dass alles ab der aktuellen Zeile eine Zeile nach unten verschoben wird
   if (akt_zeile[grid_id]>0) {
     for(var y=anz_zeilen[grid_id]-1;y>(akt_zeile[grid_id]-0+1);y--) {
       for(var x=1;x<=anz_spalten[grid_id];x++) {
           var wert=hole_zelle(y-1, x, typen[x-1], grid_id);
           setze_zelle(y, x, wert, typen[x-1], grid_id);
           }
       }

   // die aktuelle Zeile löschen
     for(var x=1;x<=anz_spalten[grid_id];x++)  {
         setze_zelle(y, x, '', typen[x-1], grid_id);
         }
         //document.getElementById(grid_id+'_'+y+'_'+x).innerHTML='';
     }
}

function hole_zelle(y, x, typ, grid_id) 
{ 
   if (typ=='c') return document.getElementById(grid_id+'_'+y+'_'+x).checked?'on':'';
   else {
       var wert=document.getElementById(grid_id+'_'+y+'_'+x).innerHTML;
       //alert(document.getElementById(grid_id+'_'+y+'_'+x).getAttribute("contenteditable"));
       if (document.getElementById(grid_id+'_'+y+'_'+x).getAttribute("contenteditable")=="true") return wert;
       else return '{--}'+wert;
       }
}

function setze_zelle(y, x, wert, typ, grid_id)
{
   if (typ=='c') document.getElementById(grid_id+'_'+y+'_'+x).checked=wert?true:false;
   else {
      if (wert.substring(0,4)=='{--}') {
          var div=document.getElementById(grid_id+'_'+y+'_'+x);
          div.style.backgroundColor="transparent";
          div.style.borderWidth="0";
          div.setAttribute("contenteditable", "false", 0);
          div.innerHTML=wert.substring(4);
          }
      else {
          var div=document.getElementById(grid_id+'_'+y+'_'+x);
          div.style.backgroundColor="white";
          div.style.borderWidth="1px";
          if (!readonly) div.setAttribute("contenteditable", "true", 0); else div.setAttribute("contenteditable", "false", 0);
          div.innerHTML=wert;
          }
      }
}

var dropdown_auswahl=new Array();

function zelle_einfuegen(y, x, w, typ, breite, grid_id)
{
   if (typ=='c')
       // Typ 'c': Checkbox
       return '<span style="display:block;width:'+(breite-0+1)+'px"><input type="checkbox" id="'+grid_id+'_'+y+'_'+x+'" '+(w?'checked="checked"':'')+' /></span>';
   else if (w.substring(0,4)=='{--}') {
   	   // Typ 't' mit Kennung '{--}': nicht änderbares Textfeld

   	    // bugfix: </a> ist manchmal verunstaltet(?)
   	   w=w.replace(/\&lt\;.\/A\&gt\;/ig,"</a>");
   	    // ende bugfix
   	   
       return '<div id="'+grid_id+'_'+y+'_'+x+'" style="background:transparent;border:0;width:'+breite+'px">'+w.substring(4)+'</div>';
       }
   else {
       // Typ 't', Texteingabefeld mit Dropdownmenü?
       if (typeof dropdown_auswahl[grid_id+x]!="undefined" && readonly==0)
            return '<div contenteditable="true" id="'+grid_id+'_'+y+'_'+x+'" style="float:left;min-height:1.25em;width:'+(breite-18)+'px;margin-right:0px">'+w+'</div>\
                    <a href="javascript:ondropdown(\''+grid_id+'_'+y+'_'+x+'\',\''+dropdown_auswahl[grid_id+x]+'\')"><img src="'+path+'images/dropdown.gif" border="0" width="14" height="18" style="margin-right:4px" /></a>';
       // Typ 't', ohne Dropdownmenü (=normales Texteingabefeld)
       else {
            var on='';
            if (grid_id=='f' && x==5) on=' onblur="alert_flag=0;return plausi_datum(this)"';
            return '<div '+(readonly==0?'contenteditable="true"':'')+' id="'+grid_id+'_'+y+'_'+x+'" style="float:left;min-height:1.25em;width:'+breite+'px;margin-right:0px"'+on+'>'+w+'</div>';
            }
       }
}

//
// Grid mit document.write() anzeigen.
// Parameter:
//  grid_id: z.B. 'c' für c_gum.htm Gewerke/Mitarbeiter.
//  spalten_namen: Spalten-Überschriften z.B. "Gewerk#Name, Vorname#Personal-Nr.#.."
//  spalten_breiten: Spalten-Breiten in px z.B. "142,118,95,13"
//  spalten_typen: c=checkbox t=text d=datum
//
var unload_grid_id=new Array();

function grid_anzeigen(grid_id, spalten_namen, spalten_breiten, spalten_typen)
{
   unload_grid_id.push(grid_id);
   var grid_typ=1; // Grid-Typ1: mit Scrollbox, 790px breit und CSV Import, Export
   grid_typ=0; // Grid-Typ0: eingebettet
      
   if (grid_id=='a') {grid_typ=2;} // Grid-Typ2: 2zeilig
   spalten_namen_a=spalten_namen.split("#");

   typmerk[grid_id]=spalten_typen;
   breitemerk[grid_id]=spalten_breiten;

   spalten_namen=spalten_namen.split("#");
   spalten_breiten=spalten_breiten.split(",");
   spalten_typen=spalten_typen.split(",");
   
   anz_spalten[grid_id]=spalten_namen.length;

   // herausfinden, welche Datenbank benutzt werden soll: parent.bericht oder parent.baustelle
   var db=parent.mitarbeiter_db;
  
   // Tabellen-Kopf ausgeben
   if (grid_typ==1) document.write('<form name="form" style="margin:0">');
   if (grid_typ!=2) {
      document.write('<table border="0" cellpadding="1" cellspacing="0" class="mygrid"><tr id="kopf_'+grid_id+'">');
      for(var x=1; x<=anz_spalten[grid_id]; x++) {
           if (spalten_namen[x-1]=='') document.write('<th style="width:'+(spalten_breiten[x-1]-0+2)+'px"></th>');
           else document.write('<th style="width:'+(spalten_breiten[x-1]-0+2)+'px">'+spalten_namen[x-1]+' <a href="javascript:sort('+x+',\''+grid_id+'\')" title="Sortieren">&dArr;</a></th>');
       }
      document.write('</table>');
   }
//   var kopf_ys=document.getElementById("kopf_"+grid_id).offsetHeight;
//   if (datei_name=="y_stundenerfassung.htm") kopf_ys+=78;
   
   // Tabellen-Inhalt ausgeben - ggf. mit Scrollbar
   if (grid_typ==1) document.write('<div id="scrollbox" style="background-color:#ECF1F7;overflow:auto;width:790px;height:'+(getClientHeight()-350-kopf_ys)+'px" onclick="grid_onclick(event)">');
   else document.write('<div style="margin-bottom:10px" onclick="grid_onclick(event)">');
   document.write('<table border="0" cellpadding="1" cellspacing="0" id="grid'+grid_id+'" class="mygrid" onclick="grid_onclick(event)"><tr>');

   var leerzeilen=1;
   if (grid_typ==1) leerzeilen=5;
   
   for(var y=1; y<300 && leerzeilen>0; y++) {
        document.write('<tr>');//<th style="background-color:#eeeeee">&nbsp;</th>');
        if (grid_typ==2) document.write('<td>&nbsp;</td></tr><tr>');
        var anz_undef=0;
        for(var x=1; x<=anz_spalten[grid_id]; x++) {
           var w='';
           if (typeof db[grid_id+y+'_'+x]!="undefined") w=db[grid_id+y+'_'+x]; else anz_undef++;
           if (grid_id=='a' && x==9) document.write('</tr><tr>');
           document.write('<td>');
           if (grid_typ==2) {
              document.write('<span style="color:#808080">'+spalten_namen[x-1]+'</span>');
              if (y==1) document.write(' <a href="javascript:sort('+x+',\''+grid_id+'\')" title="Sortieren">&dArr;</a>');
              document.write("<br />");
           }
           document.write(zelle_einfuegen(y, x, w, spalten_typen[x-1], spalten_breiten[x-1], grid_id)+'</td>');
           //document.write('<td>+zelle_einfuegen('+y+','+x+','+w+','+spalten_typen[x-1]+','+spalten_breiten[x-1]+','+grid_id+')</td>');
           }
        if (anz_undef==anz_spalten[grid_id]) leerzeilen--;
        document.write('</tr>');
        }
   anz_zeilen[grid_id]=y;
   document.write('</table>');

   if (grid_typ==0||grid_typ==2) document.write('\
   </div><p style="margin:0;padding:0"><a href="javascript:plus(\''+grid_id+'\')"><img src="'+path+'images/plus_bl.gif" border="0" width="13" height="11" title="Zeile einfügen" /></a> | \
   <a href="javascript:minus(\''+grid_id+'\')"><img src="'+path+'images/minus_bl.gif" border="0" width="13" height="11" title="Zeile löschen" /></a>');
   if (grid_typ==1) document.write('\
   <br /></div><p style="margin-bottom:10px;margin-top:10px"><a href="javascript:plus(\''+grid_id+'\')"><img src="'+path+'images/plus_bl.gif" border="0" width="13" height="11" /> Zeile einfügen</a> | \
   <a href="javascript:minus(\''+grid_id+'\')"><img src="'+path+'images/minus_bl.gif" border="0" width="13" height="11" /> Zeile löschen</a>');
   
   if (grid_typ==1 || grid_id=='p')document.write(' CSV: \
   <a href="javascript:csv_export(\''+grid_id+'\')">Export</a>  \
   <a href="javascript:csv_import(\''+grid_id+'\',0)">Import</a>  \
   <a href="javascript:csv_import(\''+grid_id+'\',1)">Anfügen</a> | \
   <a href="javascript:form_reset(1,\''+grid_id+'\')">Alles löschen</a></p> \
   \
   </form>\
   <form name="form_csv" style="display:none"><textarea name="csv"></textarea><input type="text" name="status" /></form>');
}

function grid_onclick(ev)
{
   var targ;
   if (!ev) ev = window.event;
   if (ev.target) targ = ev.target;
   else if (ev.srcElement) targ = ev.srcElement;
   if (targ.nodeType == 3) // defeat Safari bug
	    targ = targ.parentNode;
   var t_id=targ.id;
   if (!t_id) return;
   var t=t_id.split("_");
   if (t.length!=3) {zeile_markieren(grid_id_merk, -1); return;}
   var grid_id=t[0];
   
   zeile_markieren(grid_id, t[1]);
}

var grid_id_merk;
function zeile_markieren(grid_id, y)   
{
   grid_id_merk=grid_id;
   if (akt_zeile[grid_id] && akt_zeile[grid_id]!=-1)
   
   // bisherige Markierung löschen
   try{ // mit try..catch weil es sein kann, dass die Zeile mit der bisherigen Markierung bereits gelöscht wurde
   for(var x=1; x<=anz_spalten[grid_id]; x++) 
       if (document.getElementById(grid_id+'_'+akt_zeile[grid_id]+'_'+x).getAttribute("contenteditable")=="true")
           document.getElementById(grid_id+'_'+akt_zeile[grid_id]+'_'+x).style.backgroundColor="";
   }catch(e){}
    
   akt_zeile[grid_id]=y;
   if (y!=-1) for(var x=1; x<=anz_spalten[grid_id]; x++)
       if (document.getElementById(grid_id+'_'+akt_zeile[grid_id]+'_'+x).getAttribute("contenteditable")=="true")
           document.getElementById(grid_id+'_'+y+'_'+x).style.backgroundColor="#f2f2f2";
}

function grid_unload(grid_id)
{
   var db=parent.mitarbeiter_db;

   var spalten_typen=typmerk[grid_id].split(",");
   var y1=1;

   for(var y=1; y<anz_zeilen[grid_id]; y++) {
        var values=new Array();
        var flag=0;
        for(var x=1; x<=anz_spalten[grid_id]; x++) {
           values[x]=hole_zelle(y, x, spalten_typen[x-1], grid_id);
           if (values[x]!='') flag=1;
           }
        if (flag) {
            for(var x=1; x<=anz_spalten[grid_id]; x++)
                db[grid_id+y1+'_'+x]=values[x];
            y1++;
            }
        }

   for(; typeof db[grid_id+y1+'_1']!="undefined" && y1<300; y1++) {
       for(var x=1;x<=anz_spalten[grid_id];x++) delete db[grid_id+y1+'_'+x];
   }
}

//
// SORT
//
function sort(sort_nach_spalte_nr, grid_id)
{
   var typen=typmerk[grid_id].split(",");           // typ: 'c'=checkbox', 't'=Text oder fester Text (fester Text beginnt mit '{--}'  )

   var values=new Array();
   for(var y=1; y<anz_zeilen[grid_id]; y++) {
       var h=new Array();
       for(var x=1; x<=anz_spalten[grid_id]; x++) {
           h[x]=hole_zelle(y, x, typen[x-1], grid_id);
           }
       h[0]=h[sort_nach_spalte_nr];
       if (h[0].substring(0,4)=='{--}') h[0]=h[0].substring(4);
       if (h[0].charAt(0)=='<') h[0]=h[0].substring(h[0].indexOf(">")+1);
       if (h.join("")!="") h[0]="0"+h[0]; // damit leere Zeilen nach unten kommen: alle nicht-leeren Zeilen durch Voranstellen einer '0' nach oben sortieren
       values.push(h.join('{$}'));
       }
   values.sort();
   var z=0;
   for(var y=1; y<anz_zeilen[grid_id]; y++) {
       var h=values[z++].split('{$}');
       for(var x=1; x<=anz_spalten[grid_id]; x++) {
           setze_zelle(y, x, h[x], typen[x-1], grid_id);
           }
       }
}

//
// IMPORT | EXPORT
//

function form_to_csv(grid_id)
{
   var typen=typmerk[grid_id].split(",");           // typ: 'c'=checkbox', 't'=Text oder fester Text
   var csv='~csv~';
   
   for(var x=1;x<=anz_spalten[grid_id];x++) { if (x>1) csv+=';'; csv+=spalten_namen_a[x-1]; }
   csv+='\r\n';
   
   for(var y=1;y<anz_zeilen[grid_id];y++) {
   	   var zeile='';
   	   var flag_alles_leer=1;
       for(var x=1;x<=anz_spalten[grid_id];x++) {
           var w=hole_zelle(y, x, typen[x-1], grid_id);
           if (w && w.substring(0,4)!='{--}') flag_alles_leer=0;
//       	alert(x+"-"+y+"=",w);
           w=w.replace(/"/g, '""');
           w=w.replace(/\r/g, '');  // nur LF statt CR/LF
           w=w.replace(/\n/g, '¶');
           if (w.indexOf(";")!=-1 || w.indexOf('"')!=-1|| w.indexOf('¶')!=-1) zeile+='\"'+w+'\"';
           else zeile+=w;
           if (x!=anz_spalten[grid_id]) zeile+=';';
           }
     if (!flag_alles_leer) csv+=zeile+'\r\n';
     }
  csv=csv.replace(/"/g, "´");
  //alert(csv);
  document.f1.csv1.value=csv;
}

function csv_export(grid_id)
{
  form_to_csv(grid_id);
  location.href="x-s8:///"+rpath+"/$btb_csvexport:";
  reload1();
}

function csv_import(grid_id, flag_anfuegen)
{
  var typen=typmerk[grid_id].split(",");           // typ: 'c'=checkbox', 't'=Text oder fester Text

  location.href="x-s8:///"+rpath+"/$btb_csvimport:";
  if (document.form_csv.status.value!="ok") { alert("Fehler beim Öffnen."); return; }
  var csv=document.form_csv.csv.value;
  csv=csv.replace(/¶/g, "\n");
  if (csv.indexOf("\r\n")==-1) csv=csv.split("\n");
  else csv=csv.split("\r\n");

  zeile_markieren(grid_id, -1); // wenn eine Zeile markiert ist, die Markierung entfernen
  var y=1;
  if (flag_anfuegen==0) {
      if (!confirm("Alle Eingaben in diesem Formulare werden beim Importieren überschrieben. Möchten Sie fortfahren?")) return;
      form_reset(0, grid_id);
      // alle Zeilen bis auf 3 löschen
       while(anz_zeilen[grid_id]>4) minus(grid_id);
  }
  else y=anz_zeilen[grid_id];

  for(var i=0; i<csv.length; i++) {
  	   // eine Zeile der CSV in das Array c2[..] einlesen  
       var c=csv[i];
       var c2=new Array();
       var k=0,k_merk=0;
       var anfz_flag=0;
       while(k<c.length) {
         if (anfz_flag==0 && c.charAt(k)=='\"') {anfz_flag=1;k++;k_merk=k;}
         else if (anfz_flag==1 && c.charAt(k)=='\"' && c.charAt(k+1)!='\"') {
         	 anfz_flag=0;k++;
         	 if (c.charAt(k)==';') {c2.push(c.substring(k_merk,k-1));k++;k_merk=k;} else c=c.substring(0,c.length-1);
         	 }
         else if (anfz_flag==1 && c.charAt(k)=='\"' && c.charAt(k+1)=='\"') k+=2;
         else if (anfz_flag==0 && c.charAt(k)==';') {c2.push(c.substring(k_merk,k));k++;k_merk=k;}
         else k++;
         }
       c2.push(c.substring(k_merk));
 
       if (i==0 && c2[0]==spalten_namen_a[0]) continue; // Wenn die erste Zeile des CSV die Spaltennamen enthält, diese beim Einlesen überspringen.
       plus(grid_id);
       for(var x=1;x<=anz_spalten[grid_id];x++)  {
           var wert='';
           if (typeof c2[x-1]!="undefined") wert=c2[x-1].replace(/""/g, '\"');
           //alert("setze "+y+"-"+x+"="+wert);
           setze_zelle(y, x, wert, typen[x-1], grid_id);
           }
       y++;
       }
   if (flag_anfuegen) reload1(); // Nur bei "Anfügen": durch einen Reload überflüssige Leerzeilen löschen.
}

function merkeEing()
{
	if (!document.form) return;
/*
	if (parent.flag_nicht_merken!=0) {
		parent.flag_nicht_merken=0;
		return;
	}
*/
	if (typeof unload_grid_id!="undefined") {
	    for(var i=0; i<unload_grid_id.length; i++) grid_unload(unload_grid_id[i]);

	    }	
  if (typeof save_to_ls!="undefined") {save_to_ls();}
}

// -------------------- Dropdown-Menüs ---------------------------- //

var dropdown_flag=0;

function ondropdown(feldid, datenquelle)
{
	if (dropdown_flag!=0 || datenquelle==null) {
		document.getElementById("dropdown").style.visibility="hidden";
		dropdown_flag=0;
		return;
	}
   var s='';
   var laenge_liste=0;   
   
   var x=datenquelle.split("|");
   for(var i=0; i<x.length; i++) {s+='<option>'+x[i]+"</option>"; laenge_liste++;}

   if (laenge_liste>20) laenge_liste=20;
   if (laenge_liste<=1) laenge_liste=3;

   s='<form name="fs1"><select id="id_dropdown" name="sel_dropdown" size="'+laenge_liste+'" onclick="dropdown_select(\''+feldid+'\')">'+s;   
   s+='</select></form>';   

   document.getElementById("dropdown").innerHTML=s;
   o=document.getElementById(feldid);
   x=0; y=o.offsetHeight; xs=o.offsetWidth;
   if (o.type=="textarea") {y=0;x=20;}
   while(o!=null) {
       x+=o.offsetLeft; y+=o.offsetTop;
       o=o.offsetParent;
   }
   x-=parseInt(document.getElementById("content").offsetLeft);
   y-=parseInt(document.getElementById("content").offsetTop);
	//x+=226;
		
   document.getElementById("dropdown").style.left=x+"px";
   document.getElementById("dropdown").style.top=y+"px";
   document.getElementById("id_dropdown").style.width=xs+"px";
   document.getElementById("dropdown").style.visibility="visible";
   dropdown_flag=1;
}

function dropdown_select(feldid)
{
	var i,t,o;
	
	i=document.fs1.sel_dropdown.selectedIndex;
	if (i>=0) {
	    t=document.fs1.sel_dropdown.options[i].text;
	    if (document.getElementById(feldid).type=="textarea") document.form.elements[feldid].value+=t+'\r\n';
	    else  document.getElementById(feldid).innerHTML=t;
	    //if (document.form.elements[feldid].type=="text") document.form.elements[feldid].value=t;
	    //if (document.form.elements[feldid].type=="textarea") 
	    }
	ondropdown(feldid, null);
}

function reload1()
{
 location.href="x-s8:///"+rpath+'/'+datei_name;
}

function form_reset(flag_confirm, grid_id)
{
	if (flag_confirm && !confirm("Möchten Sie alle Eingaben auf dieser Seite löschen?")) return;
	document.form.reset();
	for(var i=0;i<document.form.length;i++) if (document.form[i].type=="checkbox") document.form[i].checked=false;
	akt_zeile[grid_id]=-1;
    for(i=anz_zeilen[grid_id]; i>1; i--) minus(grid_id);
	reload1();
}
