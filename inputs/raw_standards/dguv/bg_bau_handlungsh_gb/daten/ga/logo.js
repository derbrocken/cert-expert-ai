var logomerk=""
var logo_src="";
var stil=" style='display:none'";

if (document.form_pre.elements[7].value) {logo_src=document.form_pre.elements[7].value;stil="";}

document.write("<div id='vd'><input type='button' value='Logo einfügen/ändern' onclick='show_logowin(1)'></div>");
document.write("<img src='"+logo_src+"' name='logo_name' id='logo_id' "+stil+">");
document.write("<div id='logowin' style='position:absolute;top:100px;left:100px;width:290px;height:130px;background-color:#dddddd;border:1px solid black;padding:15px;display:none'>\
<form name='logoform'><p align='left'>\
Bitte geben Sie den Dateinamen des Logos ein, oder klicken Sie auf \"Durchsuchen\", um die Datei zu finden:<br><br>\
<input type='file' name='filename'></p>\
<p align='center'><input type='button' value='     OK     ' onclick='logo_einfuegen()'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Abbrechen' onclick='show_logowin(0)'></p></form></div>");

function logo_einfuegen()
{
	//logo_src=prompt("Bitte geben Sie hier den vollständigen Pfad zu der Logo-Bitmap ein (z. B. c:\\firmenlogo.jpg):", logo_src);
	logo_src=""+document.logoform.filename.value;
	if (logo_src==null) logo_src="";

	document.logo_name.src=logo_src;
	document.form_pre.elements[7].value=logo_src;
	document.getElementById('logo_id').style.display="";
	logomerk=logo_src;
    show_logowin(0);
}


function show_logowin(x)
{
	document.logoform.filename.value=""+logo_src;
	document.getElementById("logowin").style.display=x? "":"none";
}

function skalieren(skl_wdh)
{
   var q=document.getElementById('logo_id');
   if (q && q.width>250) q.width="250";
   skl_wdh--;
   setTimeout("skalieren(3);", 100);
}
    setTimeout("skalieren(3);", 100);
