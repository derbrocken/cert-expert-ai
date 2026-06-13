try{
if (bild && path.charAt(0)=="#" && bild!="0000") document.write("<table><tr><td><img src='../../infopool_neu/pics1024/"+bild+".gif'></td><td width=20>&nbsp;</td><td width=300>");
else if (bild && typeof var_99!="undefined" && var_99==998 && bild!="0000") document.write("<table><tr><td><img src='"+path+"../../infopool_neu/pics1024/"+bild+".gif'></td><td width=20>&nbsp;</td><td width=300>");
} catch(e) {}

function bc6link1(link)
{
bc6link("",link);
}
function bc6link1_htm(link)
{
bc6link("",link);
}
function bc6link2(link)
{
bc6link("../",link);
}
function bc6link2_htm(link)
{
bc6link("../",link);
}
function bc6link3(link)
{
bc6link("../../",link);
}
function bc6link4(link)
{
bc6link("../../",link);
}

function bc6link(pfad, link)
{
link=link.toLowerCase(); erg="";
if (link=="goback") { document.write(path.charAt(0)!="#"? "<a href='x-s8:///"+path+"goback'>":"<a href='javascript:history.back()'>"); return; }

if (path.charAt(0)=="#") html_links=1; // kein show8-Browser->Dann HTML-Links
 else html_links=0;                     // show8-Browser->BC6-Links
if (typeof var_99!="undefined" && var_99==998)  html_links=1; // bei AMS_Bau CD-ROM wird var99 auf 998 gesetzt, wenn HTML-Links erscheinen sollen. 999=BC6-Links
if (html_links==0) {document.write("<a href='x-s8:///"+path+link+".bc6'>");return;}

if (path.charAt(0)=="#") path1=""; else path1="x-s8:///"+path;

if (link.substring(0, 1)=="a") erg="../ga_bau/f_a/"+link+".htm";
if (link.substring(0, 3)=="aer") erg="../ga_bau/f_aer/"+link+".htm";
if (link.substring(0, 3)=="all") erg="../ga_bau/f_all/"+link+".htm";
if (link.substring(0, 1)=="b") erg="../ga_bau/f_b/"+link+".htm";
if (link.substring(0, 2)=="bg") erg="../ga_bau/f_bg/"+link+".htm";
if (link.substring(0, 3)=="bue") erg="../ga_bau/f_bue/"+link+".htm";
if (link.substring(0, 3)=="div") erg="../ga_bau/f_div2/"+link+".htm";
if (link.substring(0, 4)=="div2") erg="../ga_bau/f_div/"+link+".htm";
if (link.substring(0, 1)=="e") erg="../ga_bau/f_e/"+link+".htm";
if (link.substring(0, 2)=="ea") erg="../ga_bau/f_ea/"+link+".htm";
if (link.substring(0, 2)=="eg") erg="../ga_bau/f_eg/"+link+".htm";
if (link.substring(0, 1)=="f") erg="../ga_bau/f_f/"+link+".htm";
if (link.substring(0, 1)=="g") erg="../ga_bau/f_g/"+link+".htm";
if (link.substring(0, 1)=="i") erg="../ga_bau/f_i/"+link+".htm";
if (link.substring(0, 2)=="ko") erg="../ga_bau/f_ko/"+link+".htm";
if (link.substring(0, 2)=="ku") erg="../ga_bau/f_ku/"+link+".htm";
if (link.substring(0, 1)=="l") erg="../ga_bau/f_l/"+link+".htm";
if (link.substring(0, 1)=="s") erg="../ga_bau/f_s/"+link+".htm";
if (link.substring(0, 3)=="srs") erg="../ga_bau/f_srs/"+link+".htm";
if (link.substring(0, 3)=="ssg") erg="../ga_bau/f_ssg/"+link+".htm";
if (link.substring(0, 3)=="str") erg="../ga_bau/f_str/"+link+".htm";
if (link.substring(0, 3)=="ubm") erg="../ga_bau/f_ubm/"+link+".htm";
if (link.substring(0, 3)=="ubt") erg="../ga_bau/f_ubt/"+link+".htm";
if (link.substring(0, 1)=="v") erg="../ga_bau/f_vib/"+link+".htm";
if (link.substring(0, 3)=="vuh") erg="../ga_bau/f_VuH/"+link+".htm";
if (link.substring(0, 3)=="iop") erg="../ga_bau/f_iop/"+link+".htm";
if (link.substring(0, 5)=="buero") erg="../ga_bau/f_all/"+link+".htm";
if (link=="zurga") {document.write("<!--");return;}
//alert(pfad); alert(erg);
if (erg!="") document.write("<a href='"+path1+pfad+erg+"'>");
}
