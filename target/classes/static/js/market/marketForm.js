

/*사진 업로드*/
const upload = document.querySelector('.upload');

const uploadBox = document.querySelector('.upload-img-icon-box');

uploadBox.addEventListener('click', () => upload.click());
upload.addEventListener('change', getImageFiles);

function getImageFiles() {
  var imgs = document.querySelectorAll(".market-upload-image");
  
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
  
  if(preview.childNodes.length > 2){
	$(".upload-img").children().remove();
  }
  var file  = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
	var img = document.createElement("img");
	img.classList.add("market-upload-image");
    img.src = reader.result;
    preview.appendChild(img);
    
      //삭제 버튼 <button></button>
        const button = document.createElement("button");
        
        button.innerText = "X";
        button.classList.add("deleteBtn");
        button.type = "button";
       
        preview.appendChild(button);
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
		  $(".upload-img").children().remove();
		  $("#saveBtn").disabled = true;
  }
  
  $("#saveBtn").click(function(event){
	event.preventDefault();
	 if($(".market-upload-image").length == 0){
		 Swal.fire({
				   text: '마켓 이미지를 등록해주세요!',
				   confirmButtonColor: '#93c0b5',
				   confirmButtonText: '확인',
				});
	}else{
		$('form').submit();
	}
})