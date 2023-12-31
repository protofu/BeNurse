package com.ssafy.offschedule.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.Schedule.model.Schedule;
import com.ssafy.common.utils.APIResponse;
import com.ssafy.common.utils.IDRequest;
import com.ssafy.nurse.model.Nurse;
import com.ssafy.oauth.serivce.OauthService;
import com.ssafy.offschedule.model.OffScheduleRequest;
import com.ssafy.offschedule.model.Offschedule;
import com.ssafy.offschedule.service.OffscheduleRepository;
import com.ssafy.offschedule.service.OffscheduleService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@CrossOrigin(origins = "*")
@Api(value = "휴무 API", tags = { "휴무." })
@RestController
@RequestMapping("/api/benurse/Offschedule")
public class OffscheduleController {
	
	@Autowired
	OffscheduleRepository offscheduleRepo;
	
	@Autowired
	OauthService oauthService;
	
	@Autowired
	OffscheduleService osServ;
	
	// 휴무 일정 신청 POST
	@PostMapping("")
	@ApiOperation(value = "휴무 일정 신청", notes = "날짜, 시간, 사유로 휴무 일정 신청\nid는 자동 생성, offdate는 \"yyyy-MM-dd\" 양식으로 보내면 됩니다.")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공", response = Offschedule.class),
		@ApiResponse(code = 406, message = "실패"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	public APIResponse<Offschedule> registOffschedule(@RequestHeader("Authorization") String token, @RequestBody OffScheduleRequest offreq) {
		Nurse nurse;
		// 사용자 조회
		try {
			nurse = oauthService.getUser(token);
		}catch (Exception e) {
			e.printStackTrace();
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		try {
			for(String date : offreq.getDate()) {
				Offschedule off = new Offschedule();
				off.setNurseID(nurse.getID());
				off.setOffdate(LocalDate.parse(date, formatter));
				off.setReason(offreq.getContent());
				off.setHospitalID(nurse.getHospitalID());
				offscheduleRepo.save(off);
			}
			return new APIResponse<>(HttpStatus.OK);
		}catch (Exception e) {
			e.printStackTrace();
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
		}
	}
	
	// 휴무 신청 내역 삭제 DELETE
	@DeleteMapping("")
	@ApiOperation(value = "휴무 신청 내역 삭제", notes = "휴무 신청 내역을 삭제")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공", response = Offschedule.class),
		@ApiResponse(code = 404, message = "결과 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	public APIResponse<Void> deleteOffscheduleById(@RequestBody IDRequest req) {
	    try {
	    	osServ.delete(req.getID());
			return new APIResponse(HttpStatus.OK);
		}catch (Exception e) {
	    	e.printStackTrace();
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
	    }
	} 
	
	// 휴무 신청 내역 검색 GET
	@GetMapping("")
	@ApiOperation(value = "휴무 신청 내역 검색", notes = "간호사 ID로 휴무 신청 내역 조회") 
	@ApiResponses({
	    @ApiResponse(code = 200, message = "성공", response = Schedule.class),
	    @ApiResponse(code = 404, message = "휴무를 찾을 수 없음."),
	    @ApiResponse(code = 500, message = "서버 오류")
	})
	public APIResponse<List<Offschedule>> getOffscheduleBynurseID(@RequestParam("ID") long ID){	
	    List<Offschedule> offschedule = offscheduleRepo.findAllBynurseID(ID);
	    return new APIResponse(offschedule, HttpStatus.OK);

	}
	
	// 휴무 신청 조회 GET
	@GetMapping("/all")
	@ApiOperation(value = "휴무 신청 조회", notes = "신청 받은 휴무 일정 목록을 조회") 
	@ApiResponses({
	    @ApiResponse(code = 200, message = "성공", response = Offschedule.class),
	    @ApiResponse(code = 404, message = "휴무를 찾을 수 없음."),
	    @ApiResponse(code = 500, message = "서버 오류")
	})
	public APIResponse<List<Offschedule>> getAllOffschedule(@RequestHeader("Authorization") String token) {
		Nurse nurse;
		// 사용자 조회
		try {
			nurse = oauthService.getUser(token);
		}catch (Exception e) {
			e.printStackTrace();
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
		List<Offschedule> offschedule = offscheduleRepo.findAllByHospitalID(nurse.getHospitalID());
		return new APIResponse(offschedule, HttpStatus.OK);
	}

}
