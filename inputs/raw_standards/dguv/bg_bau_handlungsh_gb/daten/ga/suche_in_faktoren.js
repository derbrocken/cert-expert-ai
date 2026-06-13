function suche_in_faktoren()
{
   var suchbegriff="";
   if (location.search!="") {
      suchbegriff=location.search.split("=")[1];
      suchbegriff=suchbegriff.replace(/%20/g, " ");
      suchbegriff=suchbegriff.replace(/\"/g, "");
      }
   document.write('<form action="'+xpath+'ga/struktur_bearbeiten.htm" method="get">Suche in Tätigkeiten und Bereichen:<br /><input type="text" size="15" name="qu" value="'+
                  suchbegriff+'" /> <input type="submit" value="Suchen" /></form>');
   suchbegriff=suchbegriff.toLowerCase();
   if (location.search=="") return;

   var e3=0;
   var anz=0;
   var erg=new Array();

   for(var i=0; i<struktur.length; i++) {
       s=struktur[i].split("#");
       if (s[1]!="") {
       	   e1++;e2=0;e3=0;
       	   }
       if (s.length==5 && s[3]!="") {
       	   dateiname=s[4];
       	   try{
       	   z=ga_dateien[dateiname];
       	   
       	   x=titel[z]+gefahr[z]+fragen[z]+massnahmen[z].join("");
       	   x=x.toLowerCase();
       	   if (x.indexOf(suchbegriff)==-1) continue;

           if (s[4].substring(0,4)=="f_cl") ;
           else {
                   // wenn die anzuzeigende GA-Tabelle noch nicht in parent.ga_daten drin ist, dann jetzt
                   // einen Leereintrag dafür machen!
                   if (typeof parent.ga_daten!="undefined" && (typeof parent.ga_daten['f'+s[0]]=="undefined" || parent.ga_daten['f'+s[0]]==null))
                       parent.ga_daten['f'+s[0]]=s[4];
       	       anz++;
       	       /*erg.push('<li><a href="javascript:go_ga('+e3+','+i+',\''+s[4]+'\')">')+s[3]+'</a>'+
       	                      (bereich=="alles"?' <a href="javascript:ga_eigene_add('+i+')" style="font-family:wingdings;font-weight:bold;color:#ff0000" title="übernehmen ->">ð</a>':'')+
       	                      '</li>\r\n');*/
       	       erg.push('<a href="javascript:add_faktor()" ondragstart="ondragstart1()" id="fak_'+i+'">'+s[3]+'</a><br />\r\n');
       	                      
       	       l=1;
       	       }
       	    }catch(e){}
       	   }
       }
     if (anz==0 && location.search!= "") document.write("Keine Fundstellen.");
     else {
     	erg.sort();
     	document.write(erg.join(''));
     	document.write('<p>Alle Faktoren:</p>');
    }
}
