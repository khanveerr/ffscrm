

  function isInArray(value, array) {
    return array.indexOf(value) > -1;
  }


function chkrecursivefraction(numr,denr){

  var res = '';

  var mp = {};
  var remvals = [];

  var rem = numr%denr ;
  // console.log(rem);


  while ( (rem!=0) && (isInArray(rem,remvals) == false) )
   {

       var res_part = rem / denr;
       mp[rem] = res_part;
       remvals.push(rem);
       rem = rem*10;
       rem = rem % denr;

   }

   return (rem == 0)? Object.keys(mp).length :" inf";
}



function resversemyno(inp){

  var  b = 0;
  var a = parseInt(inp);
  console.log(a,b);
  while(a > 0)
	{
		b = b * 10
		b = b + parseInt(a % 10)
		a = parseInt(a / 10)
	}

  return b;
}


  var resp = chkrecursivefraction();
  console.log(resp);




  function main(input) {
      //Enter your code here
      var noOfTest = parseInt(input[0]);
      var arrOfVal = [];
      var inp = input.split("\n");

      var result = '';

      for(var i=1;i<=noOfTest;i++){
          var testinp = inp[i].replace(/\s/g,'');
          var numr = parseInt(testinp.charAt(0));
          var denr = parseInt(testinp.charAt(1));

            var res = '';

            var mp = {};
            var remvals = [];

            var rem = numr % denr ;
            console.log( testinp) ;
            console.log(numr);
            console.log(denr);
            console.log(rem);


            while ( (rem!==0) && (isInArray(rem,remvals) === false) )
            {

                var res_part = rem / denr;
                mp[rem] = res_part;
                remvals.push(rem);
                console.log(remvals);
                rem = rem*10;
                rem = rem % denr;

            }

              var myoutput ='inf';
              if (rem===0){
                  myoutput  = Object.keys(remmap).length ;
                  myoutput = myoutput.toString();
              }


             result +=  myoutput + "\n";

          }
          console.log(result);
          // process.stdout.write(result);
      }






  function isInArray(value,array){

      return array.indexOf(value) > -1;
  }

var str = 1 + "\n" + "2 10";
main(str);











  // process.stdin.resume();
  // process.stdin.setEncoding("utf-8");
  // var stdin_input = "";
  //
  // process.stdin.on("data", function (input) {
  //     stdin_input += input;
  // });
  //
  // process.stdin.on("end", function () {
  //    main(stdin_input);
  // });
