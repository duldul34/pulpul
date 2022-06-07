/* 마이페이지 처음 접근할 때, 구매 목록 가져옴 */
document.addEventListener("DOMContentLoaded", function() {    
	orderListJson();
});

/* uri */
function encodeUri(uri){
	const encoded = encodeURI(uri);
	location.href = encoded;
}

/* 식물 목록으로 이동 */
function moveToGoodsList(){
	const uri = '/lookup/goodsList';
	encodeUri(uri);
}

/* 공유 물품 목록으로 이동 */
function moveToShareThingList(){
	const uri = '/lookup/shareThingList'
	encodeUri(uri);
}

/* 대여신청 클릭 시, 해당 상품의 상세정보 페이지로 이동 */
function moveToShareThingDetail(id){
	const uri = '/lookup/shareThingDetail?itemId=' + id;
	encodeUri(uri);
}

/* 구매 목록 */
function orderListJson() {
	$.ajax({
		url : "/member/mypage/orderList",
		type : "get",
		datatype : "json",
		success : function(data) {
			console.log(data);
			$("#orderList").addClass('list-on');
			$("#shareThingList").removeClass('list-on');
			$("#shareThingList").addClass('list');
	
			const content = document.getElementById("content");
				
			while ( content.hasChildNodes() )
     		content.removeChild( content.firstChild );
     		
			const table = document.createElement("table");
			const thead = document.createElement("thead");
			const tbody = document.createElement("tbody");
					
			table.appendChild(thead);
			table.appendChild(tbody);
					
			document.getElementById("content").appendChild(table);				

			const th_row = document.createElement("tr");
					
			const th_01 = document.createElement("th");
			th_01.setAttribute("class", "order-id");
			th_01.innerHTML = "주문 번호";
					
			const th_02 = document.createElement("th");
			th_02.setAttribute("class", "order-date");
			th_02.innerHTML = "주문일";
					
			const th_03 = document.createElement("th");
			th_03.setAttribute("class", "order-market");
			th_03.innerHTML = "주문 마켓";
					
			const th_04 = document.createElement("th");
			th_04.setAttribute("class", "total-price");
			th_04.innerHTML = "결제 금액";
					
			const th_05 = document.createElement("th");
			th_05.setAttribute("class", "order-status");
			th_05.innerHTML = "주문 상태";
					
			const th_06 = document.createElement("th");
			th_06.setAttribute("class", "traking-number");
			th_06.innerHTML = "운송장 번호";
					
			const th_07 = document.createElement("th");
			th_07.setAttribute("class", "cancel-btn");
			th_07.innerHTML = "";
					
			th_row.appendChild(th_01);
			th_row.appendChild(th_02);
			th_row.appendChild(th_03);
			th_row.appendChild(th_04);
			th_row.appendChild(th_05);
			th_row.appendChild(th_06);
			th_row.appendChild(th_07);
					
			thead.appendChild(th_row);
					
			$.each(data, function(index, order) {	
				const tb_row = document.createElement("tr");
				
				const td_01 = document.createElement("td");
				td_01.setAttribute("class", "order-id");
				td_01.innerHTML = "<a href='/order/orderDetail?orderId=" + order.id + "'>" + order.id + "</a>";
				
				const td_02 = document.createElement("td");
				td_02.setAttribute("class", "order-date");
				td_02.innerHTML = order.orderDate;
				
				const td_03 = document.createElement("td");
				td_03.setAttribute("class", "order-market");
				td_03.innerHTML = order.goodsList[0].goods.item.market.name;
				
				const td_04 = document.createElement("td");
				td_04.setAttribute("class", "total-price");
				td_04.innerHTML = order.totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "원";
				
				const td_05 = document.createElement("td");
				td_05.setAttribute("class", "order-status");
				if (order.orderStatus == 0)
					td_05.innerHTML = "주문 취소";
				else if (order.orderStatus == 1)
					td_05.innerHTML = "결제 완료";
				else if (order.orderStatus == 2)
					td_05.innerHTML = "배송 시작";
				else if (order.orderStatus == 3)
					td_05.innerHTML = "주문 확정";
				
				const td_06 = document.createElement("td");
				td_06.setAttribute("class", "traking-number");
				td_06.innerHTML = order.trackingNumber;
				
				const td_07 = document.createElement("td");
				if (order.trackingNumber == null && order.orderStatus == 1) {
					td_07.setAttribute("class", "cancel-btn");
					td_07.innerHTML += "<button class='cancelBtn-noton' onclick=\"location.href='/order/cancel?orderId=" + order.id + "'\">주문 취소</button>";
					
				}
				if (order.orderStatus == 2) {
					td_07.setAttribute("class", "cancel-btn");
					td_07.innerHTML += "<button class='cancelBtn-on' onclick=\"location.href='/order/finalize?orderId=" + order.id + "'\">주문 확정</button>";
					
				}
				
				tb_row.appendChild(td_01);
				tb_row.appendChild(td_02);
				tb_row.appendChild(td_03);
				tb_row.appendChild(td_04);
				tb_row.appendChild(td_05);
				tb_row.appendChild(td_06);
				tb_row.appendChild(td_07);
				
				tbody.appendChild(tb_row);
			});
				
			const cartBtn = document.createElement("button");
			cartBtn.setAttribute("id", "shoppingBtn");
			cartBtn.innerHTML = "쇼핑 계속하기";
			
			$(cartBtn).click(function(){
						moveToGoodsList();
			})
			
			content.appendChild(cartBtn);
		},
		
		error : function() {
			alert('error');			
		}
	});
};

