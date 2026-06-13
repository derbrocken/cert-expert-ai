document.write('<form style="float:right;background-color:#cccccc;padding:5px" name="f1" action="" onSubmit="if(this.t1.value!=null && this.t1.value!=\'\') findString(this.t1.value);return false">\
<input type="text" name=t1 value="" size=20>\
<input type="submit" name=b1 value="Suchen">\
<textarea style="display:none" name="csv1"></textarea>\
</form>');

var TRange=null;

function findString (str) 
{
   if (parseInt(navigator.appVersion)<4) return;
   var strFound;
   if (window.find) {

  // CODE FOR BROWSERS THAT SUPPORT window.find

  strFound=self.find(str);
  if (strFound && self.getSelection && !self.getSelection().anchorNode) {
   strFound=self.find(str)
  }
  if (!strFound) {
   strFound=self.find(str,0,1)
   while (self.find(str,0,1)) continue
  }
 }
 else if (navigator.appName.indexOf("Microsoft")!=-1) {

  // EXPLORER-SPECIFIC CODE

  if (TRange!=null) {
   TRange.collapse(false);
   strFound=TRange.findText(str);
   if (strFound) TRange.select();
  }
  if (TRange==null || strFound==0) {

   TRange=self.document.body.createTextRange();
   TRange.moveToElementText(document.getElementById("content"));
   strFound=TRange.findText(str);

   try{
   	if (strFound) TRange.select();
   }catch(e){}

  }
 }
 if (!strFound) alert ("Der Suchbegriff '"+str+"' wurde nicht gefunden.");
 return;
}
