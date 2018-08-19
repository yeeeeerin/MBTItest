var db = null;

var testPageNum=0;
var name="Anonymous";
var resultType="";

var mE=0,mI=0;
var mS=0,mN=0;
var mT=0,mF=0;
var mJ=0,mP=0;
var mEI="",mSN="",mTF="",mJP="";

$(document).ready( function() { 

	// DB 연결
	openDB();  
	createTable();  
	createDBList();



	$('input:radio[value="on"]').attr('checked', true);	

	var Cheight = $(window).height();
	$('.container').css({'height':Cheight+'px'});

	
	$.getJSON('ajax-resultdata.json', function(jsonData) {
		var tagList = "";
		$.each(jsonData.resultInfo, function() {
			//속성에 다음으로 넘어갈 페이지와 이이디를 설정
			tagList += '<li><a href="#resultDetail_page" class="resultTitle">' + this.title + '</a></li>';
		});
		$('#listArea').empty();				
		$('#listArea').append(tagList);
		$('#listArea').listview('refresh');
	});


	$('ul').on('click', '.resultTitle', function() {
    	var title = $(this).text();
		$.getJSON('ajax-resultdata.json', function(jsonData) {
			
			$.each(jsonData.resultInfo, function() {
				if (title == this.title){
					$('#resultDetail_page #type').empty();
					$('#resultDetail_page #detail_character').empty();
					$('#resultDetail_page #detail_careful').empty();	


					$('#resultDetail_page h1').text(this.title);
					$('#resultDetail_page #type_img').attr("src",this.type_img);
					$('#resultDetail_page #type').append("<h3>"+this.type_title + '</h3>' +this.type_detail);
					$('#resultDetail_page #detail_info').text(this.detail_info);
					//$일반적인 특성 추가
					var arr=this.character;
					var mList = "";
					for(var i=0;i<arr.length;i++){
						mList+=arr[i]+'<br>';
					}
					$('#resultDetail_page #detail_character').append(mList);
					
					//주의하고 개발할 점 추가
					arr=this.careful;
					mList = "";
					for(var i=0;i<arr.length;i++){
						mList+=arr[i]+'<br>';
					}
					$('#resultDetail_page #detail_careful').append(mList);
					
					//관련 인물 추가
					$('#resultDetail_page #detail_person').text(this.person);
				}
				
			});

		});
	});


	$("#gotoTest").click(function(){
		name = $('#name').val();
	});

	$("#oldResult").click(function(){
		var length = $("#oldTestList").find("li").length;
		if(length > 0){
			$('#oldTest_page h4').remove();
			$('#oldTest_page .test_Btn').remove();
		}
	});


	$("#next_page1").click(function(){

		if (testPageNum == 0){
			$('#next_page1').removeAttr('href');
			testPageNum++;
			mE=0,mI=0;mEI="";
			for(var i=1;i<10;i++){
				var check = $('input:radio[name=radio-choice-h-'+i+']:checked').val();
				if(check == "on"){
					mE++;
				}else{
					mI++;
				}
			}

			if(mE >= mI){
				mEI="E";
			}else{
				mEI="I";
			}



			getTestPageInfo("testpage2");

			
			

			var offset = $("#newTest_page").offset();
      $('html, body').animate({scrollTop : offset.top}, 400);



		}else if(testPageNum == 1){
			$('#next_page1').removeAttr('href');
			testPageNum++;

			for(var i=1;i<10;i++){
				var check = $('input:radio[name=radio-choice-h-'+i+']:checked').val();
				if(check == "on"){
					mS++;
				}else{
					mN++;
				}
			}

			if(mS >= mN){
				mSN="S";
			}else{
				mSN="N";
			}

			getTestPageInfo("testpage3");

			var offset = $("#newTest_page").offset();
      $('html, body').animate({scrollTop : offset.top}, 400);

		}else if(testPageNum == 2){
			$('#next_page1').removeAttr('href');
			testPageNum++;

			mT=0,mF=0;mTF="";
			for(var i=1;i<10;i++){
				var check = $('input:radio[name=radio-choice-h-'+i+']:checked').val();

				if(check == "on"){
					mT++;
				}else{
					mF++;
				}
			}


			if(mT >= mF){
				mTF="T";
			}else{
				mTF="F";
			}


			getTestPageInfo("testpage4");

			var offset = $("#newTest_page").offset();
      $('html, body').animate({scrollTop : offset.top}, 400);

      $('#next_page1').text('제출'); 		

		}else if(testPageNum == 3){
			$('#next_page1').attr('href','#userResult_page');
			
			testPageNum=0;

			mJ=0,mP=0;mJP="";
			for(var i=1;i<10;i++){
				var check = $('input:radio[name=radio-choice-h-'+i+']:checked').val();
				if(check == "on"){
					mJ++;
				}else{
					mP++;
				}
			}

			if(mJ >= mP){
				mJP="J";
			}else{
				mJP="P";
			}

			var final_type=mEI+mSN+mTF+mJP;
			resultType = final_type;
			$("#userResult_page h3").text("검사 결과는 : "+final_type);
			$('#next_page1').text('다음'); 	
			$('#name').attr('value=""'); 
			insertBook(resultType,name);


			var s1 = [mP, mF, mN, mI];
      var s2 = [mJ, mT, mS, mE];    
      var ticks = ['J/P', 'T/F', 'S/N', 'E/I'];

      plot1 = $.jqplot('chartdiv', [s1, s2], {
          title: 'mbti4가지 성향 결과',
          seriesDefaults: {
              renderer:$.jqplot.BarRenderer,
              pointLabels: { show: true},
              shadowAngle: 135,
              rendererOptions: {
                  barDirection: 'horizontal'
              },
          },    
          series: [
          		{ label: '1'},
          		{ label: '2'}
          ],    
          legend: {
              show: true,
              placement: 'outside'
          },            
          axes: {
              yaxis: {
                  renderer: $.jqplot.CategoryAxisRenderer,
                  ticks: ticks
              }
          }
      });


		}


		
		
		
		
	});


});	