/* 대여 목록 */
function shareThingListJson() {
	$.ajax({
		url : "/member/mypage/borrowList",
		type : "get",
		datatype : "json",
		success : function(data) {
			console.log(data);
			$("#shareThingList").addClass('list-on');
			$("#orderList").removeClass('list-on');
			$("#orderList").addClass('list');
			
			const content = document.getElementById("content");
				
			while ( content.hasChildNodes() )
     		content.removeChild( content.firstChild );
			
			const table = document.createElement("table");
			const thead = document.createElement("thead");
			const tbody = document.createElement("tbody");
			
			table.appendChild(thead);
			table.appendChild(tbody);
			
			document.getElementById("content").appendChild(table);				
	
			const th_row = document.createElement("tr");
			
			const th_01 = document.createElement("th");
			th_01.setAttribute("class", "sharething-img");
			th_01.innerHTML = "";
			
			const th_02 = document.createElement("th");
			th_02.setAttribute("class", "sharething-info");
			th_02.innerHTML = "상품 정보";
			
			const th_03 = document.createElement("th");
			th_03.setAttribute("class", "sharething-status");
			th_03.innerHTML = "대여 상태";
			
			const th_04 = document.createElement("th");
			th_04.setAttribute("class", "sharething-waybill");
			th_04.innerHTML = "운송장 번호";
			
			const th_05 = document.createElement("th");
			th_05.setAttribute("class", "sharething-date");
			th_05.innerHTML = "대여 기간";
			
			const th_06 = document.createElement("th");
			th_06.setAttribute("class", "sharething-btn");
			th_06.innerHTML = "";
			
			th_row.appendChild(th_01);
			th_row.appendChild(th_02);
			th_row.appendChild(th_03);
			th_row.appendChild(th_04);
			th_row.appendChild(th_05);
			th_row.appendChild(th_06);
			
			thead.appendChild(th_row);
				
			$.each(data, function(index, borrow) {
				const tb_row = document.createElement("tr");
				
				const td_01 = document.createElement("td");
				td_01.setAttribute("class", "sharething-img");
				const item_img = document.createElement("img");
				item_img.src = borrow.shareThing.item.thumbnailUrl;
				td_01.appendChild(item_img);
				
				const td_02 = document.createElement("td");
				td_02.setAttribute("class", "sharething-info");
				td_02.innerHTML = borrow.shareThing.item.name;
				
				const td_03 = document.createElement("td");
				td_03.setAttribute("class", "sharething-status");
				if (borrow.id)
					td_03.innerHTML = "대여";
				else 
					td_03.innerHTML = "예약";
					
				const td_04 = document.createElement("td");
				td_04.setAttribute("class", "sharething-waybill");
				td_04.innerHTML = borrow.trackingNumber;
				
				const td_05 = document.createElement("td");
				td_05.setAttribute("class", "sharething-date");
				
				const borrow_date = document.createElement("input");
				borrow_date.type="text";
				borrow_date.setAttribute("class", "datepicker");
				borrow_date.value=borrow.borrowDate;
				
				const return_date = document.createElement("input");
				return_date.type="text";
				return_date.setAttribute("class", "datepicker");
				return_date.value=borrow.returnDate;
				
				$(function(){
				  $('.datepicker').datepicker();
				})
				
				if (borrow.id) {
					td_05.appendChild(borrow_date);
					td_05.append(" ~ ");
					td_05.appendChild(return_date);
				}
				else 
					td_05.innerHTML = "X";
					
				const td_06 = document.createElement("td");
				td_06.setAttribute("class", "sharething-btn");
				if (borrow.shareThing.isBorrowed == 1 && borrow.borrowStatus == null) {
					td_06.innerHTML += "<button class='not-extension-btn' disabled>대여 신청</button>";
				}
				
				if (borrow.shareThing.isBorrowed == 1 && borrow.borrowStatus == 1 && borrow.isExtended == 0) {
					td_06.innerHTML += "<button class='extension-btn' onclick=\"location.href='/borrow/extend?id=" + borrow.id + "'\">연장하기</button>";	
				}
				
				if (borrow.isExtended == 1) {
					td_06.innerHTML += "<button class='not-extension-btn' disabled>연장하기</button>";	
				}
				
				if (borrow.shareThing.isBorrowed == 0) {
					td_06.innerHTML += "<button class='extension-btn'>대여 신청</button>";	
					$(td_06).click(function(){
							moveToShareThingDetail(borrow.shareThing.item.id);
					})
				}
				
				tb_row.appendChild(td_01);
				tb_row.appendChild(td_02);				
				tb_row.appendChild(td_03);			
				tb_row.appendChild(td_04);
				tb_row.appendChild(td_05);
				tb_row.appendChild(td_06);
				
				tbody.appendChild(tb_row);
			});
			
			const cartBtn = document.createElement("button");
			cartBtn.setAttribute("id", "shoppingBtn");
			cartBtn.innerHTML = "쇼핑 계속하기";
			
			$(cartBtn).click(function(){
						moveToShareThingList();
			})
			
			content.appendChild(cartBtn);
		},
			
		error : function() {
			alert('error');			
		}
	});
};