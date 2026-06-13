   var l1=location.search.substring(1).split("&");
   if (l1.length<=1) medium="monitor"; else medium=l1[1];
   if (medium.substring(0,3)=="y2=") medium=l1[2];
   if (medium=="monitor") drucklink="ga.htm"+location.search.replace("?monitor","").replace("?print","").replace("?clipbrd","")+"?print";

function ga_htm()
{
//   if (bereich=="alles") medium="print";
   if (medium=="print") document.write('<div id="vd"><ul><li><a href="javascript:window.print()">Drucken</a></li><li><a href="javascript:goback()">Zurück</a></li></ul><hr></div>');

   if (l1[0]!="erglist" && l1[0]!="maengel" && l1[0]!="kontroll" && l1[0]!="risikobewertung" && medium=="monitor") 
       tab_kopf_fest_ga("table_faktor");  
   ga_ausgeben(l1[0], medium);
    var k="kap2"; if (bereich=="eigene") k="kap1";
   //if (l1.length==3) document.getElementById(k).scrollTop=l1[2].split("=")[1];
   
   if (medium=="clipbrd") {
   	  copy_clp();
   	  if (document.all) {
   	     alert('Sie können die Ergebnisse Ihrer Gefährdungsbeurteilung in Ihre Textverarbeitung übernehmen. Dazu wurden die Inhalte in die Zwischenablage übertragen.\r\n\r\n\
Starten Sie Ihre Textverarbeitung (z.B. MS-WORD) und geben Sie den Befehl "Einfügen" (im Menü "BEARBEITEN" bzw. mit der Tastenkombination STRG+V). Die Texte werden dann in Ihr Textdokument übernommen. Stellen Sie die Seitenbreite in Word auf 100 %.');
	       window.onload=goback1;
	       }
	    else { alert('Sie können die Ergebnisse Ihrer Gefährdungsbeurteilung in Ihre Textverarbeitung übernehmen. Kopieren Sie die Inhalte mit Strg-C in die Zwischenablage.\r\n\r\n\
Starten Sie Ihre Textverarbeitung (z.B. MS-WORD) und geben Sie den Befehl "Einfügen" (im Menü "BEARBEITEN" bzw. mit der Tastenkombination STRG+V). Die Texte werden dann in Ihr Textdokument übernommen. Stellen Sie die Seitenbreite in Word auf 100 %.');
	       }
   	  }
   if (medium=="print") {
   	  umbrueche_einfuegen();
   	  document.title="GB "+parent.inp11[2]+" "+parent.inp11[6];
   	  }
}
function goback1() { goback() }
