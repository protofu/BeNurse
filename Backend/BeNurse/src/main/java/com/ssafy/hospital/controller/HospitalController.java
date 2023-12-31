package com.ssafy.hospital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.common.utils.APIResponse;
import com.ssafy.common.utils.IDRequest;
import com.ssafy.hospital.model.Hospital;
import com.ssafy.hospital.service.HospitalRepository;
import com.ssafy.hospital.service.HospitalService;
import com.ssafy.nurse.model.Nurse;
import com.ssafy.nurse.service.NurseRepository;
import com.ssafy.oauth.serivce.OauthService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@CrossOrigin(origins = "*")
@Api(value = "병원 API", tags = { "병원." })
@RestController
@RequestMapping("/api/benurse/Hospital")
public class HospitalController {

	@Autowired
	HospitalRepository hospitalRepo;
	
	@Autowired
	HospitalService hospitalServ;
	
	@Autowired
	NurseRepository nurseRepo;
	
	@Autowired
	OauthService oauthService;
	
	//내 병원 정보 조회 GET
	@GetMapping("")
	@ApiOperation(value = "내 병원 정보 조회", notes = "내 병원 ID로 특정 병원 정보 조회") 
	@ApiResponses({
	    @ApiResponse(code = 200, message = "성공", response = Hospital.class),
	    @ApiResponse(code = 404, message = "병원을 찾을 수 없음"),
	    @ApiResponse(code = 500, message = "서버 오류")
	})
	public APIResponse<Hospital> getHospitalById(@RequestHeader("Authorization") String token) {
		Nurse nurse;
		// 사용자 조회
		try {
			nurse = oauthService.getUser(token);
		}catch (Exception e) {
			e.printStackTrace();
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
		
		try {
			Hospital hospital = hospitalServ.findById(nurse.getHospitalID());
			return new APIResponse<>(hospital, HttpStatus.CREATED);
		}catch (Exception e) {
			e.printStackTrace();
	    	throw new ResponseStatusException(HttpStatus.NOT_FOUND); 
		}
	}
	
	// 병원 삭제 DELETE
	@DeleteMapping("")
	@ApiOperation(value = "병원 삭제", notes = "병원 삭제")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공", response = Hospital.class),
		@ApiResponse(code = 404, message = "결과 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	public APIResponse<Void> deleteHospitalById(@RequestBody IDRequest req) {
	    try {
	    	hospitalServ.delete(req.getID());
			return new APIResponse<>(HttpStatus.OK);
	    }catch (Exception e) {
	    	e.printStackTrace();
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
	    }
	}
	
	// 병원 정보 수정 PUT
	@PutMapping("")
	@ApiOperation(value = "병원 정보 수정", notes = "병원 정보 수정") 
	@ApiResponses({
	    @ApiResponse(code = 200, message = "성공", response = Hospital.class),
	    @ApiResponse(code = 404, message = "병원을 찾을 수 없음"),
	    @ApiResponse(code = 500, message = "서버 오류")
	})
	public APIResponse<Hospital> updateHospitalById(@RequestBody Hospital updatedHospital){
	    try {
			// 업데이트된 병원 정보를 저장
	    	Hospital savedHospital = hospitalServ.save(updatedHospital);
	        return new APIResponse<>(savedHospital, HttpStatus.OK);
	    }catch (Exception e) {
	    	e.printStackTrace();
	    	throw new ResponseStatusException(HttpStatus.NOT_FOUND);
	    }
	}
	
	// 병원 정보 POST
	@PostMapping("")
	@ApiOperation(value = "병원 등록", notes = "서비스에 병원 정보를 등록")
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공", response = Hospital.class),
		@ApiResponse(code = 404, message = "결과 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	public APIResponse<Hospital> registHospital(@RequestHeader("Authorization") String token, @RequestBody Hospital hospital) {
		Nurse nurse;
		// 사용자 조회
		try {
			nurse = oauthService.getUser(token);
		}catch (Exception e) {
			e.printStackTrace();
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
		
	    Hospital savedHospital = hospitalRepo.save(hospital);
		nurse.setHospitalID(savedHospital.getID());
		nurseRepo.save(nurse);
		
	    return new APIResponse<>(savedHospital, HttpStatus.OK);
	}
}
