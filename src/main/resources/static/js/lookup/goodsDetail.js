
document.addEventListener("DOMContentLoaded", function() {    
	totalPrice(); // 상품상세 페이지로 처음 이동했을 때 total price 정보를 가져옴
});

 var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

/* 경로 */
 function encodeUri(uri){
	const encoded = encodeURI(uri);
	location.href = encoded;
}
 function uploadReview(orderId, itemId){
	const uri = '/review?orderId=' + orderId + '&itemId=' + itemId;
	encodeUri(uri);
}

function cancel(itemId){
	const uri = '/lookup/goodsDetail?itemId=' + itemId;
	encodeUri(uri);
}

/* 버튼 클릭 시 이동 막음 */
$("#soldoutBtn").click(function(event){
	event.preventDefault();
})

/*Total Price*/
function totalPrice(){
	var quantity = document.querySelector("#itemNumInput").value;
	var shippingFee = document.querySelector("#shipping").innerHTML.split("원")[0];
	var price = document.querySelector("#itemPrice").innerHTML.split("원")[0];
	
	document.querySelector("#itemQuantity").innerHTML = quantity;
	
	var itemPrice = Number(price.replace(',',"")) * Number(quantity);
	var total = itemPrice + Number(shippingFee.replace(',',""));
	$("#inputTotal").val(itemPrice); // cartItem price에는 단가 * 수량이 저장됨
	document.querySelector("#totalPrice").innerHTML = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
}

/* ratingTotal */
var ratings = document.querySelectorAll("#rating");
var ratingTotal = document.querySelector("#ratingTotal");

if(ratings == null || ratings.length == 0){
	ratingTotal.innerHTML = "0.0";
}else{
	
	var sum = 0;
	var cnt = 0;
	for(var i = 0; i < ratings.length; i++){
		sum += Number(ratings[i].innerHTML);
		cnt++;	
	}
	ratingTotal.innerHTML = sum / cnt;
}

/*사진 업로드*/
const upload = document.querySelector('.upload');

const uploadBox = document.querySelector('.upload-img-icon-box');

uploadBox.addEventListener('click', () => upload.click());
upload.addEventListener('change', getImageFiles);

function getImageFiles() {
  var imgs = document.querySelectorAll(".reviewImage");
  
  if(imgs.length > 0){
	 Swal.fire({
				   text: '이미지는 1개까지 업로드가 가능합니다.',
				   confirmButtonColor: '#93c0b5',
				   confirmButtonText: '확인',
				});
      return;
 }else{
	previewFile();
 }
}

 /*
* input file에서 이미지 선택 시 선택한 이미지 보여줌.
*/
 function previewFile() {
  var preview = document.querySelector('.upload-img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
	var img = document.createElement("img");
	img.classList.add("reviewImage");
    img.src = reader.result;
    var div = document.createElement("div");
    div.classList.add("upload-img-box");
    div.appendChild(img);

         //삭제 버튼 <button></button>
        const button = document.createElement("button");
        
        button.innerText = "X";
        button.classList.add("deleteBtn");
        button.type = "button";
       
        div.appendChild(button);
         preview.appendChild(div);
        // 이미지 삭제 버튼 눌렀을 때
        button.addEventListener("click", deleteImg);
    
  }
  
  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }

}

function deleteImg(event){
	     event.preventDefault();
	
		  /*<span> 버튼의 부모 element span 삭제
		       <button ..></button>
		    </span>
		  */
		  event.target.parentElement.remove(); 
		 
  }

/* 리뷰 글자 수 제한 */
const btn = document.querySelector("#writeReviewBtn");
if($('#writeReview').val() == ''){
	btn.disabled = true;
}
$(document).ready(function() {
    $('#writeReview').on('keyup', function() {    
		if($(this).val().length < 20){	
			btn.disabled = true;
		}else{
			btn.disabled = false;
		}
        if($(this).val().length > 200) {
            $(this).val($(this).val().substring(0, 200));
        }
    });
});

