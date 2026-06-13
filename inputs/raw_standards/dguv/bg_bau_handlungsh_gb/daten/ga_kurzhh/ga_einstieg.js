document.write('<style type="text/css">\r\n\
@media screen { #content { overflow:hidden } }\r\n\
</style>');

document.write('<link rel="stylesheet" type="text/css" href="'+path+'ga/alpha60.css" />');
if (navigator.appVersion.indexOf("MSIE 6")!=-1 || navigator.appVersion.indexOf("MSIE 7")!=-1 || navigator.appVersion.indexOf("MSIE 8")!=-1 || navigator.appVersion.indexOf("MSIE 9")!=-1)
 document.write('<link rel="stylesheet" type="text/css" href="'+path+'ga/alpha60_ie.css" />'); 

document.write('<div style="position:absolute;top:0px;left:0px">');
document.write('<img src="'+path+'ga/img/einstieg_'+bereich+'.jpg" alt="" width="715" />');
document.write('</div>');

if (bereich=="basis")
document.write('<div style="position:absolute;left:0;top:140px;width:715px;" class="alpha60">\
<div style="padding:84px;padding-top:27px;padding-bottom:27px;font-size:15px;line-height:20px;font-weight:bold">\
Stellen Sie Ihre eigene Gefährdungsbeurteilung zusammen: <br />\
 Ergänzen Sie diese Basisversion individuell. Die Inhalte der Basisversion sind für eine vollständige Gefährdungsbeurteilung zu berücksichtigen.<br />\
<br />\
Klicken Sie dann oben im Menü auf die einzelnen Arbeitsbereiche und bearbeiten Sie diese.</div>\
</div>');

else
document.write('<div style="position:absolute;left:0;top:50px;width:715px;" class="alpha60">\
<div style="padding:84px;padding-top:27px;padding-bottom:27px;font-size:20px;line-height:28px">\
Im Menü oben finden Sie Auswahlbögen zur Gefährdungsbeurteilung für '+bereichtxt+'. \
Bearbeiten Sie die vorgeschlagenen Auswahlbögen, ergänzen Sie weitere entsprechend Ihrer betrieblichen Situation.</div>\
</div>');

location.replace("ga.htm?kurzhh");

/*
var l=508;
if (w<=1024) l=502;
var h1=h-211;
if (h1>542) h1=542;
document.write('<div style="position:absolute;top:541px;left:'+l+'px;width:253px;">');
document.write('<img src="'+path+'ga/img/kasten_beige_u.gif" alt="" />');
document.write('</div>');
*/

/*
document.write('<div style="position:absolute;top:0px;left:'+l+'px;width:253px;height:'+h1+'px;background-color:#ECE8DD;overflow:auto;background-image:url('+path+'ga/img/kasten_beige_o.gif);background-repeat:no-repeat;font-size:14px">');
document.write('<h3 style="padding-left:10px;padding-top:10px;margin:0px">Gefährdungs&shy;beurteilung</h3>');
document.write('<p style="padding:10px;padding-right:10px;margin:0px">In der linken Spalte wählen Sie die Tätigkeiten und Bereiche, die für Ihren Betrieb bzw. Ihre Baustelle relevant sind.</p>');
document.write('<p style="padding:10px;padding-right:10px;margin:0px">Wir empfehlen Ihnen, die für Ihren Betrieb typischen Arbeitsbereiche und Tätigkeiten auszuwählen, ');
document.write('um damit eine Gefährdungs&shy;beurteilung ');
document.write('Ihrer Standardbaustelle zu erstellen.</p>');
document.write('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;padding-right:10px" bordercolor="#111111" id="AutoNumber1" width="100%">');
document.write('  <tr><td width="10">&nbsp;</td>');
document.write('    <td width="25"><img src="'+path+'ga/img/pfeil_sw.gif"></td>');
document.write('    <td style="font-size:14px"><a href="x-s8:///'+rpath+'/ga-bearb.htm">Daten der Bearbeitung eingeben ');
document.write('        (Baustelle, Arbeitsbereich etc.) &#150; erforderlich für jede Gefährdungsbeurteilung</a></td>');
document.write('  </tr>');
document.write('</table>');
document.write('<p style="padding-left:10px;padding-top:0px;margin:0px"><form action="'+xpath+'ga/suche_faktor.htm" method="get">Suche in Tätigkeiten und Bereichen:<br /><input type="text" size="15" name="qu" /> <input type="submit" value="Suchen" /></form>');
document.write('<p style="padding:10px;padding-right:10px;margin:0px"><b><a href="x-s8:///'+rpath+'/../ga_bau/f_e/e0001.htm">Hilfe</a> zur Durchführung einer Gefährdungsbeurteilung und Informationen zur Installation.</b></p>');
document.write('</p>');
document.write('</div>');
*/