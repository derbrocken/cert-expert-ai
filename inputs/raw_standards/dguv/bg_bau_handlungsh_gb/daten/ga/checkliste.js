   var cl=dateiname.split(".htm")[0];
   cl="f_"+cl.substring(cl.lastIndexOf("/")+1);
   var cl_titel="";
   cl_ausgeben(cl, medium);
//   var k="kap2"; if (bereich=="eigene") k="kap1";   
//   if (y) document.getElementById(k).scrollTop=y;

   if (medium=="monitor" && datei_name==parent.form_dateiname) 
	    for(i=0,z=0,z2=0;i<document.form.length;i++) {
	    	f=document.form.elements[i];
	    	if (f.type=="text") f.value=parent.form_inp_merk[z2++];
	    	if (f.type=="checkbox") f.checked=parent.form_cb_merk.charAt(z++)=="1"?true:false;
	    }
   
   document.write('<a name="spl"></a><div id="vd">');
   if (medium=="monitor") buttons(path);
   document.write('</div>');
   if (medium=="clipbrd") {
   	  copy_clp();
      alert('Die Inhalte wurden in die Zwischenablage übertragen.');
    }

function cl_ausgeben(dateiname, medium)
{
   if (medium=="print") document.write('<p><a href="javascript:window.print()">Drucken</a></p>\r\n');

   document.write('<style type="text/css">\r\n\
#form_ga td { vertical-align:top }\r\n\
#form_ga td { font-size:14px }\r\n\
</style>');
   if (medium=="monitor") document.write('<form id="form" name="form">'); else document.write('<div id="form">');
   faktor_ausgeben(dateiname, '', medium);
   if (medium=="monitor") document.write('</form>'); else document.write('</div>');
}

var fz=0;
var massn_z=1;

function faktor_ausgeben(dateiname, typ, medium)
{
   if (typeof parent.ga_daten[dateiname]=="undefined") parent.ga_daten[dateiname]=dateiname;
   ga=parent.ga_daten[dateiname];
   
   var g=ga.split("|");
   //var dateiname=g[0];
   var checkboxen=new Array();
   if (g.length>1) checkboxen=g[1].split(",");
   // inputfelder=ab g[2]
   
   if (g.length<2 && typ!="") return;
   
   var nr=ga_dateien[dateiname];
   if (""+nr=="undefined") { alert("Datei "+dateiname+ " nicht in faktoren.js enthalten."); return; }

   cl_titel=titel[nr]+" "+check[nr];

   if (++fz==30) alert("Mehr als 30 Gefährdungsfaktoren können nicht angezeigt werden.");
   if (fz>=30) return;

//<td rowspan="2"><span style="wrixting-mode : tb-rl;"><b>Bemerkungen</b></span></td>\

   //document.write('<input type="text" name="zeile" value="'+dateiname+'" style="display:none" />');
   document.write('<table border="0" cellspacing="0" cellpadding="2" id="table_faktor">\
<tr>\
<td width="590" colspan="4">\
<h3>'+repl(titel[nr])+'</h3>\
<h2>'+repl(check[nr])+'</h2>\
<h4>'+repl(fragen[nr])+'</h4>\
</td>\
</tr>\
\
<tr id="fest2">\
<td rowspan="2" valign="top" style="font-size:13px"><b>zu berücksichtigende Aspekte</b></td>\
<td colspan="2" valign="top" style="font-size:13px"><b>&nbsp;</b></td>\
<td rowspan="2" valign="top" style="font-size:13px"><b>Nicht<br>rele-<br>vant</td>\
</tr>\
<tr id="fest2" style="font-size:13px">\
<td valign="top">ja</td>\
<td valign="top">nein</td>\
</tr>');

   var m=massnahmen[nr];
   var nr_cb1=0;
   var nr_cb2=(m.length+0)*1;
   var nr_cb3=(m.length+0)*2;
   var z=0, z2=0;

   //
   // Ausgabemdium: Monitor (mit Eingabefeldern)
   //   
   if (medium=="monitor") for(var i=0;i<m.length;i++) {
      if (m[i].charAt(0)=='$') document.write('<tr><td>'+m[i].substring(1)+'</td><td colspan="3">&nbsp;</td></tr>\r\n');
      else 
      	  document.write('\
<tr id="massn'+(massn_z++)+'">\
<td>'+repl(m[i])+'</td>\
<td><input type="radio" name="rb_'+i+'" value="'+(nr_cb1+i)+'" '+(checkboxen[nr_cb1+i]=="1"?"checked":"")+' /></td>\
<td><input type="radio" name="rb_'+i+'" value="'+(nr_cb2+i)+'" '+(checkboxen[nr_cb2+i]=="1"?"checked":"")+' /></td>\
<td><input type="radio" name="rb_'+i+'" value="'+(nr_cb3+i)+'" '+(checkboxen[nr_cb3+i]=="1"?"checked":"")+' /></td>\
</tr>');
      }

   // 
   // Ausgabemedium: Drucker (ohne Eingabefelder)
   //   
   if (medium!="monitor") for(var i=0;i<m.length;i++) {
      if (m[i].charAt(0)=='$') document.write('<tr><td>'+m[i].substring(1)+'</td><td colspan="3">&nbsp;</td></tr>\r\n');
      else 
          document.write('\
<tr id="massn'+(massn_z++)+'">\
<td>'+repl(m[i])+'</td>\
<td>'+img_cb(parent.form_cb_merk.charAt(z++))+'</td>\
<td>'+img_cb(parent.form_cb_merk.charAt(z++))+'</td>\
<td>'+img_cb(parent.form_cb_merk.charAt(z++))+'</td>\
</tr>');
      }

   document.write('</table>');
   if (medium=="monitor")
   document.write('\
   <br /><table cellpadding="0" cellspacing="5">\n\
   <tr><td style="border:0px">Baustelle/Objekt:</td><td style="border:0px"><input type="text" name="i_1" size="30"> &nbsp;&nbsp;</td>\n\
   <td style="border:0px">Verantwortlich: </td><td style="border:0px"><input type="text" name="i_2" size="30"></td></tr>\n\
   <tr><td style="border:0px">Datum:</td><td style="border:0px"><input type="text" name="i_3" size="30"></td>\n\
   <td style="border:0px">Unterschrift   </td><td style="border:0px">_________________________</td></tr>\n\
   </table>');
   else
   document.write('\
   <br /><table cellpadding="0" cellspacing="5">\n\
   <tr><td style="border:0px">Baustelle/Objekt:</td><td style="border:0px">'+parent.form_inp_merk[z2++]+' &nbsp;&nbsp;</td>\n\
   <td style="border:0px">Verantwortlich: </td><td style="border:0px">'+parent.form_inp_merk[z2++]+'</td></tr>\n\
   <tr><td style="border:0px">Datum:</td><td style="border:0px">'+parent.form_inp_merk[z2++]+'</td>\n\
   <td style="border:0px">Unterschrift   </td><td style="border:0px">_________________________</td></tr>\n\
   </table>');
}

function img_cb(x)
{
   if (x=="1") return '<img src="'+path+'grafik/check1.gif" alt="X" hspace="3" vspace="3" align="left" />';
   else return '<img src="'+path+'grafik/check0.gif" alt="-" hspace="3" vspace="3" align="left" />';
}

parent.nicht_merken_flag=0;

function repl(x)
{
	x=x.replace(/img src="\.\./g, 'img src="'+path);
	return x.replace(/a href="\.\.\//g, 'a href="'+path);
}