function getTestPageInfo(pageNum) {

    $.getJSON('ajax-test.json', function(jsonData) {
			
		$.each(jsonData.testInfo, function() {
			var page = "#newTest_page"
			var page_de= ""
			if (pageNum == this.page){

				$(page+" h2").text(this.pageTitle);

				var arr = this.q1;
				$(page+" label[for='radio-choice-h-1a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-1b"+page_de+"']").text(arr[1]);

				arr = this.q2;
				$(page+" label[for='radio-choice-h-2a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-2b"+page_de+"']").text(arr[1]);

				arr = this.q3;
				$(page+" label[for='radio-choice-h-3a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-3b"+page_de+"']").text(arr[1]);

				arr = this.q4;
				$(page+" label[for='radio-choice-h-4a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-4b"+page_de+"']").text(arr[1]);

				arr = this.q5;
				$(page+" label[for='radio-choice-h-5a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-5b"+page_de+"']").text(arr[1]);

				arr = this.q6;
				$(page+" label[for='radio-choice-h-6a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-6b"+page_de+"']").text(arr[1]);

				arr = this.q7;
				$(page+" label[for='radio-choice-h-7a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-7b"+page_de+"']").text(arr[1]);

				arr = this.q8;
				$(page+" label[for='radio-choice-h-8a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-8b"+page_de+"']").text(arr[1]);

				arr = this.q9;
				$(page+" label[for='radio-choice-h-9a"+page_de+"']").text(arr[0]);
				$(page+" label[for='radio-choice-h-9b"+page_de+"']").text(arr[1]);
			}
				
		});

	});




	
	$('#newTest_page div[data-role="content"]').select('refresh');
};





// 데이터베이스 생성 및 오픈
function openDB(){
   db = window.openDatabase('testDB', '1.0', '테스트DB', 1024*1024); 
   console.log('1_DB 생성...'); 
}

function createTable() {
	db.transaction(function(tr){
		var createSQL = 'create table if not exists test(type text, name text)';       
		tr.executeSql(createSQL, [], function(){
		console.log('2_1_테이블생성_sql 실행 성공...');        
	}, function(){
		console.log('2_1_테이블생성_sql 실행 실패...');            
	});
	}, function(){
		console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	}, function(){
		console.log('2_2_테이블 생성 트랜잭션 성공...');
	});
} 

// 데이터 입력 트랜잭션 실행
function insertBook(finalType,namee){ 
  db.transaction(function(tr){
		var type = finalType
		var name = namee
		var insertSQL = 'insert into test(type, name) values(?, ?)';      
   	tr.executeSql(insertSQL, [type, name], function(tr, rs){    
    	console.log('3_ 결과 등록...no: ' + rs.insertId);
    	
   	  var dataList = "";
   	  dataList += '<li>' +name+'님 : '+ type + '타입</li>';

   		$('#oldTestList').append(dataList);
		  $('#oldTestList').listview('refresh');
	}, function(tr, err){
			alert('DB오류 ' + err.message + err.code);
		}
	);
  });      
}
//앱을 실행했을 때 데이터베이스에 저장된 기록들을 리스트뷰에 추가
function createDBList(){
  db.transaction(function(tr){
 	var selectSQL = 'select * from test';    
  	tr.executeSql(selectSQL, [], function(tr, rs){    
			console.log(rs.rows.length + '건.');
			var dataList = "";
			for(var i =0; i<rs.rows.length;i++){
   	  	dataList += '<li>' +rs.rows.item(i).name+'님 : '+ rs.rows.item(i).type+ '타입</li>';
			}
			$('#oldTestList').append(dataList);
		  $('#oldTestList').listview('refresh');
 		});   
  });           
}