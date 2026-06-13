
function bereichwechsel_pruefen(neuer_bereich)
{
   var i=document.cookie.indexOf("bereich=");
   var alter_bereich='';
   if (i==-1) document.cookie="bereich="+neuer_bereich;
   else alter_bereich=document.cookie.substring(i+8).split("; ")[0];
//   alert(alter_bereich+" neu="+neuer_bereich);

   if (neuer_bereich==alter_bereich && alter_bereich!='') return;

   if (alter_bereich=="alles" && neuer_bereich=="eigene") {
   	   }
   else if (alter_bereich=="eigene" && neuer_bereich=="alles") {
       }
   else if (alter_bereich!=neuer_bereich && alter_bereich!="") {
      if (!confirm("Beim Wechsel des Gewerks werden Ihre bisherigen Eingaben gelöscht. Möchten Sie fortfahren? Wählen Sie Abbrechen um Ihre Ergebnisse zu speichern.")) {
    	if (typeof rpath!="undefined") location.href="x-s8:///"+rpath+"/goback"; // nein -> Zurück
    	else history.back();
    	return;
    	}
      else {
        parent.neu_ga(); // ja -> neue GA
        }
    }

   init_eigene_struktur(neuer_bereich);

   document.cookie="hauptkap=0";
   document.cookie="u_kap=0";
   document.cookie="uu_kap=0";
   document.cookie="ga_nr=0";
   hauptkap=u_kap=uu_kap=ga_nr=0;
   if (neuer_bereich=="eigene") {document.cookie="hauptkap=1";document.cookie="u_kap=1";hauptkap=u_kap=1;}
   document.cookie="bereich="+neuer_bereich;
}
