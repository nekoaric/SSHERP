var ${field}Store = new Ext.data.SimpleStore({
  fields : ['value', 'text'],
  data : [
  #set($i = 0)
  #foreach($code in $codeList)
  	#set($i = $i+1)
    ['${code.code}', '#if(${showCode}=="true")${code.code} #end${code.codedesc}']
    #if($i!=$codeList.size()), #end
  #end
  ]
});