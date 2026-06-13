/*document.write("<div id='vd'><input type='button' value='Logo' onclick='show_logowin(1)'></div>");
document.write("<img src='' name='logo_name' id='logo_id' style='display:none'>");
document.write("<div id='logowin' style='position:absolute;top:100px;left:100px;width:290px;height:130px;background-color:#dddddd;border:1px solid black;padding:15px;display:none'>\
<form name='logoform'><p align='left'>\
Bitte geben Sie den Dateinamen des Logos ein, oder klicken Sie auf \"Durchsuchen\", um die Datei zu finden:<br><br>\
<input type='file' name='filename'></p>\
<p align='center'><input type='button' value='     OK     ' onclick='logo_einfuegen()'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Abbrechen' onclick='show_logowin(0)'></p></form></div>");

dc=document.cookie;
i=dc.indexOf("logo=");
if (i!=-1) {
	logo_src=unescape(dc.substring(i+5, dc.length));
	document.logo_name.src=logo_src;
	document.getElementById('logo_id').style.display="";
	logomerk=logo_src;
} else logomerk=logo_src="";
*/
function logo_inputfeld()
{
/*
document.write("<input type='text' name='logo_merk' style='display:none'>");
*/
}

function sync_logo()
{
	if (logomerk!=document.form.logo_merk.value && document.form.logo_merk.value!="") {
		logo_src=logomerk=document.form.logo_merk.value;
        document.cookie="logo="+escape(logo_src);
    	document.logo_name.src=logo_src;
	    document.getElementById('logo_id').style.display="";
	}
    setTimeout("sync_logo()", 500);
}

function logo_einfuegen()
{
	//logo_src=prompt("Bitte geben Sie hier den vollständigen Pfad zu der Logo-Bitmap ein (z. B. c:\\firmenlogo.jpg):", logo_src);
	logo_src=""+document.logoform.filename.value;
	if (logo_src==null) logo_src="";
    document.cookie="logo="+escape(logo_src);

	document.logo_name.src=logo_src;
	document.getElementById('logo_id').style.display="";
	logomerk=logo_src;
    //location.href="x-s8:///"+rpath+"/"+datei_name;
    show_logowin(0);
}


function show_logowin(x)
{
	document.logoform.filename.value=""+logo_src;
	document.getElementById("logowin").style.display=x? "":"none";
}
