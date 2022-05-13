package dongduk.cs.pulpul.dao.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import dongduk.cs.pulpul.domain.Alert;
import dongduk.cs.pulpul.domain.Borrow;

@Mapper
public interface BorrowMapper {

	List<Borrow> selectBorrowReservationByMemberId(String memberId);
	
	int insertBorrowReservation(Borrow borrow);
	
	int deleteBorrowReservation(Borrow borrow);
	
	int selectReservationNumber(String itemId);
	
	int updateFirstBooker(Borrow borrow);
	
	List<Alert> selectAlertByAlertDate();
	
	List<Alert> selectAlertByMemberId(String memberId);
	
	int selectAlertCountByIsRead(String memberId); // 추가
	
	int insertAlert(Alert alert);
	
	int deleteAlert(Alert alert);
	
	int updateIsRead(String memberId); // 추가
	
	List<Borrow> selectBorrowByMemberId(String memberId);
	
	List<Borrow> selectBorrowByItemId(String itemId);
	
	int insertBorrow(Borrow borrow);
	
	int updateTrackingNumber(Borrow borrow);
	
	int updateBorrowStatus(@Param("shareThingId") String shareThingId, 
			@Param("borrowStatus") int borrowStatus);
	
	int updateReturnDate(Borrow borrow);

}
